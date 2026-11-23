import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Section 1: Today's Summary matching Figma node 1581:62234 (328 x 146 px).
///
/// Figma Specifications:
/// - Heading: "Today’s Summary" (Poppins Medium 14 px, #000000, 24 px line height)
/// - Two cards in horizontal row:
///   1. Available Orders (156 x 110 px):
///      - 24 x 24 px order icon (dashboard_available_orders.png) + value "0" (Poppins Medium 20 px)
///      - Title: "Available orders" (Poppins Medium 14 px, #000000)
///      - Subtitle: "New Orders Show Here" (Poppins Regular 12 px, #555555)
///   2. Completed Orders (157 x 110 px):
///      - 24 x 24 px bike icon (dashboard_completed_orders.png) + value "0" (Poppins Medium 20 px)
///      - Title: "Completed ord.." (Poppins Medium 14 px, #000000)
///      - Subtitle: "Today Completed Orders" (Poppins Regular 12 px, #555555)
class TodaySummarySection extends StatelessWidget {
  const TodaySummarySection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 24,
          child: Text(
            'Today’s Summary',
            key: const Key('todays_summary_heading'),
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF000000),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildSummaryCard(
                key: const Key('available_orders_card'),
                valueKey: const Key('available_orders_count'),
                iconAsset: 'assets/icons/dashboard_available_orders.png',
                value: '0',
                title: 'Available orders',
                subtitle: 'New Orders Show Here',
              ),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: _buildSummaryCard(
                key: const Key('completed_orders_card'),
                valueKey: const Key('completed_orders_count'),
                iconAsset: 'assets/icons/dashboard_completed_orders.png',
                value: '0',
                title: 'Completed ord..',
                subtitle: 'Today Completed Orders',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSummaryCard({
    required Key key,
    required Key valueKey,
    required String iconAsset,
    required String value,
    required String title,
    required String subtitle,
  }) {
    return Container(
      key: key,
      constraints: const BoxConstraints(minHeight: 110),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset(
                    iconAsset,
                    width: 24,
                    height: 24,
                    fit: BoxFit.contain,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    value,
                    key: valueKey,
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF000000),
                      height: 1.2,
                    ),
                  ),
                ],
              ),
              const Icon(
                Icons.chevron_right_rounded,
                size: 20,
                color: Color(0xFF999999),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF000000),
                  height: 1.2,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF555555),
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
