import 'product_model.dart';

/// Cart item model holding a product and its current quantity.
class CartItem {
  final ProductItem product;
  final int quantity;
  final String variantDescription;

  const CartItem({
    required this.product,
    this.quantity = 1,
    this.variantDescription = 'Split yellow lentils',
  });

  CartItem copyWith({
    int? quantity,
  }) {
    return CartItem(
      product: product,
      quantity: quantity ?? this.quantity,
      variantDescription: variantDescription,
    );
  }

  double get totalPrice => product.currentPrice * quantity;
}
