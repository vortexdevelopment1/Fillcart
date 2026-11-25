import 'package:flutter/material.dart';

/// Top pill-shaped segmented switcher matching the "Products (324) | Inventory" Figma design.
///
/// Figma Specifications (Image 4):
/// - Flow: Horizontal
/// - Width: Fill (328px)
/// - Height: Hug (48px)
/// - Radius: 9999px (stadium border)
/// - Padding: 4px
/// - Active Pill: #C8F169 with dark text #111827 (fontFamily: Inter, fontSize: 14.5, w700)
/// - Inactive Pill: transparent with cool grey text #6B7280 (fontFamily: Inter, fontSize: 14.5, w500)
class SegmentedTabSwitch extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onTabChanged;
  final String firstTabLabel;
  final String secondTabLabel;

  const SegmentedTabSwitch({
    super.key,
    required this.selectedIndex,
    required this.onTabChanged,
    this.firstTabLabel = 'Products (324)',
    this.secondTabLabel = 'Inventory',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(9999),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: [
          Expanded(
            child: _TabButton(
              label: firstTabLabel,
              isSelected: selectedIndex == 0,
              onTap: () => onTabChanged(0),
            ),
          ),
          Expanded(
            child: _TabButton(
              label: secondTabLabel,
              isSelected: selectedIndex == 1,
              onTap: () => onTabChanged(1),
            ),
          ),
        ],
      ),
    );
  }
}

class _TabButton extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _TabButton({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFC8F169) : Colors.transparent,
          borderRadius: BorderRadius.circular(9999),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 14.5,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected ? const Color(0xFF111827) : const Color(0xFF6B7280),
          ),
        ),
      ),
    );
  }
}
