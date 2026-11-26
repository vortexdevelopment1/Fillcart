import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Shared card displaying merchant (`Pickup from`) or customer (`Customer details`)
/// contact information, with an optional `Call` action pill.
class MultiOrderContactCard extends StatelessWidget {
  final String label;
  final String name;
  final String address;
  final String? distanceText;
  final VoidCallback? onCall;
  final String callLabel;
  final Key? callButtonKey;

  const MultiOrderContactCard({
    super.key,
    required this.label,
    required this.name,
    required this.address,
    this.distanceText,
    this.onCall,
    this.callLabel = 'Call',
    this.callButtonKey,
  });

  @override
  Widget build(BuildContext context) {
    final fullAddress = distanceText != null && distanceText!.isNotEmpty
        ? '$address · $distanceText'
        : address;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF555555),
                ),
              ),
              if (onCall != null)
                InkWell(
                  key: callButtonKey ?? const Key('multi_order_contact_call_button'),
                  onTap: onCall,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF6F6F6),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.phone_outlined,
                          size: 14,
                          color: Color(0xFF080808),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          callLabel,
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF080808),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            name,
            style: GoogleFonts.poppins(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF080808),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            fullAddress,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              height: 1.4,
              color: const Color(0xFF555555),
            ),
          ),
        ],
      ),
    );
  }
}
