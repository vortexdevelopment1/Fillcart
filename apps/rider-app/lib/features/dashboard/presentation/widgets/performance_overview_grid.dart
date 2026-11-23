import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Section 3: Performance Overview matching Figma node 1584:62432 (328 x 244 px).
///
/// Figma Specifications:
/// - Heading: "Performance Overview" (Poppins Medium 14 px, #000000)
/// - 2 x 2 grid of metric cards (156 x 98 px each):
///   1. Online Hours: dashboard_online_hours.png, label "Online Hours" (Poppins Regular 14 px), value "0" (Poppins Medium 20 px)
///   2. Rider Rating: dashboard_rider_rating.png (shared star), label "Rider Rating" (Poppins Regular 14 px), value "0" (Poppins Medium 20 px)
///   3. Distance Covered: dashboard_distance.png, label "Distance Covered" (Poppins Regular 14 px), value "0" (Poppins Medium 20 px)
///   4. Orders Completed: dashboard_orders_completed.png, label "Orders Completed" (Poppins Regular 14 px), value "0" (Poppins Medium 20 px)
class PerformanceOverviewGrid extends StatelessWidget {
  const PerformanceOverviewGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 24,
          child: Text(
            'Performance Overview',
            key: const Key('performance_overview_heading'),
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF000000),
            ),
          ),
        ),
        const SizedBox(height: 12),
        // Row 1
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                key: const Key('online_hours_card'),
                valueKey: const Key('online_hours_value'),
                iconAsset: 'assets/icons/dashboard_online_hours.png',
                label: 'Online Hours',
                value: '0',
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildMetricCard(
                key: const Key('rider_rating_card'),
                valueKey: const Key('rider_rating_value'),
                iconAsset: 'assets/icons/dashboard_rider_rating.png',
                label: 'Rider Rating',
                value: '0',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Row 2
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                key: const Key('distance_covered_card'),
                valueKey: const Key('distance_covered_value'),
                iconAsset: 'assets/icons/dashboard_distance.png',
                label: 'Distance Covered',
                value: '0',
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildMetricCard(
                key: const Key('orders_completed_card'),
                valueKey: const Key('orders_completed_value'),
                iconAsset: 'assets/icons/dashboard_orders_completed.png',
                label: 'Orders Completed',
                value: '0',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMetricCard({
    required Key key,
    required Key valueKey,
    required String iconAsset,
    required String label,
    required String value,
  }) {
    return Container(
      key: key,
      constraints: const BoxConstraints(minHeight: 98),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFFDDDDDD),
          width: 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 2,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Image.asset(
            iconAsset,
            width: 24,
            height: 24,
            fit: BoxFit.contain,
          ),
          const SizedBox(height: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF000000),
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                key: valueKey,
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF191C1D),
                  letterSpacing: -0.2,
                  height: 1.2,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
