import 'package:flutter/material.dart';

/// Card showing Product Revenue, Platform Commission, Discounts, Refunds, and Net Earnings.
class EarningsBreakdownCard extends StatelessWidget {
  const EarningsBreakdownCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Earnings Breakdown',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              _buildBreakdownRow(
                icon: Icons.shopping_cart_outlined,
                title: 'Product Revenue',
                amount: '₹82,460',
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8),
                child: Divider(color: Color(0xFFF3F4F6), height: 1),
              ),
              _buildBreakdownRow(
                icon: Icons.tune_rounded,
                title: 'Platform Commission',
                amount: '-₹3,400',
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8),
                child: Divider(color: Color(0xFFF3F4F6), height: 1),
              ),
              _buildBreakdownRow(
                icon: Icons.local_offer_outlined,
                title: 'Offers & Discounts',
                amount: '-₹4,210',
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 8),
                child: Divider(color: Color(0xFFF3F4F6), height: 1),
              ),
              _buildBreakdownRow(
                icon: Icons.swap_horiz_rounded,
                title: 'Refunds',
                amount: '-₹1,250',
              ),
              const SizedBox(height: 14),

              // Highlighted Net Earnings Banner
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F7EE),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    Image.asset(
                      'assets/cardsicon/net_warning.png',
                      width: 32,
                      height: 32,
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) => Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: const Color(0xFF22C55E),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          Icons.layers_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Net Earnings',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14.5,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF111827),
                        ),
                      ),
                    ),
                    const Text(
                      '₹73,600',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF111827),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBreakdownRow({
    required IconData icon,
    required String title,
    required String amount,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            icon,
            size: 18,
            color: const Color(0xFF6B7280),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF4B5563),
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Text(
            amount,
            style: const TextStyle(
              fontSize: 14.5,
              fontWeight: FontWeight.bold,
              color: Color(0xFF111827),
            ),
          ),
        ],
      ),
    );
  }
}
