import 'package:flutter/foundation.dart';
import '../data/mock_multi_order_data.dart';
import '../domain/models/multi_order_batch.dart';
import '../domain/models/order_item.dart';
import '../domain/models/payment_summary.dart';
import '../domain/models/sub_order.dart';

/// Lightweight, self-contained local state controller for the Multi Order demo flow.
///
/// Implemented strictly with Flutter's built-in [ChangeNotifier] without any
/// external packages (zero dependencies). Enforces strict sequential transitions,
/// individual OTP verification per store, itemized checklist tracking, and
/// payment verification gates.
class MultiOrderFlowController extends ChangeNotifier {
  late MultiOrderBatch _batch;
  String? _lastErrorMessage;

  /// Creates a new [MultiOrderFlowController] initialized with a fresh sample batch.
  MultiOrderFlowController({MultiOrderBatch? initialBatch}) {
    _batch = initialBatch ?? MockMultiOrderData.createSampleBatch();
  }

  /// Current state of the Multi Order batch.
  MultiOrderBatch get batch => _batch;

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

  // ===========================================================================
  // 1. Checklist Management (Store-specific itemized checklist)
  // ===========================================================================

  /// Toggles the checked status of a specific item within an order's checklist.
  ///
  /// Each order retains its own checklist items independently.
  void toggleChecklistItem(String orderId, String itemId) {
    _lastErrorMessage = null;
    final orderIndex = _batch.subOrders.indexWhere((o) => o.id == orderId);
    if (orderIndex == -1) {
      _lastErrorMessage = 'Order $orderId not found in batch.';
      notifyListeners();
      return;
    }

    final targetOrder = _batch.subOrders[orderIndex];
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
    notifyListeners();
  }

  /// Marks all items in the specified sub-order as checked or unchecked.
  void setAllItemsCheckedForOrder(String orderId, bool isChecked) {
    _lastErrorMessage = null;
    final orderIndex = _batch.subOrders.indexWhere((o) => o.id == orderId);
    if (orderIndex == -1) return;

    final targetOrder = _batch.subOrders[orderIndex];
    final updatedItems = targetOrder.items
        .map((item) => item.copyWith(isChecked: isChecked))
        .toList();

    final updatedOrder = targetOrder.copyWith(items: updatedItems);
    final updatedSubOrders = List<SubOrder>.from(_batch.subOrders);
    updatedSubOrders[orderIndex] = updatedOrder;

    _batch = _batch.copyWith(subOrders: updatedSubOrders);
    notifyListeners();
  }

  // ===========================================================================
  // 2. The 12 Sequential Multi-Order Flow Transitions
  // ===========================================================================

  /// [Transition 1] Batch Assigned
  /// Places the batch into the initial assigned state (`1523:40712`).
  void batchAssigned() {
    _lastErrorMessage = null;
    _batch = _batch.copyWith(
      batchStatus: MultiOrderBatchStatus.assigned,
      currentStep: MultiOrderStep.batchAssigned,
    );
    notifyListeners();
  }

  /// [Transition 2 / 4 / 6] Start Pickup for Stop 1, 2, or 3
  ///
  /// Enforces sequential stop progression and rejects invalid out-of-sequence calls:
  /// - Pickup 1 can start ONLY from the initial assigned stage (`batchAssigned`).
  /// - Pickup 2 can start ONLY after Pickup 1 is verified and the flow is at the correct next-pickup stage.
  /// - Pickup 3 can start ONLY after Pickup 2 is verified and the flow is at the correct next-pickup stage.
  /// - Prevents restarting Pickup 1 after later pickups or delivery have started.
  /// - Prevents backward, skipped, or repeated transitions.
  bool startPickup(int sequenceNumber) {
    _lastErrorMessage = null;

    if (sequenceNumber < 1 || sequenceNumber > 3) {
      _lastErrorMessage =
          'Invalid pickup stop sequence ($sequenceNumber). Must be 1, 2, or 3.';
      notifyListeners();
      return false;
    }

    // Guard: Prevent starting any pickup if delivery or payment has already started
    if (_batch.batchStatus == MultiOrderBatchStatus.delivering ||
        _batch.batchStatus == MultiOrderBatchStatus.collectingPayment ||
        _batch.batchStatus == MultiOrderBatchStatus.completed ||
        _batch.batchStatus == MultiOrderBatchStatus.cancelled) {
      _lastErrorMessage =
          'Cannot start pickup $sequenceNumber. Batch has already progressed to ${_batch.batchStatus.name}.';
      notifyListeners();
      return false;
    }

    if (sequenceNumber == 1) {
      // Pickup 1 can start ONLY from the initial assigned stage
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

      // Pickup 2 requires Pickup 1 to be verified
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
      // Must be at the stage following Stop 1 verification
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

      // Pickup 3 requires Pickup 2 to be verified
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
      // Must be at the stage following Stop 2 verification
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

    // Update sub-order status
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

    notifyListeners();
    return true;
  }

  /// Transition when the rider arrives at the merchant store and opens verification.
  /// Moves from route view (`*Route`) to checklist/OTP view (`*Verify`).
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

    notifyListeners();
    return true;
  }

  /// [Transition 3 / 5 / 7] Verify Pickup for Stop 1, 2, or 3 with checklist check and 4-digit OTP.
  ///
  /// Business Rules Enforced:
  /// 1. Sequence number must match the active pickup stop.
  /// 2. Current step must be the corresponding verification step.
  /// 3. Checklist Validation Gate: ALL items on the sub-order checklist MUST be checked
  ///    before OTP verification can proceed. If any item is unchecked:
  ///    - Returns false.
  ///    - Sets clear error message.
  ///    - Does not mark pickup verified.
  ///    - Does not change order status.
  ///    - Does not advance sequence or step.
  /// 4. OTP Validation Gate: Only after checklist is complete is the OTP evaluated.
  ///    - If OTP is incorrect: returns false, sets error, does not advance.
  ///    - If OTP is correct: marks `isPickupVerified = true`, `status = SubOrderStatus.pickedUp`,
  ///      and advances `currentPickupSequence` if more stops remain.
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

    // -------------------------------------------------------------
    // Gate 1: Checklist Completion Validation
    // -------------------------------------------------------------
    if (!targetOrder.areAllItemsChecked) {
      final uncheckedCount =
          targetOrder.items.where((item) => !item.isChecked).length;
      _lastErrorMessage =
          'Please verify all checklist items ($uncheckedCount pending) for ${targetOrder.merchantName} before confirming pickup.';
      notifyListeners();
      return false;
    }

    // -------------------------------------------------------------
    // Gate 2: OTP Validation
    // -------------------------------------------------------------
    if (!targetOrder.validateOtp(enteredOtp)) {
      _lastErrorMessage =
          'Incorrect OTP "$enteredOtp" for ${targetOrder.merchantName}. Pickup cannot be confirmed.';
      notifyListeners();
      return false;
    }

    // Checklist complete AND OTP verified successfully!
    final verifiedOrder = targetOrder.copyWith(
      isPickupVerified: true,
      status: SubOrderStatus.pickedUp,
    );

    final updatedSubOrders = List<SubOrder>.from(_batch.subOrders);
    updatedSubOrders[targetOrderIndex] = verifiedOrder;

    _batch = _batch.copyWith(subOrders: updatedSubOrders);

    // If there is a next stop, advance sequence
    if (sequenceNumber < 3) {
      _batch = _batch.copyWith(
        currentPickupSequence: sequenceNumber + 1,
      );
    }

    notifyListeners();
    return true;
  }

  /// [Transition 8] Start Delivery
  ///
  /// Business Rule Enforced:
  /// The delivery stage **CANNOT** begin until all 3 pickups are verified!
  bool startDelivery() {
    _lastErrorMessage = null;

    if (!_batch.allPickupsVerified) {
      final pendingCount = 3 - _batch.verifiedPickupsCount;
      _lastErrorMessage =
          'Cannot start delivery. $pendingCount pickup stop(s) still pending verification.';
      notifyListeners();
      return false;
    }

    // Must be coming from the verified pickup phase
    if (_batch.currentStep != MultiOrderStep.pickup3Verify &&
        _batch.currentStep != MultiOrderStep.deliveryRoute) {
      _lastErrorMessage =
          'Cannot start delivery from current step ${_batch.currentStep.name}.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(
      batchStatus: MultiOrderBatchStatus.delivering,
      currentStep: MultiOrderStep.deliveryRoute,
    );

    notifyListeners();
    return true;
  }

  /// [Transition 9] Arrive at Customer
  ///
  /// Moves rider to the customer arrival state (`1555:36537` arrived).
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

    _batch = _batch.copyWith(
      currentStep: MultiOrderStep.arriveAtCustomer,
    );

    notifyListeners();
    return true;
  }

  /// [Transition 10] Select Payment Method (Cash vs UPI)
  ///
  /// Business Rules Enforced:
  /// - Allowed ONLY while payment selection stage is active and all 3 pickups are verified.
  /// - Rejects `PaymentMethod.unselected` as an actual selection.
  /// - Does not let payment selection advance the flow from earlier pickup or delivery route stages.
  /// - Rejects changes if payment is already confirmed.
  bool selectPaymentMethod(PaymentMethod method) {
    _lastErrorMessage = null;

    // Reject PaymentMethod.unselected
    if (method == PaymentMethod.unselected) {
      _lastErrorMessage =
          'Cannot select unselected as a payment method. Must choose Cash or UPI.';
      notifyListeners();
      return false;
    }

    // All pickups must be verified
    if (!_batch.allPickupsVerified) {
      _lastErrorMessage =
          'Cannot select payment method before all pickups are verified.';
      notifyListeners();
      return false;
    }

    // Payment selection stage must be active
    if (_batch.currentStep != MultiOrderStep.paymentSelect &&
        _batch.currentStep != MultiOrderStep.arriveAtCustomer &&
        _batch.currentStep != MultiOrderStep.paymentProcessing) {
      _lastErrorMessage =
          'Payment method selection is only allowed after reaching the customer. Current step is ${_batch.currentStep.name}.';
      notifyListeners();
      return false;
    }

    // Cannot re-select after payment is already confirmed
    if (_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Payment has already been confirmed. Cannot re-select payment method.';
      notifyListeners();
      return false;
    }

    final label = method == PaymentMethod.cash
        ? 'Cash on Delivery (COD)'
        : method == PaymentMethod.upi
            ? 'Dynamic UPI QR'
            : 'Unselected';

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

    notifyListeners();
    return true;
  }

  /// Navigation helper to open or switch the payment selection screen (`1568:58262`).
  ///
  /// Allowed ONLY after the rider has arrived at the customer and all 3 pickups are verified.
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
    notifyListeners();
    return true;
  }

  /// [Transition 11] Simulate Payment Confirmation
  ///
  /// Business Rules Enforced:
  /// - All 3 pickups must be verified.
  /// - Rider must be in the customer arrival / payment stage (`MultiOrderStep.paymentProcessing`).
  /// - A valid payment method must be selected (`cash` or `upi`).
  /// - Prevents duplicate payment confirmation from changing an already completed payment.
  /// - Converges both Cash and UPI payment paths into the same payment-confirmed stage (`1569:60680`).
  bool confirmPayment({String? transactionReference}) {
    _lastErrorMessage = null;

    // Guard 1: Duplicate payment confirmation prevention
    if (_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Payment has already been confirmed for this order. Duplicate confirmation is rejected.';
      notifyListeners();
      return false;
    }

    // Guard 2: All pickups verified
    if (!_batch.allPickupsVerified) {
      _lastErrorMessage =
          'Cannot confirm payment before all pickup stops have been verified.';
      notifyListeners();
      return false;
    }

    // Guard 3: Current step must be paymentProcessing
    if (_batch.currentStep != MultiOrderStep.paymentProcessing) {
      _lastErrorMessage =
          'Cannot confirm payment while current step is ${_batch.currentStep.name}. Expected paymentProcessing.';
      notifyListeners();
      return false;
    }

    // Guard 4: Valid payment method must be selected (Cash or UPI)
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
            : 'CASH-REC-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}');

    final updatedPayment = _batch.paymentSummary.copyWith(
      paymentStatus: PaymentStatus.completed,
      amountCollected: _batch.paymentSummary.totalAmountDue,
      transactionReference: ref,
    );

    _batch = _batch.copyWith(
      paymentSummary: updatedPayment,
      currentStep: MultiOrderStep.paymentConfirm,
    );

    notifyListeners();
    return true;
  }

  /// [Transition 12] Complete Delivery
  ///
  /// Business Rules Enforced:
  /// - Delivery completion is **PREVENTED** if customer payment has not been confirmed!
  /// - Current step must be `paymentConfirm`.
  bool completeDelivery() {
    _lastErrorMessage = null;

    if (!_batch.isPaymentConfirmed) {
      _lastErrorMessage =
          'Cannot complete delivery. Customer payment of ₹${_batch.paymentSummary.totalAmountDue.toStringAsFixed(2)} has not been confirmed.';
      notifyListeners();
      return false;
    }

    if (_batch.currentStep != MultiOrderStep.paymentConfirm) {
      _lastErrorMessage =
          'Cannot complete delivery before reaching the payment confirmation stage. Current step is ${_batch.currentStep.name}.';
      notifyListeners();
      return false;
    }

    _batch = _batch.copyWith(
      batchStatus: MultiOrderBatchStatus.completed,
      currentStep: MultiOrderStep.deliveryComplete,
    );

    notifyListeners();
    return true;
  }

  /// Resets the controller back to the initial sample batch state for demo re-runs.
  void resetDemo() {
    _lastErrorMessage = null;
    _batch = MockMultiOrderData.createSampleBatch();
    notifyListeners();
  }
}
