import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/inventory_product.dart';
import 'review_and_update_screen.dart';

/// Screen 1: Bulk Update Stock (matching Image 1)
class BulkUpdateStockScreen extends StatefulWidget {
  const BulkUpdateStockScreen({super.key});

  @override
  State<BulkUpdateStockScreen> createState() => _BulkUpdateStockScreenState();
}

class _BulkUpdateStockScreenState extends State<BulkUpdateStockScreen> {
  // Demo items matching the design specifications in Image 1
  late List<_BulkItem> _items;

  @override
  void initState() {
    super.initState();
    _items = [
      _BulkItem(
        product: const InventoryProduct(
          id: 'prod_1',
          name: 'Amul Taaza Milk (1 L)',
          category: 'Dairy',
          subCategory: 'Milk',
          sku: 'AMU-MLK-1L',
          currentStock: 120,
          lowStockThreshold: 20,
          price: 68.0,
          mrp: 72.0,
          discountPercent: 5.5,
          isLowStock: false,
          isOutOfStock: false,
        ),
        quantity: 100,
        isSelected: true,
      ),
      _BulkItem(
        product: const InventoryProduct(
          id: 'prod_2',
          name: 'Britannia White Bread (400 g)',
          category: 'Bakery',
          subCategory: 'Bread',
          sku: 'BRD-400',
          currentStock: 12,
          lowStockThreshold: 20,
          price: 45.0,
          mrp: 50.0,
          discountPercent: 10.0,
          isLowStock: true,
          isOutOfStock: false,
        ),
        quantity: 50,
        isSelected: false,
      ),
      _BulkItem(
        product: const InventoryProduct(
          id: 'prod_3',
          name: 'Farm Eggs (12 pcs)',
          category: 'Dairy',
          subCategory: 'Eggs',
          sku: 'EGG-12',
          currentStock: 56,
          lowStockThreshold: 15,
          price: 45.0,
          mrp: 50.0,
          discountPercent: 10.0,
          isLowStock: false,
          isOutOfStock: false,
        ),
        quantity: 200,
        isSelected: true,
      ),
      _BulkItem(
        product: const InventoryProduct(
          id: 'prod_4',
          name: 'Surf Excel Detergent (1 kg)',
          category: 'Home Care',
          subCategory: 'Laundry',
          sku: 'SXL-1KG',
          currentStock: 0,
          lowStockThreshold: 10,
          price: 278.0,
          mrp: 316.0,
          discountPercent: 12.0,
          isLowStock: false,
          isOutOfStock: true,
        ),
        quantity: 0,
        isSelected: false,
      ),
    ];
  }

  void _navigateToReview([_BulkItem? tappedItem]) {
    // If a specific item was tapped, ensure it's selected
    if (tappedItem != null) {
      tappedItem.isSelected = true;
    }

    final selectedItems = _items.where((i) => i.isSelected).toList();
    final itemsToReview = selectedItems.isNotEmpty
        ? selectedItems
        : [tappedItem ?? _items.first];

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ReviewAndUpdateScreen(
          selectedItems: itemsToReview.map((e) => SelectedProductUpdate(
            product: e.product,
            newQuantity: e.quantity > 0 ? (e.product.id == 'prod_1' ? 150 : 100) : 100,
          )).toList(),
        ),
      ),
    );
  }

  Widget _buildProductThumbnail(InventoryProduct product) {
    if (product.id == 'prod_1') {
      return Image.asset(
        'assets/cardsicon/amul_milk.png',
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(Icons.local_drink_outlined, color: Color(0xFF0284C7), size: 24),
      );
    } else if (product.id == 'prod_2') {
      return Image.asset(
        'assets/cardsicon/britannia_bread.png',
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(Icons.bakery_dining_outlined, color: Color(0xFFD97706), size: 24),
      );
    } else if (product.id == 'prod_3') {
      return Image.asset(
        'assets/cardsicon/farm_eggs.png',
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(Icons.egg_outlined, color: Color(0xFF059669), size: 24),
      );
    } else {
      return const Icon(Icons.cleaning_services_outlined, color: Color(0xFF7C3AED), size: 24);
    }
  }

  Widget _buildStockBadge(InventoryProduct product) {
    if (product.isOutOfStock) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: const Color(0xFFFEE2E2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          'Out of Stock',
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: const Color(0xFFDC2626),
          ),
        ),
      );
    }

    if (product.isLowStock) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: const Color(0xFFFEF3C7),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          'Low Stock',
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: const Color(0xFFB45309),
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFFEAF8ED),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        'In Stock',
        style: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: const Color(0xFF15803D),
        ),
      ),
    );
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
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ),
        title: Text(
          'Bulk Update Stock',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF0F172A),
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
                  icon: SvgPicture.asset(
                    'assets/svg/info_button.svg',
                    width: 22,
                    height: 22,
                    fit: BoxFit.contain,
                  ),
                  onPressed: () {},
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Hero Cardboard Boxes Illustration
                    Center(
                      child: SizedBox(
                        width: 144,
                        height: 96,
                        child: SvgPicture.asset(
                          'assets/svg/bulk_update_stock.svg',
                          width: 144,
                          height: 96,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Hero Headline & Subtitle
                    Center(
                      child: Text(
                        'Update stock for multiple\nproducts in just a few steps',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF0F172A),
                          height: 1.3,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Center(
                      child: Text(
                        'Choose products, set quantity and update\nstock in bulk.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF64748B),
                          height: 1.4,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Quick Action Tiles: Scan Barcode & Upload File
                    Row(
                      children: [
                        // Scan Barcode
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Scan barcode initiated.'),
                                  backgroundColor: Color(0xFF0F172A),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              height: 72,
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.03),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  SizedBox(
                                    width: 28,
                                    height: 28,
                                    child: SvgPicture.asset(
                                      'assets/svg/Barcode_Scanner_Icon.svg',
                                      width: 28,
                                      height: 28,
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      'Scan\nBarcode',
                                      style: GoogleFonts.inter(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF0F172A),
                                        height: 1.2,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Upload File
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Upload file initiated.'),
                                  backgroundColor: Color(0xFF0F172A),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              height: 72,
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.03),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  SizedBox(
                                    width: 28,
                                    height: 28,
                                    child: SvgPicture.asset(
                                      'assets/svg/Upload Sheet Icon.svg',
                                      width: 28,
                                      height: 28,
                                      fit: BoxFit.contain,
                                      errorBuilder: (context, error, stackTrace) => SvgPicture.asset(
                                        'assets/svg/upload_sheet_icon.svg',
                                        width: 28,
                                        height: 28,
                                        fit: BoxFit.contain,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      'Upload\nFile',
                                      style: GoogleFonts.inter(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF0F172A),
                                        height: 1.2,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Divider with "or"
                    Row(
                      children: [
                        const Expanded(
                          child: Divider(
                            color: Color(0xFFCBD5E1),
                            thickness: 1,
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          child: Text(
                            'or',
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF94A3B8),
                            ),
                          ),
                        ),
                        const Expanded(
                          child: Divider(
                            color: Color(0xFFCBD5E1),
                            thickness: 1,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Section Heading: Select Products
                    Text(
                      'Select Products',
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Products List
                    ..._items.map((item) {
                      final product = item.product;
                      final isLimeBorder = item.isSelected;

                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.03),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Material(
                          color: Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                          child: InkWell(
                            onTap: () => _navigateToReview(item),
                            borderRadius: BorderRadius.circular(16),
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Row(
                                children: [
                                  // Product Thumbnail
                                  Container(
                                    width: 48,
                                    height: 48,
                                    padding: const EdgeInsets.all(4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF8FAFC),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: const Color(0xFFE2E8F0),
                                      ),
                                    ),
                                    child: Center(
                                      child: _buildProductThumbnail(product),
                                    ),
                                  ),
                                  const SizedBox(width: 12),

                                  // Product Name, SKU, Status Badge
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          product.name,
                                          style: GoogleFonts.inter(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                            color: const Color(0xFF0F172A),
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          'SKU: ${product.sku}',
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w400,
                                            color: const Color(0xFF94A3B8),
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        _buildStockBadge(product),
                                      ],
                                    ),
                                  ),

                                  // Quantity Pill Box (e.g. 100 | units)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: isLimeBorder
                                            ? const Color(0xFFD4F932)
                                            : const Color(0xFFE2E8F0),
                                        width: isLimeBorder ? 1.5 : 1,
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          '${item.quantity}',
                                          style: GoogleFonts.inter(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                            color: const Color(0xFF0F172A),
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          '|',
                                          style: GoogleFonts.inter(
                                            fontSize: 13,
                                            color: const Color(0xFFCBD5E1),
                                          ),
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          'units',
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            color: const Color(0xFF64748B),
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
                      );
                    }),
                  ],
                ),
              ),
            ),

            // Bottom Next Button
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.transparent,
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => _navigateToReview(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD4F932),
                    foregroundColor: const Color(0xFF0F172A),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    'Next',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF0F172A),
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
}

class _BulkItem {
  final InventoryProduct product;
  final int quantity;
  bool isSelected;

  _BulkItem({
    required this.product,
    required this.quantity,
    this.isSelected = false,
  });
}
