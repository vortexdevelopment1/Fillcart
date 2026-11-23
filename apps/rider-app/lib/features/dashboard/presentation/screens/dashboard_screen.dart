import 'package:flutter/material.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../../navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import '../widgets/dashboard_header.dart';
import '../widgets/incentives_progress_card.dart';
import '../widgets/performance_overview_grid.dart';
import '../widgets/ratings_card.dart';
import '../widgets/today_earnings_snapshot_card.dart';
import '../widgets/today_summary_section.dart';

/// Full Dashboard Screen matching Figma Node 1010:14002 (360 x 1206 px).
///
/// Figma Specifications:
/// - Frame: 360 x 1206 px (scrollable within 360 x 800 mobile viewport)
/// - Background: #FFFFFF (RiderColors.background)
/// - Fixed Bottom Navigation: 360 x 68 px at bottom with index 3 (Dashboard) selected
/// - Layout Structure:
///   1. Dashboard Header (360 x 208 px gradient header, profile, notification, toggle, earnings bar)
///   2. Section 1: Today's Summary (Available Orders & Completed Orders)
///   3. Section 2: Today's Earnings Snapshot (Earned Today + View Earnings pill)
///   4. Section 3: Performance Overview (4 metric cards in 2x2 grid)
///   5. Section 4: Incentives Progress (₹100 Bonus + progress bar + counter)
///   6. Section 5: Ratings Breakdown (5 to 1 score distribution + score badge)
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isOnline = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('dashboard_screen_scaffold'),
      backgroundColor: RiderColors.background,
      bottomNavigationBar: const RiderBottomNavBar(selectedIndex: 3),
      body: SafeArea(
        top: false,
        bottom: false,
        child: SingleChildScrollView(
          key: const Key('dashboard_scroll_view'),
          physics: const ClampingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Dashboard Header (360 x 208 px)
              DashboardHeader(
                isOnline: _isOnline,
                onToggleChanged: (online) {
                  setState(() {
                    _isOnline = online;
                  });
                },
              ),

              // 2. Dashboard Body Content (Padding: 16 px)
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    SizedBox(height: 16),

                    // Section 1: Today's Summary
                    TodaySummarySection(),

                    SizedBox(height: 16),

                    // Section 2: Today's Earnings Snapshot
                    TodayEarningsSnapshotCard(),

                    SizedBox(height: 16),

                    // Section 3: Performance Overview
                    PerformanceOverviewGrid(),

                    SizedBox(height: 16),

                    // Section 4: Incentives Progress
                    IncentivesProgressCard(),

                    SizedBox(height: 16),

                    // Section 5: Ratings Breakdown
                    RatingsCard(),

                    SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
