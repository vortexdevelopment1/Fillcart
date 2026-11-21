import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../models/inventory_product.dart';

enum StockAdjustmentType {
  add('Add Stock', 'assets/svg/add_stock.svg'),
  reduce('Reduce Stock', 'assets/svg/reduce_stock.svg'),
  correct('Correct Stock', 'assets/svg/correct_stock.svg');

  final String label;
  final String svgPath;
  const StockAdjustmentType(this.label, this.svgPath);
}

/// Screen allowing the vendor to adjust stock for a specific product (Image 3).
class UpdateStockScreen extends StatefulWidget {
  final InventoryProduct product;

  const UpdateStockScreen({
    super.key,
    required this.product,
  });

  @override
  State<UpdateStockScreen> createState() => _UpdateStockScreenState();
}

class _UpdateStockScreenState extends State<UpdateStockScreen> {
  StockAdjustmentType _selectedType = StockAdjustmentType.add;
  final TextEditingController _quantityController = TextEditingController(text: '50');
  String _selectedReason = 'New stock received';
  DateTime? _selectedExpiryDate;

  final List<String> _addReasons = [
    'New stock received',
    'Return from customer',
    'Inventory found / Excess',
    'Other',
  ];

  final List<String> _reduceReasons = [
    'Damaged products',
    'Expired products',
    'Theft / Missing stock',
    'Order fulfillment discrepancy',
    'Other',
  ];

  final List<String> _correctReasons = [
    'Physical audit count',
    'System mismatch',
    'Catalog correction',
    'Other',
  ];

  @override
  void initState() {
    super.initState();
    _quantityController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  List<String> get _currentReasons {
    switch (_selectedType) {
      case StockAdjustmentType.add:
        return _addReasons;
      case StockAdjustmentType.reduce:
        return _reduceReasons;
      case StockAdjustmentType.correct:
        return _correctReasons;
    }
  }

  int get _parsedQuantity => int.tryParse(_quantityController.text.trim()) ?? 0;

  int get _calculatedNewStock {
    final current = widget.product.currentStock;
    final qty = _parsedQuantity;
    switch (_selectedType) {
      case StockAdjustmentType.add:
        return current + qty;
      case StockAdjustmentType.reduce:
        return (current - qty).clamp(0, 999999);
      case StockAdjustmentType.correct:
        return qty;
    }
  }

  String get _calculationSummaryText {
    final current = widget.product.currentStock;
    final qty = _parsedQuantity;
    switch (_selectedType) {
      case StockAdjustmentType.add:
        return 'New stock will be added to the current quantity ($current + $qty = $_calculatedNewStock).';
      case StockAdjustmentType.reduce:
        return 'Stock will be deducted from the current quantity ($current - $qty = $_calculatedNewStock).';
      case StockAdjustmentType.correct:
        return 'Stock count will be updated directly to $_calculatedNewStock units.';
    }
  }

  Future<void> _pickExpiryDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedExpiryDate ?? now.add(const Duration(days: 30)),
      firstDate: now,
      lastDate: now.add(const Duration(days: 365 * 3)),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFF0F172A),
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: Color(0xFF0F172A),
            ),
            dialogBackgroundColor: Colors.white,
            scaffoldBackgroundColor: Colors.white,
            datePickerTheme: const DatePickerThemeData(
              backgroundColor: Colors.white,
              headerBackgroundColor: Colors.white,
              headerForegroundColor: Color(0xFF0F172A),
              surfaceTintColor: Colors.transparent,
              dividerColor: Color(0xFFE2E8F0),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _selectedExpiryDate = picked;
      });
    }
  }

  void _submitUpdate() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Stock for ${widget.product.name} updated to $_calculatedNewStock units!',
        ),
        backgroundColor: const Color(0xFF10B981),
      ),
    );
    Navigator.of(context).pop();
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
        title: const Text(
          'Update Stock',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Color(0xFF0F172A),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product Header Card
              _buildProductHeaderCard(),
              const SizedBox(height: 24),

              // Adjustment Type Header
              const Text(
                'Adjustment Type',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 12),

              // Adjustment Type Row (3 choices)
              _buildAdjustmentTypeRow(),
              const SizedBox(height: 24),

              // Quantity Input Field with Red Asterisk
              RichText(
                text: TextSpan(
                  text: _selectedType == StockAdjustmentType.correct
                      ? 'Corrected Quantity '
                      : 'Quantity to ${_selectedType == StockAdjustmentType.add ? "Add" : "Reduce"} ',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0F172A),
                  ),
                  children: const [
                    TextSpan(
                      text: '*',
                      style: TextStyle(
                        color: Color(0xFFEF4444),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              _buildQuantityInput(),
              const SizedBox(height: 20),

              // Reason Dropdown Field with Red Asterisk
              RichText(
                text: const TextSpan(
                  text: 'Reason ',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0F172A),
                  ),
                  children: [
                    TextSpan(
                      text: '*',
                      style: TextStyle(
                        color: Color(0xFFEF4444),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              _buildReasonDropdown(),
              const SizedBox(height: 20),

              // Expiry Date Field (Optional)
              RichText(
                text: const TextSpan(
                  text: 'Expiry Date ',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0F172A),
                  ),
                  children: [
                    TextSpan(
                      text: '(Optional)',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              _buildExpiryDateSelector(),
              const SizedBox(height: 20),

              // Dynamic Calculation Helper Card
              _buildCalculationHelperCard(),
              const SizedBox(height: 32),

              // Bottom Update Stock Button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: _submitUpdate,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD4F932),
                    foregroundColor: const Color(0xFF0F172A),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Update Stock',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProductHeaderCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Product thumbnail / image
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F9FF),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFBAE6FD)),
                ),
                child: const Center(
                  child: Icon(
                    Icons.local_drink_outlined,
                    color: Color(0xFF0284C7),
                    size: 30,
                  ),
                ),
              ),
              const SizedBox(width: 14),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.product.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      widget.product.categoryPath,
                      style: const TextStyle(
                        fontSize: 13,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Two Sub-Cards: Current Stock & Low Stock Alert
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Current Stock',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF3B82F6),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${widget.product.currentStock} units',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEFCE8),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Low Stock Alert',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFFD97706),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${widget.product.lowStockThreshold} units',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAdjustmentTypeRow() {
    return Row(
      children: StockAdjustmentType.values.map((type) {
        final isSelected = type == _selectedType;
        return Expanded(
          child: GestureDetector(
            onTap: () {
              setState(() {
                _selectedType = type;
                _selectedReason = _currentReasons.first;
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFFD4F932) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    width: 22,
                    height: 22,
                    child: SvgPicture.asset(
                      type.svgPath,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    type.label,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildQuantityInput() {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
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
                controller: _quantityController,
                keyboardType: TextInputType.number,
                textAlignVertical: TextAlignVertical.center,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0F172A),
                ),
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  errorBorder: InputBorder.none,
                  focusedErrorBorder: InputBorder.none,
                  isCollapsed: true,
                  contentPadding: EdgeInsets.zero,
                  hintText: '0',
                  hintStyle: TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                  ),
                  filled: false,
                  fillColor: Colors.transparent,
                ),
              ),
            ),
          ),
          const Text(
            'units',
            style: TextStyle(
              fontSize: 14,
              color: Color(0xFF94A3B8),
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReasonDropdown() {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _currentReasons.contains(_selectedReason)
              ? _selectedReason
              : _currentReasons.first,
          isExpanded: true,
          dropdownColor: Colors.white,
          borderRadius: BorderRadius.circular(14),
          icon: const Icon(Icons.keyboard_arrow_down, color: Color(0xFF64748B)),
          items: _currentReasons.map((reason) {
            return DropdownMenuItem<String>(
              value: reason,
              child: Text(
                reason,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF0F172A),
                ),
              ),
            );
          }).toList(),
          onChanged: (newVal) {
            if (newVal != null) {
              setState(() => _selectedReason = newVal);
            }
          },
        ),
      ),
    );
  }

  Widget _buildExpiryDateSelector() {
    final formattedDate = _selectedExpiryDate == null
        ? 'Select expiry date'
        : '${_selectedExpiryDate!.day.toString().padLeft(2, '0')}/${_selectedExpiryDate!.month.toString().padLeft(2, '0')}/${_selectedExpiryDate!.year}';

    return GestureDetector(
      onTap: _pickExpiryDate,
      child: Container(
        height: 52,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              formattedDate,
              style: TextStyle(
                fontSize: 14,
                color: _selectedExpiryDate == null
                    ? const Color(0xFF94A3B8)
                    : const Color(0xFF0F172A),
                fontWeight: _selectedExpiryDate == null
                    ? FontWeight.w400
                    : FontWeight.w500,
              ),
            ),
            SizedBox(
              width: 20,
              height: 20,
              child: SvgPicture.asset(
                'assets/svg/Calendar_Icon.svg',
                fit: BoxFit.contain,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCalculationHelperCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEB),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.access_time_rounded,
            size: 20,
            color: Color(0xFFD97706),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              _calculationSummaryText,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: Color(0xFF92400E),
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
