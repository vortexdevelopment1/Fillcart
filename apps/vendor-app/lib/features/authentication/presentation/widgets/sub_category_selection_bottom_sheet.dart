import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/category_model.dart';
import 'custom_checkbox.dart';

/// Bottom sheet modal to select business sub-categories (Image 5).
class SubCategorySelectionBottomSheet extends StatefulWidget {
  final List<String> initialSelectedIds;
  final ValueChanged<List<String>> onApply;

  const SubCategorySelectionBottomSheet({
    super.key,
    required this.initialSelectedIds,
    required this.onApply,
  });

  static Future<List<String>?> show(
    BuildContext context, {
    required List<String> initialSelectedIds,
  }) {
    return showModalBottomSheet<List<String>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => SubCategorySelectionBottomSheet(
        initialSelectedIds: initialSelectedIds,
        onApply: (selected) => Navigator.of(ctx).pop(selected),
      ),
    );
  }

  @override
  State<SubCategorySelectionBottomSheet> createState() =>
      _SubCategorySelectionBottomSheetState();
}

class _SubCategorySelectionBottomSheetState
    extends State<SubCategorySelectionBottomSheet> {
  late final Set<String> _selectedIds;

  @override
  void initState() {
    super.initState();
    _selectedIds = Set.from(widget.initialSelectedIds);
  }

  void _toggleSubCategory(String id) {
    setState(() {
      if (_selectedIds.contains(id)) {
        _selectedIds.remove(id);
      } else {
        _selectedIds.add(id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final paddingBottom = MediaQuery.of(context).padding.bottom;
    final maxHeight = MediaQuery.of(context).size.height * 0.85;

    return Container(
      constraints: BoxConstraints(maxHeight: maxHeight),
      decoration: const BoxDecoration(
        color: Color(0xFFF1F5F9),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28.0)),
      ),
      padding: EdgeInsets.fromLTRB(20.0, 12.0, 20.0, 20.0 + paddingBottom + bottomInset),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 48.0,
              height: 4.5,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(3.0),
              ),
            ),
          ),
          const SizedBox(height: 18.0),

          // Title
          Text(
            'Select Sub Categories',
            style: GoogleFonts.inter(
              fontSize: 18.0,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 16.0),

          // White Container with scrollable sub-category options
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16.0),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16.0),
                child: ListView.separated(
                  itemCount: CategoryItem.defaultSubCategories.length,
                  separatorBuilder: (context, index) => const Divider(
                    height: 1.0,
                    thickness: 1.0,
                    color: Color(0xFFF1F5F9),
                    indent: 16.0,
                    endIndent: 16.0,
                  ),
                  itemBuilder: (context, index) {
                    return _buildSubCategoryRow(
                      CategoryItem.defaultSubCategories[index],
                    );
                  },
                ),
              ),
            ),
          ),
          const SizedBox(height: 20.0),

          // Apply Button
          SizedBox(
            width: double.infinity,
            height: 52.0,
            child: ElevatedButton(
              onPressed: () => widget.onApply(_selectedIds.toList()),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF000000),
                foregroundColor: Colors.white,
                elevation: 0,
                shape: const StadiumBorder(),
              ),
              child: Text(
                'Apply (${_selectedIds.length})',
                style: GoogleFonts.inter(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubCategoryRow(CategoryItem item) {
    final isSelected = _selectedIds.contains(item.id);

    return InkWell(
      onTap: () => _toggleSubCategory(item.id),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        child: Row(
          children: [
            // Circular avatar container
            Container(
              width: 34.0,
              height: 34.0,
              decoration: const BoxDecoration(
                color: Color(0xFFF1F5F9),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: item.iconData != null
                  ? Icon(
                      item.iconData,
                      size: 18.0,
                      color: const Color(0xFF0F172A),
                    )
                  : Text(
                      item.emoji ?? '•',
                      style: const TextStyle(fontSize: 16.0),
                    ),
            ),
            const SizedBox(width: 12.0),
            Expanded(
              child: Text(
                item.name,
                style: GoogleFonts.inter(
                  fontSize: 15.0,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF0F172A),
                ),
              ),
            ),
            CustomCheckbox(
              value: isSelected,
              onChanged: (_) => _toggleSubCategory(item.id),
            ),
          ],
        ),
      ),
    );
  }
}
