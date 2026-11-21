import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/inventory_product.dart';

/// Model representing a product update item in the review screen
class SelectedProductUpdate {
  final InventoryProduct product;
  final int newQuantity;

  const SelectedProductUpdate({
    required this.product,
    required this.newQuantity,
  });
}

/// Screen 2: Review & Update (matching Image 2)
class ReviewAndUpdateScreen extends StatefulWidget {
  final List<SelectedProductUpdate> selectedItems;

  const ReviewAndUpdateScreen({
    super.key,
    required this.selectedItems,
  });

  @override
  State<ReviewAndUpdateScreen> createState() => _ReviewAndUpdateScreenState();
}

class _ReviewAndUpdateScreenState extends State<ReviewAndUpdateScreen> {
  final TextEditingController _noteController = TextEditingController();
  late List<SelectedProductUpdate> _items;

  @override
  void initState() {
    super.initState();
    // Use passed items if available, or fallback to the two products shown in Image 2
    if (widget.selectedItems.isNotEmpty) {
      _items = widget.selectedItems;
    } else {
      _items = const [
        SelectedProductUpdate(
          product: InventoryProduct(
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
          newQuantity: 150,
        ),
        SelectedProductUpdate(
          product: InventoryProduct(
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
          newQuantity: 100,
        ),
      ];
    }
  }

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  Widget _buildProductThumbnail(InventoryProduct product) {
    if (product.id == 'prod_1') {
      return Image.asset(
        'assets/cardsicon/amul_milk.png',
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(
          Icons.local_drink_outlined,
          color: Color(0xFF0284C7),
          size: 24,
        ),
      );
    } else if (product.id == 'prod_2') {
      return Image.asset(
        'assets/cardsicon/britannia_bread.png',
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(
          Icons.bakery_dining_outlined,
          color: Color(0xFFD97706),
          size: 24,
        ),
      );
    } else if (product.id == 'prod_3') {
      return Image.asset(
        'assets/cardsicon/farm_eggs.png',
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(
          Icons.egg_outlined,
          color: Color(0xFF059669),
          size: 24,
        ),
      );
    } else {
      return const Icon(
        Icons.cleaning_services_outlined,
        color: Color(0xFF7C3AED),
        size: 24,
      );
    }
  }

  void _onConfirmUpdate() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Stock updated successfully for ${_items.length} products.',
          style: GoogleFonts.inter(),
        ),
        backgroundColor: const Color(0xFF15803D),
      ),
    );

    // Pop back to inventory screen (pop 2 screens: ReviewAndUpdate -> BulkUpdateStock -> Inventory)
    int count = 0;
    Navigator.of(context).popUntil((route) => count++ >= 2 || route.isFirst);
  }

  @override
  Widget build(BuildContext context) {
    final count = _items.length;

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
          'Review & Update',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF0F172A),
          ),
        ),
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
                    // Summary Banner (Image 2)
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF3),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFD1FADF)),
                      ),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 32,
                            height: 32,
                            child: SvgPicture.asset(
                              'assets/svg/selected_product.svg',
                              width: 32,
                              height: 32,
                              fit: BoxFit.contain,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '$count Products Selected',
                                  style: GoogleFonts.inter(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'You\'re about to update stock for $count products',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w400,
                                    color: const Color(0xFF475467),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Selected Products Cards List
                    ..._items.map((item) {
                      final product = item.product;

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
                        child: Padding(
                          padding: const EdgeInsets.all(14),
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

                              // Name & Current Stock
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
                                    const SizedBox(height: 4),
                                    Text(
                                      'Current Stock: ${product.currentStock} units',
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w400,
                                        color: const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              // Trailing Target Units Box
                              Container(
                                width: 68,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: const Color(0xFFE2E8F0),
                                  ),
                                ),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      '${item.newQuantity}',
                                      style: GoogleFonts.inter(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w600,
                                        color: const Color(0xFF0F172A),
                                      ),
                                    ),
                                    Text(
                                      'units',
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w400,
                                        color: const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: 12),

                    // Additional Note (Optional)
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: 'Additional Note ',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF0F172A),
                            ),
                          ),
                          TextSpan(
                            text: '(Optional)',
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Note Input Box with Document Icon
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 12,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 6,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(top: 2),
                            child: SvgPicture.asset(
                              'assets/svg/Pencil Icon.svg',
                              width: 20,
                              height: 20,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => SvgPicture.asset(
                                'assets/svg/pencil_icon.svg',
                                width: 20,
                                height: 20,
                                fit: BoxFit.contain,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Theme(
                              data: Theme.of(context).copyWith(
                                inputDecorationTheme:
                                    const InputDecorationTheme(
                                  filled: false,
                                  fillColor: Colors.transparent,
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                  disabledBorder: InputBorder.none,
                                  errorBorder: InputBorder.none,
                                ),
                              ),
                              child: TextField(
                                controller: _noteController,
                                maxLength: 100,
                                maxLines: 2,
                                minLines: 1,
                                buildCounter: (
                                  context, {
                                  required currentLength,
                                  required isFocused,
                                  maxLength,
                                }) =>
                                    null, // We build our own clean counter below
                                onChanged: (val) => setState(() {}),
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  color: const Color(0xFF0F172A),
                                ),
                                decoration: InputDecoration(
                                  isDense: true,
                                  contentPadding: EdgeInsets.zero,
                                  hintText:
                                      'Add note (e.g. new batch, supplier...)',
                                  hintStyle: GoogleFonts.inter(
                                    fontSize: 13,
                                    color: const Color(0xFF94A3B8),
                                  ),
                                  filled: false,
                                  fillColor: Colors.transparent,
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),

                    // 0/100 Character Counter
                    Align(
                      alignment: Alignment.centerRight,
                      child: Text(
                        '${_noteController.text.length}/100',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: const Color(0xFF94A3B8),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Information Alert Box
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFFBEB),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFFDE68A)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: SvgPicture.asset(
                              'assets/svg/Info Circular Icon.svg',
                              width: 20,
                              height: 20,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => SvgPicture.asset(
                                'assets/svg/info_circular_icon.svg',
                                width: 20,
                                height: 20,
                                fit: BoxFit.contain,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Stock will be updated immediately in your inventory.',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.w400,
                                color: const Color(0xFF0F172A),
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Confirm Update Button
            Container(
              padding: const EdgeInsets.all(16),
              color: Colors.transparent,
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _onConfirmUpdate,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD4F932),
                    foregroundColor: const Color(0xFF0F172A),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    'Confirm Update',
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
