import 'package:flutter/material.dart';
import '../../models/inventory_product.dart';

/// Card widget rendering an individual inventory product item matching Image 1.
class ProductItemCard extends StatelessWidget {
  final InventoryProduct product;
  final VoidCallback onTap;
  final VoidCallback? onMoreOptionsTap;

  const ProductItemCard({
    super.key,
    required this.product,
    required this.onTap,
    this.onMoreOptionsTap,
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
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Product Thumbnail / Icon
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Center(
                    child: _buildProductIcon(product),
                  ),
                ),
                const SizedBox(width: 12),

                // Details Column
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product Title
                      Text(
                        product.name,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF0F172A),
                          height: 1.2,
                        ),
                      ),
                      const SizedBox(height: 3),

                      // Category Hierarchy
                      Text(
                        '${product.category}  ›  ${product.subCategory}',
                        style: const TextStyle(
                          fontSize: 13,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Price and Discount Row
                      Row(
                        children: [
                          Text(
                            '₹${product.price.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'MRP ₹${product.mrp.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF94A3B8),
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

                // Right Column: Stock Badge & 3-dots Menu
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    _buildStockBadge(product),
                    const SizedBox(height: 12),
                    GestureDetector(
                      onTap: onMoreOptionsTap,
                      child: const Icon(
                        Icons.more_vert,
                        size: 20,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStockBadge(InventoryProduct product) {
    if (product.isOutOfStock) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: const Color(0xFFFEF2F2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Text(
          'Out of Stock',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Color(0xFFDC2626),
          ),
        ),
      );
    }

    if (product.isLowStock) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: const Color(0xFFFFFBEB),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          'Low Stock: ${product.currentStock}',
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: Color(0xFFD97706),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        'Qty: ${product.currentStock}',
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: Color(0xFF334155),
        ),
      ),
    );
  }

  Widget _buildProductIcon(InventoryProduct product) {
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

    return Icon(icon, color: iconColor, size: 26);
  }
}
