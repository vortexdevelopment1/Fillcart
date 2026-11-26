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

  /// Batch was cancelled (explicitly rejected or went offline before acceptance).
  cancelled,

  /// Batch assignment timed out after 7 seconds without acceptance.
  expired,
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

  /// Screen 13: 6-digit customer delivery OTP verification (`2074:44261`).
  deliveryOtpVerify,

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

  /// Assignment timeout duration in milliseconds (strictly 7 seconds).
  static const int assignmentTimeoutMs = 7000;

  /// UTC epoch timestamp (ms) when this batch assignment was created.
  final int? assignedAtEpochMs;

  /// Expected 6-digit customer delivery OTP.
  final String deliveryOtp;

  /// Whether the customer delivery OTP has been verified.
  final bool isDeliveryOtpVerified;

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
    this.assignedAtEpochMs,
    this.deliveryOtp = '654321',
    this.isDeliveryOtpVerified = false,
  });

  /// Validates an entered 6-digit customer delivery OTP.
  bool validateDeliveryOtp(String enteredOtp) =>
      enteredOtp.trim() == deliveryOtp.trim();

  /// Remaining assignment countdown in milliseconds at [nowEpochMs].
  int remainingAssignmentMs(int nowEpochMs) {
    final assignedAt = assignedAtEpochMs;
    if (assignedAt == null) return 0;
    final remaining = assignmentTimeoutMs - (nowEpochMs - assignedAt);
    if (remaining <= 0) return 0;
    if (remaining >= assignmentTimeoutMs) return assignmentTimeoutMs;
    return remaining;
  }

  /// Remaining assignment countdown in whole seconds (ceiling) at [nowEpochMs].
  int remainingAssignmentSeconds(int nowEpochMs) {
    final ms = remainingAssignmentMs(nowEpochMs);
    if (ms <= 0) return 0;
    return (ms / 1000).ceil();
  }

  /// Whether the pending assignment has exceeded the 7-second window at [nowEpochMs].
  bool isAssignmentExpiredAt(int nowEpochMs) {
    final assignedAt = assignedAtEpochMs;
    if (assignedAt == null) return false;
    return (nowEpochMs - assignedAt) >= assignmentTimeoutMs;
  }

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
    int? assignedAtEpochMs,
    String? deliveryOtp,
    bool? isDeliveryOtpVerified,
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
      assignedAtEpochMs: assignedAtEpochMs ?? this.assignedAtEpochMs,
      deliveryOtp: deliveryOtp ?? this.deliveryOtp,
      isDeliveryOtpVerified:
          isDeliveryOtpVerified ?? this.isDeliveryOtpVerified,
    );
  }

  /// Serializes this [MultiOrderBatch] to a JSON map.
  Map<String, dynamic> toJson() => <String, dynamic>{
        'id': id,
        'totalOrders': totalOrders,
        'currentPickupSequence': currentPickupSequence,
        'subOrders': subOrders.map((o) => o.toJson()).toList(),
        'customerName': customerName,
        'customerPhone': customerPhone,
        'deliveryAddress': deliveryAddress,
        'totalDistanceKm': totalDistanceKm,
        'totalRiderEarnings': totalRiderEarnings,
        'baseEarnings': baseEarnings,
        'multiOrderBonus': multiOrderBonus,
        'distanceEarnings': distanceEarnings,
        'paymentSummary': paymentSummary.toJson(),
        'batchStatus': batchStatus.name,
        'currentStep': currentStep.name,
        'assignedAtEpochMs': assignedAtEpochMs,
        'deliveryOtp': deliveryOtp,
        'isDeliveryOtpVerified': isDeliveryOtpVerified,
      };

  /// Deserializes a [MultiOrderBatch] from a JSON map.
  factory MultiOrderBatch.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final customerName = json['customerName'];
    final customerPhone = json['customerPhone'];
    final deliveryAddress = json['deliveryAddress'];
    final totalDistanceKm = json['totalDistanceKm'];
    final totalRiderEarnings = json['totalRiderEarnings'];
    final rawSubOrders = json['subOrders'];
    final rawPayment = json['paymentSummary'];

    if (id is! String ||
        customerName is! String ||
        customerPhone is! String ||
        deliveryAddress is! String ||
        totalDistanceKm is! num ||
        totalRiderEarnings is! num ||
        rawSubOrders is! List ||
        rawPayment is! Map) {
      throw const FormatException('Invalid MultiOrderBatch JSON');
    }

    final statusName = json['batchStatus'];
    final batchStatus = MultiOrderBatchStatus.values.firstWhere(
      (s) => s.name == statusName,
      orElse: () =>
          throw FormatException('Unknown MultiOrderBatchStatus: $statusName'),
    );

    final stepName = json['currentStep'];
    final currentStep = MultiOrderStep.values.firstWhere(
      (s) => s.name == stepName,
      orElse: () => throw FormatException('Unknown MultiOrderStep: $stepName'),
    );

    final parsedSubOrders = rawSubOrders.map((entry) {
      if (entry is! Map) {
        throw const FormatException('Invalid SubOrder entry in MultiOrderBatch');
      }
      return SubOrder.fromJson(Map<String, dynamic>.from(entry));
    }).toList();

    return MultiOrderBatch(
      id: id,
      totalOrders: (json['totalOrders'] as num?)?.toInt() ?? 3,
      currentPickupSequence:
          (json['currentPickupSequence'] as num?)?.toInt() ?? 1,
      subOrders: parsedSubOrders,
      customerName: customerName,
      customerPhone: customerPhone,
      deliveryAddress: deliveryAddress,
      totalDistanceKm: totalDistanceKm.toDouble(),
      totalRiderEarnings: totalRiderEarnings.toDouble(),
      baseEarnings: (json['baseEarnings'] as num?)?.toDouble(),
      multiOrderBonus: (json['multiOrderBonus'] as num?)?.toDouble(),
      distanceEarnings: (json['distanceEarnings'] as num?)?.toDouble(),
      paymentSummary:
          PaymentSummary.fromJson(Map<String, dynamic>.from(rawPayment)),
      batchStatus: batchStatus,
      currentStep: currentStep,
      assignedAtEpochMs: (json['assignedAtEpochMs'] as num?)?.toInt(),
      deliveryOtp: json['deliveryOtp'] as String? ?? '654321',
      isDeliveryOtpVerified: json['isDeliveryOtpVerified'] as bool? ?? false,
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
        other.assignedAtEpochMs == assignedAtEpochMs &&
        other.deliveryOtp == deliveryOtp &&
        other.isDeliveryOtpVerified == isDeliveryOtpVerified &&
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
        assignedAtEpochMs,
        deliveryOtp,
        isDeliveryOtpVerified,
        Object.hashAll(subOrders),
      );

  @override
  String toString() =>
      'MultiOrderBatch(id: $id, seq: $currentPickupSequence, verified: $verifiedPickupsCount/$totalOrders, step: $currentStep, status: $batchStatus)';
}
