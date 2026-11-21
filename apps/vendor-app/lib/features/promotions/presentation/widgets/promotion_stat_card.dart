import 'package:flutter/material.dart';

class PromotionStatCard extends StatelessWidget {
  const PromotionStatCard({
    super.key,
    required this.label,
    this.value,
    this.badgeText,
    this.badgeBgColor,
    this.badgeTextColor,
  });

  final String label;
  final String? value;
  final String? badgeText;
  final Color? badgeBgColor;
  final Color? badgeTextColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 66,
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          if (badgeText != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: badgeBgColor ?? const Color(0xFFD1FADF),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                badgeText!,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: badgeTextColor ?? const Color(0xFF027A48),
                ),
              ),
            )
          else if (value != null)
            Text(
              value!,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 17,
                fontWeight: FontWeight.w600,
                color: Color(0xFF111827),
              ),
            ),
          const SizedBox(height: 3),
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 11,
              color: Color(0xFF6B7280),
              fontWeight: FontWeight.w400,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
