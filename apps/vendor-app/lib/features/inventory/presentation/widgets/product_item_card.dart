import 'package:flutter/material.dart';
import '../../models/inventory_product.dart';
import 'inventory_options_menu.dart';

/// Card widget rendering an individual inventory product item matching Figma Image 5.
///
/// Figma Specifications (Image 5):
/// - Flow: Horizontal
/// - Width: Fixed (328px) / Fill
/// - Height: Hug (84px)
/// - Radius: 16px
/// - Padding: 12px
/// - Card Background: Pure White (#FFFFFF)
/// - Thumbnail: 48x48 rounded rectangle (radius: 12px) with product image
/// - Title & Category: Left column with high-contrast Inter typography
/// - Top-Right: Qty badge & 3-dots icon aligned horizontally side-by-side
/// - Bottom Row: Price, MRP strikethrough, and discount badge
class ProductItemCard extends StatelessWidget {
  final InventoryProduct product;
  final VoidCallback onTap;
  final VoidCallback? onMoreOptionsTap;
  final VoidCallback? onEditProduct;
  final VoidCallback? onUpdateStock;
  final VoidCallback? onDeactivateProduct;
  final VoidCallback? onDeleteProduct;

  const ProductItemCard({
    super.key,
    required this.product,
    required this.onTap,
    this.onMoreOptionsTap,
    this.onEditProduct,
    this.onUpdateStock,
    this.onDeactivateProduct,
    this.onDeleteProduct,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Clean Single Thumbnail (No double-box, no clipping)
                _buildProductThumbnail(product),
                const SizedBox(width: 12),

                // Details Column
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Top Row: Title on left, [Qty badge + 3-dots icon] on right
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Expanded(
                            child: Text(
                              product.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF111827),
                                height: 1.2,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              _buildStockBadge(product),
                              const SizedBox(width: 2),
                              SizedBox(
                                width: 24,
                                height: 24,
                                child: ProductCardOptionsMenuButton(
                                  product: product,
                                  iconSize: 18,
                                  iconColor: const Color(0xFF9CA3AF),
                                  onEditProduct: onEditProduct,
                                  onUpdateStock: onUpdateStock ?? onTap,
                                  onDeactivateProduct: onDeactivateProduct,
                                  onDeleteProduct: onDeleteProduct,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),

                      // Category Subtitle
                      Text(
                        '${product.category}  ›  ${product.subCategory}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12.5,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                      const SizedBox(height: 5),

                      // Price and Discount Row
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text(
                            '₹${product.price.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'MRP ₹${product.mrp.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF9CA3AF),
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFECFDF5),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              '${product.discountPercent.toStringAsFixed(product.discountPercent.truncateToDouble() == product.discountPercent ? 0 : 1)}% off',
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF059669),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProductThumbnail(InventoryProduct product) {
    if (product.imageUrl != null && product.imageUrl!.isNotEmpty) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: SizedBox(
          width: 48,
          height: 48,
          child: Image.asset(
            product.imageUrl!,
            width: 48,
            height: 48,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => _buildFallbackIcon(product),
          ),
        ),
      );
    }
    return _buildFallbackIcon(product);
  }

  Widget _buildStockBadge(InventoryProduct product) {
    if (product.isOutOfStock) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: const Color(0xFFFEF2F2),
          borderRadius: BorderRadius.circular(9999),
        ),
        child: const Text(
          'Out of Stock',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 11.5,
            fontWeight: FontWeight.w600,
            color: Color(0xFFDC2626),
          ),
        ),
      );
    }

    if (product.isLowStock) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: const Color(0xFFFEF3C7),
          borderRadius: BorderRadius.circular(9999),
        ),
        child: Text(
          'Low Stock: ${product.currentStock}',
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 11.5,
            fontWeight: FontWeight.w600,
            color: Color(0xFFD97706),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(9999),
      ),
      child: Text(
        'Qty: ${product.currentStock}',
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 11.5,
          fontWeight: FontWeight.w500,
          color: Color(0xFF4B5563),
        ),
      ),
    );
  }

  Widget _buildFallbackIcon(InventoryProduct product) {
    IconData icon;
    Color iconColor;

    if (product.category.toLowerCase().contains('dairy')) {
      icon = Icons.local_drink_outlined;
      iconColor = const Color(0xFF0284C7);
    } else if (product.category.toLowerCase().contains('bakery')) {
      icon = Icons.bakery_dining_outlined;
      iconColor = const Color(0xFFD97706);
    } else if (product.name.toLowerCase().contains('detergent')) {
      icon = Icons.cleaning_services_outlined;
      iconColor = const Color(0xFF7C3AED);
    } else {
      icon = Icons.inventory_2_outlined;
      iconColor = const Color(0xFF10B981);
    }

    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Center(
        child: Icon(icon, color: iconColor, size: 24),
      ),
    );
  }
}
