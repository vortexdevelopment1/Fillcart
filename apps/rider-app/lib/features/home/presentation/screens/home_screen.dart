import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../../navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import '../../../profile/bloc/profile_bloc.dart';
import '../widgets/rider_online_toggle_bar.dart';
import '../widgets/today_earnings_bar.dart';

/// New Rider Home Screen / No Orders Empty State (Figma Node 1045:3648).
///
/// Figma Specifications (360 x 800 px):
/// - Background: #FFFFFF (RiderColors.background)
/// - Header Container: 360 x 217 px with gradient (#FFE700 -> #FFF48C -> #FFF8B0 -> #FFFFFF)
/// - Status Bar spacer: 48 px
/// - Profile Row (1470:54670): 328 x 42 px at x=16, y=64
///   - Avatar: 36 x 36 px circular
///   - Name: "Ms Dhoni" (Poppins Medium 14 px, #080808)
///   - Location: "Vijay Nagar, Indore" (Poppins Regular 12 px, #0A0A0A)
///   - Notification bell: 24 x 24 px
/// - Online / Offline toggle bar (1470:54683 / 153:1171): 328 x 36 px
/// - Today's Earnings bar (1048:14779): 328 x 40 px, #C1FE03
/// - Empty state container (1076:14670): 328 x 348 px
///   - Illustration container (1076:14258): 328 x 254 px (placeholder pending asset export)
///   - Text container (1070:14256): 315 x 68 px
///     - Title (1070:14253): "No Delivery Requests Yet" (Poppins SemiBold 16 px, #1B1C17)
///     - Subtitle (1070:14255): "Stay online and ready. We’ll notify you as soon as a delivery request  comes."
///       (Poppins Regular 12 px, #777980, literal double space preserved)
/// - Bottom Navigation Bar (1359:19422): 360 x 68 px fixed at bottom with Home tab active
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isOnline = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RiderColors.background,
      bottomNavigationBar: const RiderBottomNavBar(selectedIndex: 0),
      body: Column(
        children: [
          // 1. Header Section with Gradient (360 x 217 px)
          Container(
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

                    // Profile Row: 328 x 42 px
                    SizedBox(
                      height: 42,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          // Left: Avatar + Name & Location (tap opens Profile)
                          InkWell(
                            key: const Key('home_profile_button'),
                            onTap: () {
                              try {
                                GoRouter.of(context).push('/profile');
                              } catch (_) {}
                            },
                            borderRadius: BorderRadius.circular(12),
                            child: Row(
                              children: [
                                Container(
                                  width: 36,
                                  height: 36,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: const Color(0xFFF0F0F0),
                                    border: Border.all(
                                      color: const Color(0x22000000),
                                      width: 1,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Builder(
                                  builder: (context) {
                                    String riderName = 'Ms Dhoni';
                                    try {
                                      riderName = context
                                          .watch<ProfileBloc>()
                                          .state
                                          .profile
                                          .fullName;
                                    } catch (_) {}
                                    return Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          riderName,
                                          key: const Key('home_rider_name'),
                                          style: GoogleFonts.poppins(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w500,
                                            color: const Color(0xFF080808),
                                          ),
                                        ),
                                        Text(
                                          'Vijay Nagar, Indore',
                                          key: const Key('home_rider_location'),
                                          style: GoogleFonts.poppins(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w400,
                                            color: const Color(0xFF0A0A0A),
                                          ),
                                        ),
                                      ],
                                    );
                                  },
                                ),
                              ],
                            ),
                          ),

                          // Right: Notification Bell (24 x 24 px)
                          InkWell(
                            key: const Key('home_notification_button'),
                            onTap: () {
                              ScaffoldMessenger.of(context).hideCurrentSnackBar();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'No new notifications',
                                    style: GoogleFonts.poppins(fontSize: 13),
                                  ),
                                  duration: const Duration(seconds: 1),
                                  behavior: SnackBarBehavior.floating,
                                  backgroundColor: RiderColors.onSurfaceDark,
                                ),
                              );
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

                    // Online / Offline Toggle Bar (328 x 36 px)
                    RiderOnlineToggleBar(
                      initialOnline: _isOnline,
                      onToggleChanged: (online) {
                        setState(() {
                          _isOnline = online;
                        });
                      },
                    ),

                    const SizedBox(height: 8),

                    // Today's Earnings Bar (328 x 40 px)
                    const TodayEarningsBar(amount: 0),

                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ),

          // 2. Empty-State Body (Scrollable for responsiveness on small viewports)
          Expanded(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 16),

                    // Dimensionally accurate illustration (328 x 254 px)
                    Image.asset(
                      'assets/images/rider_scooter_empty.png',
                      key: const Key('home_scooter_illustration'),
                      width: 328,
                      height: 254,
                      fit: BoxFit.contain,
                    ),

                    const SizedBox(height: 16),

                    // Title & Subtitle Container (315 x 68 px)
                    SizedBox(
                      width: 315,
                      child: Column(
                        children: [
                          Text(
                            'No Delivery Requests Yet',
                            key: const Key('home_empty_title'),
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              height: 1.5,
                              color: const Color(0xFF1B1C17),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Stay online and ready. We’ll notify you as soon as a delivery request  comes.',
                            key: const Key('home_empty_subtitle'),
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              height: 1.5,
                              color: const Color(0xFF777980),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
