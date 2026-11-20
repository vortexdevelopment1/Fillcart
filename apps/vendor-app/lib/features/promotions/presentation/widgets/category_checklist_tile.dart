import 'package:flutter/material.dart';

class CategoryChecklistTile extends StatelessWidget {
  const CategoryChecklistTile({
    super.key,
    required this.name,
    required this.itemCount,
    required this.iconAsset,
    this.iconBgColor,
    required this.isChecked,
    required this.onToggle,
  });

  final String name;
  final int itemCount;
  final String iconAsset;
  final Color? iconBgColor;
  final bool isChecked;
  final ValueChanged<bool> onToggle;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => onToggle(!isChecked),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                // Cards Icon - 48x48 with no background color
                SizedBox(
                  width: 48,
                  height: 48,
                  child: Image.asset(
                    iconAsset,
                    width: 48,
                    height: 48,
                    fit: BoxFit.contain,
                    filterQuality: FilterQuality.high,
                  ),
                ),
                const SizedBox(width: 14),
                // Title
                Expanded(
                  child: Text(
                    '$name ($itemCount)',
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF111827),
                    ),
                  ),
                ),
                // Checkbox
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: isChecked
                        ? const Color(0xFF133E2B)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(
                      color: isChecked
                          ? const Color(0xFF133E2B)
                          : const Color(0xFFD1D5DB),
                      width: 1.5,
                    ),
                  ),
                  child: isChecked
                      ? const Icon(
                          Icons.check,
                          size: 16,
                          color: Colors.white,
                        )
                      : null,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
