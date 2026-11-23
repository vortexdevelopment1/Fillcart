import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Today's Earnings bar matching Figma node 1048:14779.
///
/// Figma Specifications:
/// - Dimensions: 328 x 40 px
/// - Background: #C1FE03 (RiderColors.earningNeon)
/// - Corner Radius: 8 px
/// - Padding: horizontal 16 px, vertical 8 px
/// - Row layout with space-between:
///   - Left: "Today Earnings" (Poppins Regular 16 px, #000000)
///   - Right: "₹ 0" (Poppins Medium 16 px, #000000)
class TodayEarningsBar extends StatelessWidget {
  final int amount;

  const TodayEarningsBar({
    super.key,
    this.amount = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('today_earnings_bar'),
      width: 328,
      height: 40,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: RiderColors.earningNeon,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Today Earnings',
            key: const Key('today_earnings_label'),
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF000000),
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '₹',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF000000),
                ),
              ),
              const SizedBox(width: 4),
              Text(
                '$amount',
                key: const Key('today_earnings_amount'),
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF000000),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
