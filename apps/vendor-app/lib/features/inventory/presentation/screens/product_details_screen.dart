import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'pricing_and_inventory_screen.dart';

/// Screen 3: Product Details (matching Image 3)
class ProductDetailsScreen extends StatefulWidget {
  final String? initialCategory;
  final String? initialSubcategory;
  final String? initialBrand;
  final String? initialProductName;
  final String? initialUnitPackSize;
  final String buttonText;
  final bool showPreviewCard;

  const ProductDetailsScreen({
    super.key,
    this.initialCategory,
    this.initialSubcategory,
    this.initialBrand,
    this.initialProductName,
    this.initialUnitPackSize,
    this.buttonText = 'Next',
    this.showPreviewCard = true,
  });

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  late final TextEditingController _categoryController;
  late final TextEditingController _subcategoryController;
  late final TextEditingController _brandController;
  late final TextEditingController _productNameController;
  late final TextEditingController _unitPackSizeController;

  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _categoryController = TextEditingController(
      text: widget.initialCategory ?? 'Grocery',
    );
    _subcategoryController = TextEditingController(
      text: widget.initialSubcategory ?? 'Dairy',
    );
    _brandController = TextEditingController(
      text: widget.initialBrand ?? 'Amul',
    );
    _productNameController = TextEditingController(
      text: widget.initialProductName ?? 'Amul Taaza Milk (1 L)',
    );
    _unitPackSizeController = TextEditingController(
      text: widget.initialUnitPackSize ?? '1 L',
    );
  }

  @override
  void dispose() {
    _categoryController.dispose();
    _subcategoryController.dispose();
    _brandController.dispose();
    _productNameController.dispose();
    _unitPackSizeController.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_formKey.currentState?.validate() ?? false) {
      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => PricingAndInventoryScreen(
            productName: _productNameController.text.trim().isNotEmpty
                ? _productNameController.text.trim()
                : 'Amul Taaza Milk (1 L)',
            brand: _brandController.text.trim().isNotEmpty
                ? _brandController.text.trim()
                : 'Amul',
            category: _categoryController.text.trim().isNotEmpty
                ? _categoryController.text.trim()
                : 'Grocery',
            subCategory: _subcategoryController.text.trim().isNotEmpty
                ? _subcategoryController.text.trim()
                : 'Dairy',
            unitPackSize: _unitPackSizeController.text.trim().isNotEmpty
                ? _unitPackSizeController.text.trim()
                : '1 L',
          ),
        ),
      );
    }
  }

  Widget _buildSvg({
    required String primaryPath,
    required String fallbackPath,
    required double width,
    required double height,
    Color? color,
    IconData fallbackIcon = Icons.image_outlined,
  }) {
    return SvgPicture.asset(
      primaryPath,
      width: width,
      height: height,
      colorFilter: color != null
          ? ColorFilter.mode(color, BlendMode.srcIn)
          : null,
      placeholderBuilder: (_) => SvgPicture.asset(
        fallbackPath,
        width: width,
        height: height,
        colorFilter: color != null
            ? ColorFilter.mode(color, BlendMode.srcIn)
            : null,
        placeholderBuilder: (_) => Icon(
          fallbackIcon,
          size: width,
          color: color ?? const Color(0xFF111827),
        ),
      ),
    );
  }

  Widget _buildField({
    required String label,
    required TextEditingController controller,
    bool isRequired = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
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
            validator: (value) {
              if (isRequired && (value == null || value.trim().isEmpty)) {
                return 'Please enter $label';
              }
              return null;
            },
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
                color: const Color.fromRGBO(255, 255, 255, 0.36),
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
          'Product Details',
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
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product Images Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          RichText(
                            text: const TextSpan(
                              text: 'Product Images',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 15,
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
                                    fontSize: 15,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Text(
                            '1 of 4 uploaded',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 13,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF6B7280),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Photos row: Add Photo & Back View
                      Row(
                        children: [
                          // Card 1: Add Photo
                          GestureDetector(
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Add photo clicked',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      color: Colors.white,
                                    ),
                                  ),
                                  backgroundColor: Color(0xFF111827),
                                  duration: Duration(seconds: 1),
                                ),
                              );
                            },
                            child: Container(
                              width: 104,
                              height: 104,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: const Color(0xFFE5E7EB),
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF1F5F9),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Center(
                                      child: _buildSvg(
                                        primaryPath: 'assets/svg/add_photos.svg',
                                        fallbackPath: 'assets/svg/add photos.svg',
                                        width: 22,
                                        height: 22,
                                        color: const Color(0xFF047857),
                                        fallbackIcon: Icons.camera_alt_outlined,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Add Photo',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF047857),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),

                          // Card 2: Back View
                          GestureDetector(
                            onTap: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Back view clicked',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      color: Colors.white,
                                    ),
                                  ),
                                  backgroundColor: Color(0xFF111827),
                                  duration: Duration(seconds: 1),
                                ),
                              );
                            },
                            child: Container(
                              width: 104,
                              height: 104,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: const Color(0xFFE5E7EB),
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF8FAFC),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Center(
                                      child: _buildSvg(
                                        primaryPath: 'assets/svg/back_view.svg',
                                        fallbackPath: 'assets/svg/back view.svg',
                                        width: 22,
                                        height: 22,
                                        color: const Color(0xFF9CA3AF),
                                        fallbackIcon: Icons.image_outlined,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Back View',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 12,
                                      fontWeight: FontWeight.w400,
                                      color: Color(0xFF9CA3AF),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Conversion Tip Banner
                      const Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            Icons.verified_outlined,
                            size: 16,
                            color: Color(0xFF047857),
                          ),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'High-resolution photos with clear product labels convert 35% faster.',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 12,
                                fontWeight: FontWeight.w400,
                                color: Color(0xFF111827),
                                height: 1.3,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Scanned / Preview Product Card
                      if (widget.showPreviewCard) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
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
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                clipBehavior: Clip.antiAlias,
                                child: Image.asset(
                                  'assets/cardsicon/amul_milk.png',
                                  fit: BoxFit.contain,
                                  errorBuilder: (context, error, stackTrace) =>
                                      const Center(
                                    child: Icon(
                                      Icons.local_drink_outlined,
                                      color: Color(0xFF111827),
                                      size: 24,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Amul Taaza Milk (1 L)',
                                      style: TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 15,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFF111827),
                                      ),
                                    ),
                                    SizedBox(height: 2),
                                    Text(
                                      'Amul',
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
                              Padding(
                                padding: const EdgeInsets.only(right: 4),
                                child: _buildSvg(
                                  primaryPath:
                                      'assets/svg/edit title and brand.svg',
                                  fallbackPath:
                                      'assets/svg/edit_title_and_brand.svg',
                                  width: 18,
                                  height: 18,
                                  color: const Color(0xFF6B7280),
                                  fallbackIcon: Icons.edit_outlined,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 18),
                      ],

                      // Form Fields
                      _buildField(
                        label: 'Category',
                        controller: _categoryController,
                        isRequired: true,
                      ),
                      const SizedBox(height: 14),

                      _buildField(
                        label: 'Subcategory',
                        controller: _subcategoryController,
                        isRequired: true,
                      ),
                      const SizedBox(height: 14),

                      _buildField(
                        label: 'Brand',
                        controller: _brandController,
                        isRequired: false,
                      ),
                      const SizedBox(height: 14),

                      _buildField(
                        label: 'Product Name',
                        controller: _productNameController,
                        isRequired: true,
                      ),
                      const SizedBox(height: 14),

                      _buildField(
                        label: 'Unit / Pack Size',
                        controller: _unitPackSizeController,
                        isRequired: false,
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom Next / Continue Button
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _onNext,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC8F169),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    widget.buttonText,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
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
    );
  }
}
