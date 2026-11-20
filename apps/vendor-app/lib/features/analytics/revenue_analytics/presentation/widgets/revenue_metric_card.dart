import 'package:flutter/material.dart';

/// Metric Card for Revenue Analytics 2x2 grid.
class RevenueMetricCard extends StatelessWidget {
  const RevenueMetricCard({
    super.key,
    required this.title,
    required this.value,
    required this.badgeText,
    required this.iconPath,
    required this.backgroundColor,
    required this.isPositive,
  });

  final String title;
  final String value;
  final String badgeText;
  final String iconPath;
  final Color backgroundColor;
  final bool isPositive;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 130,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Image.asset(
                iconPath,
                width: 40,
                height: 40,
                fit: BoxFit.contain,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF374151),
                    height: 1.2,
                  ),
                  maxLines: 2,
                  softWrap: true,
                ),
              ),
            ],
          ),
          Text(
            value,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF111827),
              letterSpacing: -0.5,
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
            decoration: BoxDecoration(
              color: isPositive
                  ? const Color(0xFFD1FADF)
                  : const Color(0xFFFFE4E6),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              badgeText,
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: isPositive
                    ? const Color(0xFF027A48)
                    : const Color(0xFFB42318),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
