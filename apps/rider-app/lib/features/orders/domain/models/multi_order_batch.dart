import 'package:flutter/foundation.dart';
import 'payment_summary.dart';
import 'sub_order.dart';

/// Overall lifecycle status of a Multi Order batch.
enum MultiOrderBatchStatus {
  /// Batch has been assigned to the rider and is ready to start.
  assigned,

  /// Rider is actively navigating to or verifying pickups (sequence 1 to 3).
  inPickup,

  /// All 3 pickups are verified; rider is navigating to the customer.
  delivering,

  /// Arrived at customer location; selecting payment mode or collecting payment.
  collectingPayment,

  /// Payment collected and delivery marked complete.
  completed,

  /// Batch was cancelled.
  cancelled,
}

/// Granular step within the Multi Order lifecycle matching the Figma screens.
enum MultiOrderStep {
  /// Screen 1: Home dashboard with multi-order active card (`1523:40712`).
  batchAssigned,

  /// Screen 2: Map route and details for Stop 1 pickup (`1463:26246`).
  pickup1Route,

  /// Screen 3: Checklist and OTP verification at Stop 1 (`1531:44747`).
  pickup1Verify,

  /// Screen 4: Map route and details for Stop 2 pickup (`1531:46447`).
  pickup2Route,

  /// Screen 5: Checklist and OTP verification at Stop 2 (`1531:47416`).
  pickup2Verify,

  /// Screen 6: Map route and details for Stop 3 pickup (`1547:42238`).
  pickup3Route,

  /// Screen 7: Checklist and OTP verification at Stop 3 (`1555:36519`).
  pickup3Verify,

  /// Screen 8: En route to customer delivery location (`1555:36537`).
  deliveryRoute,

  /// Screen 8 (Arrived): Arrived at customer location.
  arriveAtCustomer,

  /// Screen 9: Payment mode selection (Cash vs UPI) (`1568:58262`).
  paymentSelect,

  /// Screen 10/11: Cash collection (`1569:60708`) or UPI QR scanning (`1569:60666`).
  paymentProcessing,

  /// Screen 12: Payment receipt & confirmation summary (`1569:60680`).
  paymentConfirm,

  /// Screen 14: Final delivery complete celebration and earnings (`1569:60724`).
  deliveryComplete,
}

/// Represents a complete Multi Order batch containing 3 sequential pickups
/// and 1 consolidated customer delivery.
@immutable
class MultiOrderBatch {
  /// Unique batch identifier (e.g. "BATCH-IND-7701").
  final String id;

  /// Total number of pickup orders in this batch (strictly 3).
  final int totalOrders;

  /// Current active pickup sequence number (1, 2, or 3).
  final int currentPickupSequence;

  /// The list of 3 sequential sub-orders.
  final List<SubOrder> subOrders;

  /// Name of the delivery customer.
  final String customerName;

  /// Contact phone number of the delivery customer.
  final String customerPhone;

  /// Consolidated delivery address where all 3 orders will be delivered.
  final String deliveryAddress;

  /// Total calculated route distance in kilometers (e.g. 5.8 km).
  final double totalDistanceKm;

  /// Total guaranteed earnings for the rider across this multi-order batch.
  final double totalRiderEarnings;

  /// Optional base payout component.
  final double? baseEarnings;

  /// Optional multi-order bonus payout component.
  final double? multiOrderBonus;

  /// Optional distance allowance component.
  final double? distanceEarnings;

  /// Complete payment summary including method, status, and breakdown.
  final PaymentSummary paymentSummary;

  /// High-level batch lifecycle status.
  final MultiOrderBatchStatus batchStatus;

  /// Current granular screen step in the local flow.
  final MultiOrderStep currentStep;

  const MultiOrderBatch({
    required this.id,
    this.totalOrders = 3,
    this.currentPickupSequence = 1,
    required this.subOrders,
    required this.customerName,
    required this.customerPhone,
    required this.deliveryAddress,
    required this.totalDistanceKm,
    required this.totalRiderEarnings,
    this.baseEarnings,
    this.multiOrderBonus,
    this.distanceEarnings,
    required this.paymentSummary,
    this.batchStatus = MultiOrderBatchStatus.assigned,
    this.currentStep = MultiOrderStep.batchAssigned,
  });

  /// Whether all 3 pickup sub-orders have been successfully verified with OTP.
  bool get allPickupsVerified =>
      subOrders.length == totalOrders &&
      subOrders.every((order) => order.isPickupVerified);

  /// Count of currently verified pickups (0 to 3).
  int get verifiedPickupsCount =>
      subOrders.where((order) => order.isPickupVerified).length;

  /// Whether customer payment has been confirmed and collected.
  bool get isPaymentConfirmed => paymentSummary.isPaid;

  /// The active [SubOrder] corresponding to the [currentPickupSequence].
  SubOrder? get currentSubOrder {
    try {
      return subOrders.firstWhere(
        (order) => order.sequenceNumber == currentPickupSequence,
      );
    } catch (_) {
      return null;
    }
  }

  /// Finds a [SubOrder] by its unique [orderId].
  SubOrder? findOrderById(String orderId) {
    try {
      return subOrders.firstWhere((order) => order.id == orderId);
    } catch (_) {
      return null;
    }
  }

  /// Creates a copy of this [MultiOrderBatch] with updated values.
  MultiOrderBatch copyWith({
    String? id,
    int? totalOrders,
    int? currentPickupSequence,
    List<SubOrder>? subOrders,
    String? customerName,
    String? customerPhone,
    String? deliveryAddress,
    double? totalDistanceKm,
    double? totalRiderEarnings,
    double? baseEarnings,
    double? multiOrderBonus,
    double? distanceEarnings,
    PaymentSummary? paymentSummary,
    MultiOrderBatchStatus? batchStatus,
    MultiOrderStep? currentStep,
  }) {
    return MultiOrderBatch(
      id: id ?? this.id,
      totalOrders: totalOrders ?? this.totalOrders,
      currentPickupSequence:
          currentPickupSequence ?? this.currentPickupSequence,
      subOrders: subOrders ?? this.subOrders,
      customerName: customerName ?? this.customerName,
      customerPhone: customerPhone ?? this.customerPhone,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      totalDistanceKm: totalDistanceKm ?? this.totalDistanceKm,
      totalRiderEarnings: totalRiderEarnings ?? this.totalRiderEarnings,
      baseEarnings: baseEarnings ?? this.baseEarnings,
      multiOrderBonus: multiOrderBonus ?? this.multiOrderBonus,
      distanceEarnings: distanceEarnings ?? this.distanceEarnings,
      paymentSummary: paymentSummary ?? this.paymentSummary,
      batchStatus: batchStatus ?? this.batchStatus,
      currentStep: currentStep ?? this.currentStep,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MultiOrderBatch &&
        other.id == id &&
        other.totalOrders == totalOrders &&
        other.currentPickupSequence == currentPickupSequence &&
        other.customerName == customerName &&
        other.customerPhone == customerPhone &&
        other.deliveryAddress == deliveryAddress &&
        other.totalDistanceKm == totalDistanceKm &&
        other.totalRiderEarnings == totalRiderEarnings &&
        other.baseEarnings == baseEarnings &&
        other.multiOrderBonus == multiOrderBonus &&
        other.distanceEarnings == distanceEarnings &&
        other.paymentSummary == paymentSummary &&
        other.batchStatus == batchStatus &&
        other.currentStep == currentStep &&
        listEquals(other.subOrders, subOrders);
  }

  @override
  int get hashCode => Object.hash(
        id,
        totalOrders,
        currentPickupSequence,
        customerName,
        customerPhone,
        deliveryAddress,
        totalDistanceKm,
        totalRiderEarnings,
        baseEarnings,
        multiOrderBonus,
        distanceEarnings,
        paymentSummary,
        batchStatus,
        currentStep,
        Object.hashAll(subOrders),
      );

  @override
  String toString() =>
      'MultiOrderBatch(id: $id, seq: $currentPickupSequence, verified: $verifiedPickupsCount/$totalOrders, step: $currentStep, status: $batchStatus)';
}
