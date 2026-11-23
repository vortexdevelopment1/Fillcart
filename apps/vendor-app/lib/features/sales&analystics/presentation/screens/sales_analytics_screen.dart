import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/analytics/revenue_analytics/presentation/screens/revenue_analytics_screen.dart';
import 'package:fillcart_vendor/features/product_insights/presentation/screens/product_insights_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../widgets/analytics_metric_card.dart';
import '../widgets/category_donut_chart.dart';
import '../widgets/recent_order_tile.dart';
import '../widgets/sales_hero_card.dart';
import '../widgets/sales_trend_chart.dart';
import '../widgets/top_product_tile.dart';

/// Sales Analytics screen with Overview, Products, and Orders tabs.
class SalesAnalyticsScreen extends StatefulWidget {
  const SalesAnalyticsScreen({
    super.key,
    this.initialTab = 0,
  });

  /// 0 = Overview, 1 = Products, 2 = Orders
  final int initialTab;

  @override
  State<SalesAnalyticsScreen> createState() => _SalesAnalyticsScreenState();
}

class _SalesAnalyticsScreenState extends State<SalesAnalyticsScreen> {
  late int _selectedTab;
  String _selectedDateRange = 'Last 7 Days';
  String _selectedTrendMetric = 'Revenue';

  final List<String> _tabs = const ['Overview', 'Products', 'Orders'];

  @override
  void initState() {
    super.initState();
    _selectedTab = widget.initialTab;
  }

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF1EEE6);

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
                    'Sales Analytics',
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

              // Segmented Tab Pill Controller
              Container(
                height: 46,
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                ),
                child: Row(
                  children: List.generate(_tabs.length, (index) {
                    final isSelected = _selectedTab == index;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedTab = index;
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0xFFC8F169)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(22),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            _tabs[index],
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 13.5,
                              fontWeight: FontWeight.w600,
                              color: isSelected
                                  ? const Color(0xFF111827)
                                  : const Color(0xFF4B5563),
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
              const SizedBox(height: 14),

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

              // Dynamic Tab View
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 250),
                child: switch (_selectedTab) {
                  0 => _buildOverviewTab(),
                  1 => _buildProductsTab(),
                  _ => _buildOrdersTab(),
                },
              ),
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

  // -------------------------------------------------------------
  // TAB 0: OVERVIEW
  // -------------------------------------------------------------
  Widget _buildOverviewTab() {
    return Column(
      key: const ValueKey('tab_overview'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Total Sales Hero Card
        SalesHeroCard(
          amount: '₹86,320',
          growthRate: '+ 12.4%',
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (context) => const RevenueAnalyticsScreen(),
              ),
            );
          },
        ),
        const SizedBox(height: 16),

        // 2x2 Grid of Metrics
        const Row(
          children: [
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Total Orders',
                value: '168',
                badgeText: '+11%',
                iconPath: 'assets/cardsicon/total-orders.png',
                backgroundColor: Color(0xFFF4FDFF),
                isPositive: true,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Avg. Order Value',
                value: '₹552',
                badgeText: '88.2%',
                iconPath: 'assets/cardsicon/avg_orders.png',
                backgroundColor: Color(0xFFF0EDFA),
                isPositive: true,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        const Row(
          children: [
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Item Sold',
                value: '342',
                badgeText: '7.1%',
                iconPath: 'assets/cardsicon/item_sold.png',
                backgroundColor: Color(0xFFFEF4F4),
                isPositive: false,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Net Revenue',
                value: '₹82,460',
                badgeText: '4.8%',
                iconPath: 'assets/cardsicon/net_revenue.png',
                backgroundColor: Color(0xFFF0F8F0),
                isPositive: false,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Sales Trend Chart
        SalesTrendChart(
          selectedMetric: _selectedTrendMetric,
          onMetricChanged: (val) {
            setState(() {
              _selectedTrendMetric = val;
            });
          },
        ),
      ],
    );
  }

  // -------------------------------------------------------------
  // TAB 1: PRODUCTS
  // -------------------------------------------------------------
  Widget _buildProductsTab() {
    return Column(
      key: const ValueKey('tab_products'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Top Performing Products',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF111827),
              ),
            ),
            TextButton(
              onPressed: () {},
              child: const Text(
                'See All',
                style: TextStyle(
                  fontFamily: 'Inter',
                  color: Color(0xFF16A34A),
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Products List
        TopProductTile(
          name: 'Amul Taaza Milk (1 L)',
          soldCount: '126 sold',
          price: '₹10,710',
          growth: '↑ +18%',
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (context) => const ProductInsightsScreen(),
              ),
            );
          },
          imageWidget: Image.asset(
            'assets/cardsicon/amul_milk.png',
            fit: BoxFit.cover,
          ),
        ),
        const SizedBox(height: 10),
        TopProductTile(
          name: 'Farm Eggs (12 pcs)',
          soldCount: '92 sold',
          price: '₹6,440',
          growth: '↑ +12%',
          imageWidget: Image.asset(
            'assets/cardsicon/farm_eggs.png',
            fit: BoxFit.cover,
          ),
        ),
        const SizedBox(height: 10),
        TopProductTile(
          name: 'Britannia White Bread',
          soldCount: '(400 g)\n64 sold',
          price: '₹4,160',
          growth: '↑ +8%',
          imageWidget: Image.asset(
            'assets/cardsicon/britannia_bread.png',
            fit: BoxFit.cover,
          ),
        ),
        const SizedBox(height: 20),

        // Category Performance Header
        const Text(
          'Category Performance',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 12),

        // Donut Chart
        const CategoryDonutChart(),
      ],
    );
  }

  // -------------------------------------------------------------
  // TAB 2: ORDERS
  // -------------------------------------------------------------
  Widget _buildOrdersTab() {
    return Column(
      key: const ValueKey('tab_orders'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Orders Overview',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 14),

        // 2x2 Grid of Order Metrics
        const Row(
          children: [
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Total Orders',
                value: '168',
                badgeText: '+11%',
                iconPath: 'assets/cardsicon/total-orders.png',
                backgroundColor: Color(0xFFF4FDFF),
                isPositive: true,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Completed',
                value: '142',
                badgeText: '88.2%',
                iconPath: 'assets/cardsicon/complete.png',
                backgroundColor: Color(0xFFF0F8F0),
                isPositive: true,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        const Row(
          children: [
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Cancelled',
                value: '12',
                badgeText: '7.1%',
                iconPath: 'assets/cardsicon/cancelled.png',
                backgroundColor: Color(0xFFFEF4F4),
                isPositive: false,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: AnalyticsMetricCard(
                title: 'Returned',
                value: '14',
                badgeText: '4.8%',
                iconPath: 'assets/cardsicon/return.png',
                backgroundColor: Color(0xFFF4FDFF),
                isPositive: false,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Recent Orders Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Recent Orders',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF111827),
              ),
            ),
            TextButton(
              onPressed: () {},
              child: const Text(
                'See All',
                style: TextStyle(
                  fontFamily: 'Inter',
                  color: Color(0xFF16A34A),
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Recent Orders List
        const RecentOrderTile(
          orderId: '#FC12847',
          timeAgo: 'Today, 7:14 PM',
          price: '₹640',
          isCompleted: true,
        ),
        const SizedBox(height: 10),
        const RecentOrderTile(
          orderId: '#FC12846',
          timeAgo: 'Today, 6:02 PM',
          price: '₹1,240',
          isCompleted: true,
        ),
        const SizedBox(height: 10),
        const RecentOrderTile(
          orderId: '#FC12845',
          timeAgo: 'Today, 5:38 PM',
          price: '₹520',
          isCompleted: false,
        ),
        const SizedBox(height: 10),
        const RecentOrderTile(
          orderId: '#FC12844',
          timeAgo: 'Today, 4:21 PM',
          price: '₹960',
          isCompleted: true,
        ),
      ],
    );
  }
}
