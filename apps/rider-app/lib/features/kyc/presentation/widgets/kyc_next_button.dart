import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../shared/constants/rider_colors.dart';

/// Primary full-width action button for KYC screens:
/// - Dimensions: 328 x 48 px
/// - Corner radius: 12 px
/// - Background: #FFE700 (RiderColors.primaryYellow)
/// - Text: "Next" (Poppins Medium 20 px, black)
class KycNextButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String label;
  final Key? buttonKey;

  const KycNextButton({
    super.key,
    required this.onPressed,
    this.label = 'Next',
    this.buttonKey,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        key: buttonKey ?? const Key('kyc_next_button'),
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: RiderColors.primaryYellow,
          foregroundColor: const Color(0xFF000000),
          disabledBackgroundColor: RiderColors.primaryYellow.withValues(
            alpha: 0.5,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF000000),
          ),
        ),
      ),
    );
  }
}
