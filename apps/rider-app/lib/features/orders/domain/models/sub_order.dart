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

  /// Safety check 1: Whether the rider verified the order ID at pickup.
  final bool isOrderIdChecked;

  /// Safety check 2: Whether the rider verified customer details at pickup.
  final bool isCustomerDetailsChecked;

  /// Safety check 3: Whether the rider confirmed all items are collected.
  final bool isAllItemsCollected;

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
    this.isOrderIdChecked = false,
    this.isCustomerDetailsChecked = false,
    this.isAllItemsCollected = false,
  });

  /// Whether all three independent safety checks are completed for this pickup.
  bool get areSafetyChecksComplete =>
      isOrderIdChecked && isCustomerDetailsChecked && isAllItemsCollected;

  /// Whether all individual items on this order's legacy checklist have been verified.
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
    bool? isOrderIdChecked,
    bool? isCustomerDetailsChecked,
    bool? isAllItemsCollected,
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
      isOrderIdChecked: isOrderIdChecked ?? this.isOrderIdChecked,
      isCustomerDetailsChecked:
          isCustomerDetailsChecked ?? this.isCustomerDetailsChecked,
      isAllItemsCollected: isAllItemsCollected ?? this.isAllItemsCollected,
    );
  }

  /// Serializes this [SubOrder] to a JSON map.
  Map<String, dynamic> toJson() => <String, dynamic>{
        'id': id,
        'sequenceNumber': sequenceNumber,
        'merchantName': merchantName,
        'merchantAddress': merchantAddress,
        'merchantPhone': merchantPhone,
        'merchantInstructions': merchantInstructions,
        'merchantLatitude': merchantLatitude,
        'merchantLongitude': merchantLongitude,
        'customerName': customerName,
        'customerPhone': customerPhone,
        'deliveryAddress': deliveryAddress,
        'items': items.map((item) => item.toJson()).toList(),
        'pickupOtp': pickupOtp,
        'isPickupVerified': isPickupVerified,
        'status': status.name,
        'isOrderIdChecked': isOrderIdChecked,
        'isCustomerDetailsChecked': isCustomerDetailsChecked,
        'isAllItemsCollected': isAllItemsCollected,
      };

  /// Deserializes a [SubOrder] from a JSON map.
  factory SubOrder.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final sequenceNumber = json['sequenceNumber'];
    final merchantName = json['merchantName'];
    final merchantAddress = json['merchantAddress'];
    final customerName = json['customerName'];
    final customerPhone = json['customerPhone'];
    final deliveryAddress = json['deliveryAddress'];
    final pickupOtp = json['pickupOtp'];
    final rawItems = json['items'];

    if (id is! String ||
        sequenceNumber is! num ||
        merchantName is! String ||
        merchantAddress is! String ||
        customerName is! String ||
        customerPhone is! String ||
        deliveryAddress is! String ||
        pickupOtp is! String ||
        rawItems is! List) {
      throw const FormatException('Invalid SubOrder JSON');
    }

    final statusName = json['status'];
    final status = SubOrderStatus.values.firstWhere(
      (s) => s.name == statusName,
      orElse: () => throw FormatException('Unknown SubOrderStatus: $statusName'),
    );

    final parsedItems = rawItems.map((entry) {
      if (entry is! Map) {
        throw const FormatException('Invalid OrderItem entry in SubOrder');
      }
      return OrderItem.fromJson(Map<String, dynamic>.from(entry));
    }).toList();

    return SubOrder(
      id: id,
      sequenceNumber: sequenceNumber.toInt(),
      merchantName: merchantName,
      merchantAddress: merchantAddress,
      merchantPhone: json['merchantPhone'] as String?,
      merchantInstructions: json['merchantInstructions'] as String?,
      merchantLatitude: (json['merchantLatitude'] as num?)?.toDouble(),
      merchantLongitude: (json['merchantLongitude'] as num?)?.toDouble(),
      customerName: customerName,
      customerPhone: customerPhone,
      deliveryAddress: deliveryAddress,
      items: parsedItems,
      pickupOtp: pickupOtp,
      isPickupVerified: json['isPickupVerified'] as bool? ?? false,
      status: status,
      isOrderIdChecked: json['isOrderIdChecked'] as bool? ?? false,
      isCustomerDetailsChecked:
          json['isCustomerDetailsChecked'] as bool? ?? false,
      isAllItemsCollected: json['isAllItemsCollected'] as bool? ?? false,
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
        other.isOrderIdChecked == isOrderIdChecked &&
        other.isCustomerDetailsChecked == isCustomerDetailsChecked &&
        other.isAllItemsCollected == isAllItemsCollected &&
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
        isOrderIdChecked,
        isCustomerDetailsChecked,
        isAllItemsCollected,
        Object.hashAll(items),
      );

  @override
  String toString() =>
      'SubOrder(id: $id, seq: $sequenceNumber, merchant: $merchantName, verified: $isPickupVerified, status: $status)';
}
