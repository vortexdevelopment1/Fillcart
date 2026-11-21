import 'package:flutter/material.dart';
import '../widgets/category_checklist_tile.dart';
import '../widgets/promotion_step_indicator.dart';
import 'discount_offer_screen.dart';

/// Screen 3: Select Products (Step 1) Screen.
class SelectProductsScreen extends StatefulWidget {
  const SelectProductsScreen({
    super.key,
    this.promotionType = 'Percentage / Flat Discount',
  });

  final String promotionType;

  @override
  State<SelectProductsScreen> createState() => _SelectProductsScreenState();
}

class _SelectProductsScreenState extends State<SelectProductsScreen> {
  int _selectedTab = 0; // 0 = Categories, 1 = Products
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _categories = [
    {
      'name': 'Dairy',
      'count': 24,
      'icon': 'assets/cardsicon/Dairy.png',
      'bgColor': const Color(0xFFECFDF5),
      'checked': true,
    },
    {
      'name': 'Snacks',
      'count': 18,
      'icon': 'assets/cardsicon/Snaks.png',
      'bgColor': const Color(0xFFFFF7ED),
      'checked': true,
    },
    {
      'name': 'Beverages',
      'count': 12,
      'icon': 'assets/cardsicon/Beverages.png',
      'bgColor': const Color(0xFFF0F9FF),
      'checked': false,
    },
    {
      'name': 'Fruits & Vegetables',
      'count': 36,
      'icon': 'assets/cardsicon/fruits&vegetables.png',
      'bgColor': const Color(0xFFFFF7ED),
      'checked': false,
    },
    {
      'name': 'Bakery',
      'count': 8,
      'icon': 'assets/cardsicon/Bakery.png',
      'bgColor': const Color(0xFFFEFCE8),
      'checked': false,
    },
    {
      'name': 'Personal Care',
      'count': 14,
      'icon': 'assets/cardsicon/Beauty.png',
      'bgColor': const Color(0xFFFDF2F8),
      'checked': false,
    },
    {
      'name': 'Household',
      'count': 20,
      'icon': 'assets/cardsicon/Household.png',
      'bgColor': const Color(0xFFF0FDF4),
      'checked': false,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF1EEE6);

    final filteredCategories = _categories.where((cat) {
      final query = _searchController.text.trim().toLowerCase();
      if (query.isEmpty) return true;
      return (cat['name'] as String).toLowerCase().contains(query);
    }).toList();

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Bar
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
                            child: const Icon(
                              Icons.arrow_back_rounded,
                              color: Color(0xFF111827),
                              size: 20,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Select Products',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF111827),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Stepper: 1 Products (Active) -> 2 Details -> 3 Review
                    const PromotionStepIndicator(currentStep: 1),
                    const SizedBox(height: 16),

                    // Pill Switcher: Categories vs Products (Figma: Height 40px, Pill Capsule, White, No Border)
                    Container(
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      padding: const EdgeInsets.all(3),
                      child: Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  _selectedTab = 0;
                                });
                              },
                              borderRadius: BorderRadius.circular(17),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: _selectedTab == 0
                                      ? const Color(0xFFC8F169)
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(17),
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  'Categories',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  _selectedTab = 1;
                                });
                              },
                              borderRadius: BorderRadius.circular(17),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: _selectedTab == 1
                                      ? const Color(0xFFC8F169)
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(17),
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  'Products',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Search Container - Figma: Width Fill (328px), Height Hug (40px), Radius 16px, Padding 12px, Gap 11px, No Border
                    Container(
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.search,
                            color: Color(0xFF9CA3AF),
                            size: 18,
                          ),
                          const SizedBox(width: 11), // Figma Gap: 11px
                          Expanded(
                            child: TextField(
                              controller: _searchController,
                              onChanged: (_) => setState(() {}),
                              cursorColor: const Color(0xFF111827),
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 13,
                                color: Color(0xFF111827),
                              ),
                              decoration: InputDecoration(
                                hintText: _selectedTab == 0
                                    ? 'Search categories...'
                                    : 'Search products...',
                                hintStyle: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 13,
                                  color: Color(0xFF9CA3AF),
                                ),
                                border: InputBorder.none,
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
                                disabledBorder: InputBorder.none,
                                errorBorder: InputBorder.none,
                                focusedErrorBorder: InputBorder.none,
                                isDense: true,
                                contentPadding: EdgeInsets.zero,
                                filled: false,
                                fillColor: Colors.transparent,
                              ),
                            ),
                          ),
                          if (_searchController.text.isNotEmpty)
                            GestureDetector(
                              onTap: () {
                                _searchController.clear();
                                setState(() {});
                              },
                              child: const Icon(
                                Icons.close,
                                color: Color(0xFF9CA3AF),
                                size: 16,
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Categories Checklist
                    ...filteredCategories.map((item) {
                      return CategoryChecklistTile(
                        name: item['name'] as String,
                        itemCount: item['count'] as int,
                        iconAsset: item['icon'] as String,
                        isChecked: item['checked'] as bool,
                        onToggle: (val) {
                          setState(() {
                            item['checked'] = val;
                          });
                        },
                      );
                    }),
                  ],
                ),
              ),
            ),

            // Bottom Sticky Button: Next
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC8F169),
                    foregroundColor: const Color(0xFF111827),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  onPressed: () {
                    final selectedCategoryNames = _categories
                        .where((c) => c['checked'] == true)
                        .map((c) => c['name'] as String)
                        .toList();

                    Navigator.push(
                      context,
                      MaterialPageRoute<void>(
                        builder: (context) => DiscountOfferScreen(
                          promotionType: widget.promotionType,
                          selectedCategories: selectedCategoryNames,
                        ),
                      ),
                    );
                  },
                  child: const Text(
                    'Next',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
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
