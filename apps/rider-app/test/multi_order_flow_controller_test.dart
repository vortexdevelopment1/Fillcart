import 'package:fillcart_rider/features/orders/controllers/multi_order_flow_controller.dart';
import 'package:fillcart_rider/features/orders/data/mock_multi_order_data.dart';
import 'package:fillcart_rider/features/orders/data/multi_order_persistence_store.dart';
import 'package:fillcart_rider/features/orders/domain/models/multi_order_batch.dart';
import 'package:fillcart_rider/features/orders/domain/models/order_item.dart';
import 'package:fillcart_rider/features/orders/domain/models/payment_summary.dart';
import 'package:fillcart_rider/features/orders/domain/models/sub_order.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Multi-Order Models JSON & Helpers', () {
    test('OrderItem round-trip JSON preserves isChecked and lineTotal', () {
      const item = OrderItem(
        id: 'ITEM-1',
        name: 'Test Item',
        quantity: 3,
        unit: 'Pack',
        price: 25.5,
        isChecked: true,
      );
      final restored = OrderItem.fromJson(item.toJson());
      expect(restored, equals(item));
      expect(restored.lineTotal, equals(76.5));
      expect(restored.isChecked, isTrue);
    });

    test('PaymentSummary round-trip JSON preserves enums and amounts', () {
      const summary = PaymentSummary(
        subtotal: 614.0,
        deliveryFee: 45.0,
        totalAmountDue: 659.0,
        amountCollected: 659.0,
        paymentMethod: PaymentMethod.upi,
        paymentStatus: PaymentStatus.completed,
        transactionReference: 'UPI-TXN-4492881',
        paymentMethodLabel: 'Dynamic UPI QR',
      );
      final restored = PaymentSummary.fromJson(summary.toJson());
      expect(restored, equals(summary));
      expect(restored.isPaid, isTrue);
      expect(restored.isUpi, isTrue);
    });

    test('SubOrder defaults safety checks to false and handles missing fields', () {
      final batch = MockMultiOrderData.createSampleBatch(assignedAtEpochMs: 1000);
      final stop1 = batch.subOrders.first;
      expect(stop1.isOrderIdChecked, isFalse);
      expect(stop1.isCustomerDetailsChecked, isFalse);
      expect(stop1.isAllItemsCollected, isFalse);
      expect(stop1.areSafetyChecksComplete, isFalse);

      final json = stop1.toJson();
      json.remove('isOrderIdChecked');
      json.remove('isCustomerDetailsChecked');
      json.remove('isAllItemsCollected');
      final restored = SubOrder.fromJson(json);
      expect(restored.isOrderIdChecked, isFalse);
      expect(restored.isCustomerDetailsChecked, isFalse);
      expect(restored.isAllItemsCollected, isFalse);
    });

    test('MultiOrderBatch defaults deliveryOtp to 654321 and rejects invalid enums', () {
      final batch = MockMultiOrderData.createSampleBatch(assignedAtEpochMs: 1000);
      expect(batch.deliveryOtp, equals('654321'));
      expect(batch.isDeliveryOtpVerified, isFalse);
      expect(batch.paymentSummary.subtotal, equals(614.0));
      expect(batch.paymentSummary.deliveryFee, equals(45.0));
      expect(batch.paymentSummary.totalAmountDue, equals(659.0));
      expect(batch.totalRiderEarnings, equals(145.0));

      final restored = MultiOrderBatch.fromJson(batch.toJson());
      expect(restored, equals(batch));

      final invalidJson = batch.toJson()..['batchStatus'] = 'bogus_status';
      expect(
        () => MultiOrderBatch.fromJson(invalidJson),
        throwsFormatException,
      );
    });
  });

  group('MultiOrderFlowController — Assignment & Online/Offline', () {
    late DateTime now;
    late InMemoryMultiOrderPersistenceStore store;
    late MultiOrderFlowController controller;

    setUp(() {
      now = DateTime.utc(2026, 1, 1, 10, 0, 0);
      store = InMemoryMultiOrderPersistenceStore();
      controller = MultiOrderFlowController(
        persistenceStore: store,
        nowProvider: () => now,
      );
    });

    test('accepts assignment before 7s timeout and starts Pickup 1', () {
      now = now.add(const Duration(seconds: 6));
      expect(controller.remainingAssignmentSeconds, equals(1));
      expect(controller.acceptAssignment(), isTrue);
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.inPickup);
      expect(controller.batch.currentStep, MultiOrderStep.pickup1Route);
    });

    test('expires assignment at 7s and blocks subsequent acceptance', () {
      now = now.add(const Duration(seconds: 7));
      expect(controller.remainingAssignmentSeconds, equals(0));
      expect(controller.acceptAssignment(), isFalse);
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.expired);
      expect(controller.acceptAssignment(), isFalse);
    });

    test('rejection produces cancelled distinct from expired and cannot be accepted', () {
      expect(controller.rejectAssignment(), isTrue);
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.cancelled);
      expect(controller.acceptAssignment(), isFalse);
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.cancelled);
    });

    test('going offline during pending assignment cancels it', () {
      expect(controller.setOnlineStatus(false), isTrue);
      expect(controller.isOnline, isFalse);
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.cancelled);
      expect(controller.acceptAssignment(), isFalse);
    });

    test('going offline during active pickup/delivery is blocked', () {
      expect(controller.acceptAssignment(), isTrue);
      expect(controller.canGoOffline, isFalse);
      expect(controller.setOnlineStatus(false), isFalse);
      expect(controller.isOnline, isTrue);
      expect(controller.lastErrorMessage, isNotNull);
    });

    test('assignFreshDemoBatch preserves completed/cancelled/expired records', () {
      expect(controller.rejectAssignment(), isTrue);
      expect(controller.assignFreshDemoBatch(newBatchId: 'BATCH-NEW-2'), isTrue);
      expect(controller.archivedBatches.length, equals(1));
      expect(
        controller.archivedBatches.first.batchStatus,
        MultiOrderBatchStatus.cancelled,
      );
      expect(controller.batch.id, equals('BATCH-NEW-2'));
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.assigned);
    });
  });

  group('MultiOrderFlowController — Pickup Safety Checks, OTP & Legacy Checklist', () {
    late DateTime now;
    late InMemoryMultiOrderPersistenceStore store;
    late MultiOrderFlowController controller;

    setUp(() {
      now = DateTime.utc(2026, 1, 1, 10, 0, 0);
      store = InMemoryMultiOrderPersistenceStore();
      controller = MultiOrderFlowController(
        persistenceStore: store,
        nowProvider: () => now,
      );
    });

    void completeStopSafetyChecks(String orderId) {
      expect(
        controller.toggleSafetyCheck(
          orderId,
          MultiOrderSafetyCheckType.orderIdChecked,
        ),
        isTrue,
      );
      expect(
        controller.toggleSafetyCheck(
          orderId,
          MultiOrderSafetyCheckType.customerDetailsChecked,
        ),
        isTrue,
      );
      expect(
        controller.toggleSafetyCheck(
          orderId,
          MultiOrderSafetyCheckType.allItemsCollected,
        ),
        isTrue,
      );
    }

    test('three safety checks are independent and gate pickup OTP verification', () {
      expect(controller.acceptAssignment(), isTrue);
      expect(controller.arriveAtPickup(1), isTrue);

      // Legacy item checkboxes alone do NOT unlock pickup OTP
      controller.setAllItemsCheckedForOrder('#ORD-8821', true);
      expect(controller.verifyPickup(1, '4821'), isFalse);

      // Partial safety checks still block OTP
      controller.toggleSafetyCheck(
        '#ORD-8821',
        MultiOrderSafetyCheckType.orderIdChecked,
      );
      controller.toggleSafetyCheck(
        '#ORD-8821',
        MultiOrderSafetyCheckType.customerDetailsChecked,
      );
      expect(controller.verifyPickup(1, '4821'), isFalse);

      // Complete 3rd safety check -> wrong OTP fails, checklist preserved, retry succeeds
      controller.toggleSafetyCheck(
        '#ORD-8821',
        MultiOrderSafetyCheckType.allItemsCollected,
      );
      expect(controller.verifyPickup(1, '0000'), isFalse);
      expect(controller.batch.subOrders[0].areSafetyChecksComplete, isTrue);

      expect(controller.verifyPickup(1, '4821'), isTrue);
      expect(controller.batch.subOrders[0].isPickupVerified, isTrue);
      expect(controller.batch.currentPickupSequence, equals(2));

      // Cannot mutate safety checks or legacy items after verification
      expect(
        controller.toggleSafetyCheck(
          '#ORD-8821',
          MultiOrderSafetyCheckType.orderIdChecked,
        ),
        isFalse,
      );
      controller.toggleChecklistItem('#ORD-8821', 'ITEM-101');
      expect(controller.batch.subOrders[0].items.first.isChecked, isTrue);
    });

    test('complete sequential pickup flow enforces 4821, 9102, 3357', () {
      controller.acceptAssignment();
      controller.arriveAtPickup(1);
      completeStopSafetyChecks('#ORD-8821');
      expect(controller.verifyPickup(1, '4821'), isTrue);

      expect(controller.startPickup(2), isTrue);
      expect(controller.arriveAtPickup(2), isTrue);
      completeStopSafetyChecks('#ORD-8822');
      expect(controller.verifyPickup(2, '9102'), isTrue);

      expect(controller.startPickup(3), isTrue);
      expect(controller.arriveAtPickup(3), isTrue);
      completeStopSafetyChecks('#ORD-8823');
      expect(controller.verifyPickup(3, '3357'), isTrue);

      expect(controller.batch.allPickupsVerified, isTrue);
      expect(controller.startDelivery(), isTrue);
    });
  });

  group('MultiOrderFlowController — Payment, Delivery OTP & Persistence', () {
    late DateTime now;
    late InMemoryMultiOrderPersistenceStore store;
    late MultiOrderFlowController controller;

    void completeAllPickupsAndArriveAtCustomer(MultiOrderFlowController c) {
      c.acceptAssignment();
      final stops = [
        (1, '#ORD-8821', '4821'),
        (2, '#ORD-8822', '9102'),
        (3, '#ORD-8823', '3357'),
      ];
      for (final (seq, orderId, otp) in stops) {
        if (seq > 1) c.startPickup(seq);
        c.arriveAtPickup(seq);
        c.toggleSafetyCheck(orderId, MultiOrderSafetyCheckType.orderIdChecked);
        c.toggleSafetyCheck(
          orderId,
          MultiOrderSafetyCheckType.customerDetailsChecked,
        );
        c.toggleSafetyCheck(
          orderId,
          MultiOrderSafetyCheckType.allItemsCollected,
        );
        expect(c.verifyPickup(seq, otp), isTrue);
      }
      expect(c.startDelivery(), isTrue);
      expect(c.arriveAtCustomer(), isTrue);
    }

    setUp(() {
      now = DateTime.utc(2026, 1, 1, 10, 0, 0);
      store = InMemoryMultiOrderPersistenceStore();
      controller = MultiOrderFlowController(
        persistenceStore: store,
        nowProvider: () => now,
      );
    });

    test('cash & UPI switching, confirmation, duplicate guard, and 654321 delivery OTP', () {
      completeAllPickupsAndArriveAtCustomer(controller);

      // Delivery OTP blocked before payment confirmation
      expect(controller.openDeliveryOtp(), isFalse);
      expect(controller.verifyDeliveryOtp('654321'), isFalse);

      expect(controller.openPaymentSelection(), isTrue);
      expect(controller.selectPaymentMethod(PaymentMethod.cash), isTrue);
      // Switching to UPI before confirmation is allowed
      expect(controller.selectPaymentMethod(PaymentMethod.upi), isTrue);
      expect(controller.confirmPayment(), isTrue);

      // Duplicate payment confirmation & switching blocked
      expect(controller.confirmPayment(), isFalse);
      expect(controller.selectPaymentMethod(PaymentMethod.cash), isFalse);
      expect(controller.batch.isPaymentConfirmed, isTrue);
      expect(controller.batch.currentStep, MultiOrderStep.paymentConfirm);

      // Open Delivery OTP -> return to Payment Received -> re-open -> verify
      expect(controller.openDeliveryOtp(), isTrue);
      expect(controller.batch.currentStep, MultiOrderStep.deliveryOtpVerify);
      expect(controller.returnToPaymentReceived(), isTrue);
      expect(controller.batch.currentStep, MultiOrderStep.paymentConfirm);

      expect(controller.openDeliveryOtp(), isTrue);
      expect(controller.verifyDeliveryOtp('111111'), isFalse);
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.collectingPayment);

      // Valid delivery OTP completes delivery immediately
      expect(controller.verifyDeliveryOtp('654321'), isTrue);
      expect(controller.batch.isDeliveryOtpVerified, isTrue);
      expect(controller.batch.batchStatus, MultiOrderBatchStatus.completed);
      expect(controller.batch.currentStep, MultiOrderStep.deliveryComplete);
      expect(controller.batch.isPaymentConfirmed, isTrue);

      // Duplicate completion blocked
      expect(controller.verifyDeliveryOtp('654321'), isFalse);
      expect(controller.completeDelivery(), isFalse);
    });

    test('restores Payment Received & prevents duplicate payment after restart', () async {
      completeAllPickupsAndArriveAtCustomer(controller);
      controller.openPaymentSelection();
      controller.selectPaymentMethod(PaymentMethod.cash);
      controller.confirmPayment();

      final restoredController = MultiOrderFlowController(
        persistenceStore: store,
        nowProvider: () => now.add(const Duration(minutes: 5)),
      );
      expect(await restoredController.restoreState(), isTrue);
      expect(
        restoredController.batch.currentStep,
        MultiOrderStep.paymentConfirm,
      );
      expect(restoredController.batch.isPaymentConfirmed, isTrue);
      expect(
        restoredController.batch.paymentSummary.paymentMethod,
        PaymentMethod.cash,
      );
      expect(restoredController.confirmPayment(), isFalse);
      expect(restoredController.openDeliveryOtp(), isTrue);
      expect(restoredController.verifyDeliveryOtp('654321'), isTrue);
    });

    test('restores active pickup safety checks and legacy items cleanly', () async {
      controller.acceptAssignment();
      controller.arriveAtPickup(1);
      controller.toggleSafetyCheck(
        '#ORD-8821',
        MultiOrderSafetyCheckType.orderIdChecked,
      );
      controller.toggleChecklistItem('#ORD-8821', 'ITEM-101');

      final restored = MultiOrderFlowController(
        persistenceStore: store,
        nowProvider: () => now,
      );
      expect(await restored.restoreState(), isTrue);
      expect(restored.batch.currentStep, MultiOrderStep.pickup1Verify);
      expect(restored.batch.subOrders[0].isOrderIdChecked, isTrue);
      expect(restored.batch.subOrders[0].isCustomerDetailsChecked, isFalse);
      expect(restored.batch.subOrders[0].items[0].isChecked, isTrue);
    });

    test('restoring expired assignment marks it expired and does not restart timer', () async {
      // Trigger save of initial assigned state
      controller.batchAssigned();

      final later = now.add(const Duration(seconds: 10));
      final restored = MultiOrderFlowController(
        persistenceStore: store,
        nowProvider: () => later,
      );
      expect(await restored.restoreState(), isTrue);
      expect(restored.batch.batchStatus, MultiOrderBatchStatus.expired);
      expect(restored.remainingAssignmentSeconds, equals(0));
      expect(restored.acceptAssignment(), isFalse);
    });

    test('handles corrupted stored JSON safely without inventing state', () async {
      store.setRawJsonForTesting('{not valid json');
      final restored = MultiOrderFlowController(
        persistenceStore: store,
        nowProvider: () => now,
      );
      expect(await restored.restoreState(), isFalse);
      expect(restored.lastErrorMessage, isNotNull);
    });
  });
}
