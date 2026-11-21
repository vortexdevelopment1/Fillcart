import 'package:flutter/material.dart';

class PromotionTypeCard extends StatelessWidget {
  const PromotionTypeCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.iconAsset,
    this.iconBgColor,
    required this.isSelected,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final String iconAsset;
  final Color? iconBgColor;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected ? const Color(0xFFC8F169) : const Color(0xFFF3F4F6),
          width: 2,
        ),
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
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(14),
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
                // Text Column
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(height: 3),
                      SizedBox(
                        width: 210,
                        height: 39.75,
                        child: Text(
                          subtitle,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: Color(0xFF6B7280),
                            height: 1.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                // Radio Indicator
                Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? const Color(0xFFC8F169)
                          : const Color(0xFFD1D5DB),
                      width: 2,
                    ),
                  ),
                  child: isSelected
                      ? Center(
                          child: Container(
                            width: 10,
                            height: 10,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              color: Color(0xFFC8F169),
                            ),
                          ),
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
