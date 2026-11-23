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
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
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
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0F172A),
                  ),
                ),
                SvgPicture.asset(
                  AppAssets.svgNextArrow,
                  width: 18,
                  height: 18,
                  colorFilter: const ColorFilter.mode(
                    Color(0xFF64748B),
                    BlendMode.srcIn,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Multi-segment continuous progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: SizedBox(
              height: 8,
              child: Row(
                children: [
                  Expanded(
                    flex: metrics.inStockCount,
                    child: Container(color: const Color(0xFF10B981)),
                  ),
                  const SizedBox(width: 2),
                  Expanded(
                    flex: metrics.lowStockCount,
                    child: Container(color: const Color(0xFFF59E0B)),
                  ),
                  const SizedBox(width: 2),
                  Expanded(
                    flex: metrics.outOfStockCount,
                    child: Container(color: const Color(0xFFEF4444)),
                  ),
                ],
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
                fontSize: 12,
                color: Color(0xFF64748B),
              ),
            ),
            Text(
              stat,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF0F172A),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
