import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

/// Section 2: Today's Earnings Snapshot matching Figma node 1581:62287 (328 x 110 px).
///
/// Figma Specifications:
/// - Heading: "Today’s Earnings Snapshot" (Poppins Medium 14 px, #000000)
/// - Card (1581:62304): 328 x 74 px
///   - Background: rgba(251, 146, 60, 0.02)
///   - Border: 1 px #FB923C
///   - Radius: 12 px, padding: 12 px
///   - Left side: 48 x 48 px circular coin icon (dashboard_earned_today.png), "Earned Today" (14 px), "₹0" (Inter Bold 20 px, #111827)
///   - Right side: "View Earnings" pill button (border rgba(255, 142, 0, 0.5), text #F97316)
///   - Interaction: Tapping "View Earnings" navigates to /earnings
class TodayEarningsSnapshotCard extends StatelessWidget {
  const TodayEarningsSnapshotCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 24,
          child: Text(
            'Today’s Earnings Snapshot',
            key: const Key('earnings_snapshot_heading'),
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF000000),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          key: const Key('earnings_snapshot_card'),
          constraints: const BoxConstraints(minHeight: 74),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: const Color(0x05FB923C),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFFFB923C),
              width: 1,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Left: Coin Icon (48 x 48 px) + Earned Today + Amount
              Expanded(
                child: Row(
                  children: [
                    Image.asset(
                      'assets/icons/dashboard_earned_today.png',
                      key: const Key('earned_today_icon'),
                      width: 48,
                      height: 48,
                      fit: BoxFit.contain,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Earned Today',
                            key: const Key('earned_today_label'),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: const Color(0xFF555555),
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '₹0',
                            key: const Key('earned_today_amount'),
                            style: GoogleFonts.inter(
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF111827),
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 8),

              // Right: View Earnings Pill Button
              InkWell(
                key: const Key('view_earnings_button'),
                onTap: () {
                  try {
                    context.go('/earnings');
                  } catch (_) {
                    GoRouter.of(context).go('/earnings');
                  }
                },
                borderRadius: BorderRadius.circular(9999),
                child: Container(
                  height: 32,
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(9999),
                    border: Border.all(
                      color: const Color(0x80FF8E00),
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
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'View Earnings',
                        style: GoogleFonts.poppins(
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFFF97316),
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(
                        Icons.chevron_right_rounded,
                        size: 14,
                        color: Color(0xFFF97316),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
