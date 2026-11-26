import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import '../widgets/earnings_period_slider.dart';

/// Earnings Screen matching Figma Frames:
/// - Today: `1501:37215` (`Earning Screens 5`)
/// - Weekly: `1501:37491` (`Earning Screens 2 `)
/// - Monthly: `1501:37767` (`Earning Screens 3 `)
///
/// Figma Specifications:
/// - Frame size: 360 x 800 px
/// - Background: #F3F4E5
/// - Header: 328 x 82 px at (16, 48)
///   * Heading: "Earnings" with Back Button (18 px Poppins SemiBold, 24 px line height, #1B1C17)
///   * Spacing: 12 px
///   * Earnings Period Slider: 328 x 40 px ([ Today | Weekly | Monthly ])
/// - Line 13 Divider: 360 x 1 px, #EEEEEE (Present on Today frame 1501:37215)
/// - Empty State Container (Node 1501:37225): 307 x 259 px at (27, 271)
///   * Wallet Illustration (Node 1501:37226): 228 x 193 px (BoxFit.contain, centered horizontally)
///   * Spacing: 24 px
///   * Subtitle (Node 1501:37490): 307 x 42 px (14 px Poppins Regular, 21 px line height, #777980, centered)
/// - Bottom Navigation: Component 3 (360 x 68 px at y=732), index 2 active
class EarningsScreen extends StatefulWidget {
  final int initialPeriodIndex;
  final bool showBottomNavBar;

  const EarningsScreen({
    super.key,
    this.initialPeriodIndex = 0,
    this.showBottomNavBar = true,
  });

  @override
  State<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends State<EarningsScreen> {
  late int _selectedPeriod;

  @override
  void initState() {
    super.initState();
    _selectedPeriod = widget.initialPeriodIndex;
  }

  void _onPeriodChanged(int index) {
    if (_selectedPeriod != index) {
      setState(() {
        _selectedPeriod = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F4E5),
      bottomNavigationBar: widget.showBottomNavBar
          ? const RiderBottomNavBar(
              selectedIndex: 2,
            )
          : null,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // 1. Header Section: 328 x 82 px
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 12),

                  // Heading: "Earnings" with Back Button (328 x 30 px container)
                  SizedBox(
                    width: 328,
                    height: 30,
                    child: Row(
                      children: [
                        InkWell(
                          key: const Key('earnings_screen_back_button'),
                          onTap: () {
                            if (Navigator.of(context).canPop()) {
                              Navigator.of(context).pop();
                            } else {
                              context.go('/home');
                            }
                          },
                          borderRadius: BorderRadius.circular(20),
                          child: const SizedBox(
                            width: 24,
                            height: 24,
                            child: Center(
                              child: Icon(
                                Icons.arrow_back,
                                size: 20,
                                color: Color(0xFF1B1C17),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Earnings',
                          key: const Key('earnings_screen_heading'),
                          style: GoogleFonts.poppins(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            height: 24 / 18,
                            color: const Color(0xFF1B1C17),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // 12 px gap between heading and slider
                  const SizedBox(height: 12),

                  // Earnings Period Slider: 328 x 40 px
                  EarningsPeriodSlider(
                    selectedIndex: _selectedPeriod,
                    onPeriodChanged: _onPeriodChanged,
                  ),
                ],
              ),
            ),

            // 2. Empty-State Body (Consistent layout across Today, Weekly, and Monthly)
            Expanded(
              child: Stack(
                children: [
                  SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 26.5),
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const SizedBox(height: 60),

                            // Empty State Container: 307 x 259 px
                            SizedBox(
                              width: 307,
                              child: Column(
                                children: [
                                  // Wallet Illustration: 228 x 193 px, centered horizontally
                                  Center(
                                    child: Image.asset(
                                      'assets/images/wallet_empty.png',
                                      key: const Key('earnings_wallet_illustration'),
                                      width: 228,
                                      height: 193,
                                      fit: BoxFit.contain,
                                    ),
                                  ),

                                  // 24 px gap between illustration and subtitle
                                  const SizedBox(height: 24),

                                  // Subtitle Container: 307 x 42 px
                                  SizedBox(
                                    width: 307,
                                    height: 42,
                                    child: Text(
                                      'Complete your first delivery to start earning. Your earnings will appear here.',
                                      key: const Key('earnings_empty_subtitle'),
                                      textAlign: TextAlign.center,
                                      style: GoogleFonts.poppins(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w400,
                                        height: 21 / 14,
                                        color: const Color(0xFF777980),
                                      ),
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

                  // Line 13 Divider: Present on Today frame in Figma (positioned without shifting layout)
                  if (_selectedPeriod == 0)
                    const Positioned(
                      top: 12,
                      left: 0,
                      right: 0,
                      child: Divider(
                        key: Key('earnings_today_divider'),
                        height: 1,
                        thickness: 1,
                        color: Color(0xFFEEEEEE),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
