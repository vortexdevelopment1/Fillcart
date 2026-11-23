import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/notifications/presentation/screens/notification_screen.dart';
import 'package:fillcart_vendor/features/analytics/revenue_analytics/presentation/screens/revenue_analytics_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_details_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_packing_status_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_ready_for_pickup_screen.dart';
import 'package:fillcart_vendor/features/order_management/models/vendor_order_model.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_orders_screen.dart';
import 'package:fillcart_vendor/features/product_insights/presentation/screens/product_insights_screen.dart';
import 'package:fillcart_vendor/features/promotions/presentation/screens/promotions_screen.dart';
import 'package:fillcart_vendor/features/sales&analystics/presentation/screens/sales_analytics_screen.dart';

/// Vendor Dashboard Screen (Home Tab) displaying store status, sales metrics,
/// incoming orders flow, and store management shortcuts.
class VendorDashboardScreen extends StatefulWidget {
  const VendorDashboardScreen({super.key});

  @override
  State<VendorDashboardScreen> createState() => _VendorDashboardScreenState();
}

class _VendorDashboardScreenState extends State<VendorDashboardScreen> {
  bool _isStoreOnline = true;
  final String _selectedPeriod = 'Today';

  @override
  Widget build(BuildContext context) {
    const brandLime = Color(0xFFC8F169);
    const darkBg = Color(0xFF111827);

    return Scaffold(
      backgroundColor: const Color(0xFFF4F5F7),
      body: Stack(
        children: [
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ==========================================
                // 1. TOP CURVED LIME HEADER
                // ==========================================
                Container(
                  decoration: const BoxDecoration(
                    color: brandLime,
                    borderRadius: BorderRadius.vertical(
                      bottom: Radius.circular(24),
                    ),
                  ),
                  child: SafeArea(
                    bottom: false,
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Profile & Notification Row
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  // Store Avatar
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF0F172A),
                                      borderRadius: BorderRadius.circular(14),
                                      image: const DecorationImage(
                                        image: AssetImage(
                                          'assets/cardsicon/fruits&vegetables.png',
                                        ),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  const Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Namaste',
                                        style: TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 12,
                                          fontWeight: FontWeight.w400,
                                          color: Color(0xFF374151),
                                        ),
                                      ),
                                      Text(
                                        'Rahul Mart',
                                        style: TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 17,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF111827),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              // Notification Bell Icon in white rounded container
                              GestureDetector(
                                key: const Key('dashboard_notification_button'),
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute<void>(
                                      builder: (_) =>
                                          const NotificationScreen(),
                                    ),
                                  );
                                },
                                child: Container(
                                  width: 42,
                                  height: 42,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  child: Stack(
                                    alignment: Alignment.center,
                                    children: [
                                      SvgPicture.asset(
                                        AppAssets.svgNotification,
                                        width: 20,
                                        height: 20,
                                      ),
                                      Positioned(
                                        top: 10,
                                        right: 11,
                                        child: Container(
                                          width: 8,
                                          height: 8,
                                          decoration: const BoxDecoration(
                                            color: Color(0xFFC8F169),
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // "Store is Online" Card
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: darkBg,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _isStoreOnline
                                          ? 'Store is Online'
                                          : 'Store is Offline',
                                      style: const TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      _isStoreOnline
                                          ? 'Accepting orders · closes 9:00 PM'
                                          : 'Not accepting orders right now',
                                      style: const TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w400,
                                        color: Color(0xFF9CA3AF),
                                      ),
                                    ),
                                  ],
                                ),
                                // Switch
                                Transform.scale(
                                  scale: 0.85,
                                  child: Switch(
                                    value: _isStoreOnline,
                                    activeThumbColor: darkBg,
                                    activeTrackColor: const Color(0xFFC8F169),
                                    inactiveThumbColor: Colors.white,
                                    inactiveTrackColor: const Color(0xFF4B5563),
                                    onChanged: (val) {
                                      setState(() {
                                        _isStoreOnline = val;
                                      });
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Search Bar (Pill shape with camera and mic)
                          Container(
                            height: 48,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: const Color(0xFFE5E7EB),
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.03),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Row(
                              children: [
                                SvgPicture.asset(
                                  'assets/svg/search_icon.svg',
                                  width: 20,
                                  height: 20,
                                  colorFilter: const ColorFilter.mode(
                                    Color(0xFF4B5563),
                                    BlendMode.srcIn,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Expanded(
                                  child: Text(
                                    'Search Products etc.',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w400,
                                      color: Color(0xFF4B5563),
                                    ),
                                  ),
                                ),
                                SvgPicture.asset(
                                  'assets/svg/camera.svg',
                                  width: 20,
                                  height: 20,
                                  colorFilter: const ColorFilter.mode(
                                    Color(0xFF6B7280),
                                    BlendMode.srcIn,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                SvgPicture.asset(
                                  'assets/svg/mic.svg',
                                  width: 20,
                                  height: 20,
                                  colorFilter: const ColorFilter.mode(
                                    Color(0xFF6B7280),
                                    BlendMode.srcIn,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // ==========================================
                // 2. MAIN BODY CONTENT
                // ==========================================
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 90),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ------------------------------------------
                      // NEW ORDERS WAITING BANNER (Image 2)
                      // ------------------------------------------
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: const BoxDecoration(
                          color: Color(0xFFC8F169),
                          borderRadius: BorderRadius.all(Radius.circular(24)),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  '3 new orders waiting',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 5,
                                  ),
                                  decoration: BoxDecoration(
                                    color: darkBg,
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: const Text(
                                    'Accept in 2:45',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),

                            // Order 1 (Tappable -> Opens Order Details Flow)
                            _buildNewOrderCard(
                              orderTitle: '#FC2841 · Anita K.',
                              subtitle: '6 items · ₹386 · Paid online',
                              timeLeft: '2:45',
                              timeLeftColor: const Color(0xFFDC2626),
                              onTap: () {
                                Navigator.push<void>(
                                  context,
                                  MaterialPageRoute<void>(
                                    builder: (_) => const OrderDetailsScreen(),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 10),

                            // Order 2
                            _buildNewOrderCard(
                              orderTitle: '#FC2840 · Mohit S.',
                              subtitle: '4 items · ₹210 · COD',
                              timeLeft: '4:10',
                              timeLeftColor: const Color(0xFFB45309),
                              onTap: () {
                                Navigator.push<void>(
                                  context,
                                  MaterialPageRoute<void>(
                                    builder: (_) => const OrderDetailsScreen(),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 12),

                            // View All New Orders Link
                            InkWell(
                              onTap: () {
                                Navigator.push<void>(
                                  context,
                                  MaterialPageRoute<void>(
                                    builder: (_) => const VendorOrdersScreen(
                                      initialTab: VendorOrderTab.newOrders,
                                    ),
                                  ),
                                );
                              },
                              child: const Padding(
                                padding: EdgeInsets.symmetric(vertical: 4),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      'View all new orders',
                                      style: TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFF111827),
                                      ),
                                    ),
                                    SizedBox(width: 6),
                                    Icon(
                                      Icons.arrow_forward_rounded,
                                      size: 16,
                                      color: Color(0xFF111827),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),

                      // ------------------------------------------
                      // TODAY'S SALES CARD (Dark Container)
                      // ------------------------------------------
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: darkBg,
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Top Row: Title & Dropdown
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  "Today's sales",
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 13,
                                    fontWeight: FontWeight.w400,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                ),
                                Row(
                                  children: [
                                    Text(
                                      _selectedPeriod,
                                      style: const TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                        color: Color(0xFFD1D5DB),
                                      ),
                                    ),
                                    const SizedBox(width: 2),
                                    const Icon(
                                      Icons.arrow_drop_down_rounded,
                                      color: Color(0xFFD1D5DB),
                                      size: 20,
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),

                            // Amount & Growth Pill
                            Row(
                              children: [
                                const Text(
                                  '₹12,480',
                                  style: TextStyle(
                                    fontFamily: 'Sora',
                                    fontSize: 40,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.white,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 3.5,
                                  ),
                                  decoration: BoxDecoration(
                                    color: brandLime,
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Text(
                                    '+8% vs yesterday',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF111827),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),

                            // Smooth Line Chart
                            SizedBox(
                              width: double.infinity,
                              height: 38,
                              child: CustomPaint(
                                painter: _SmoothTrendLinePainter(),
                              ),
                            ),
                            const SizedBox(height: 12),

                            // Bottom 3 Metric Pills
                            Row(
                              children: [
                                _buildDarkMetricBox(
                                  value: '24',
                                  label: 'Orders',
                                ),
                                const SizedBox(width: 8),
                                _buildDarkMetricBox(
                                  value: '₹520',
                                  label: 'Avg. order',
                                ),
                                const SizedBox(width: 8),
                                _buildDarkMetricBox(
                                  value: '₹9,860',
                                  label: 'Payout due',
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),

                      // ------------------------------------------
                      // ORDERS STATUS QUICK PILLS (New, Packing, Ready)
                      // ------------------------------------------
                      Row(
                        children: [
                          // New 3 (Dark Pill with Lime Number)
                          Expanded(
                            child: _buildOrderStatusTile(
                              title: 'New',
                              count: '3',
                              isDark: true,
                              countColor: brandLime,
                              onTap: () {
                                Navigator.push<void>(
                                  context,
                                  MaterialPageRoute<void>(
                                    builder: (_) => const VendorOrdersScreen(
                                      initialTab: VendorOrderTab.newOrders,
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(width: 10),
                          // Packing 5
                          Expanded(
                            child: _buildOrderStatusTile(
                              title: 'Packing',
                              count: '5',
                              isDark: false,
                              countColor: const Color(0xFF111827),
                              onTap: () {
                                Navigator.push<void>(
                                  context,
                                  MaterialPageRoute<void>(
                                    builder: (_) =>
                                        const OrderPackingStatusScreen(),
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(width: 10),
                          // Ready 2
                          Expanded(
                            child: _buildOrderStatusTile(
                              title: 'Ready',
                              count: '2',
                              isDark: false,
                              countColor: const Color(0xFF111827),
                              onTap: () {
                                Navigator.push<void>(
                                  context,
                                  MaterialPageRoute<void>(
                                    builder: (_) =>
                                        const OrderReadyForPickupScreen(),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // ------------------------------------------
                      // MANAGE STORE SECTION
                      // ------------------------------------------
                      const Text(
                        'Manage Store',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          _buildStoreActionCard(
                            iconAsset: 'assets/cardsicon/add.png',
                            title: 'Add\nProducts',
                            onTap: () {
                              Navigator.push<void>(
                                context,
                                MaterialPageRoute<void>(
                                  builder: (_) =>
                                      const ProductInsightsScreen(),
                                ),
                              );
                            },
                          ),
                          const SizedBox(width: 10),
                          _buildStoreActionCard(
                            iconAsset: 'assets/cardsicon/warning.png',
                            title: '(3) Low\nStock',
                            onTap: () {},
                          ),
                          const SizedBox(width: 10),
                          _buildStoreActionCard(
                            iconAsset: 'assets/cardsicon/clock.png',
                            title: '(1)\nExpiring',
                            onTap: () {},
                          ),
                          const SizedBox(width: 10),
                          _buildStoreActionCard(
                            iconAsset: 'assets/cardsicon/Payout.png',
                            title: 'Payouts\n',
                            onTap: () {},
                          ),
                        ],
                      ),
                      const SizedBox(height: 22),

                      // ------------------------------------------
                      // BUSINESS OVERVIEW SECTION
                      // ------------------------------------------
                      const Text(
                        'Business Overview',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // 1. Sales Analytics
                      _buildOverviewTile(
                        iconAsset: 'assets/cardsicon/barchart.png',
                        title: 'Sales Analytics',
                        subtitle: 'Track your sales performance',
                        onTap: () {
                          Navigator.push<void>(
                            context,
                            MaterialPageRoute<void>(
                              builder: (_) => const SalesAnalyticsScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),

                      // 2. Product Management
                      _buildOverviewTile(
                        iconAsset: 'assets/cardsicon/product.png',
                        title: 'Product Management',
                        subtitle: 'View top performing products',
                        onTap: () {
                          Navigator.push<void>(
                            context,
                            MaterialPageRoute<void>(
                              builder: (_) => const ProductInsightsScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),

                      // 3. Revenue Analytics
                      _buildOverviewTile(
                        iconAsset: 'assets/cardsicon/revenue.png',
                        title: 'Revenue Analytics',
                        subtitle: 'Track your revenue growth',
                        onTap: () {
                          Navigator.push<void>(
                            context,
                            MaterialPageRoute<void>(
                              builder: (_) => const RevenueAnalyticsScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),

                      // 4. Promotions
                      _buildOverviewTile(
                        iconAsset: 'assets/cardsicon/discount.png',
                        title: 'Promotions',
                        subtitle: 'Grow your business with FillCart',
                        onTap: () {
                          Navigator.push<void>(
                            context,
                            MaterialPageRoute<void>(
                              builder: (_) => const PromotionsScreen(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Floating Action Button (+ in black squircle with lime +)
          Positioned(
            right: 16,
            bottom: 96 + MediaQuery.paddingOf(context).bottom,
            child: InkWell(
              onTap: () {
                Navigator.push<void>(
                  context,
                  MaterialPageRoute<void>(
                    builder: (_) => const ProductInsightsScreen(),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(20),
              child: Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: darkBg,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x33000000),
                      blurRadius: 10,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.add,
                  color: brandLime,
                  size: 28,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // HELPER WIDGETS
  // -------------------------------------------------------------

  Widget _buildNewOrderCard({
    required String orderTitle,
    required String subtitle,
    required String timeLeft,
    required Color timeLeftColor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    orderTitle,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    timeLeft,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14.5,
                      fontWeight: FontWeight.w700,
                      color: timeLeftColor,
                      height: 1.15,
                    ),
                    textAlign: TextAlign.right,
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'left',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF6B7280),
                    ),
                    textAlign: TextAlign.right,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDarkMetricBox({
    required String value,
    required String label,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: const Color(0xFF1E2633),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 11,
                fontWeight: FontWeight.w400,
                color: Color(0xFF9CA3AF),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderStatusTile({
    required String title,
    required String count,
    required bool isDark,
    required Color countColor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: isDark ? const Color(0xFF111827) : Colors.white,
      borderRadius: BorderRadius.circular(16),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: isDark
                ? null
                : Border.all(color: const Color(0xFFE5E7EB), width: 1),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
                      color: isDark ? Colors.white : const Color(0xFF4B5563),
                    ),
                  ),
                  SvgPicture.asset(
                    AppAssets.svgUperArrow,
                    width: 14,
                    height: 14,
                    colorFilter: ColorFilter.mode(
                      isDark ? Colors.white : const Color(0xFF4B5563),
                      BlendMode.srcIn,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                count,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  color: countColor,
                  height: 1.1,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStoreActionCard({
    required String iconAsset,
    required String title,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            height: 98,
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Image.asset(
                  iconAsset,
                  width: 48,
                  height: 48,
                  fit: BoxFit.contain,
                ),
                const SizedBox(height: 6),
                Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 10.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF111827),
                    height: 1.15,
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 2,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewTile({
    required String iconAsset,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            children: [
              Image.asset(
                iconAsset,
                width: 48,
                height: 48,
                fit: BoxFit.contain,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14.5,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
              ),
              SvgPicture.asset(
                AppAssets.svgNextArrow,
                width: 18,
                height: 18,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF9CA3AF),
                  BlendMode.srcIn,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SmoothTrendLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    const strokeColor = Color(0xFFC8F169);
    final paint = Paint()
      ..color = strokeColor
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    path.moveTo(0, size.height * 0.7);
    path.cubicTo(
      size.width * 0.25,
      size.height * 0.55,
      size.width * 0.45,
      size.height * 0.85,
      size.width * 0.75,
      size.height * 0.35,
    );
    path.cubicTo(
      size.width * 0.85,
      size.height * 0.2,
      size.width * 0.95,
      size.height * 0.1,
      size.width,
      size.height * 0.15,
    );

    canvas.drawPath(path, paint);

    // Glowing dot at the end
    final dotPaint = Paint()..color = strokeColor;
    canvas.drawCircle(Offset(size.width, size.height * 0.15), 3.5, dotPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
