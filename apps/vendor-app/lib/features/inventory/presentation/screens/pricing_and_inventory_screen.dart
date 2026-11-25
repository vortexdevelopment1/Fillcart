import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/core/widgets/vendor_toggle_switch.dart';
import 'preview_and_publish_screen.dart';

/// Screen 3 in Add Product Flow: Pricing & Inventory (matching Figma Image 3)
class PricingAndInventoryScreen extends StatefulWidget {
  final String productName;
  final String brand;
  final String category;
  final String subCategory;
  final String unitPackSize;
  final double initialMrp;
  final double initialSellingPrice;
  final int initialStock;
  final int initialLowStockAlert;
  final String initialGst;
  final bool initialAvailability;

  const PricingAndInventoryScreen({
    super.key,
    this.productName = 'Amul Taaza Milk (1 L)',
    this.brand = 'Amul',
    this.category = 'Grocery',
    this.subCategory = 'Dairy',
    this.unitPackSize = '1 L',
    this.initialMrp = 72.0,
    this.initialSellingPrice = 68.0,
    this.initialStock = 120,
    this.initialLowStockAlert = 10,
    this.initialGst = '5%',
    this.initialAvailability = true,
  });

  @override
  State<PricingAndInventoryScreen> createState() =>
      _PricingAndInventoryScreenState();
}

class _PricingAndInventoryScreenState extends State<PricingAndInventoryScreen> {
  late final TextEditingController _mrpController;
  late final TextEditingController _sellingPriceController;
  late final TextEditingController _stockQuantityController;
  late final TextEditingController _lowStockAlertController;

  late String _selectedGst;
  late bool _isAvailable;

  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _mrpController = TextEditingController(
      text: widget.initialMrp.toStringAsFixed(0),
    );
    _sellingPriceController = TextEditingController(
      text: widget.initialSellingPrice.toStringAsFixed(0),
    );
    _stockQuantityController = TextEditingController(
      text: widget.initialStock.toString(),
    );
    _lowStockAlertController = TextEditingController(
      text: widget.initialLowStockAlert.toString(),
    );
    _selectedGst = widget.initialGst;
    _isAvailable = widget.initialAvailability;
  }

  @override
  void dispose() {
    _mrpController.dispose();
    _sellingPriceController.dispose();
    _stockQuantityController.dispose();
    _lowStockAlertController.dispose();
    super.dispose();
  }

  String get _discountText {
    final mrp = double.tryParse(_mrpController.text) ?? 72.0;
    final sp = double.tryParse(_sellingPriceController.text) ?? 68.0;
    if (mrp == 72.0 && sp == 68.0) {
      return '5.5% off';
    }
    if (mrp > 0 && sp > 0 && mrp > sp) {
      final discount = ((mrp - sp) / mrp) * 100;
      return '${discount.toStringAsFixed(1)}% off';
    }
    return '5.5% off';
  }

  void _onNext() {
    if (_formKey.currentState?.validate() ?? true) {
      final mrp = double.tryParse(_mrpController.text) ?? 72.0;
      final sp = double.tryParse(_sellingPriceController.text) ?? 68.0;
      final stock = int.tryParse(_stockQuantityController.text) ?? 120;

      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => PreviewAndPublishScreen(
            productName: widget.productName,
            brand: widget.brand,
            category: widget.category,
            subCategory: widget.subCategory,
            unitPackSize: widget.unitPackSize,
            mrp: mrp,
            sellingPrice: sp,
            stock: stock,
            gst: _selectedGst,
            isAvailable: _isAvailable,
          ),
        ),
      );
    }
  }

  Widget _buildField({
    required String label,
    required TextEditingController controller,
    bool isRequired = false,
    Widget? trailingHeader,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            RichText(
              text: TextSpan(
                text: label,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
                children: [
                  if (isRequired)
                    const TextSpan(
                      text: ' *',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        color: Color(0xFFEF4444),
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                ],
              ),
            ),
            if (trailingHeader != null) ...[
              const SizedBox(width: 6),
              trailingHeader,
            ],
          ],
        ),
        const SizedBox(height: 8),
        Container(
          height: 52,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: const Color(0xFFE5E7EB),
            ),
          ),
          alignment: Alignment.centerLeft,
          child: TextFormField(
            controller: controller,
            keyboardType: TextInputType.number,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 15,
              fontWeight: FontWeight.w500,
              color: Color(0xFF111827),
            ),
            decoration: const InputDecoration(
              isDense: true,
              contentPadding: EdgeInsets.symmetric(vertical: 14),
              filled: false,
              fillColor: Colors.transparent,
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              errorBorder: InputBorder.none,
              focusedErrorBorder: InputBorder.none,
            ),
            onChanged: (_) => setState(() {}),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        toolbarHeight: 52,
        leadingWidth: 52,
        centerTitle: false,
        titleSpacing: 12,
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
                    spreadRadius: 0,
                    color: Color(0x1A000000),
                  ),
                ],
              ),
              child: IconButton(
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
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ),
        title: const Text(
          'Pricing & Inventory',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827),
            height: 28 / 20,
            letterSpacing: -0.2,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // MRP & Selling Price Row
                      Row(
                        children: [
                          Expanded(
                            child: _buildField(
                              label: 'MRP (₹)',
                              controller: _mrpController,
                              isRequired: true,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildField(
                              label: 'Selling Price (₹)',
                              controller: _sellingPriceController,
                              isRequired: true,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Discount Banner
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFBBF7D0),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.local_offer_outlined,
                              size: 18,
                              color: Color(0xFF047857),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'Discount',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF047857),
                              ),
                            ),
                            const Spacer(),
                            Text(
                              _discountText,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF047857),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Tax (GST) Dropdown Field
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          RichText(
                            text: const TextSpan(
                              text: 'Tax (GST)',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF111827),
                              ),
                              children: [
                                TextSpan(
                                  text: ' *',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    color: Color(0xFFEF4444),
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            height: 52,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(
                                color: const Color(0xFFE5E7EB),
                              ),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedGst,
                                isExpanded: true,
                                icon: const Icon(
                                  Icons.keyboard_arrow_down_rounded,
                                  color: Color(0xFF4B5563),
                                  size: 22,
                                ),
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF111827),
                                ),
                                items: const [
                                  DropdownMenuItem(
                                    value: '0%',
                                    child: Text('0%'),
                                  ),
                                  DropdownMenuItem(
                                    value: '5%',
                                    child: Text('5%'),
                                  ),
                                  DropdownMenuItem(
                                    value: '12%',
                                    child: Text('12%'),
                                  ),
                                  DropdownMenuItem(
                                    value: '18%',
                                    child: Text('18%'),
                                  ),
                                  DropdownMenuItem(
                                    value: '28%',
                                    child: Text('28%'),
                                  ),
                                ],
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() {
                                      _selectedGst = value;
                                    });
                                  }
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Stock Quantity Field
                      _buildField(
                        label: 'Stock Quantity',
                        controller: _stockQuantityController,
                        isRequired: true,
                      ),
                      const SizedBox(height: 16),

                      // Low Stock Alert (Optional) Field
                      _buildField(
                        label: 'Low Stock Alert (Optional)',
                        controller: _lowStockAlertController,
                        isRequired: false,
                        trailingHeader: const Icon(
                          Icons.info_outline,
                          size: 16,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Availability Toggle Row
                      Row(
                        children: [
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Availability',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF111827),
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Show this product in your store',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 13,
                                  fontWeight: FontWeight.w400,
                                  color: Color(0xFF6B7280),
                                ),
                              ),
                            ],
                          ),
                          const Spacer(),
                          VendorToggleSwitch(
                            value: _isAvailable,
                            onChanged: (val) {
                              setState(() {
                                _isAvailable = val;
                              });
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // Variants (Optional) Card
                      InkWell(
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Variants manager opening...',
                                style: TextStyle(fontFamily: 'Inter'),
                              ),
                              backgroundColor: Color(0xFF111827),
                              duration: Duration(seconds: 1),
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: const Color(0xFFE5E7EB),
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: const Color(0xFFE5E7EB),
                                  ),
                                ),
                                child: const Center(
                                  child: Icon(
                                    Icons.layers_outlined,
                                    size: 22,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    RichText(
                                      text: const TextSpan(
                                        text: 'Variants ',
                                        style: TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 15,
                                          fontWeight: FontWeight.w700,
                                          color: Color(0xFF111827),
                                        ),
                                        children: [
                                          TextSpan(
                                            text: '(Optional)',
                                            style: TextStyle(
                                              fontFamily: 'Inter',
                                              fontSize: 13,
                                              fontWeight: FontWeight.w400,
                                              color: Color(0xFF6B7280),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    const Text(
                                      'Add size, pack, etc.',
                                      style: TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 13,
                                        fontWeight: FontWeight.w400,
                                        color: Color(0xFF6B7280),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(
                                Icons.chevron_right,
                                color: Color(0xFF9CA3AF),
                                size: 22,
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Next Button
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _onNext,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Next',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
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
