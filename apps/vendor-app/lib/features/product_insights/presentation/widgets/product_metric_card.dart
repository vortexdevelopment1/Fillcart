import 'package:flutter/material.dart';

/// Metric Card for Product Insights 3-column performance row.
class ProductMetricCard extends StatelessWidget {
  const ProductMetricCard({
    super.key,
    required this.value,
    required this.label,
    this.badgeText,
    this.isPositive = true,
  });

  final String value;
  final String label;
  final String? badgeText;
  final bool isPositive;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 95,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            value,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF111827),
              letterSpacing: -0.3,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Color(0xFF9CA3AF),
            ),
            textAlign: TextAlign.center,
          ),
          if (badgeText != null) ...[
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isPositive
                    ? const Color(0xFFD1FADF)
                    : const Color(0xFFFFE4E6),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                badgeText!,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 10.5,
                  fontWeight: FontWeight.bold,
                  color: isPositive
                      ? const Color(0xFF027A48)
                      : const Color(0xFFB42318),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
