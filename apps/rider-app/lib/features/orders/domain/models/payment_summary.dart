import 'package:flutter/foundation.dart';

/// Payment method options available during the Multi Order settlement flow.
enum PaymentMethod {
  /// Unselected initial state before rider selects payment mode.
  unselected,

  /// Cash on Delivery (COD).
  cash,

  /// Dynamic UPI QR code scanned by customer.
  upi,
}

/// Settlement status of the order payment.
enum PaymentStatus {
  /// Awaiting customer payment selection or action.
  pending,

  /// In the process of collection / QR scanning / status check.
  processing,

  /// Payment successfully verified and collected.
  completed,

  /// Payment attempt failed or cancelled.
  failed,
}

/// Represents the payment information and breakdown for the delivery.
///
/// Uses numeric [double] values for accurate calculation rather than
/// formatted currency strings.
@immutable
class PaymentSummary {
  /// Subtotal for items across the multi-order delivery.
  final double subtotal;

  /// Delivery and handling charge.
  final double deliveryFee;

  /// Total amount due from the customer (subtotal + deliveryFee).
  final double totalAmountDue;

  /// Actual amount collected from the customer.
  final double amountCollected;

  /// Selected payment method (Cash vs UPI).
  final PaymentMethod paymentMethod;

  /// Current status of the payment transaction.
  final PaymentStatus paymentStatus;

  /// Optional UPI transaction reference string (e.g. "UPI-TXN-4492881").
  final String? transactionReference;

  /// User-facing label for the payment method.
  final String? paymentMethodLabel;

  const PaymentSummary({
    required this.subtotal,
    required this.deliveryFee,
    required this.totalAmountDue,
    this.amountCollected = 0.0,
    this.paymentMethod = PaymentMethod.unselected,
    this.paymentStatus = PaymentStatus.pending,
    this.transactionReference,
    this.paymentMethodLabel,
  });

  /// Whether payment has been confirmed and fully collected.
  bool get isPaid => paymentStatus == PaymentStatus.completed;

  /// Whether payment was completed via Cash.
  bool get isCash => paymentMethod == PaymentMethod.cash;

  /// Whether payment was completed via UPI.
  bool get isUpi => paymentMethod == PaymentMethod.upi;

  /// Creates a copy of this [PaymentSummary] with updated values.
  PaymentSummary copyWith({
    double? subtotal,
    double? deliveryFee,
    double? totalAmountDue,
    double? amountCollected,
    PaymentMethod? paymentMethod,
    PaymentStatus? paymentStatus,
    String? transactionReference,
    String? paymentMethodLabel,
  }) {
    return PaymentSummary(
      subtotal: subtotal ?? this.subtotal,
      deliveryFee: deliveryFee ?? this.deliveryFee,
      totalAmountDue: totalAmountDue ?? this.totalAmountDue,
      amountCollected: amountCollected ?? this.amountCollected,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      transactionReference:
          transactionReference ?? this.transactionReference,
      paymentMethodLabel: paymentMethodLabel ?? this.paymentMethodLabel,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is PaymentSummary &&
        other.subtotal == subtotal &&
        other.deliveryFee == deliveryFee &&
        other.totalAmountDue == totalAmountDue &&
        other.amountCollected == amountCollected &&
        other.paymentMethod == paymentMethod &&
        other.paymentStatus == paymentStatus &&
        other.transactionReference == transactionReference &&
        other.paymentMethodLabel == paymentMethodLabel;
  }

  @override
  int get hashCode => Object.hash(
        subtotal,
        deliveryFee,
        totalAmountDue,
        amountCollected,
        paymentMethod,
        paymentStatus,
        transactionReference,
        paymentMethodLabel,
      );

  @override
  String toString() =>
      'PaymentSummary(due: $totalAmountDue, method: $paymentMethod, status: $paymentStatus, isPaid: $isPaid)';
}
