import 'package:flutter/material.dart';
import 'package:fillcart_vendor/features/order_management/models/vendor_order_model.dart';

/// Modal bottom sheet for sorting and filtering vendor orders.
/// Matches screenshot design with interactive radio-style selection pills.
class OrderFilterSortBottomSheet extends StatefulWidget {
  const OrderFilterSortBottomSheet({
    super.key,
    required this.initialFilter,
    required this.onApply,
  });

  final VendorOrderFilter initialFilter;
  final ValueChanged<VendorOrderFilter> onApply;

  /// Helper to show this bottom sheet in a consistent styled container.
  static Future<void> show(
    BuildContext context, {
    required VendorOrderFilter currentFilter,
    required ValueChanged<VendorOrderFilter> onApply,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => OrderFilterSortBottomSheet(
        initialFilter: currentFilter,
        onApply: onApply,
      ),
    );
  }

  @override
  State<OrderFilterSortBottomSheet> createState() =>
      _OrderFilterSortBottomSheetState();
}

class _OrderFilterSortBottomSheetState
    extends State<OrderFilterSortBottomSheet> {
  late String _selectedSort;
  late Set<String> _selectedCategories;
  String? _selectedPayment;

  static const Color brandLime = Color(0xFFD9FB67);
  static const Color darkCharcoal = Color(0xFF0E1512);

  @override
  void initState() {
    super.initState();
    _selectedSort = widget.initialFilter.sortBy;
    _selectedCategories = Set<String>.from(widget.initialFilter.categories);
    _selectedPayment = widget.initialFilter.payment;
  }

  void _reset() {
    setState(() {
      _selectedSort = 'Newest first';
      _selectedCategories = {'Vegetables', 'Grocery'};
      _selectedPayment = null;
    });
  }

  void _apply() {
    final updated = VendorOrderFilter(
      sortBy: _selectedSort,
      categories: _selectedCategories,
      payment: _selectedPayment,
    );
    widget.onApply(updated);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFFF3F4F6),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.fromLTRB(
        20,
        12,
        20,
        16 + MediaQuery.paddingOf(context).bottom,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFD1D5DB),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Header Row: Title & Reset Button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Filter and sort',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827),
                ),
              ),
              InkWell(
                onTap: _reset,
                borderRadius: BorderRadius.circular(8),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Text(
                    'Reset',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF2563EB),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // 1. Sort by Section
          const Text(
            'Sort by',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _buildRadioPill(
                label: 'Newest first',
                isSelected: _selectedSort == 'Newest first',
                onTap: () => setState(() => _selectedSort = 'Newest first'),
              ),
              _buildRadioPill(
                label: 'Oldest first',
                isSelected: _selectedSort == 'Oldest first',
                onTap: () => setState(() => _selectedSort = 'Oldest first'),
              ),
              _buildRadioPill(
                label: 'Highest value',
                isSelected: _selectedSort == 'Highest value',
                onTap: () => setState(() => _selectedSort = 'Highest value'),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // 2. Category Section
          const Text(
            'Category',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _buildRadioPill(
                label: 'Vegetables',
                isSelected: _selectedCategories.contains('Vegetables'),
                onTap: () {
                  setState(() {
                    if (_selectedCategories.contains('Vegetables')) {
                      _selectedCategories.remove('Vegetables');
                    } else {
                      _selectedCategories.add('Vegetables');
                    }
                  });
                },
              ),
              _buildRadioPill(
                label: 'Grocery',
                isSelected: _selectedCategories.contains('Grocery'),
                onTap: () {
                  setState(() {
                    if (_selectedCategories.contains('Grocery')) {
                      _selectedCategories.remove('Grocery');
                    } else {
                      _selectedCategories.add('Grocery');
                    }
                  });
                },
              ),
              _buildRadioPill(
                label: 'Electronics',
                isSelected: _selectedCategories.contains('Electronics'),
                onTap: () {
                  setState(() {
                    if (_selectedCategories.contains('Electronics')) {
                      _selectedCategories.remove('Electronics');
                    } else {
                      _selectedCategories.add('Electronics');
                    }
                  });
                },
              ),
              _buildRadioPill(
                label: 'Stationery',
                isSelected: _selectedCategories.contains('Stationery'),
                onTap: () {
                  setState(() {
                    if (_selectedCategories.contains('Stationery')) {
                      _selectedCategories.remove('Stationery');
                    } else {
                      _selectedCategories.add('Stationery');
                    }
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 24),

          // 3. Payment Section
          const Text(
            'Payment',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _buildRadioPill(
                label: 'Paid online',
                isSelected: _selectedPayment == 'Paid online',
                onTap: () {
                  setState(() {
                    _selectedPayment =
                        _selectedPayment == 'Paid online' ? null : 'Paid online';
                  });
                },
              ),
              _buildRadioPill(
                label: 'Pay on delivery',
                isSelected: _selectedPayment == 'Pay on delivery',
                onTap: () {
                  setState(() {
                    _selectedPayment = _selectedPayment == 'Pay on delivery'
                        ? null
                        : 'Pay on delivery';
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 32),

          // Action Button: Show Orders
          SizedBox(
            width: double.infinity,
            height: 52,
            child: ElevatedButton(
              onPressed: _apply,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF000000),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(26),
                ),
                elevation: 0,
              ),
              child: const Text(
                'Show Orders',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Builds a pill container matching the attached filter design.
  Widget _buildRadioPill({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
        decoration: BoxDecoration(
          color: isSelected ? darkCharcoal : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? darkCharcoal : const Color(0xFFE5E7EB),
            width: 1.2,
          ),
          boxShadow: isSelected
              ? []
              : [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Custom Radio Indicator Circle matching Image 2
            Container(
              width: 16,
              height: 16,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? brandLime : const Color(0xFF9CA3AF),
                  width: 1.5,
                ),
                color: isSelected ? brandLime : Colors.white,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected ? brandLime : const Color(0xFF374151),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
