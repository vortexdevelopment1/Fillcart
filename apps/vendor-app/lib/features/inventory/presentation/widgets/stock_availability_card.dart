import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../../../core/constants/app_assets.dart';
import '../../models/inventory_metrics.dart';

/// Card showing the Stock Availability breakdown progress bar and legend (Image 2).
class StockAvailabilityCard extends StatelessWidget {
  final InventoryMetrics metrics;
  final VoidCallback? onTap;

  const StockAvailabilityCard({
    super.key,
    required this.metrics,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFE5E7EB),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Row
          InkWell(
            onTap: onTap,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Stock Availability',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF111827),
                  ),
                ),
                SvgPicture.asset(
                  AppAssets.svgNextArrow,
                  width: 18,
                  height: 18,
                  colorFilter: const ColorFilter.mode(
                    Color(0xFF6B7280),
                    BlendMode.srcIn,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Continuous gradient progress bar matching Image 4
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: Container(
              height: 8,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(4),
                gradient: const LinearGradient(
                  colors: [
                    Color(0xFF10B981),
                    Color(0xFF22C55E),
                    Color(0xFFF59E0B),
                    Color(0xFFEF4444),
                  ],
                  stops: [0.0, 0.75, 0.90, 1.0],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Legend Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildLegendItem(
                dotColor: const Color(0xFF10B981),
                label: 'In Stock',
                stat: '${metrics.inStockCount} (${metrics.inStockPercentage.toStringAsFixed(0)}%)',
              ),
              _buildLegendItem(
                dotColor: const Color(0xFFF59E0B),
                label: 'Low Stock',
                stat: '${metrics.lowStockCount} (${metrics.lowStockPercentage.toStringAsFixed(0)}%)',
              ),
              _buildLegendItem(
                dotColor: const Color(0xFFEF4444),
                label: 'Out of Stock',
                stat: '${metrics.outOfStockCount} (${metrics.outOfStockPercentage.toStringAsFixed(0)}%)',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem({
    required Color dotColor,
    required String label,
    required String stat,
  }) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 4, right: 6),
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: dotColor,
            shape: BoxShape.circle,
          ),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 12,
                color: Color(0xFF6B7280),
              ),
            ),
            Text(
              stat,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF111827),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
