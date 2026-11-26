import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Shared Order ID card (`Order ID` label + order identifier + optional
/// trailing icon slot) used across Pickup Verify and Delivery Completed screens.
class MultiOrderOrderIdCard extends StatelessWidget {
  final String orderId;
  final String label;
  final Widget? trailingIcon;

  const MultiOrderOrderIdCard({
    super.key,
    required this.orderId,
    this.label = 'Order ID',
    this.trailingIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('multi_order_id_card'),
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: RiderColors.surface,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF555555),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                orderId,
                key: const Key('multi_order_id_value'),
                style: GoogleFonts.poppins(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF080808),
                ),
              ),
            ],
          ),
          if (trailingIcon != null)
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: const Color(0xFFFAF7E8),
                borderRadius: BorderRadius.circular(10),
              ),
              alignment: Alignment.center,
              child: trailingIcon,
            ),
        ],
      ),
    );
  }
}
