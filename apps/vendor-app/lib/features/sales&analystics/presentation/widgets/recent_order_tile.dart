import 'package:flutter/material.dart';

/// Recent Order Card for the Orders tab in Sales Analytics.
class RecentOrderTile extends StatelessWidget {
  const RecentOrderTile({
    super.key,
    required this.orderId,
    required this.timeAgo,
    required this.price,
    required this.isCompleted,
  });

  final String orderId;
  final String timeAgo;
  final String price;
  final bool isCompleted;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          // Order Receipt Icon
          Image.asset(
            'assets/cardsicon/Order_Icon.png',
            width: 40,
            height: 40,
            fit: BoxFit.contain,
          ),
          const SizedBox(width: 12),

          // Order ID & Time
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  orderId,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontWeight: FontWeight.bold,
                    fontSize: 14.5,
                    color: Color(0xFF111827),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  timeAgo,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 11.5,
                    color: Color(0xFF9CA3AF),
                  ),
                ),
              ],
            ),
          ),

          // Price & Status Badge
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                price,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontWeight: FontWeight.bold,
                  fontSize: 14.5,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                decoration: BoxDecoration(
                  color: isCompleted
                      ? const Color(0xFFD1FADF)
                      : const Color(0xFFFFECEB),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  isCompleted ? 'Completed' : 'Cancelled',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isCompleted
                        ? const Color(0xFF027A48)
                        : const Color(0xFFF04438),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 8),

          // Chevron Right
          const Icon(
            Icons.chevron_right_rounded,
            color: Color(0xFFD1D5DB),
            size: 20,
          ),
        ],
      ),
    );
  }
}
