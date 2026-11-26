import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../home/presentation/widgets/rider_online_toggle_bar.dart';
import '../../../home/presentation/widgets/today_earnings_bar.dart';

/// Header section for the Dashboard screen matching Figma Top Frame (Node 1076:14889).
///
/// Figma Specifications (360 x 208 px):
/// - Background Gradient: 4-stop linear gradient (#FFE700 -> #FFF48C -> #FFF8B0 -> #FFFFFF)
/// - Safe area / status bar spacing: 48 px
/// - Profile row (1076:14893): 328 x 36 px at padding 16 px
///   - Avatar: 36 x 36 px blank grey circle (#D9D9D9)
///   - Name: "Ms Dhoni" (Poppins Medium 12 px, #080808)
///   - Location: "Vijay Nagar, Indore" (Poppins Regular 12 px, #0A0A0A)
///   - Notification bell: 24 x 24 px
/// - Toggle & Earnings bars container (1076:14904): 328 x 84 px with 8 px gap
///   - Online / Offline toggle bar (328 x 36 px)
///   - Today's Earnings bar (328 x 40 px, #C1FE03)
class DashboardHeader extends StatelessWidget {
  final bool isOnline;
  final ValueChanged<bool>? onToggleChanged;

  const DashboardHeader({
    super.key,
    this.isOnline = true,
    this.onToggleChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFFFE700),
            Color(0xFFFFF48C),
            Color(0xFFFFF8B0),
            Color(0xFFFFFFFF),
          ],
          stops: [0.0198, 0.325, 0.864, 0.996],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 8),

              // Profile Row: 328 x 36 px (responsive flex)
              SizedBox(
                height: 36,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Left: Avatar + Name & Location
                    Expanded(
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: const Color(0xFFD9D9D9),
                              border: Border.all(
                                color: const Color(0x22000000),
                                width: 1,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Ms Dhoni',
                                  key: const Key('dashboard_rider_name'),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.poppins(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: const Color(0xFF080808),
                                    height: 1.2,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Vijay Nagar, Indore',
                                  key: const Key('dashboard_rider_location'),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.poppins(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w400,
                                    color: const Color(0xFF0A0A0A),
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

                    // Right: Notification Bell (24 x 24 px)
                    InkWell(
                      key: const Key('dashboard_notification_button'),
                      onTap: () {
                        context.push('/notifications');
                      },
                      borderRadius: BorderRadius.circular(12),
                      child: Padding(
                        padding: const EdgeInsets.all(4.0),
                        child: Image.asset(
                          'assets/icons/home_notification.png',
                          width: 24,
                          height: 24,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 12),

              // Action Bars Container (328 x 84 px with 8 px spacing, fitted for narrow viewports)
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    RiderOnlineToggleBar(
                      initialOnline: isOnline,
                      onToggleChanged: onToggleChanged,
                    ),
                    const SizedBox(height: 8),
                    const TodayEarningsBar(amount: 0),
                  ],
                ),
              ),

              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
