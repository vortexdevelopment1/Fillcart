import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import '../widgets/earnings_period_slider.dart';

/// Earnings Screen implementing Today's, Weekly, and Monthly views
/// matching the exact design specifications.
class EarningsScreen extends StatefulWidget {
  final int initialPeriodIndex;

  const EarningsScreen({
    super.key,
    this.initialPeriodIndex = 0,
  });

  @override
  State<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends State<EarningsScreen> {
  late int _selectedPeriod;
  int _selectedBarIndex = 4; // Friday selected by default
  String _selectedWeeklyRange = 'Last 01 Days';
  String _selectedMonthlyRange = 'Last 30 Days';

  static const _creamBg = Color(0xFFF3F4E5);
  static const _oliveGold = Color(0xFFCCB900);

  static final List<BoxShadow> _cardShadow = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.06),
      blurRadius: 12,
      offset: const Offset(0, 3),
    ),
  ];

  static const List<_DailyBarData> _dailyBars = [
    _DailyBarData(day: 'Mon', date: 'Aug 11', amount: 310, orders: 6, avg: 52, ratio: 0.50),
    _DailyBarData(day: 'Tue', date: 'Aug 12', amount: 480, orders: 7, avg: 68, ratio: 0.72),
    _DailyBarData(day: 'Wed', date: 'Aug 13', amount: 210, orders: 4, avg: 52, ratio: 0.36),
    _DailyBarData(day: 'Thu', date: 'Aug 14', amount: 500, orders: 8, avg: 62, ratio: 0.75),
    _DailyBarData(day: 'Fri', date: 'Aug 15', amount: 640, orders: 8, avg: 40, ratio: 0.90),
    _DailyBarData(day: 'Sat', date: 'Aug 16', amount: 420, orders: 6, avg: 70, ratio: 0.60),
    _DailyBarData(day: 'Sun', date: 'Aug 17', amount: 320, orders: 5, avg: 64, ratio: 0.45),
  ];

  @override
  void initState() {
    super.initState();
    _selectedPeriod = widget.initialPeriodIndex;
  }

  void _onPeriodChanged(int index) {
    if (_selectedPeriod != index) {
      setState(() => _selectedPeriod = index);
    }
  }

  void _onBack() {
    if (Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    } else {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _creamBg,
      bottomNavigationBar: const RiderBottomNavBar(selectedIndex: 2),
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // Header + Segmented Slider
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      GestureDetector(
                        onTap: _onBack,
                        behavior: HitTestBehavior.opaque,
                        child: const Padding(
                          padding: EdgeInsets.only(right: 12, top: 4, bottom: 4),
                          child: Icon(
                            Icons.arrow_back,
                            size: 22,
                            color: Color(0xFF000000),
                          ),
                        ),
                      ),
                      Text(
                        'Earnings',
                        key: const Key('earnings_screen_heading'),
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF000000),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  EarningsPeriodSlider(
                    selectedIndex: _selectedPeriod,
                    onPeriodChanged: _onPeriodChanged,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Body Content
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                child: _selectedPeriod == 0
                    ? _buildTodayView()
                    : _buildPeriodView(isMonthly: _selectedPeriod == 2),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // 1. TODAY'S VIEW
  // ===========================================================================
  Widget _buildTodayView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Today's Summary",
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF000000),
          ),
        ),
        const SizedBox(height: 12),

        // 2x2 Summary Grid
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                value: '8',
                label: 'Total Orders',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                value: '₹50',
                label: 'Today Earnings',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                value: '5H 20M',
                label: 'Online  Time',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                value: '₹ 0',
                label: 'Today Earnings',
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Earnings Breakdown Card with #FEF8DC Footer
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: _cardShadow,
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Earnings Breakdown',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF000000),
                        ),
                      ),
                      const SizedBox(height: 14),
                      _buildSimpleBreakdownRow('Base Earning', '₹45'),
                      const SizedBox(height: 10),
                      _buildSimpleBreakdownRow('Incentive', '₹5'),
                      const SizedBox(height: 10),
                      _buildSimpleBreakdownRow('Tip', '₹0'),
                    ],
                  ),
                ),
                Container(
                  width: double.infinity,
                  color: const Color(0xFFFFFAE4),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            SvgPicture.asset(
                              'assets/icons/total_earnings.svg',
                              width: 22,
                              height: 22,
                            ),
                            const SizedBox(width: 10),
                            Flexible(
                              child: Text(
                                'Total Earnings',
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                  color: const Color(0xFF555555),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '₹ 50',
                        style: GoogleFonts.poppins(
                          fontSize: 24,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF000000),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 18),

        // Performance Overview
        Text(
          'Performance Overview',
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF000000),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildPerformanceIconCard(
                iconAsset: 'assets/icons/Distance Covered Icon.svg',
                label: 'Distance Covered',
                value: '0',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildPerformanceIconCard(
                iconAsset: 'assets/icons/rider rating.svg',
                label: 'Rider Rating',
                value: '0',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                value: '96%',
                label: 'Acceptance Rate',
                valueColor: const Color(0xFF357B51),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                value: '95%',
                label: 'On Time Delivery',
                valueColor: const Color(0xFF357B51),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required String value,
    required String label,
    Color valueColor = const Color(0xFF333333),
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: _cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.w500,
              color: valueColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF333333),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPerformanceIconCard({
    required String iconAsset,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: _cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SvgPicture.asset(
            iconAsset,
            width: 26,
            height: 26,
          ),
          const SizedBox(height: 10),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 13.5,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF000000),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF000000),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSimpleBreakdownRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF000000),
          ),
        ),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF000000),
          ),
        ),
      ],
    );
  }

  // ===========================================================================
  // 2. WEEKLY & MONTHLY VIEW
  // ===========================================================================
  Widget _buildPeriodView({required bool isMonthly}) {
    final selectedBar = _dailyBars[_selectedBarIndex];
    final rangeLabel =
        isMonthly ? _selectedMonthlyRange : _selectedWeeklyRange;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Hero Lime-to-Amber Radial Glow Card
        Container(
          width: double.infinity,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: const LinearGradient(
              begin: Alignment.bottomLeft,
              end: Alignment.topRight,
              colors: [
                Color(0xFFB5EC0A),
                Color(0xFFD5FA28),
                Color(0xFFE7FB3B),
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.12),
                blurRadius: 14,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: RadialGradient(
                center: const Alignment(0.88, -0.78),
                radius: 0.95,
                colors: [
                  const Color(0xFFFFBC2E).withValues(alpha: 0.92),
                  const Color(0xFFFFBC2E).withValues(alpha: 0.0),
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'WEEKLY TOTAL',
                  style: GoogleFonts.poppins(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.4,
                    color: const Color(0xFF333333),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '₹ 2,880',
                  style: GoogleFonts.poppins(
                    fontSize: 34,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF3B3B35),
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Aug 11 – Aug 17, 2026',
                  style: GoogleFonts.poppins(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF333333),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _buildHeroSubCard(value: '₹411', label: 'Avg/Day'),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildHeroSubCard(value: '₹100', label: 'Tips'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 18),

        // Weekly Summary Grid
        Text(
          'Weekly Summary',
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF000000),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(value: '8', label: 'Total Orders'),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(value: '₹ 100', label: 'Today Earnings'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(value: '5H 20M', label: 'Online  Time'),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(value: '₹ 0', label: 'Today Earnings'),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Daily Earnings Bar Chart Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: _cardShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Daily Earnings',
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF000000),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        if (isMonthly) {
                          _selectedMonthlyRange =
                              _selectedMonthlyRange == 'Last 30 Days'
                                  ? 'Last 60 Days'
                                  : 'Last 30 Days';
                        } else {
                          _selectedWeeklyRange =
                              _selectedWeeklyRange == 'Last 01 Days'
                                  ? 'Last 07 Days'
                                  : 'Last 01 Days';
                        }
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                          color: const Color(0xFFD4D4D8),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            rangeLabel,
                            style: GoogleFonts.poppins(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF333333),
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.unfold_more_rounded,
                            size: 14,
                            color: Color(0xFF555555),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // 7-Bar Interactive Chart
              SizedBox(
                height: 152,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: List.generate(_dailyBars.length, (index) {
                    final bar = _dailyBars[index];
                    final isSelected = index == _selectedBarIndex;

                    return Expanded(
                      child: GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () => setState(() => _selectedBarIndex = index),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            if (isSelected)
                              Container(
                                margin: const EdgeInsets.only(bottom: 6),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 3,
                                ),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF2557FF),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  '₹${bar.amount}',
                                  style: GoogleFonts.poppins(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                              )
                            else
                              const SizedBox(height: 24),
                            Container(
                              width: 28,
                              height: 92 * bar.ratio,
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? const Color(0xFF2557FF)
                                    : const Color(0xFFD9D9D9),
                                borderRadius: const BorderRadius.vertical(
                                  top: Radius.circular(10),
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              bar.day,
                              style: GoogleFonts.poppins(
                                fontSize: 11,
                                fontWeight: isSelected
                                    ? FontWeight.w600
                                    : FontWeight.w400,
                                color: isSelected
                                    ? const Color(0xFF000000)
                                    : const Color(0xFF888888),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ),
              ),
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildChartMetric(
                    label: selectedBar.date,
                    value: '₹${selectedBar.amount}',
                    align: CrossAxisAlignment.start,
                  ),
                  _buildChartMetric(
                    label: 'Orders',
                    value: '${selectedBar.orders}',
                    align: CrossAxisAlignment.center,
                  ),
                  _buildChartMetric(
                    label: 'Avg/Order',
                    value: '₹${selectedBar.avg}',
                    align: CrossAxisAlignment.end,
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Earnings Breakdown with Progress Bars
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: _cardShadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Earnings Breakdown',
                style: GoogleFonts.poppins(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF000000),
                ),
              ),
              const SizedBox(height: 14),
              _buildProgressBreakdownRow('Base Earning', '₹2415', 1.0),
              const SizedBox(height: 12),
              _buildProgressBreakdownRow('Incentive', '₹268', 1.0),
              const SizedBox(height: 12),
              _buildProgressBreakdownRow('Tips', '₹197', 1.0),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Total Earnings',
                      style: GoogleFonts.poppins(
                        fontSize: 15.5,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF000000),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '₹2880',
                    style: GoogleFonts.poppins(
                      fontSize: 16.5,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF000000),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHeroSubCard({required String value, required String label}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.36),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 15.5,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF000000),
            ),
          ),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF357B51),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChartMetric({
    required String label,
    required String value,
    required CrossAxisAlignment align,
  }) {
    return Column(
      crossAxisAlignment: align,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF666666),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF000000),
          ),
        ),
      ],
    );
  }

  Widget _buildProgressBreakdownRow(
    String label,
    String value,
    double fillFactor,
  ) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: GoogleFonts.poppins(
                fontSize: 13.5,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF000000),
              ),
            ),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 13.5,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF555555),
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: fillFactor,
            minHeight: 5,
            backgroundColor: const Color(0xFFE4E4E7),
            valueColor: const AlwaysStoppedAnimation<Color>(_oliveGold),
          ),
        ),
      ],
    );
  }
}

class _DailyBarData {
  final String day;
  final String date;
  final int amount;
  final int orders;
  final int avg;
  final double ratio;

  const _DailyBarData({
    required this.day,
    required this.date,
    required this.amount,
    required this.orders,
    required this.avg,
    required this.ratio,
  });
}
