import 'dart:async';

import 'package:flutter/foundation.dart';
import '../data/mock_multi_order_data.dart';
import '../data/multi_order_persistence_store.dart';
import '../domain/models/multi_order_batch.dart';
import '../domain/models/order_item.dart';
import '../domain/models/payment_summary.dart';
import '../domain/models/sub_order.dart';

/// Clock callback for deterministic assignment-expiry testing.
typedef MultiOrderClock = DateTime Function();

/// The three independent safety checks required before pickup OTP verification.
enum MultiOrderSafetyCheckType {
  orderIdChecked,
  customerDetailsChecked,
  allItemsCollected,
}

/// Self-contained local state controller for the Multi Order demo flow.
///
/// Implemented with Flutter's [ChangeNotifier] and backed by
/// [MultiOrderPersistenceStore] for local restoration across restarts.
class MultiOrderFlowController extends ChangeNotifier {
  late MultiOrderBatch _batch;
  final MultiOrderPersistenceStore _persistenceStore;
  final MultiOrderClock _nowProvider;
  final List<MultiOrderBatch> _archivedBatches = <MultiOrderBatch>[];
  final bool _hasCustomInitialBatch;

  bool _isOnline;
  String? _lastErrorMessage;
  bool _isRestored = false;
  bool _hasPersistedState = false;
  bool _hasRestoreError = false;

  /// Creates a new [MultiOrderFlowController].
  MultiOrderFlowController({
    MultiOrderBatch? initialBatch,
    MultiOrderPersistenceStore? persistenceStore,
    MultiOrderClock? nowProvider,
    bool initialOnline = true,
  })  : _persistenceStore =
            persistenceStore ?? SharedPreferencesMultiOrderPersistenceStore(),
        _nowProvider = nowProvider ?? DateTime.now,
        _hasCustomInitialBatch = initialBatch != null,
        _isOnline = initialOnline {
    _batch = initialBatch ??
        MockMultiOrderData.createSampleBatch(
          assignedAtEpochMs: _nowProvider().millisecondsSinceEpoch,
        );
  }

  /// Current state of the Multi Order batch.
  MultiOrderBatch get batch => _batch;

  /// Whether the rider is currently online.
  bool get isOnline => _isOnline;

  /// Whether the rider is allowed to go offline right now.
  ///
  /// Going offline is blocked during active pickup, delivery, or payment.
  bool get canGoOffline =>
      _batch.batchStatus != MultiOrderBatchStatus.inPickup &&
      _batch.batchStatus != MultiOrderBatchStatus.delivering &&
      _batch.batchStatus != MultiOrderBatchStatus.collectingPayment;

  /// Whether [restoreState] has completed.
  bool get isRestored => _isRestored;

  /// Whether persisted Multi-Order state existed (or was provisioned) on device.
  bool get hasPersistedState => _hasPersistedState;

  /// Whether the current batch is in an active delivery stage.
  bool get hasActiveBatch =>
      _batch.batchStatus == MultiOrderBatchStatus.inPickup ||
      _batch.batchStatus == MultiOrderBatchStatus.delivering ||
      _batch.batchStatus == MultiOrderBatchStatus.collectingPayment;

  /// Previously completed, cancelled, or expired batches preserved during dev
  /// fresh-assignment operations.
  List<MultiOrderBatch> get archivedBatches =>
      List<MultiOrderBatch>.unmodifiable(_archivedBatches);

  /// Remaining assignment countdown in seconds based on elapsed real time.
  int get remainingAssignmentSeconds {
    if (_batch.batchStatus != MultiOrderBatchStatus.assigned) return 0;
    return _batch.remainingAssignmentSeconds(
      _nowProvider().millisecondsSinceEpoch,
    );
  }

  /// Whether the pending assignment has expired.
  bool get isAssignmentExpired =>
      _batch.batchStatus == MultiOrderBatchStatus.expired ||
      (_batch.batchStatus == MultiOrderBatchStatus.assigned &&
          _batch.isAssignmentExpiredAt(
            _nowProvider().millisecondsSinceEpoch,
          ));

  /// Last error message, if any transition or validation failed.
  String? get lastErrorMessage => _lastErrorMessage;

  /// The active [SubOrder] corresponding to the current pickup stop (1, 2, or 3).
  SubOrder? get currentSubOrder => _batch.currentSubOrder;

  /// Clears the last error message.
  void clearError() {
    if (_lastErrorMessage != null) {
      _lastErrorMessage = null;
      notifyListeners();
    }
  }

  void _persistCurrentState() {
    unawaited(
      _persistenceStore.save(
        MultiOrderPersistedState(
          batch: _batch,
          isOnline: _isOnline,
        ),
      ),
    );
  }

  // ===========================================================================
  // 0. Persistence Restoration & Online/Offline Management
  // ===========================================================================

  /// Restores the last saved Multi-Order state from local storage.
  ///
  /// Evaluates elapsed real time against [MultiOrderBatch.assignedAtEpochMs]
  /// so expired assignments never reappear as acceptable.
  Future<bool> restoreState() async {
    final result = await _persistenceStore.load();
    _isRestored = true;

    if (result.hasError) {
      _hasRestoreError = true;
      _lastErrorMessage = result.errorMessage;
      notifyListeners();
      return false;
    }

    _hasRestoreError = false;
    final loaded = result.state;
    if (loaded == null) {
      _hasPersistedState = false;
      notifyListeners();
      return true;
    }

    _hasPersistedState = true;
    _batch = loaded.batch;
    _isOnline = loaded.isOnline;
    _lastErrorMessage = null;

    if (_batch.batchStatus == MultiOrderBatchStatus.assigned &&
        _batch.isAssignmentExpiredAt(_nowProvider().millisecondsSinceEpoch)) {
      _batch = _batch.copyWith(batchStatus: MultiOrderBatchStatus.expired);
      await _persistenceStore.save(
        MultiOrderPersistedState(batch: _batch, isOnline: _isOnline),
      );
    }

    notifyListeners();
    return true;
  }

  /// Provisions and persists a single clean-install sample assignment when no
  /// persisted state exists yet, starting the 7-second countdown at that moment.
  ///
  /// Safe to call across rebuilds or route changes: no-ops once persisted state
  /// exists or if restoration has not completed.
  bool provisionCleanInstallAssignmentIfNeeded() {
    if (!_isRestored ||
        _hasPersistedState ||
        _hasRestoreError ||
        _hasCustomInitialBatch) {
      return false;
    }

    _batch = MockMultiOrderData.createSampleBatch(
      assignedAtEpochMs: _nowProvider().millisecondsSinceEpoch,
    );
    _hasPersistedState = true;
    _lastErrorMessage = null;
    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Updates the rider's online/offline status with active-delivery protection.
  ///
  /// - Prevented during active pickup, delivery, or payment collection.
  /// - Permitted while an assignment is pending; going offline cancels the
  ///   pending assignment so it cannot be accepted later.
  bool setOnlineStatus(bool online) {
    _lastErrorMessage = null;

    if (_isOnline == online) {
      return true;
    }

    if (!online && !canGoOffline) {
      _lastErrorMessage =
          'Cannot go offline during an active delivery (${_batch.batchStatus.name}).';
      notifyListeners();
      return false;
    }

    _isOnline = online;
    if (!online && _batch.batchStatus == MultiOrderBatchStatus.assigned) {
      _batch = _batch.copyWith(batchStatus: MultiOrderBatchStatus.cancelled);
    }

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  // ===========================================================================
  // 1. Checklist & Safety-Check Management
  // ===========================================================================

  /// Validates whether checklist interaction is permitted for [targetOrder].
  ///
  /// Checklist changes are allowed ONLY for the currently active pickup stop
  /// while the rider has arrived at that stop (`arrivedAtPickup` / `*Verify`)
  /// and before the pickup has been verified.
  bool _validateChecklistMutationAllowed(SubOrder targetOrder) {
    if (_batch.batchStatus != MultiOrderBatchStatus.inPickup) {
      _lastErrorMessage =
          'Cannot modify checklist while batch status is ${_batch.batchStatus.name}.';
      return false;
    }

    if (targetOrder.isPickupVerified ||
        targetOrder.status == SubOrderStatus.pickedUp) {
      _lastErrorMessage =
          'Cannot modify checklist for ${targetOrder.merchantName}; pickup is already verified.';
      return false;
    }

    if (targetOrder.sequenceNumber != _batch.currentPickupSequence) {
      _lastErrorMessage =
          'Cannot modify checklist for stop ${targetOrder.sequenceNumber} while active stop is ${_batch.currentPickupSequence}.';
      return false;
    }

    final expectedVerifyStep = targetOrder.sequenceNumber == 1
        ? MultiOrderStep.pickup1Verify
        : targetOrder.sequenceNumber == 2
            ? MultiOrderStep.pickup2Verify
            : MultiOrderStep.pickup3Verify;

    if (targetOrder.status != SubOrderStatus.arrivedAtPickup ||
        _batch.currentStep != expectedVerifyStep) {
      _lastErrorMessage =
          'Cannot modify checklist before arriving at ${targetOrder.merchantName} (current step: ${_batch.currentStep.name}).';
      return false;
    }

    return true;
  }

  /// Toggles one of the three independent safety checks for [orderId].
  bool toggleSafetyCheck(
    String orderId,
    MultiOrderSafetyCheckType checkType,
  ) {
    _lastErrorMessage = null;
    final orderIndex = _batch.subOrders.indexWhere((o) => o.id == orderId);
    if (orderIndex == -1) {
      _lastErrorMessage = 'Order $orderId not found in batch.';
      notifyListeners();
      return false;
    }

    final targetOrder = _batch.subOrders[orderIndex];
    if (!_validateChecklistMutationAllowed(targetOrder)) {
      notifyListeners();
      return false;
    }

    final updatedOrder = switch (checkType) {
      MultiOrderSafetyCheckType.orderIdChecked =>
        targetOrder.copyWith(isOrderIdChecked: !targetOrder.isOrderIdChecked),
      MultiOrderSafetyCheckType.customerDetailsChecked => targetOrder.copyWith(
          isCustomerDetailsChecked: !targetOrder.isCustomerDetailsChecked,
        ),
      MultiOrderSafetyCheckType.allItemsCollected => targetOrder.copyWith(
          isAllItemsCollected: !targetOrder.isAllItemsCollected,
        ),
    };

    final updatedSubOrders = List<SubOrder>.from(_batch.subOrders);
    updatedSubOrders[orderIndex] = updatedOrder;

    _batch = _batch.copyWith(subOrders: updatedSubOrders);
    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Explicitly sets one of the three independent safety checks for [orderId].
  bool setSafetyCheck(
    String orderId,
    MultiOrderSafetyCheckType checkType,
    bool value,
  ) {
    _lastErrorMessage = null;
    final orderIndex = _batch.subOrders.indexWhere((o) => o.id == orderId);
    if (orderIndex == -1) {
      _lastErrorMessage = 'Order $orderId not found in batch.';
      notifyListeners();
      return false;
    }

    final targetOrder = _batch.subOrders[orderIndex];
    if (!_validateChecklistMutationAllowed(targetOrder)) {
      notifyListeners();
      return false;
    }

    final updatedOrder = switch (checkType) {
      MultiOrderSafetyCheckType.orderIdChecked =>
        targetOrder.copyWith(isOrderIdChecked: value),
      MultiOrderSafetyCheckType.customerDetailsChecked =>
        targetOrder.copyWith(isCustomerDetailsChecked: value),
      MultiOrderSafetyCheckType.allItemsCollected =>
        targetOrder.copyWith(isAllItemsCollected: value),
    };

    if (updatedOrder == targetOrder) {
      return true;
    }

    final updatedSubOrders = List<SubOrder>.from(_batch.subOrders);
    updatedSubOrders[orderIndex] = updatedOrder;

    _batch = _batch.copyWith(subOrders: updatedSubOrders);
    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Legacy method: toggles the checked status of a specific [OrderItem].
  ///
  /// Preserved for backward compatibility; separate from the three safety
  /// checks required for pickup OTP verification.
  void toggleChecklistItem(String orderId, String itemId) {
    _lastErrorMessage = null;
    final orderIndex = _batch.subOrders.indexWhere((o) => o.id == orderId);
    if (orderIndex == -1) {
      _lastErrorMessage = 'Order $orderId not found in batch.';
      notifyListeners();
      return;
    }

    final targetOrder = _batch.subOrders[orderIndex];
    if (!_validateChecklistMutationAllowed(targetOrder)) {
      notifyListeners();
      return;
    }

    final itemIndex = targetOrder.items.indexWhere((i) => i.id == itemId);
    if (itemIndex == -1) {
      _lastErrorMessage = 'Item $itemId not found in order $orderId.';
      notifyListeners();
      return;
    }

    final currentItem = targetOrder.items[itemIndex];
    final updatedItem = currentItem.copyWith(isChecked: !currentItem.isChecked);

    final updatedItems = List<OrderItem>.from(targetOrder.items);
    updatedItems[itemIndex] = updatedItem;

    final updatedOrder = targetOrder.copyWith(items: updatedItems);
    final updatedSubOrders = List<SubOrder>.from(_batch.subOrders);
    updatedSubOrders[orderIndex] = updatedOrder;

    _batch = _batch.copyWith(subOrders: updatedSubOrders);
    _persistCurrentState();
    notifyListeners();
  }

  /// Legacy method: marks all [OrderItem]s in the specified sub-order as
  /// checked or unchecked.
  void setAllItemsCheckedForOrder(String orderId, bool isChecked) {
    _lastErrorMessage = null;
    final orderIndex = _batch.subOrders.indexWhere((o) => o.id == orderId);
    if (orderIndex == -1) {
      _lastErrorMessage = 'Order $orderId not found in batch.';
      notifyListeners();
      return;
    }

    final targetOrder = _batch.subOrders[orderIndex];
    if (!_validateChecklistMutationAllowed(targetOrder)) {
      notifyListeners();
      return;
    }

    final updatedItems = targetOrder.items
        .map((item) => item.copyWith(isChecked: isChecked))
        .toList();

    final updatedOrder = targetOrder.copyWith(items: updatedItems);
    final updatedSubOrders = List<SubOrder>.from(_batch.subOrders);
    updatedSubOrders[orderIndex] = updatedOrder;

    _batch = _batch.copyWith(subOrders: updatedSubOrders);
    _persistCurrentState();
    notifyListeners();
  }

  // ===========================================================================
  // 2. Sequential Multi-Order Flow Transitions
  // ===========================================================================

  /// [Transition 1] Batch Assigned
  /// Places the batch into the initial assigned state (`1523:40712`) ONLY when
  /// the batch has not yet progressed beyond initial assignment.
  void batchAssigned() {
    _lastErrorMessage = null;
    if (_batch.batchStatus != MultiOrderBatchStatus.assigned ||
        _batch.currentStep != MultiOrderStep.batchAssigned ||
        _batch.currentPickupSequence != 1 ||
        _batch.verifiedPickupsCount > 0 ||
        _batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Cannot re-enter batchAssigned after flow progression (status: ${_batch.batchStatus.name}, step: ${_batch.currentStep.name}). Use resetDemo() to restart.';
      notifyListeners();
      return;
    }

    _batch = _batch.copyWith(
      batchStatus: MultiOrderBatchStatus.assigned,
      currentStep: MultiOrderStep.batchAssigned,
    );
    _persistCurrentState();
    notifyListeners();
  }

  /// Checks whether the pending assignment has exceeded its 7-second window
  /// and transitions it to [MultiOrderBatchStatus.expired] if so.
  bool checkAssignmentExpiry() {
    if (_batch.batchStatus == MultiOrderBatchStatus.assigned &&
        _batch.isAssignmentExpiredAt(_nowProvider().millisecondsSinceEpoch)) {
      _batch = _batch.copyWith(batchStatus: MultiOrderBatchStatus.expired);
      _persistCurrentState();
      notifyListeners();
      return true;
    }
    return false;
  }

  /// Explicitly marks a pending assignment as expired if still in `assigned`.
  bool expireAssignment() {
    _lastErrorMessage = null;
    if (_batch.batchStatus != MultiOrderBatchStatus.assigned) {
      _lastErrorMessage =
          'Cannot expire assignment while batch status is ${_batch.batchStatus.name}.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(batchStatus: MultiOrderBatchStatus.expired);
    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Rejects a pending assignment (`X` button), marking it `cancelled`.
  bool rejectAssignment() {
    _lastErrorMessage = null;
    if (_batch.batchStatus != MultiOrderBatchStatus.assigned ||
        _batch.currentStep != MultiOrderStep.batchAssigned) {
      _lastErrorMessage =
          'Cannot reject assignment while batch status is ${_batch.batchStatus.name}.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(batchStatus: MultiOrderBatchStatus.cancelled);
    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Accepts a pending Multi-Order assignment and starts Pickup 1.
  bool acceptAssignment() => startPickup(1);

  /// [Transition 2 / 4 / 6] Start Pickup for Stop 1, 2, or 3
  bool startPickup(int sequenceNumber) {
    _lastErrorMessage = null;

    if (sequenceNumber < 1 || sequenceNumber > 3) {
      _lastErrorMessage =
          'Invalid pickup stop sequence ($sequenceNumber). Must be 1, 2, or 3.';
      notifyListeners();
      return false;
    }

    if (sequenceNumber == 1) {
      if (checkAssignmentExpiry()) {
        _lastErrorMessage =
            'Cannot accept assignment. The 7-second acceptance window has expired.';
        notifyListeners();
        return false;
      }

      if (!_isOnline) {
        _lastErrorMessage = 'Cannot accept assignment while rider is offline.';
        notifyListeners();
        return false;
      }
    }

    // Guard: Prevent starting any pickup if delivery, payment, completion,
    // cancellation, or expiry has occurred.
    if (_batch.batchStatus == MultiOrderBatchStatus.delivering ||
        _batch.batchStatus == MultiOrderBatchStatus.collectingPayment ||
        _batch.batchStatus == MultiOrderBatchStatus.completed ||
        _batch.batchStatus == MultiOrderBatchStatus.cancelled ||
        _batch.batchStatus == MultiOrderBatchStatus.expired) {
      _lastErrorMessage =
          'Cannot start pickup $sequenceNumber. Batch status is ${_batch.batchStatus.name}.';
      notifyListeners();
      return false;
    }

    if (sequenceNumber == 1) {
      if (_batch.currentStep != MultiOrderStep.batchAssigned ||
          _batch.batchStatus != MultiOrderBatchStatus.assigned) {
        _lastErrorMessage =
            'Pickup 1 can only be started from the initial assigned stage. Current step is ${_batch.currentStep.name}.';
        notifyListeners();
        return false;
      }
    } else if (sequenceNumber == 2) {
      final stop1 = _batch.subOrders.firstWhere((o) => o.sequenceNumber == 1);
      final stop2 = _batch.subOrders.firstWhere((o) => o.sequenceNumber == 2);

      if (!stop1.isPickupVerified) {
        _lastErrorMessage =
            'Cannot start Pickup 2 before Pickup 1 is verified with its OTP.';
        notifyListeners();
        return false;
      }
      if (stop2.isPickupVerified) {
        _lastErrorMessage = 'Pickup 2 has already been verified.';
        notifyListeners();
        return false;
      }
      if (_batch.currentPickupSequence != 2) {
        _lastErrorMessage =
            'Cannot start Pickup 2 while active sequence is ${_batch.currentPickupSequence}.';
        notifyListeners();
        return false;
      }
      if (_batch.currentStep != MultiOrderStep.pickup1Verify &&
          _batch.currentStep != MultiOrderStep.pickup2Route) {
        _lastErrorMessage =
            'Cannot start Pickup 2 from current step ${_batch.currentStep.name}.';
        notifyListeners();
        return false;
      }
    } else if (sequenceNumber == 3) {
      final stop2 = _batch.subOrders.firstWhere((o) => o.sequenceNumber == 2);
      final stop3 = _batch.subOrders.firstWhere((o) => o.sequenceNumber == 3);

      if (!stop2.isPickupVerified) {
        _lastErrorMessage =
            'Cannot start Pickup 3 before Pickup 2 is verified with its OTP.';
        notifyListeners();
        return false;
      }
      if (stop3.isPickupVerified) {
        _lastErrorMessage = 'Pickup 3 has already been verified.';
        notifyListeners();
        return false;
      }
      if (_batch.currentPickupSequence != 3) {
        _lastErrorMessage =
            'Cannot start Pickup 3 while active sequence is ${_batch.currentPickupSequence}.';
        notifyListeners();
        return false;
      }
      if (_batch.currentStep != MultiOrderStep.pickup2Verify &&
          _batch.currentStep != MultiOrderStep.pickup3Route) {
        _lastErrorMessage =
            'Cannot start Pickup 3 from current step ${_batch.currentStep.name}.';
        notifyListeners();
        return false;
      }
    }

    final targetStep = sequenceNumber == 1
        ? MultiOrderStep.pickup1Route
        : sequenceNumber == 2
            ? MultiOrderStep.pickup2Route
            : MultiOrderStep.pickup3Route;

    final updatedSubOrders = _batch.subOrders.map((order) {
      if (order.sequenceNumber == sequenceNumber) {
        return order.copyWith(status: SubOrderStatus.headingToPickup);
      }
      return order;
    }).toList();

    _batch = _batch.copyWith(
      currentPickupSequence: sequenceNumber,
      batchStatus: MultiOrderBatchStatus.inPickup,
      currentStep: targetStep,
      subOrders: updatedSubOrders,
    );

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Transition when the rider arrives at the merchant store and opens verification.
  bool arriveAtPickup(int sequenceNumber) {
    _lastErrorMessage = null;

    if (sequenceNumber < 1 || sequenceNumber > 3) {
      _lastErrorMessage = 'Invalid pickup sequence: $sequenceNumber.';
      notifyListeners();
      return false;
    }

    if (_batch.currentPickupSequence != sequenceNumber) {
      _lastErrorMessage =
          'Cannot arrive at stop $sequenceNumber while active sequence is ${_batch.currentPickupSequence}.';
      notifyListeners();
      return false;
    }

    final expectedRouteStep = sequenceNumber == 1
        ? MultiOrderStep.pickup1Route
        : sequenceNumber == 2
            ? MultiOrderStep.pickup2Route
            : MultiOrderStep.pickup3Route;

    if (_batch.currentStep != expectedRouteStep) {
      _lastErrorMessage =
          'Cannot arrive at stop $sequenceNumber from current step ${_batch.currentStep.name}. Expected ${expectedRouteStep.name}.';
      notifyListeners();
      return false;
    }

    final targetStep = sequenceNumber == 1
        ? MultiOrderStep.pickup1Verify
        : sequenceNumber == 2
            ? MultiOrderStep.pickup2Verify
            : MultiOrderStep.pickup3Verify;

    final updatedSubOrders = _batch.subOrders.map((order) {
      if (order.sequenceNumber == sequenceNumber) {
        return order.copyWith(status: SubOrderStatus.arrivedAtPickup);
      }
      return order;
    }).toList();

    _batch = _batch.copyWith(
      currentStep: targetStep,
      subOrders: updatedSubOrders,
    );

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// [Transition 3 / 5 / 7] Verify Pickup for Stop 1, 2, or 3 with the
  /// three independent safety checks and 4-digit OTP.
  bool verifyPickup(int sequenceNumber, String enteredOtp) {
    _lastErrorMessage = null;

    if (_batch.currentPickupSequence != sequenceNumber) {
      _lastErrorMessage =
          'Active pickup stop is ${_batch.currentPickupSequence}, cannot verify stop $sequenceNumber.';
      notifyListeners();
      return false;
    }

    final expectedStep = sequenceNumber == 1
        ? MultiOrderStep.pickup1Verify
        : sequenceNumber == 2
            ? MultiOrderStep.pickup2Verify
            : MultiOrderStep.pickup3Verify;

    if (_batch.currentStep != expectedStep) {
      _lastErrorMessage =
          'Cannot verify stop $sequenceNumber from current step ${_batch.currentStep.name}. Expected ${expectedStep.name}.';
      notifyListeners();
      return false;
    }

    final targetOrderIndex =
        _batch.subOrders.indexWhere((o) => o.sequenceNumber == sequenceNumber);
    if (targetOrderIndex == -1) {
      _lastErrorMessage = 'Order for stop $sequenceNumber not found in batch.';
      notifyListeners();
      return false;
    }

    final targetOrder = _batch.subOrders[targetOrderIndex];

    // Gate 1: Three Safety Checks Completion Validation
    if (!targetOrder.areSafetyChecksComplete) {
      _lastErrorMessage =
          'Please complete all three safety checks for ${targetOrder.merchantName} before confirming pickup.';
      notifyListeners();
      return false;
    }

    // Gate 2: OTP Validation (allows unlimited retries without lockout)
    if (!targetOrder.validateOtp(enteredOtp)) {
      _lastErrorMessage =
          'Incorrect OTP "$enteredOtp" for ${targetOrder.merchantName}. Pickup cannot be confirmed.';
      notifyListeners();
      return false;
    }

    final verifiedOrder = targetOrder.copyWith(
      isPickupVerified: true,
      status: SubOrderStatus.pickedUp,
    );

    final updatedSubOrders = List<SubOrder>.from(_batch.subOrders);
    updatedSubOrders[targetOrderIndex] = verifiedOrder;

    _batch = _batch.copyWith(subOrders: updatedSubOrders);

    if (sequenceNumber < 3) {
      _batch = _batch.copyWith(
        currentPickupSequence: sequenceNumber + 1,
      );
    }

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// [Transition 8] Start Delivery
  bool startDelivery() {
    _lastErrorMessage = null;

    if (!_batch.allPickupsVerified) {
      final pendingCount = 3 - _batch.verifiedPickupsCount;
      _lastErrorMessage =
          'Cannot start delivery. $pendingCount pickup stop(s) still pending verification.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.pickup3Verify &&
        _batch.currentStep != MultiOrderStep.deliveryRoute) {
      _lastErrorMessage =
          'Cannot start delivery from current step ${_batch.currentStep.name}.';
      notifyListeners();
      return false;
    }

    final wasAlreadyInRoute =
        _batch.batchStatus == MultiOrderBatchStatus.delivering &&
            _batch.currentStep == MultiOrderStep.deliveryRoute;

    _batch = _batch.copyWith(
      batchStatus: MultiOrderBatchStatus.delivering,
      currentStep: MultiOrderStep.deliveryRoute,
    );

    if (!wasAlreadyInRoute) {
      _persistCurrentState();
    }
    notifyListeners();
    return true;
  }

  /// [Transition 9] Arrive at Customer
  bool arriveAtCustomer() {
    _lastErrorMessage = null;

    if (!_batch.allPickupsVerified) {
      _lastErrorMessage =
          'Cannot arrive at customer before all pickup stops are verified.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.deliveryRoute &&
        _batch.currentStep != MultiOrderStep.arriveAtCustomer) {
      _lastErrorMessage =
          'Cannot arrive at customer from current step ${_batch.currentStep.name}. Must be on delivery route.';
      notifyListeners();
      return false;
    }

    final changed = _batch.currentStep != MultiOrderStep.arriveAtCustomer;
    _batch = _batch.copyWith(
      currentStep: MultiOrderStep.arriveAtCustomer,
    );

    if (changed) {
      _persistCurrentState();
    }
    notifyListeners();
    return true;
  }

  /// [Transition 10] Select Payment Method (Cash vs UPI)
  bool selectPaymentMethod(PaymentMethod method) {
    _lastErrorMessage = null;

    if (method == PaymentMethod.unselected) {
      _lastErrorMessage =
          'Cannot select unselected as a payment method. Must choose Cash or UPI.';
      notifyListeners();
      return false;
    }

    if (!_batch.allPickupsVerified) {
      _lastErrorMessage =
          'Cannot select payment method before all pickups are verified.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.paymentSelect &&
        _batch.currentStep != MultiOrderStep.paymentProcessing) {
      _lastErrorMessage =
          'Payment method selection requires entering the payment selection stage first. Current step is ${_batch.currentStep.name}.';
      notifyListeners();
      return false;
    }

    if (_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Payment has already been confirmed. Cannot re-select payment method.';
      notifyListeners();
      return false;
    }

    final label = method == PaymentMethod.cash
        ? 'Cash on Delivery (COD)'
        : 'Dynamic UPI QR';

    final updatedPayment = _batch.paymentSummary.copyWith(
      paymentMethod: method,
      paymentMethodLabel: label,
      paymentStatus: PaymentStatus.processing,
    );

    _batch = _batch.copyWith(
      paymentSummary: updatedPayment,
      batchStatus: MultiOrderBatchStatus.collectingPayment,
      currentStep: MultiOrderStep.paymentProcessing,
    );

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Opens or returns to the payment selection screen (`1568:58262`).
  bool openPaymentSelection() {
    _lastErrorMessage = null;

    if (!_batch.allPickupsVerified) {
      _lastErrorMessage =
          'Cannot open payment selection before all pickup stops are verified.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.arriveAtCustomer &&
        _batch.currentStep != MultiOrderStep.paymentSelect &&
        _batch.currentStep != MultiOrderStep.paymentProcessing) {
      _lastErrorMessage =
          'Cannot open payment selection from current step ${_batch.currentStep.name}. Rider must arrive at customer first.';
      notifyListeners();
      return false;
    }

    if (_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Payment has already been confirmed. Cannot re-open payment selection.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(
      batchStatus: MultiOrderBatchStatus.collectingPayment,
      currentStep: MultiOrderStep.paymentSelect,
    );
    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// [Transition 11] Simulate Payment Confirmation
  bool confirmPayment({String? transactionReference}) {
    _lastErrorMessage = null;

    if (_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Payment has already been confirmed for this order. Duplicate confirmation is rejected.';
      notifyListeners();
      return false;
    }

    if (!_batch.allPickupsVerified) {
      _lastErrorMessage =
          'Cannot confirm payment before all pickup stops have been verified.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.paymentProcessing) {
      _lastErrorMessage =
          'Cannot confirm payment while current step is ${_batch.currentStep.name}. Expected paymentProcessing.';
      notifyListeners();
      return false;
    }

    final method = _batch.paymentSummary.paymentMethod;
    if (method != PaymentMethod.cash && method != PaymentMethod.upi) {
      _lastErrorMessage =
          'A valid payment method (Cash or UPI) must be selected before confirming payment.';
      notifyListeners();
      return false;
    }

    final ref = transactionReference ??
        (method == PaymentMethod.upi
            ? 'UPI-TXN-4492881'
            : 'CASH-REC-${_nowProvider().millisecondsSinceEpoch.toString().substring(7)}');

    final updatedPayment = _batch.paymentSummary.copyWith(
      paymentStatus: PaymentStatus.completed,
      amountCollected: _batch.paymentSummary.totalAmountDue,
      transactionReference: ref,
    );

    _batch = _batch.copyWith(
      paymentSummary: updatedPayment,
      currentStep: MultiOrderStep.paymentConfirm,
    );

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// [Transition 12] Open 6-Digit Customer Delivery OTP Verification (`2074:44261`)
  bool openDeliveryOtp() {
    _lastErrorMessage = null;

    if (_batch.batchStatus == MultiOrderBatchStatus.completed ||
        _batch.isDeliveryOtpVerified) {
      _lastErrorMessage = 'Delivery has already been completed.';
      notifyListeners();
      return false;
    }

    if (!_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Cannot open delivery OTP before customer payment is confirmed.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.paymentConfirm &&
        _batch.currentStep != MultiOrderStep.deliveryOtpVerify) {
      _lastErrorMessage =
          'Cannot open delivery OTP from current step ${_batch.currentStep.name}.';
      notifyListeners();
      return false;
    }

    final changed = _batch.currentStep != MultiOrderStep.deliveryOtpVerify;
    _batch = _batch.copyWith(currentStep: MultiOrderStep.deliveryOtpVerify);

    if (changed) {
      _persistCurrentState();
    }
    notifyListeners();
    return true;
  }

  /// Returns from Delivery OTP back to Payment Received (`paymentConfirm`).
  bool returnToPaymentReceived() {
    _lastErrorMessage = null;

    if (_batch.batchStatus == MultiOrderBatchStatus.completed ||
        _batch.isDeliveryOtpVerified) {
      _lastErrorMessage =
          'Cannot return to Payment Received after delivery is completed.';
      notifyListeners();
      return false;
    }

    if (!_batch.isPaymentConfirmed ||
        _batch.currentStep != MultiOrderStep.deliveryOtpVerify) {
      _lastErrorMessage =
          'Can only return to Payment Received from deliveryOtpVerify.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(currentStep: MultiOrderStep.paymentConfirm);
    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// [Transition 13] Verify 6-Digit Customer Delivery OTP & Complete Delivery
  ///
  /// Successful OTP verification (`654321`) immediately completes delivery
  /// while keeping payment confirmed.
  bool verifyDeliveryOtp(String enteredOtp) {
    _lastErrorMessage = null;

    if (_batch.batchStatus == MultiOrderBatchStatus.completed ||
        _batch.isDeliveryOtpVerified) {
      _lastErrorMessage =
          'Delivery has already been completed. Duplicate verification is rejected.';
      notifyListeners();
      return false;
    }

    if (!_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Cannot verify delivery OTP before customer payment is confirmed.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.deliveryOtpVerify) {
      _lastErrorMessage =
          'Cannot verify delivery OTP from current step ${_batch.currentStep.name}. Expected deliveryOtpVerify.';
      notifyListeners();
      return false;
    }

    if (!_batch.validateDeliveryOtp(enteredOtp)) {
      _lastErrorMessage =
          'Incorrect delivery OTP "$enteredOtp". Please ask the customer and try again.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(
      isDeliveryOtpVerified: true,
      batchStatus: MultiOrderBatchStatus.completed,
      currentStep: MultiOrderStep.deliveryComplete,
    );

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  /// Completes delivery only after both payment confirmation and delivery OTP
  /// verification have succeeded.
  bool completeDelivery() {
    _lastErrorMessage = null;

    if (_batch.batchStatus == MultiOrderBatchStatus.completed ||
        _batch.currentStep == MultiOrderStep.deliveryComplete) {
      _lastErrorMessage = 'Delivery has already been completed.';
      notifyListeners();
      return false;
    }

    if (!_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Cannot complete delivery. Customer payment of ₹${_batch.paymentSummary.totalAmountDue.toStringAsFixed(2)} has not been confirmed.';
      notifyListeners();
      return false;
    }

    if (!_batch.isDeliveryOtpVerified) {
      _lastErrorMessage =
          'Cannot complete delivery before verifying the 6-digit customer delivery OTP.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(
      batchStatus: MultiOrderBatchStatus.completed,
      currentStep: MultiOrderStep.deliveryComplete,
    );

    _persistCurrentState();
    notifyListeners();
    return true;
  }

  // ===========================================================================
  // 3. Development / Testing Helpers
  // ===========================================================================

  /// Development/testing helper: resets the current demo state and clears
  /// persisted Multi-Order storage.
  Future<void> resetDemo() async {
    _lastErrorMessage = null;
    _isOnline = true;
    await _persistenceStore.clear();
    _batch = MockMultiOrderData.createSampleBatch(
      assignedAtEpochMs: _nowProvider().millisecondsSinceEpoch,
    );
    notifyListeners();
  }

  /// Development/testing helper: creates a fresh assignment without erasing
  /// previously completed, cancelled, or expired batch records.
  ///
  /// Returns `false` if an active delivery/pickup/payment is still in progress.
  bool assignFreshDemoBatch({String? newBatchId}) {
    _lastErrorMessage = null;

    if (!canGoOffline) {
      _lastErrorMessage =
          'Cannot assign a fresh batch while an active delivery is in progress.';
      notifyListeners();
      return false;
    }

    if (_batch.batchStatus == MultiOrderBatchStatus.completed ||
        _batch.batchStatus == MultiOrderBatchStatus.cancelled ||
        _batch.batchStatus == MultiOrderBatchStatus.expired) {
      _archivedBatches.add(_batch);
    }

    _isOnline = true;
    final sample = MockMultiOrderData.createSampleBatch(
      assignedAtEpochMs: _nowProvider().millisecondsSinceEpoch,
    );
    _batch = newBatchId != null ? sample.copyWith(id: newBatchId) : sample;
    _persistCurrentState();
    notifyListeners();
    return true;
  }
}
