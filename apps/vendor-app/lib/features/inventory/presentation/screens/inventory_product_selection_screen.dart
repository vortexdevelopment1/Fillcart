import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import '../../models/inventory_product.dart';
import '../widgets/product_item_card.dart';

/// Screen displayed when selecting an item from the inventory
/// for "Update Stock" or "Stock History" actions.
class InventoryProductSelectionScreen extends StatefulWidget {
  final String title;
  final ValueChanged<InventoryProduct> onProductSelected;

  const InventoryProductSelectionScreen({
    super.key,
    required this.title,
    required this.onProductSelected,
  });

  @override
  State<InventoryProductSelectionScreen> createState() =>
      _InventoryProductSelectionScreenState();
}

class _InventoryProductSelectionScreenState
    extends State<InventoryProductSelectionScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<InventoryProduct> _filteredProducts = InventoryProduct.demoProducts;

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    final query = _searchController.text.trim().toLowerCase();
    setState(() {
      if (query.isEmpty) {
        _filteredProducts = InventoryProduct.demoProducts;
      } else {
        _filteredProducts = InventoryProduct.demoProducts.where((p) {
          return p.name.toLowerCase().contains(query) ||
              p.category.toLowerCase().contains(query) ||
              p.subCategory.toLowerCase().contains(query) ||
              p.sku.toLowerCase().contains(query);
        }).toList();
      }
    });
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
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: SvgPicture.asset(
                  AppAssets.svgBackArrow,
                  width: 20,
                  height: 20,
                  colorFilter: const ColorFilter.mode(
                    Color(0xFF0F172A),
                    BlendMode.srcIn,
                  ),
                ),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ),
        title: Text(
          widget.title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Color(0xFF0F172A),
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Input
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
              child: Container(
                height: 48,
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
                            color: Color(0xFF111827),
                            fontWeight: FontWeight.w400,
                          ),
                          onChanged: (val) => setState(() {}),
                          decoration: const InputDecoration(
                            hintText: 'Search products by name or SKU...',
                            hintStyle: TextStyle(
                              fontFamily: 'Inter',
                              color: Color(0xFF4B5563),
                              fontSize: 14.5,
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
                          padding: EdgeInsets.symmetric(horizontal: 4),
                          child: Icon(Icons.close, color: Color(0xFF94A3B8), size: 18),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Products List
            Expanded(
              child: _filteredProducts.isEmpty
                  ? const Center(
                      child: Text(
                        'No products match your search.',
                        style: TextStyle(
                          color: Color(0xFF64748B),
                          fontSize: 15,
                        ),
                      ),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                      itemCount: _filteredProducts.length,
                      itemBuilder: (context, index) {
                        final product = _filteredProducts[index];
                        return ProductItemCard(
                          product: product,
                          onTap: () => widget.onProductSelected(product),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
