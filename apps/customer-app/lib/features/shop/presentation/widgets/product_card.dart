import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:flutter/material.dart';

/// Pixel-accurate Product Card matching the Figma design references.
class ProductCard extends StatelessWidget {
  final ProductItem product;
  final VoidCallback? onTap;
  final VoidCallback? onAddToCart;
  final VoidCallback? onToggleFavorite;

  const ProductCard({
    super.key,
    required this.product,
    this.onTap,
    this.onAddToCart,
    this.onToggleFavorite,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Image Container with Cream background
            Container(
              height: 125,
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFFFEF9EE),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Stack(
                children: [
                  // Product Image
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Image.asset(
                        product.imagePath,
                        fit: BoxFit.contain,
                        height: 95,
                        errorBuilder: (_, _, _) => const Icon(
                          Icons.shopping_bag_outlined,
                          size: 48,
                          color: Color(0xFFBDBDBD),
                        ),
                      ),
                    ),
                  ),

                  // Heart / Wishlist Icon button at top right
                  Positioned(
                    top: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: onToggleFavorite,
                      behavior: HitTestBehavior.opaque,
                      child: Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.9),
                          shape: BoxShape.circle,
                        ),
                        alignment: Alignment.center,
                        child: Icon(
                          product.isFavorite
                              ? Icons.favorite
                              : Icons.favorite_border,
                          size: 16,
                          color: product.isFavorite
                              ? Colors.red
                              : const Color(0xFF6B7280),
                        ),
                      ),
                    ),
                  ),

                  // Add To Cart Button (+) at bottom right of image box
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: GestureDetector(
                      onTap: onAddToCart,
                      behavior: HitTestBehavior.opaque,
                      child: Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5B014),
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFF5B014).withValues(alpha: 0.35),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: const Icon(
                          Icons.add,
                          color: Colors.black,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // Product Title
            Text(
              product.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1F1F1F),
                letterSpacing: -0.2,
              ),
            ),

            const SizedBox(height: 3),

            // Weight & Options
            Text.rich(
              TextSpan(
                text: product.weight,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
                children: [
                  const TextSpan(text: ' • '),
                  TextSpan(
                    text: product.optionsCount,
                    style: const TextStyle(
                      color: Color(0xFF4361EE),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 6),

            // Pricing & Discount row
            FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerLeft,
              child: Row(
                children: [
                  Text(
                    '₹${product.currentPrice.toInt()}',
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1F1F1F),
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    '₹${product.originalPrice.toInt()}',
                    style: const TextStyle(
                      fontSize: 11.5,
                      decoration: TextDecoration.lineThrough,
                      color: Color(0xFF9E9E9E),
                    ),
                  ),
                  const SizedBox(width: 5),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E9),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      '${product.discountPercent}% off',
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF2E7D32),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 4),

            // Rating row
            Row(
              children: [
                const Icon(
                  Icons.star,
                  size: 13,
                  color: Color(0xFFF5B014),
                ),
                const SizedBox(width: 3),
                Text(
                  '${product.rating}',
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1F1F1F),
                  ),
                ),
                const SizedBox(width: 3),
                Text(
                  '(${product.reviewCount})',
                  style: const TextStyle(
                    fontSize: 11,
                    color: Color(0xFF9E9E9E),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

