import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Standardized header for KYC Wizard screens matching exact Figma specifications:
/// - Width: 360 px (responsive full-width)
/// - Height: 56 px (including bottom border)
/// - Padding: Top 6 px, Right 16 px, Bottom 6 px, Left 16 px
/// - Bottom border: 1 px solid #CACACA
/// - Aligned Title, Material Left Arrow (where applicable), and Step Counter
class KycStepHeader extends StatelessWidget {
  final String title;
  final String stepCounter;
  final VoidCallback? onBack;
  final bool showBackButton;

  const KycStepHeader({
    super.key,
    required this.title,
    required this.stepCounter,
    this.onBack,
    this.showBackButton = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 56.0,
      padding: const EdgeInsets.only(
        top: 6.0,
        bottom: 6.0,
        left: 16.0,
        right: 16.0,
      ),
      decoration: const BoxDecoration(
        color: RiderColors.background,
        border: Border(
          bottom: BorderSide(color: Color(0xFFCACACA), width: 1.0),
        ),
      ),
      child: Row(
        children: [
          if (showBackButton) ...[
            InkWell(
              key: const Key('kyc_header_back_button'),
              onTap: onBack,
              borderRadius: BorderRadius.circular(20),
              child: const SizedBox(
                width: 24,
                height: 24,
                child: Center(
                  child: Icon(
                    Icons.arrow_back,
                    size: 24,
                    color: Color(0xFF000000),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
          ],

          // Title
          Expanded(
            child: Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF000000),
              ),
            ),
          ),

          // Step counter (e.g. "1/4", "2/4")
          Text(
            stepCounter,
            key: const Key('kyc_step_counter_text'),
            style: GoogleFonts.roboto(
              fontSize: 20,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF555555),
            ),
          ),
        ],
      ),
    );
  }
}
