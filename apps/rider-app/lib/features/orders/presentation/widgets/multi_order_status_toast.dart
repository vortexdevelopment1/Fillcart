import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Reusable green confirmation toast banner displayed on Multi-Order route
/// and pickup verification screens.
class MultiOrderStatusToast extends StatelessWidget {
  final String message;

  const MultiOrderStatusToast({
    super.key,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 40,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFE7F9E8),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: const Color(0xFF22C55E),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.check_circle,
            size: 18,
            color: Color(0xFF0B7A1E),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              message,
              key: const Key('multi_order_status_toast_text'),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.poppins(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF080808),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
