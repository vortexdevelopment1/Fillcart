import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import '../widgets/orders_slider_bar.dart';

/// Orders Screen matching Figma Frames `1501:38043` (Active Orders) and `1501:38466` (Completed Orders).
///
/// Figma Specifications:
/// - Frame size: 360 x 800 px
/// - Background: #F3F4E5
/// - Header: 328 x 82 px at (16, 48)
///   * Top Screen Heading: "Orders" (18 px Poppins SemiBold, 24 px line height, #1B1C17)
///   * Spacing: 12 px
///   * Orders Slider: 328 x 40 px ([ Active Orders | Completed Orders ])
/// - Active Empty State (Node 1501:38051):
///   * Scooter Illustration: 328 x 254 px (BoxFit.contain)
///   * Spacing: 12 px
///   * Title: "No Delivery Requests Yet" (16 px Poppins SemiBold, 24 px line height, #1B1C17)
///   * Spacing: 8 px
///   * Subtitle: "Stay online to receive delivery requests." (14 px Poppins Regular, 21 px line height, #777980)
/// - Completed Empty State (Node 1501:38473):
///   * Standing Rider Illustration: 218 x 192 px (BoxFit.contain, centered horizontally)
///   * Spacing: 16 px
///   * Title: "No Completed Orders Yet" (16 px Poppins SemiBold, 24 px line height, #1B1C17)
///   * Spacing: 8 px
///   * Subtitle: "Your completed orders will appear here." (14 px Poppins Regular, 21 px line height, #777980, 280 px wide)
/// - Bottom Navigation: Component 3 (360 x 68 px at y=732), index 1 active
class OrdersScreen extends StatefulWidget {
  final int initialTabIndex;
  final bool showBottomNavBar;

  const OrdersScreen({
    super.key,
    this.initialTabIndex = 0,
    this.showBottomNavBar = true,
  });

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  late int _selectedTab;

  @override
  void initState() {
    super.initState();
    _selectedTab = widget.initialTabIndex;
  }

  void _onTabChanged(int index) {
    if (_selectedTab != index) {
      setState(() {
        _selectedTab = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F4E5),
      bottomNavigationBar: widget.showBottomNavBar
          ? const RiderBottomNavBar(
              selectedIndex: 1,
            )
          : null,
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // 1. Header Section: 328 x 82 px (at 16, 48 in 800 px frame)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 12),

                  // Heading: "Orders" (328 x 30 px container)
                  SizedBox(
                    width: 328,
                    height: 30,
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Orders',
                        key: const Key('orders_screen_heading'),
                        style: GoogleFonts.poppins(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          height: 24 / 18,
                          color: const Color(0xFF1B1C17),
                        ),
                      ),
                    ),
                  ),

                  // 12 px gap between heading and slider
                  const SizedBox(height: 12),

                  // Orders Slider: 328 x 40 px
                  OrdersSliderBar(
                    selectedIndex: _selectedTab,
                    onTabChanged: _onTabChanged,
                  ),
                ],
              ),
            ),

            // 2. Empty-State Body (Scrollable for small viewports, centered in available body area)
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Center(
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 200),
                      reverseDuration: const Duration(milliseconds: 150),
                      switchInCurve: Curves.easeOut,
                      switchOutCurve: Curves.easeIn,
                      layoutBuilder: (Widget? currentChild, List<Widget> previousChildren) {
                        return Stack(
                          alignment: Alignment.topCenter,
                          children: <Widget>[
                            ...previousChildren,
                            if (currentChild != null) currentChild,
                          ],
                        );
                      },
                      transitionBuilder: (child, animation) {
                        return FadeTransition(
                          opacity: animation,
                          child: child,
                        );
                      },
                      child: _selectedTab == 0
                          ? _buildActiveEmptyState()
                          : _buildCompletedEmptyState(),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Active Orders Empty State matching Node `1501:38051` (328 x 319 px).
  Widget _buildActiveEmptyState() {
    return Column(
      key: const ValueKey('active_orders_empty_view'),
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const SizedBox(height: 48),

        // Illustration: 328 x 254 px matching Figma node 1501:38052
        Image.asset(
          'assets/images/rider_scooter_empty.png',
          key: const Key('orders_active_illustration'),
          width: 328,
          height: 254,
          fit: BoxFit.contain,
        ),

        // 12 px gap between illustration and text matching Figma node 1501:38051
        const SizedBox(height: 12),

        // Text Context: 328 x 53 px
        SizedBox(
          width: 328,
          child: Column(
            children: [
              Text(
                'No Delivery Requests Yet',
                key: const Key('orders_active_empty_title'),
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  height: 24 / 16,
                  color: const Color(0xFF1B1C17),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Stay online to receive delivery requests.',
                key: const Key('orders_active_empty_subtitle'),
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  height: 21 / 14,
                  color: const Color(0xFF777980),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),
      ],
    );
  }

  /// Completed Orders Empty State matching Node `1501:38473` (328 x 261 px).
  Widget _buildCompletedEmptyState() {
    return Column(
      key: const ValueKey('completed_orders_empty_view'),
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Top spacing calibrated to align title baseline exactly with Active Orders:
        // Active: 48 (top) + 254 (illustration) + 12 (gap) = 314 px to title
        // Completed: 106 (top) + 192 (illustration) + 16 (gap) = 314 px to title
        const SizedBox(height: 106),

        // Illustration: 218 x 192 px, centered horizontally matching Figma node 1589:64102
        Center(
          child: Image.asset(
            'assets/images/completed_orders_empty.png',
            key: const Key('orders_completed_illustration'),
            width: 218,
            height: 192,
            fit: BoxFit.contain,
          ),
        ),

        // 16 px gap between illustration and text matching Figma node 1501:38473
        const SizedBox(height: 16),

        // Text Context: 328 x 53 px (subtitle in 280 px container)
        SizedBox(
          width: 328,
          child: Column(
            children: [
              Text(
                'No Completed Orders Yet',
                key: const Key('orders_completed_empty_title'),
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  height: 24 / 16,
                  color: const Color(0xFF1B1C17),
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: 280,
                child: Text(
                  'Your completed orders will appear here.',
                  key: const Key('orders_completed_empty_subtitle'),
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
    );
  }
}
