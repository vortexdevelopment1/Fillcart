import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import '../../../../sales&analystics/presentation/widgets/sales_hero_card.dart';
import '../widgets/earnings_breakdown_card.dart';
import '../widgets/revenue_category_donut.dart';
import '../widgets/revenue_metric_card.dart';
import '../widgets/revenue_trend_chart.dart';

/// Screen displaying revenue analytics, earnings breakdown, category revenue, and revenue trends.
class RevenueAnalyticsScreen extends StatefulWidget {
  const RevenueAnalyticsScreen({super.key});

  @override
  State<RevenueAnalyticsScreen> createState() => _RevenueAnalyticsScreenState();
}

class _RevenueAnalyticsScreenState extends State<RevenueAnalyticsScreen> {
  String _selectedDateRange = 'Last 7 Days';

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF0F0F0);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar with Back Button & Screen Title
              Row(
                children: [
                  InkWell(
                    onTap: () => Navigator.maybePop(context),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Center(
                        child: SvgPicture.asset(
                          AppAssets.svgBackArrow,
                          width: 20,
                          height: 20,
                          colorFilter: const ColorFilter.mode(
                            Color(0xFF111827),
                            BlendMode.srcIn,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Revenue Analytics',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF111827),
                      height: 1.4,
                      letterSpacing: 0,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Date Filter Dropdown
              InkWell(
                onTap: _showDateRangePicker,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  height: 44,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          SvgPicture.asset(
                            'assets/icons/Calendar_Icon.svg',
                            width: 16,
                            height: 16,
                          ),
                          const SizedBox(width: 10),
                          Text(
                            _selectedDateRange,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 13.5,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1F2937),
                            ),
                          ),
                        ],
                      ),
                      const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: Color(0xFF6B7280),
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Total Sales Hero Card
              const SalesHeroCard(
                amount: '₹86,320',
                growthRate: '+ 12.4%',
              ),
              const SizedBox(height: 16),

              // 2x2 Grid of Revenue Metrics
              const Row(
                children: [
                  Expanded(
                    child: RevenueMetricCard(
                      title: 'Net Revenue',
                      value: '₹82,460',
                      badgeText: '↑ +11.8%',
                      iconPath: 'assets/cardsicon/net_revenue.png',
                      backgroundColor: Color(0xFFF0FDF4),
                      isPositive: true,
                    ),
                  ),
                  SizedBox(width: 14),
                  Expanded(
                    child: RevenueMetricCard(
                      title: 'Total Earnings',
                      value: '₹3,860',
                      badgeText: '↑ +15.2%',
                      iconPath: 'assets/cardsicon/total_earning.png',
                      backgroundColor: Color(0xFFFFF7ED),
                      isPositive: true,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Row(
                children: [
                  Expanded(
                    child: RevenueMetricCard(
                      title: 'Discounts Given',
                      value: '₹4,210',
                      badgeText: '↓ -6.7%',
                      iconPath: 'assets/cardsicon/discount.png',
                      backgroundColor: Color(0xFFFFF1F2),
                      isPositive: false,
                    ),
                  ),
                  SizedBox(width: 14),
                  Expanded(
                    child: RevenueMetricCard(
                      title: 'Refunds',
                      value: '₹1,250',
                      badgeText: '↓ -18.4%',
                      iconPath: 'assets/cardsicon/return.png',
                      backgroundColor: Color(0xFFEFF8FF),
                      isPositive: false,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Revenue Trend Chart
              const RevenueTrendChart(),
              const SizedBox(height: 24),

              // Revenue by Category Donut Chart
              const RevenueCategoryDonut(),
              const SizedBox(height: 24),

              // Earnings Breakdown Card
              const EarningsBreakdownCard(),
            ],
          ),
        ),
      ),
    );
  }

  void _showDateRangePicker() {
    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final ranges = [
          'Today',
          'Yesterday',
          'Last 7 Days',
          'Last 30 Days',
          'This Month',
          'This Year',
        ];
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Padding(
                padding: EdgeInsets.all(16),
                child: Text(
                  'Select Date Range',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              ...ranges.map(
                (range) => ListTile(
                  title: Text(range),
                  trailing: range == _selectedDateRange
                      ? const Icon(Icons.check, color: Color(0xFF22C55E))
                      : null,
                  onTap: () {
                    setState(() {
                      _selectedDateRange = range;
                    });
                    Navigator.pop(context);
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
