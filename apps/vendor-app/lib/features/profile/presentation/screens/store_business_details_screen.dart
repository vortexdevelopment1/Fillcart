import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Screen for displaying and updating vendor Store & Business Details.
/// Matches Figma design: Store & Business Details (Image 3).
class StoreBusinessDetailsScreen extends StatefulWidget {
  const StoreBusinessDetailsScreen({super.key});

  @override
  State<StoreBusinessDetailsScreen> createState() =>
      _StoreBusinessDetailsScreenState();
}

class _StoreBusinessDetailsScreenState
    extends State<StoreBusinessDetailsScreen> {
  final TextEditingController _shopNameController =
      TextEditingController(text: 'Rakesh Mart');
  final TextEditingController _businessPhoneController =
      TextEditingController(text: '+91 2380697810');
  final TextEditingController _altPhoneController =
      TextEditingController(text: '+91 2380697810');
  final TextEditingController _businessEmailController =
      TextEditingController(text: 'Fillcartsvendor@gmail.com');

  final List<String> _categories = ['Beauty', 'Grocery'];
  final List<String> _subCategories = ['Beauty', 'Grocery'];

  @override
  void dispose() {
    _shopNameController.dispose();
    _businessPhoneController.dispose();
    _altPhoneController.dispose();
    _businessEmailController.dispose();
    super.dispose();
  }

  void _onSaveChanges() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Store & business details updated successfully!'),
        backgroundColor: Color(0xFF16A34A),
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
                color: const Color.fromRGBO(255, 255, 255, 0.36),
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
          'Store & Business Details',
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
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Section 1: Store Information
                    const Text(
                      'Store Information',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Shop Name*
                    _buildFieldLabel('Shop Name*'),
                    const SizedBox(height: 6),
                    _buildEditableField(
                      controller: _shopNameController,
                      keyboardType: TextInputType.text,
                    ),
                    const SizedBox(height: 14),

                    // Category*
                    _buildFieldLabel('Category*'),
                    const SizedBox(height: 6),
                    _buildPillSelectionField(
                      items: _categories,
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Select Category')),
                        );
                      },
                    ),
                    const SizedBox(height: 14),

                    // Sub Category*
                    _buildFieldLabel('Sub Category*'),
                    const SizedBox(height: 6),
                    _buildPillSelectionField(
                      items: _subCategories,
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Select Sub Category')),
                        );
                      },
                    ),
                    const SizedBox(height: 24),

                    // Section 2: Contact information
                    const Text(
                      'Contact information',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Business Mobile Number
                    _buildFieldLabel('Business Mobile Number'),
                    const SizedBox(height: 6),
                    _buildEditableField(
                      controller: _businessPhoneController,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 14),

                    // Alternate Mobile Number
                    _buildFieldLabel('Alternate Mobile Number'),
                    const SizedBox(height: 6),
                    _buildEditableField(
                      controller: _altPhoneController,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 14),

                    // Business Email
                    _buildFieldLabel('Business Email'),
                    const SizedBox(height: 6),
                    _buildEditableField(
                      controller: _businessEmailController,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),

            // Bottom Save Changes Button
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 16),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _onSaveChanges,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(26),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Save changes',
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

  Widget _buildFieldLabel(String label) {
    return Text(
      label,
      style: const TextStyle(
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: FontWeight.w700,
        color: Color(0xFF111827),
      ),
    );
  }

  Widget _buildEditableField({
    required TextEditingController controller,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFFD1D5DB),
          width: 1,
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
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
                controller: controller,
                keyboardType: keyboardType,
                textAlignVertical: TextAlignVertical.center,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF111827),
                ),
                decoration: const InputDecoration(
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
          SvgPicture.asset(
            AppAssets.svgEditPencil,
            width: 18,
            height: 18,
            colorFilter: const ColorFilter.mode(
              Color(0xFF4B5563),
              BlendMode.srcIn,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPillSelectionField({
    required List<String> items,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 56,
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6).withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: const Color(0xFFD1D5DB),
            width: 1,
          ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          children: [
            ...items.map(
              (item) => Padding(
                padding: const EdgeInsets.only(right: 8),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    item,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13.5,
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
            const Spacer(),
            const Icon(
              Icons.chevron_right_rounded,
              color: Color(0xFF111827),
              size: 22,
            ),
          ],
        ),
      ),
    );
  }
}
