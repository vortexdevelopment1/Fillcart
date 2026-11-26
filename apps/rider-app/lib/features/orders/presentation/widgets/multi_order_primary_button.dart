import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Reusable primary yellow action button (`48 px` height, `12 px` radius)
/// used across Multi-Order payment and OTP flows.
class MultiOrderPrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool enabled;
  final bool fullWidth;
  final Key? buttonKey;

  const MultiOrderPrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.enabled = true,
    this.fullWidth = true,
    this.buttonKey,
  });

  @override
  Widget build(BuildContext context) {
    final isInteractive = enabled && onPressed != null;

    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: 48,
      child: ElevatedButton(
        key: buttonKey ?? const Key('multi_order_primary_button'),
        onPressed: isInteractive ? onPressed : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: RiderColors.primaryYellow,
          foregroundColor: const Color(0xFF000000),
          disabledBackgroundColor:
              RiderColors.primaryYellow.withValues(alpha: 0.5),
          disabledForegroundColor:
              const Color(0xFF000000).withValues(alpha: 0.45),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
