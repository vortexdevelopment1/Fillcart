import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/category_model.dart';
import '../widgets/category_selection_bottom_sheet.dart';
import '../widgets/sub_category_selection_bottom_sheet.dart';
import 'store_details_screen.dart';

/// Screen 3: "Business Information (Step 1/5)" (Image 3).
class BusinessInformationScreen extends StatefulWidget {
  final String phoneNumber;
  final Widget? nextScreen;
  final bool isEditing;
  final String? initialStoreName;
  final String? initialOwnerName;

  const BusinessInformationScreen({
    super.key,
    this.phoneNumber = '+91 98658147958',
    this.nextScreen,
    this.isEditing = false,
    this.initialStoreName,
    this.initialOwnerName,
  });

  @override
  State<BusinessInformationScreen> createState() =>
      _BusinessInformationScreenState();
}

class _BusinessInformationScreenState extends State<BusinessInformationScreen> {
  final TextEditingController _storeNameController = TextEditingController();
  final TextEditingController _ownerNameController = TextEditingController();

  List<String> _selectedCategoryIds = ['grocery', 'beauty'];
  List<String> _selectedSubCategoryIds = [
    'fruits_vegetables',
    'atta_rice_oil_dals',
    'masala_dry_fruits_more',
    'breakfast_sauces',
    'meats_fish_chicken_eggs',
    'packaged_food',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialStoreName != null) {
      _storeNameController.text = widget.initialStoreName!;
    }
    if (widget.initialOwnerName != null) {
      _ownerNameController.text = widget.initialOwnerName!;
    }
  }

  @override
  void dispose() {
    _storeNameController.dispose();
    _ownerNameController.dispose();
    super.dispose();
  }

  String get _categoryDisplayText {
    if (_selectedCategoryIds.isEmpty) {
      return '';
    }
    final names = _selectedCategoryIds.map((id) {
      final match = CategoryItem.defaultCategories.firstWhere(
        (c) => c.id == id,
        orElse: () => CategoryItem(id: id, name: id),
      );
      return match.name;
    }).toList();
    return names.join(', ');
  }

  String get _subCategoryDisplayText {
    if (_selectedSubCategoryIds.isEmpty) {
      return '';
    }
    final names = _selectedSubCategoryIds.map((id) {
      final match = CategoryItem.defaultSubCategories.firstWhere(
        (c) => c.id == id,
        orElse: () => CategoryItem(id: id, name: id),
      );
      return match.name;
    }).toList();
    return names.join(', ');
  }

  Future<void> _openCategorySheet() async {
    final result = await CategorySelectionBottomSheet.show(
      context,
      initialSelectedIds: _selectedCategoryIds,
    );
    if (result != null && mounted) {
      setState(() => _selectedCategoryIds = result);
    }
  }

  Future<void> _openSubCategorySheet() async {
    final result = await SubCategorySelectionBottomSheet.show(
      context,
      initialSelectedIds: _selectedSubCategoryIds,
    );
    if (result != null && mounted) {
      setState(() => _selectedSubCategoryIds = result);
    }
  }

  void _onContinue() {
    if (widget.isEditing) {
      Navigator.of(context).pop<Map<String, dynamic>>({
        'storeName': _storeNameController.text.isNotEmpty
            ? _storeNameController.text
            : (widget.initialStoreName ?? 'Fresh Mart Supermarket'),
        'ownerName': _ownerNameController.text.isNotEmpty
            ? _ownerNameController.text
            : (widget.initialOwnerName ?? 'Gopal Yadav'),
        'category': _categoryDisplayText.isNotEmpty
            ? _categoryDisplayText
            : 'Grocery, Beauty',
        'subCategory': _subCategoryDisplayText.isNotEmpty
            ? _subCategoryDisplayText
            : 'Fruits & Vegetables',
      });
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => widget.nextScreen ??
            StoreDetailsScreen(
              storeName: _storeNameController.text.isNotEmpty
                  ? _storeNameController.text
                  : 'Fresh Mart Supermarket',
              ownerName: _ownerNameController.text.isNotEmpty
                  ? _ownerNameController.text
                  : 'Gopal Yadav',
              category: _categoryDisplayText.isNotEmpty
                  ? _categoryDisplayText
                  : 'Grocery, Beauty',
              subCategory: _subCategoryDisplayText.isNotEmpty
                  ? _subCategoryDisplayText
                  : 'Fruits & Vegetables',
            ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final paddingBottom = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFEDEDED),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 28.0),

              // Header: Title & Step Indicator "1/5"
              Row(
                children: [
                  if (widget.isEditing) ...[
                    GestureDetector(
                      onTap: () => Navigator.of(context).pop(),
                      child: const Padding(
                        padding: EdgeInsets.only(right: 12.0),
                        child: Icon(
                          Icons.arrow_back,
                          size: 24.0,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                  ],
                  Expanded(
                    child: Text(
                      'Business Information',
                      style: GoogleFonts.inter(
                        fontSize: 24.0,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                  Text(
                    '1/5',
                    style: GoogleFonts.inter(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14.0),

              // 5-segment Progress Bar
              Row(
                children: List.generate(5, (index) {
                  final isActive = index == 0;
                  return Expanded(
                    child: Container(
                      height: 5.5,
                      margin: EdgeInsets.only(right: index < 4 ? 6.0 : 0.0),
                      decoration: BoxDecoration(
                        color: isActive
                            ? const Color(0xFFD4F038)
                            : const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(3.0),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 28.0),

              // Store Name (AS ON BOARD)
              RichText(
                text: TextSpan(
                  style: GoogleFonts.inter(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF0F172A),
                  ),
                  children: [
                    const TextSpan(text: 'Store Name '),
                    TextSpan(
                      text: '(AS ON BOARD)',
                      style: GoogleFonts.inter(
                        fontSize: 13.0,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _storeNameController,
                hintText: 'Fresh Mart Supermarket',
              ),
              const SizedBox(height: 20.0),

              // Owner Full Name
              Text(
                'Owner Full Name',
                style: GoogleFonts.inter(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _ownerNameController,
                hintText: 'Gopal Yadav',
              ),
              const SizedBox(height: 20.0),

              // Store Contact Number (Verified Container)
              Text(
                'Store Contact Number',
                style: GoogleFonts.inter(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8.0),
              Container(
                height: 56.0,
                decoration: BoxDecoration(
                  color: const Color(0xFFF7FEE7),
                  borderRadius: BorderRadius.circular(14.0),
                  border: Border.all(
                    color: const Color(0xFFD4F038),
                    width: 1.5,
                  ),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        widget.phoneNumber,
                        style: GoogleFonts.inter(
                          fontSize: 16.0,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14.0,
                        vertical: 6.0,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD4F038),
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      child: Text(
                        'Verified',
                        style: GoogleFonts.inter(
                          fontSize: 12.0,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF0F172A),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20.0),

              // Category Selector
              Text(
                'Category',
                style: GoogleFonts.inter(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8.0),
              _buildSelectorContainer(
                displayText: _categoryDisplayText,
                placeholder: 'Enter Business Category',
                onTap: _openCategorySheet,
              ),
              const SizedBox(height: 20.0),

              // Sub Category Selector
              Text(
                'Sub Category',
                style: GoogleFonts.inter(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8.0),
              _buildSelectorContainer(
                displayText: _subCategoryDisplayText,
                placeholder: 'Enter sub Category',
                onTap: _openSubCategorySheet,
              ),
              const SizedBox(height: 36.0),

              // Continue Button
              SizedBox(
                width: double.infinity,
                height: 56.0,
                child: ElevatedButton(
                  onPressed: _onContinue,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: const StadiumBorder(),
                  ),
                  child: Text(
                    'Continue',
                    style: GoogleFonts.inter(
                      fontSize: 17.0,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20.0 + paddingBottom),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextInputContainer({
    required TextEditingController controller,
    required String hintText,
  }) {
    return Container(
      height: 56.0,
      decoration: BoxDecoration(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(14.0),
        border: Border.all(
          color: const Color(0xFF71717A),
          width: 1.0,
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      alignment: Alignment.centerLeft,
      child: TextField(
        controller: controller,
        style: GoogleFonts.inter(
          fontSize: 15.5,
          fontWeight: FontWeight.w400,
          color: const Color(0xFF0F172A),
        ),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: GoogleFonts.inter(
            fontSize: 15.5,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF64748B),
          ),
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
    );
  }

  Widget _buildSelectorContainer({
    required String displayText,
    required String placeholder,
    required VoidCallback onTap,
  }) {
    final hasText = displayText.isNotEmpty;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        height: 56.0,
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(14.0),
          border: Border.all(
            color: const Color(0xFF71717A),
            width: 1.0,
          ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Row(
          children: [
            Expanded(
              child: Text(
                hasText ? displayText : placeholder,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.inter(
                  fontSize: 15.5,
                  fontWeight: FontWeight.w400,
                  color: hasText
                      ? const Color(0xFF0F172A)
                      : const Color(0xFF64748B),
                ),
              ),
            ),
            const SizedBox(width: 8.0),
            const Icon(
              Icons.keyboard_arrow_down_rounded,
              color: Color(0xFF64748B),
              size: 26.0,
            ),
          ],
        ),
      ),
    );
  }
}
