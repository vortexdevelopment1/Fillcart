import 'package:flutter/material.dart';

/// More Insights row tile for Stock Movement, Order Distribution, Customer Demand.
class ProductInsightTile extends StatelessWidget {
  const ProductInsightTile({
    super.key,
    required this.title,
    required this.subtitle,
    required this.iconPath,
    this.onTap,
  });

  final String title;
  final String subtitle;
  final String iconPath;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Image.asset(
              iconPath,
              width: 40,
              height: 40,
              fit: BoxFit.contain,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontWeight: FontWeight.bold,
                      fontSize: 14.5,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12,
                      color: Color(0xFF9CA3AF),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: Color(0xFF9CA3AF),
              size: 22,
            ),
          ],
        ),
      ),
    );
  }
}
