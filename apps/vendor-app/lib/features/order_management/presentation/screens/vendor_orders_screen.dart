import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/navigation/presentation/screens/main_vendor_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_details_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_packing_status_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_ready_for_pickup_screen.dart';
import 'package:fillcart_vendor/features/order_management/models/vendor_order_model.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_cancelled_order_details_screen.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_completed_order_details_screen.dart';
import 'package:fillcart_vendor/features/order_management/presentation/widgets/order_filter_sort_bottom_sheet.dart';

/// Vendor Orders Management Screen with multi-tab stage filters, interactive search,
/// category/sort modal sheet, and deep flow navigation for all order states.
class VendorOrdersScreen extends StatefulWidget {
  const VendorOrdersScreen({
    super.key,
    this.initialTab = VendorOrderTab.all,
    this.onBackToHome,
  });

  final VendorOrderTab initialTab;
  final VoidCallback? onBackToHome;

  @override
  State<VendorOrdersScreen> createState() => _VendorOrdersScreenState();
}

class _VendorOrdersScreenState extends State<VendorOrdersScreen> {
  late VendorOrderTab _activeTab;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  VendorOrderFilter _filter = const VendorOrderFilter();

  static const Color brandLime = Color(0xFFD9FB67);
  static const Color darkCharcoal = Color(0xFF0E1512);
  static const Color darkBg = Color(0xFF111827);

  @override
  void initState() {
    super.initState();
    _activeTab = widget.initialTab;
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text.trim();
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<VendorOrder> _filterOrders(List<VendorOrder> orders) {
    return orders.where((order) {
      // 1. Search Query
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final matchesId = order.orderId.toLowerCase().contains(query);
        final matchesCustomer =
            order.customerName.toLowerCase().contains(query);
        final matchesSummary =
            order.summaryItems.toLowerCase().contains(query);
        if (!matchesId && !matchesCustomer && !matchesSummary) {
          return false;
        }
      }

      // 2. Category Filter
      if (_filter.categories.isNotEmpty &&
          !_filter.categories.contains(order.category)) {
        return false;
      }

      // 3. Payment Filter
      if (_filter.payment != null &&
          order.paymentMethod.toLowerCase() !=
              _filter.payment!.toLowerCase()) {
        return false;
      }

      return true;
    }).toList();
  }

  void _openFilterModal() {
    OrderFilterSortBottomSheet.show(
      context,
      currentFilter: _filter,
      onApply: (newFilter) {
        setState(() {
          _filter = newFilter;
        });
      },
    );
  }

  void _exitSearch() {
    setState(() {
      _searchController.clear();
      _searchQuery = '';
    });
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    final allOrders = _filterOrders(VendorOrder.mockOrders);
    final isSearching = _searchQuery.isNotEmpty;

    final newOrders = allOrders
        .where((o) => o.status == VendorOrderStatus.newOrder)
        .toList();
    final preparingOrders = allOrders
        .where((o) => o.status == VendorOrderStatus.preparing)
        .toList();
    final riderOrders = allOrders
        .where((o) => o.status == VendorOrderStatus.riderAtStore)
        .toList();
    final completedOrders = allOrders
        .where((o) => o.status == VendorOrderStatus.completed)
        .toList();
    final cancelledOrders = allOrders
        .where((o) => o.status == VendorOrderStatus.cancelled)
        .toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      appBar: isSearching
          ? null
          : AppBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              scrolledUnderElevation: 0,
              toolbarHeight: 52,
              leadingWidth: 52,
              centerTitle: true,
              leading: Padding(
                padding: const EdgeInsets.only(left: 16),
                child: Center(
                  child: Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFFFFF),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: const [
                        BoxShadow(
                          offset: Offset(0, 1),
                          blurRadius: 2,
                          color: Color(0x1A000000),
                        ),
                      ],
                    ),
                    child: IconButton(
                      key: const Key('orders_back_button'),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      icon: SvgPicture.asset(
                        AppAssets.svgBackArrow,
                        width: 20,
                        height: 20,
                        colorFilter: const ColorFilter.mode(
                          Color(0xFF111827),
                          BlendMode.srcIn,
                        ),
                      ),
                      onPressed: () {
                        if (Navigator.of(context).canPop()) {
                          Navigator.of(context).pop();
                        } else if (widget.onBackToHome != null) {
                          widget.onBackToHome!();
                        } else {
                          Navigator.of(context).pushAndRemoveUntil(
                            MaterialPageRoute<void>(
                              builder: (_) =>
                                  const MainVendorScreen(initialIndex: 0),
                            ),
                            (route) => false,
                          );
                        }
                      },
                    ),
                  ),
                ),
              ),
              title: const Text(
                'Orders',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                  height: 28 / 20,
                  letterSpacing: 0,
                ),
              ),
            ),
      body: SafeArea(
        child: isSearching
            ? _buildSearchModeBody(allOrders)
            : _buildStandardBody(
                newOrders: newOrders,
                preparingOrders: preparingOrders,
                riderOrders: riderOrders,
                completedOrders: completedOrders,
                cancelledOrders: cancelledOrders,
              ),
      ),
    );
  }

  // =========================================================================
  // SEARCH MODE (Matches Image 1)
  // =========================================================================
  Widget _buildSearchModeBody(List<VendorOrder> matchingOrders) {
    return Column(
      children: [
        // Dedicated Search Bar matching Image 1
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: Container(
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(26),
              border: Border.all(
                color: const Color(0xFFE5E7EB),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: Row(
              children: [
                IconButton(
                  key: const Key('search_back_button'),
                  icon: SvgPicture.asset(
                    AppAssets.svgBackArrow,
                    width: 24,
                    height: 24,
                    colorFilter: const ColorFilter.mode(
                      Color(0xFF111827),
                      BlendMode.srcIn,
                    ),
                  ),
                  onPressed: _exitSearch,
                ),
                Expanded(
                  child: Theme(
                    data: Theme.of(context).copyWith(
                      inputDecorationTheme: const InputDecorationTheme(
                        filled: false,
                        fillColor: Colors.transparent,
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        focusedErrorBorder: InputBorder.none,
                      ),
                    ),
                    child: TextField(
                      controller: _searchController,
                      textAlignVertical: TextAlignVertical.center,
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF111827),
                      ),
                      decoration: const InputDecoration(
                        hintText: 'Search order ID, name...',
                        hintStyle: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF94A3B8),
                        ),
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        focusedErrorBorder: InputBorder.none,
                        filled: false,
                        fillColor: Colors.transparent,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(
                    Icons.close_rounded,
                    color: Color(0xFF6B7280),
                    size: 20,
                  ),
                  onPressed: () => _searchController.clear(),
                ),
              ],
            ),
          ),
        ),

        // Search Content or Search Empty State
        Expanded(
          child: matchingOrders.isEmpty
              ? _buildSearchEmptyState(_searchQuery)
              : ListView(
                  padding: const EdgeInsets.fromLTRB(16, 4, 16, 120),
                  children: [
                    Text(
                      '${matchingOrders.length} results',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ...matchingOrders.map((o) => _buildSearchResultCard(o)),
                    const SizedBox(height: 20),
                    const Text(
                      'Recent searches',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildRecentSearchRow('FC2839'),
                    _buildRecentSearchRow('Mohit'),
                    _buildRecentSearchRow('Tomato 1Kg'),
                  ],
                ),
        ),
      ],
    );
  }

  Widget _buildRecentSearchRow(String query) {
    return InkWell(
      onTap: () {
        _searchController.text = query;
      },
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 4),
        child: Row(
          children: [
            const Icon(
              Icons.access_time_rounded,
              size: 20,
              color: Color(0xFF4B5563),
            ),
            const SizedBox(width: 14),
            Text(
              query,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: Color(0xFF1F2937),
              ),
            ),
            const Spacer(),
            SvgPicture.asset(
              AppAssets.svgUperArrow,
              width: 14,
              height: 14,
              colorFilter: const ColorFilter.mode(
                Color(0xFF4B5563),
                BlendMode.srcIn,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchResultCard(VendorOrder order) {
    Color badgeBg;
    Color badgeTextColor;
    String badgeText;

    switch (order.status) {
      case VendorOrderStatus.preparing:
        badgeBg = const Color(0xFFFEF3C7);
        badgeTextColor = const Color(0xFFB45309);
        badgeText = 'Packing';
        break;
      case VendorOrderStatus.newOrder:
        badgeBg = const Color(0xFFFEE2E2);
        badgeTextColor = const Color(0xFFDC2626);
        badgeText = 'New';
        break;
      case VendorOrderStatus.riderAtStore:
        badgeBg = const Color(0xFFDCFCE7);
        badgeTextColor = const Color(0xFF16A34A);
        badgeText = 'Rider at store';
        break;
      case VendorOrderStatus.completed:
        badgeBg = const Color(0xFFDCFCE7);
        badgeTextColor = const Color(0xFF16A34A);
        badgeText = 'Delivered';
        break;
      case VendorOrderStatus.cancelled:
        badgeBg = const Color(0xFFFEE2E2);
        badgeTextColor = const Color(0xFFDC2626);
        badgeText = 'Cancelled';
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            switch (order.status) {
              case VendorOrderStatus.newOrder:
                Navigator.push<void>(
                  context,
                  MaterialPageRoute<void>(
                    builder: (_) => const OrderDetailsScreen(),
                  ),
                );
                break;
              case VendorOrderStatus.preparing:
                Navigator.push<void>(
                  context,
                  MaterialPageRoute<void>(
                    builder: (_) => const OrderPackingStatusScreen(),
                  ),
                );
                break;
              case VendorOrderStatus.riderAtStore:
                Navigator.push<void>(
                  context,
                  MaterialPageRoute<void>(
                    builder: (_) => const OrderReadyForPickupScreen(),
                  ),
                );
                break;
              case VendorOrderStatus.completed:
                Navigator.push<void>(
                  context,
                  MaterialPageRoute<void>(
                    builder: (_) =>
                        VendorCompletedOrderDetailsScreen(order: order),
                  ),
                );
                break;
              case VendorOrderStatus.cancelled:
                Navigator.push<void>(
                  context,
                  MaterialPageRoute<void>(
                    builder: (_) =>
                        VendorCancelledOrderDetailsScreen(order: order),
                  ),
                );
                break;
            }
          },
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text.rich(
                      TextSpan(
                        children: [
                          const TextSpan(
                            text: 'Order ID  ',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 14.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF111827),
                            ),
                          ),
                          TextSpan(
                            text: order.orderId,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 14.5,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: badgeBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        badgeText,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: badgeTextColor,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 5,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD9FB67),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        order.customerName,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                      ),
                    ),
                    Text(
                      ' · ${order.itemCount} items · ₹${order.totalAmount.toStringAsFixed(0)}',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  order.orderDateTime ?? 'Today · 7:42 PM',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12.5,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // =========================================================================
  // STANDARD ORDERS BODY (Matches Image 2 & Previous Tabs)
  // =========================================================================
  Widget _buildStandardBody({
    required List<VendorOrder> newOrders,
    required List<VendorOrder> preparingOrders,
    required List<VendorOrder> riderOrders,
    required List<VendorOrder> completedOrders,
    required List<VendorOrder> cancelledOrders,
  }) {
    return Column(
      children: [
        // 1. Search Bar & Filter Button
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: const Color(0xFFCBD5E1),
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
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      SvgPicture.asset(
                        AppAssets.svgSearch,
                        width: 20,
                        height: 20,
                        colorFilter: const ColorFilter.mode(
                          Color(0xFF4B5563),
                          BlendMode.srcIn,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Theme(
                          data: Theme.of(context).copyWith(
                            inputDecorationTheme: const InputDecorationTheme(
                              filled: false,
                              fillColor: Colors.transparent,
                              border: InputBorder.none,
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                              disabledBorder: InputBorder.none,
                              errorBorder: InputBorder.none,
                              focusedErrorBorder: InputBorder.none,
                            ),
                          ),
                          child: TextField(
                            controller: _searchController,
                            textAlignVertical: TextAlignVertical.center,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 14.5,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF111827),
                            ),
                            decoration: const InputDecoration(
                              hintText: 'Search order ID, name...',
                              hintStyle: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14.5,
                                fontWeight: FontWeight.w400,
                                color: Color(0xFF94A3B8),
                              ),
                              border: InputBorder.none,
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                              disabledBorder: InputBorder.none,
                              errorBorder: InputBorder.none,
                              focusedErrorBorder: InputBorder.none,
                              filled: false,
                              fillColor: Colors.transparent,
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              GestureDetector(
                key: const Key('filter_button'),
                onTap: _openFilterModal,
                child: Container(
                  width: 50,
                  height: 37,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: const Color(0xFFCBD5E1),
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Center(
                    child: SvgPicture.asset(
                      AppAssets.svgFilter,
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
            ],
          ),
        ),

        // 2. Horizontal Tab Pills
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              _buildTabPill(tab: VendorOrderTab.all),
              const SizedBox(width: 8),
              _buildTabPill(tab: VendorOrderTab.newOrders),
              const SizedBox(width: 8),
              _buildTabPill(tab: VendorOrderTab.preparing),
              const SizedBox(width: 8),
              _buildTabPill(tab: VendorOrderTab.riderAtStore),
              const SizedBox(width: 8),
              _buildTabPill(tab: VendorOrderTab.completed),
              const SizedBox(width: 8),
              _buildTabPill(tab: VendorOrderTab.cancel),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // 3. Tab Content
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 120),
            children: [
              // --- TAB: ALL ---
              if (_activeTab == VendorOrderTab.all) ...[
                if (newOrders.isNotEmpty) ...[
                  _buildSectionTitle('New Orders'),
                  const SizedBox(height: 8),
                  ...newOrders.map((o) => _buildNewOrderCard(o)),
                  const SizedBox(height: 18),
                ],
                if (preparingOrders.isNotEmpty) ...[
                  _buildSectionTitle('Preparing Order'),
                  const SizedBox(height: 8),
                  ...preparingOrders.map((o) => _buildPreparingOrderCard(o)),
                  const SizedBox(height: 18),
                ],
                if (riderOrders.isNotEmpty) ...[
                  _buildSectionTitle('Rider at store'),
                  const SizedBox(height: 8),
                  ...riderOrders.map((o) => _buildRiderAtStoreCard(o)),
                  const SizedBox(height: 18),
                ],
                if (newOrders.isEmpty &&
                    preparingOrders.isEmpty &&
                    riderOrders.isEmpty)
                  _buildTabEmptyState(_activeTab),
              ],

              // --- TAB: NEW ---
              if (_activeTab == VendorOrderTab.newOrders) ...[
                if (newOrders.isEmpty)
                  _buildTabEmptyState(VendorOrderTab.newOrders)
                else ...[
                  _buildSectionTitle('New Orders'),
                  const SizedBox(height: 8),
                  ...newOrders.map((o) => _buildNewOrderCard(o)),
                ],
              ],

              // --- TAB: PREPARING ---
              if (_activeTab == VendorOrderTab.preparing) ...[
                if (preparingOrders.isEmpty)
                  _buildTabEmptyState(VendorOrderTab.preparing)
                else ...[
                  _buildSectionTitle('Preparing Order'),
                  const SizedBox(height: 8),
                  ...preparingOrders.map((o) => _buildPreparingOrderCard(o)),
                ],
              ],

              // --- TAB: RIDER AT STORE ---
              if (_activeTab == VendorOrderTab.riderAtStore) ...[
                if (riderOrders.isEmpty)
                  _buildTabEmptyState(VendorOrderTab.riderAtStore)
                else ...[
                  _buildSectionTitle('Rider at store'),
                  const SizedBox(height: 8),
                  ...riderOrders.map((o) => _buildRiderAtStoreCard(o)),
                ],
              ],

              // --- TAB: COMPLETED ---
              if (_activeTab == VendorOrderTab.completed) ...[
                if (completedOrders.isEmpty)
                  _buildTabEmptyState(VendorOrderTab.completed)
                else ...[
                  _buildSectionTitle('Completed Orders'),
                  const SizedBox(height: 12),
                  ...completedOrders.map((o) => _buildCompletedOrderCard(o)),
                  const SizedBox(height: 16),
                  _buildNoticeBanner(
                    text:
                        'Tap a completed order to view its delivery details, payment status, order summary and the complete order timeline.',
                  ),
                ],
              ],

              // --- TAB: CANCEL ---
              if (_activeTab == VendorOrderTab.cancel) ...[
                if (cancelledOrders.isEmpty)
                  _buildTabEmptyState(VendorOrderTab.cancel)
                else ...[
                  _buildSectionTitle('Cancelled Orders'),
                  const SizedBox(height: 12),
                  ...cancelledOrders.map((o) => _buildCancelledOrderCard(o)),
                  const SizedBox(height: 16),
                  _buildNoticeBanner(
                    text:
                        'Tap a cancelled order to see when it was cancelled, what was already packed and what to do next.',
                  ),
                ],
              ],
            ],
          ),
        ),
      ],
    );
  }

  // =========================================================================
  // EMPTY STATE BUILDERS (Image 1 & Image 2)
  // =========================================================================

  /// Search Empty State matching Image 1
  Widget _buildSearchEmptyState(String query) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: const BoxDecoration(
                color: darkBg,
                shape: BoxShape.circle,
              ),
              child: const CustomPaint(
                painter: _SearchNoOrdersPainter(),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No orders found',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'We couldn\'t find an order matching “$query”. Check the order ID, or try a customer name or an item.',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.5,
                color: Color(0xFF6B7280),
                height: 1.45,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Category Tab Empty State matching Image 2
  Widget _buildTabEmptyState(VendorOrderTab tab) {
    String title;
    String description;

    switch (tab) {
      case VendorOrderTab.newOrders:
        title = 'No new orders right now';
        description =
            'New orders appear here with an alert as soon as a customer places one.';
        break;
      case VendorOrderTab.preparing:
        title = 'No orders being prepared';
        description =
            'Orders being packed and prepared will show up here.';
        break;
      case VendorOrderTab.riderAtStore:
        title = 'No riders at store';
        description =
            'When a delivery partner arrives at your store, they will appear here.';
        break;
      case VendorOrderTab.completed:
        title = 'No completed orders';
        description =
            'Delivered orders and payout summaries will show up here.';
        break;
      case VendorOrderTab.cancel:
        title = 'No cancelled orders';
        description =
            'Cancelled orders and refund details will show up here.';
        break;
      case VendorOrderTab.all:
        title = 'No orders found';
        description = 'Orders will appear here once they are received.';
        break;
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 36),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: const BoxDecoration(
                color: darkBg,
                shape: BoxShape.circle,
              ),
              child: const CustomPaint(
                painter: _EmptyOrdersBagPainter(),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              title,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: Color(0xFF111827),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            Text(
              description,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.5,
                color: Color(0xFF6B7280),
                height: 1.45,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  // =========================================================================
  // PILL WIDGET
  // =========================================================================
  Widget _buildTabPill({
    required VendorOrderTab tab,
  }) {
    final isSelected = _activeTab == tab;

    return GestureDetector(
      onTap: () {
        setState(() {
          _activeTab = tab;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? darkCharcoal : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? darkCharcoal : const Color(0xFFE5E7EB),
            width: 1,
          ),
          boxShadow: isSelected
              ? []
              : [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
        ),
        child: Text(
          tab.label,
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 13.5,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
            color: isSelected ? brandLime : const Color(0xFF111827),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: Color(0xFF111827),
      ),
    );
  }

  // =========================================================================
  // ORDER CARD BUILDERS
  // =========================================================================

  Widget _buildNewOrderCard(VendorOrder order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push<void>(
              context,
              MaterialPageRoute<void>(
                builder: (_) => const OrderDetailsScreen(),
              ),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text.rich(
                              TextSpan(
                                children: [
                                  const TextSpan(
                                    text: 'Order ID  ',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF111827),
                                    ),
                                  ),
                                  TextSpan(
                                    text: order.orderId,
                                    style: const TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w400,
                                      color: Color(0xFF6B7280),
                                    ),
                                  ),
                                ],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 3.5,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFEE2E2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              order.timeLeft ?? '2:45 left',
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFDC2626),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${order.itemCount} items · ₹${order.totalAmount.toStringAsFixed(0)}',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        '${order.summaryItems} · ${order.paymentMethod}',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          color: Color(0xFF6B7280),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
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
      ),
    );
  }

  Widget _buildPreparingOrderCard(VendorOrder order) {
    final packed = order.packedCount ?? 5;
    final total = order.totalPacked ?? 8;
    final progress = total > 0 ? (packed / total).clamp(0.0, 1.0) : 0.6;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push<void>(
              context,
              MaterialPageRoute<void>(
                builder: (_) => const OrderPackingStatusScreen(),
              ),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text.rich(
                        TextSpan(
                          children: [
                            const TextSpan(
                              text: 'Order ID  ',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14.5,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF111827),
                              ),
                            ),
                            TextSpan(
                              text: order.orderId,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14.5,
                                fontWeight: FontWeight.w400,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ],
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      order.timeLeft ?? '4:45 left',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12.5,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '$packed of $total packed',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: SizedBox(
                    height: 6,
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: const Color(0xFFF3EFE6),
                      valueColor:
                          const AlwaysStoppedAnimation<Color>(Color(0xFF0F172A)),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      order.readyTime ?? 'Ready by 8:10 PM',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12.5,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
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
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRiderAtStoreCard(VendorOrder order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push<void>(
              context,
              MaterialPageRoute<void>(
                builder: (_) => const OrderReadyForPickupScreen(),
              ),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text.rich(
                              TextSpan(
                                children: [
                                  const TextSpan(
                                    text: 'Order ID  ',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF111827),
                                    ),
                                  ),
                                  TextSpan(
                                    text: order.orderId,
                                    style: const TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w400,
                                      color: Color(0xFF6B7280),
                                    ),
                                  ),
                                ],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            order.readyTime ?? 'Ready since 7:41 PM',
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12.5,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${order.itemCount} items',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFF16A34A),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            order.customerName.contains('arrived')
                                ? order.customerName
                                : '${order.riderName ?? "Imran K."} has arrived',
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
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
      ),
    );
  }

  Widget _buildCompletedOrderCard(VendorOrder order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push<void>(
              context,
              MaterialPageRoute<void>(
                builder: (_) => VendorCompletedOrderDetailsScreen(order: order),
              ),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        '${order.orderId} · ${order.customerName}',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '₹${order.totalAmount.toStringAsFixed(0)}',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        '${order.itemCount} items · ${order.orderDateTime ?? "12 November ,6:52 PM"}',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF6B7280),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Delivered',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCancelledOrderCard(VendorOrder order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
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
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push<void>(
              context,
              MaterialPageRoute<void>(
                builder: (_) => VendorCancelledOrderDetailsScreen(order: order),
              ),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        '${order.orderId} · ${order.customerName}',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '₹${order.totalAmount.toStringAsFixed(0)}',
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        '${order.itemCount} items · ${order.orderDateTime ?? "12 November ,6:52 PM"}',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF6B7280),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Cancelled',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFFDC2626),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNoticeBanner({required String text}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF3C7),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 13,
          fontWeight: FontWeight.w400,
          color: Color(0xFF78350F),
          height: 1.4,
        ),
      ),
    );
  }
}

// =========================================================================
// CUSTOM PAINTERS FOR EMPTY STATES (Images 1 & 2)
// =========================================================================

/// Custom painter for the search empty state:
/// Magnifying glass with an 'X' inside it in lime green Color(0xFFC8F169).
class _SearchNoOrdersPainter extends CustomPainter {
  const _SearchNoOrdersPainter();
  static const Color iconColor = Color(0xFFD9FB67);

  @override
  void paint(Canvas canvas, Size size) {
    final strokePaint = Paint()
      ..color = iconColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final center = Offset(size.width * 0.44, size.height * 0.44);
    final radius = size.width * 0.22;

    // Magnifying glass lens
    canvas.drawCircle(center, radius, strokePaint);

    // Magnifying glass handle
    final handleStart = Offset(
      center.dx + radius * 0.707,
      center.dy + radius * 0.707,
    );
    final handleEnd = Offset(
      center.dx + radius * 1.55,
      center.dy + radius * 1.55,
    );
    canvas.drawLine(handleStart, handleEnd, strokePaint);

    // 'X' inside the glass
    final xPaint = Paint()
      ..color = iconColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.4
      ..strokeCap = StrokeCap.round;

    final xHalf = radius * 0.42;
    canvas.drawLine(
      Offset(center.dx - xHalf, center.dy - xHalf),
      Offset(center.dx + xHalf, center.dy + xHalf),
      xPaint,
    );
    canvas.drawLine(
      Offset(center.dx - xHalf, center.dy + xHalf),
      Offset(center.dx + xHalf, center.dy - xHalf),
      xPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Custom painter for the orders tab empty state:
/// Shopping bag with handles in lime green Color(0xFFC8F169).
class _EmptyOrdersBagPainter extends CustomPainter {
  const _EmptyOrdersBagPainter();
  static const Color iconColor = Color(0xFFD9FB67);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = iconColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final w = size.width;
    final h = size.height;

    // Bag body: trapezoid tote shape
    final path = Path();
    path.moveTo(w * 0.30, h * 0.44);
    path.lineTo(w * 0.70, h * 0.44);
    path.lineTo(w * 0.76, h * 0.76);
    path.lineTo(w * 0.24, h * 0.76);
    path.close();
    canvas.drawPath(path, paint);

    // Bag handles: arch at the top
    final handlePath = Path();
    handlePath.moveTo(w * 0.39, h * 0.44);
    handlePath.cubicTo(
      w * 0.39,
      h * 0.26,
      w * 0.61,
      h * 0.26,
      w * 0.61,
      h * 0.44,
    );
    canvas.drawPath(handlePath, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
