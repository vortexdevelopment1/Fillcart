import 'package:flutter/foundation.dart';
import 'order_item.dart';

/// Status of an individual pickup order within the multi-order sequence.
enum SubOrderStatus {
  /// Initial assigned state waiting for rider to navigate to merchant.
  pending,

  /// Rider has started navigation and is en route to this merchant.
  headingToPickup,

  /// Rider has reached merchant store and is verifying items / OTP.
  arrivedAtPickup,

  /// Order has been verified and picked up successfully.
  pickedUp,

  /// Order was cancelled or failed pickup.
  cancelled,
}

/// Represents an individual pickup order within a multi-order batch.
///
/// In the Fillcart Multi Order flow, exactly 3 sub-orders are batched together.
/// Each sub-order maintains its own merchant pickup details, unique 4-digit OTP,
/// item checklist, and independent verification status.
@immutable
class SubOrder {
  /// Unique order ID (e.g. "#ORD-8821").
  final String id;

  /// Sequential pickup stop number (1, 2, or 3).
  final int sequenceNumber;

  /// Merchant / store / restaurant name.
  final String merchantName;

  /// Complete merchant physical address.
  final String merchantAddress;

  /// Merchant contact phone number.
  final String? merchantPhone;

  /// Special pickup instructions from merchant or dispatch.
  final String? merchantInstructions;

  /// Geographic coordinates of the merchant for map navigation.
  final double? merchantLatitude;
  final double? merchantLongitude;

  /// Customer name associated with this sub-order.
  final String customerName;

  /// Customer contact phone number.
  final String customerPhone;

  /// Final delivery address for this order's destination.
  final String deliveryAddress;

  /// List of items to be picked up and verified at this store.
  final List<OrderItem> items;

  /// Expected 4-digit pickup verification OTP provided by merchant.
  final String pickupOtp;

  /// Whether this pickup order has been verified with its correct OTP.
  final bool isPickupVerified;

  /// Current lifecycle status of this sub-order.
  final SubOrderStatus status;

  const SubOrder({
    required this.id,
    required this.sequenceNumber,
    required this.merchantName,
    required this.merchantAddress,
    this.merchantPhone,
    this.merchantInstructions,
    this.merchantLatitude,
    this.merchantLongitude,
    required this.customerName,
    required this.customerPhone,
    required this.deliveryAddress,
    required this.items,
    required this.pickupOtp,
    this.isPickupVerified = false,
    this.status = SubOrderStatus.pending,
  });

  /// Whether all individual items on this order's checklist have been verified.
  bool get areAllItemsChecked =>
      items.isNotEmpty && items.every((item) => item.isChecked);

  /// Total count of individual item units in this order.
  int get totalItemsCount =>
      items.fold(0, (sum, item) => sum + item.quantity);

  /// Subtotal price of all items in this order.
  double get itemsSubtotal =>
      items.fold(0.0, (sum, item) => sum + item.lineTotal);

  /// Validates an entered OTP string against this order's expected [pickupOtp].
  bool validateOtp(String enteredOtp) {
    return enteredOtp.trim() == pickupOtp.trim();
  }

  /// Creates a copy of this [SubOrder] with updated values.
  SubOrder copyWith({
    String? id,
    int? sequenceNumber,
    String? merchantName,
    String? merchantAddress,
    String? merchantPhone,
    String? merchantInstructions,
    double? merchantLatitude,
    double? merchantLongitude,
    String? customerName,
    String? customerPhone,
    String? deliveryAddress,
    List<OrderItem>? items,
    String? pickupOtp,
    bool? isPickupVerified,
    SubOrderStatus? status,
  }) {
    return SubOrder(
      id: id ?? this.id,
      sequenceNumber: sequenceNumber ?? this.sequenceNumber,
      merchantName: merchantName ?? this.merchantName,
      merchantAddress: merchantAddress ?? this.merchantAddress,
      merchantPhone: merchantPhone ?? this.merchantPhone,
      merchantInstructions:
          merchantInstructions ?? this.merchantInstructions,
      merchantLatitude: merchantLatitude ?? this.merchantLatitude,
      merchantLongitude: merchantLongitude ?? this.merchantLongitude,
      customerName: customerName ?? this.customerName,
      customerPhone: customerPhone ?? this.customerPhone,
      deliveryAddress: deliveryAddress ?? this.deliveryAddress,
      items: items ?? this.items,
      pickupOtp: pickupOtp ?? this.pickupOtp,
      isPickupVerified: isPickupVerified ?? this.isPickupVerified,
      status: status ?? this.status,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is SubOrder &&
        other.id == id &&
        other.sequenceNumber == sequenceNumber &&
        other.merchantName == merchantName &&
        other.merchantAddress == merchantAddress &&
        other.customerName == customerName &&
        other.deliveryAddress == deliveryAddress &&
        other.pickupOtp == pickupOtp &&
        other.isPickupVerified == isPickupVerified &&
        other.status == status &&
        listEquals(other.items, items);
  }

  @override
  int get hashCode => Object.hash(
        id,
        sequenceNumber,
        merchantName,
        merchantAddress,
        customerName,
        deliveryAddress,
        pickupOtp,
        isPickupVerified,
        status,
        Object.hashAll(items),
      );

  @override
  String toString() =>
      'SubOrder(id: $id, seq: $sequenceNumber, merchant: $merchantName, verified: $isPickupVerified, status: $status)';
}
