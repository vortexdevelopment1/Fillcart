import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/category_model.dart';
import 'custom_checkbox.dart';

/// Bottom sheet modal to select business categories (Image 4).
class CategorySelectionBottomSheet extends StatefulWidget {
  final List<String> initialSelectedIds;
  final ValueChanged<List<String>> onApply;

  const CategorySelectionBottomSheet({
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
      builder: (ctx) => CategorySelectionBottomSheet(
        initialSelectedIds: initialSelectedIds,
        onApply: (selected) => Navigator.of(ctx).pop(selected),
      ),
    );
  }

  @override
  State<CategorySelectionBottomSheet> createState() =>
      _CategorySelectionBottomSheetState();
}

class _CategorySelectionBottomSheetState
    extends State<CategorySelectionBottomSheet> {
  late final Set<String> _selectedIds;

  @override
  void initState() {
    super.initState();
    _selectedIds = Set.from(widget.initialSelectedIds);
  }

  void _toggleCategory(String id) {
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

    return Container(
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
            'Select categories',
            style: GoogleFonts.inter(
              fontSize: 18.0,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 16.0),

          // White Container with category options
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16.0),
              child: Column(
                children: [
                  for (int i = 0;
                      i < CategoryItem.defaultCategories.length;
                      i++) ...[
                    _buildCategoryRow(CategoryItem.defaultCategories[i]),
                    if (i < CategoryItem.defaultCategories.length - 1)
                      const Divider(
                        height: 1.0,
                        thickness: 1.0,
                        color: Color(0xFFF1F5F9),
                        indent: 16.0,
                        endIndent: 16.0,
                      ),
                  ],
                ],
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

  Widget _buildCategoryRow(CategoryItem item) {
    final isSelected = _selectedIds.contains(item.id);

    return InkWell(
      onTap: () => _toggleCategory(item.id),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
        child: Row(
          children: [
            if (item.emoji != null) ...[
              Text(
                item.emoji!,
                style: const TextStyle(fontSize: 18.0),
              ),
              const SizedBox(width: 12.0),
            ],
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
              onChanged: (_) => _toggleCategory(item.id),
            ),
          ],
        ),
      ),
    );
  }
}
