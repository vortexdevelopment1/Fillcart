import 'package:flutter/foundation.dart';

/// Represents an individual item within an order in the Multi Order batch.
///
/// Each item has its own verification/checked status so the rider can
/// verify and tick off items on the store checklist before leaving.
@immutable
class OrderItem {
  /// Unique identifier for the item.
  final String id;

  /// Display name of the grocery / food / essential item.
  final String name;

  /// Quantity ordered.
  final int quantity;

  /// Optional unit or packaging description (e.g. "1 kg", "500 ml", "Strip of 15").
  final String? unit;

  /// Price per unit in Rupees (INR).
  final double? price;

  /// Whether this item has been verified/checked by the rider during pickup.
  final bool isChecked;

  const OrderItem({
    required this.id,
    required this.name,
    required this.quantity,
    this.unit,
    this.price,
    this.isChecked = false,
  });

  /// Creates a copy of this [OrderItem] with updated values.
  OrderItem copyWith({
    String? id,
    String? name,
    int? quantity,
    String? unit,
    double? price,
    bool? isChecked,
  }) {
    return OrderItem(
      id: id ?? this.id,
      name: name ?? this.name,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      price: price ?? this.price,
      isChecked: isChecked ?? this.isChecked,
    );
  }

  /// Calculates total price for this line item based on quantity.
  double get lineTotal => (price ?? 0.0) * quantity;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is OrderItem &&
        other.id == id &&
        other.name == name &&
        other.quantity == quantity &&
        other.unit == unit &&
        other.price == price &&
        other.isChecked == isChecked;
  }

  @override
  int get hashCode => Object.hash(id, name, quantity, unit, price, isChecked);

  @override
  String toString() =>
      'OrderItem(id: $id, name: $name, quantity: $quantity, isChecked: $isChecked)';
}
