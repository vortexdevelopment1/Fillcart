import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/inventory_metrics.dart';
import '../../models/inventory_product.dart';
import 'package:fillcart_vendor/features/navigation/presentation/screens/main_vendor_screen.dart';
import '../widgets/inventory_overview_card.dart';
import '../widgets/product_item_card.dart';
import '../widgets/quick_action_card.dart';
import '../widgets/segmented_tab_switch.dart';
import '../widgets/stock_availability_card.dart';
import '../widgets/add_product_bottom_sheet.dart';
import 'bulk_update_stock_screen.dart';
import 'inventory_product_selection_screen.dart';
import 'stock_alert_settings_screen.dart';
import 'stock_history_screen.dart';
import 'update_stock_screen.dart';

enum ProductFilter {
  all('All (324)'),
  inStock('In Stock (286)'),
  lowStock('Low Stock (24)');

  final String label;
  const ProductFilter(this.label);
}

/// The primary Products & Inventory screen for the Vendor App (Images 1 & 2).
///
/// Houses the dual-segmented toggle between:
/// 1. Products List (Image 1)
/// 2. Inventory Overview Dashboard (Image 2)
class VendorInventoryScreen extends StatefulWidget {
  final int initialTabIndex;
  final VoidCallback? onBackToHome;

  const VendorInventoryScreen({
    super.key,
    this.initialTabIndex = 0,
    this.onBackToHome,
  });

  @override
  State<VendorInventoryScreen> createState() => _VendorInventoryScreenState();
}

class _VendorInventoryScreenState extends State<VendorInventoryScreen> {
  late int _selectedTabIndex;
  ProductFilter _activeFilter = ProductFilter.all;
  final TextEditingController _searchController = TextEditingController();

  final InventoryMetrics _metrics = const InventoryMetrics();
  List<InventoryProduct> _products = InventoryProduct.demoProducts;

  @override
  void initState() {
    super.initState();
    _selectedTabIndex = widget.initialTabIndex;
    _searchController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<InventoryProduct> get _filteredProducts {
    final query = _searchController.text.trim().toLowerCase();
    return _products.where((product) {
      // Filter by chip
      if (_activeFilter == ProductFilter.inStock &&
          (product.isOutOfStock || product.isLowStock)) {
        return false;
      }
      if (_activeFilter == ProductFilter.lowStock && !product.isLowStock) {
        return false;
      }

      // Filter by search query
      if (query.isNotEmpty) {
        final matchesName = product.name.toLowerCase().contains(query);
        final matchesCat = product.category.toLowerCase().contains(query);
        final matchesSku = product.sku.toLowerCase().contains(query);
        if (!matchesName && !matchesCat && !matchesSku) {
          return false;
        }
      }

      return true;
    }).toList();
  }

  void _navigateToUpdateStock(InventoryProduct product) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => UpdateStockScreen(product: product),
      ),
    );
  }

  void _navigateToStockHistory(InventoryProduct product) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => StockHistoryScreen(product: product),
      ),
    );
  }

  void _navigateToAlertSettings(InventoryProduct product) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => StockAlertSettingsScreen(product: product),
      ),
    );
  }

  void _onQuickActionUpdateStock() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => InventoryProductSelectionScreen(
          title: 'Update Stock',
          onProductSelected: (product) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute<void>(
                builder: (_) => UpdateStockScreen(product: product),
              ),
            );
          },
        ),
      ),
    );
  }

  void _onQuickActionStockHistory() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => InventoryProductSelectionScreen(
          title: 'Stock History',
          onProductSelected: (product) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute<void>(
                builder: (_) => StockHistoryScreen(product: product),
              ),
            );
          },
        ),
      ),
    );
  }

  void _onQuickActionBulkUpdate() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const BulkUpdateStockScreen(),
      ),
    );
  }

  void _onQuickActionAlertSettings() {
    _navigateToAlertSettings(_products.first);
  }

  void _handleBack() {
    if (widget.onBackToHome != null) {
      widget.onBackToHome!();
    } else if (Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    } else {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(
          builder: (_) => const MainVendorScreen(initialIndex: 0),
        ),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: Center(
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: IconButton(
                icon: const Icon(
                  Icons.arrow_back,
                  color: Color(0xFF0F172A),
                  size: 20,
                ),
                onPressed: _handleBack,
              ),
            ),
          ),
        ),
        title: const Text(
          'Products & Inventory',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Color(0xFF0F172A),
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: IconButton(
                  icon: const Icon(
                    Icons.more_vert,
                    color: Color(0xFF0F172A),
                    size: 20,
                  ),
                  onPressed: () {},
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: _selectedTabIndex == 0
          ? Padding(
              padding: const EdgeInsets.only(bottom: 72),
              child: FloatingActionButton.extended(
                onPressed: () => AddProductBottomSheet.show(context),
                backgroundColor: const Color(0xFFD4F932),
                foregroundColor: const Color(0xFF0F172A),
                elevation: 4,
                icon: const Icon(Icons.add, size: 20, color: Color(0xFF0F172A)),
                label: Text(
                  'Add Product',
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                shape: const StadiumBorder(),
              ),
            )
          : null,
      body: PopScope(
        canPop: false,
        onPopInvokedWithResult: (didPop, result) {
          if (didPop) return;
          _handleBack();
        },
        child: SafeArea(
          child: Column(
            children: [
              // Top Dual-Tab Switcher
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                child: SegmentedTabSwitch(
                  selectedIndex: _selectedTabIndex,
                  onTabChanged: (index) {
                    setState(() {
                      _selectedTabIndex = index;
                    });
                  },
                ),
              ),

              // Tab View Content
              Expanded(
                child: _selectedTabIndex == 0
                    ? _buildProductsTabView()
                    : _buildInventoryOverviewTabView(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Tab 1: Products List View (Image 1)
  Widget _buildProductsTabView() {
    final filtered = _filteredProducts;

    return Column(
      children: [
        // Filter Chips Row
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
          child: Row(
            children: ProductFilter.values.map((filter) {
              final isSelected = filter == _activeFilter;
              return GestureDetector(
                onTap: () => setState(() => _activeFilter = filter),
                child: Container(
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFFD4F932) : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 6,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (filter == ProductFilter.lowStock) ...[
                        Container(
                          width: 8,
                          height: 8,
                          margin: const EdgeInsets.only(right: 6),
                          decoration: const BoxDecoration(
                            color: Color(0xFFF59E0B),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                      Text(
                        filter.label,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),

        // Search Bar with Camera Icon and Realtime Filtering
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: Container(
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const Icon(Icons.search, color: Color(0xFF94A3B8), size: 22),
                const SizedBox(width: 10),
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
                        fontSize: 14,
                        color: Color(0xFF0F172A),
                        fontWeight: FontWeight.w500,
                      ),
                      onChanged: (val) {
                        setState(() {});
                      },
                      decoration: const InputDecoration(
                        hintText: 'Search products...',
                        hintStyle: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                        ),
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        disabledBorder: InputBorder.none,
                        errorBorder: InputBorder.none,
                        focusedErrorBorder: InputBorder.none,
                        isCollapsed: true,
                        filled: false,
                        fillColor: Colors.transparent,
                      ),
                    ),
                  ),
                ),
                if (_searchController.text.isNotEmpty)
                  GestureDetector(
                    onTap: () {
                      _searchController.clear();
                      setState(() {});
                    },
                    child: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 6),
                      child: Icon(
                        Icons.close,
                        size: 18,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ),
                const SizedBox(width: 4),
                GestureDetector(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Barcode scanner active.'),
                        backgroundColor: Color(0xFF0F172A),
                      ),
                    );
                  },
                  child: const Padding(
                    padding: EdgeInsets.all(4),
                    child: Icon(
                      Icons.camera_alt_outlined,
                      color: Color(0xFF0F172A),
                      size: 22,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        // Product Cards List
        Expanded(
          child: filtered.isEmpty
              ? const Center(
                  child: Text(
                    'No products match your filter criteria.',
                    style: TextStyle(
                      color: Color(0xFF64748B),
                      fontSize: 15,
                    ),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 4, 16, 96),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final product = filtered[index];
                    return ProductItemCard(
                      product: product,
                      onTap: () => _navigateToUpdateStock(product),
                      onMoreOptionsTap: () => _showProductActionsModal(product),
                    );
                  },
                ),
        ),
      ],
    );
  }

  /// Tab 2: Inventory Overview Dashboard (Image 2)
  Widget _buildInventoryOverviewTabView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Title: Inventory Overview
          const Text(
            'Inventory Overview',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 12),

          // 2x2 Metric Summary Cards Grid
          Row(
            children: [
              Expanded(
                child: InventoryOverviewCard(
                  svgPath: 'assets/svg/diagonal_box.svg',
                  count: '${_metrics.totalProducts}',
                  backgroundColor: const Color(0xFFF0FDF4),
                  countColor: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: InventoryOverviewCard(
                  svgPath: 'assets/svg/low_stock.svg',
                  title: 'Low Stock',
                  count: '${_metrics.lowStockCount}',
                  backgroundColor: const Color(0xFFFEFCE8),
                  countColor: const Color(0xFFD97706),
                  titleColor: const Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: InventoryOverviewCard(
                  svgPath: 'assets/svg/out_of_stock.svg',
                  title: 'Out of Stock',
                  count: '${_metrics.outOfStockCount}',
                  backgroundColor: const Color(0xFFFEF2F2),
                  countColor: const Color(0xFFDC2626),
                  titleColor: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: InventoryOverviewCard(
                  svgPath: 'assets/svg/expiring_soon.svg',
                  title: 'Expiring Soon',
                  count: '${_metrics.expiringSoonCount}',
                  backgroundColor: const Color(0xFFEFF6FF),
                  countColor: const Color(0xFF2563EB),
                  titleColor: const Color(0xFF0F172A),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Stock Availability Card
          StockAvailabilityCard(
            metrics: _metrics,
            onTap: () {
              setState(() {
                _selectedTabIndex = 0;
              });
            },
          ),
          const SizedBox(height: 24),

          // Section Title: Quick Actions
          const Text(
            'Quick Actions',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w600,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 12),

          // 2x2 Grid of Quick Actions
          Row(
            children: [
              Expanded(
                child: QuickActionCard(
                  svgPath: 'assets/svg/update_stock.svg',
                  title: 'Update Stock',
                  onTap: _onQuickActionUpdateStock,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: QuickActionCard(
                  svgPath: 'assets/svg/stock_history.svg',
                  title: 'Stock History',
                  onTap: _onQuickActionStockHistory,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: QuickActionCard(
                  svgPath: 'assets/svg/bulk_update.svg',
                  title: 'Bulk Update',
                  onTap: _onQuickActionBulkUpdate,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: QuickActionCard(
                  svgPath: 'assets/svg/alert_settings.svg',
                  title: 'Alert Settings',
                  onTap: _onQuickActionAlertSettings,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showProductActionsModal(InventoryProduct product) {
    showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      backgroundColor: Colors.white,
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ListTile(
                  leading: const Icon(Icons.edit_outlined, color: Color(0xFF0F172A)),
                  title: const Text('Update Stock'),
                  onTap: () {
                    Navigator.pop(ctx);
                    _navigateToUpdateStock(product);
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.history_outlined, color: Color(0xFF0F172A)),
                  title: const Text('View Stock History'),
                  onTap: () {
                    Navigator.pop(ctx);
                    _navigateToStockHistory(product);
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.notifications_active_outlined, color: Color(0xFF0F172A)),
                  title: const Text('Stock Alert Settings'),
                  onTap: () {
                    Navigator.pop(ctx);
                    _navigateToAlertSettings(product);
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
