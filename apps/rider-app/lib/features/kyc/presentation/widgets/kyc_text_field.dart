import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../shared/constants/rider_colors.dart';

/// Reusable input field matching Figma KYC design specifications:
/// - Label (Poppins 14 px) with optional mandatory red asterisk `*`
/// - 8 px vertical spacing to input
/// - Input dimensions: 328 x 48 px, radius 12 px, 1 px #C4C4C4 border (1.8 px #FFE700 when focused)
/// - Placeholder (Poppins 16 px, #5B5B5B)
/// - Text (Poppins 16 px, #000000)
/// - Optional suffix icon, read-only mode, and onTap callback (for date picker support)
class KycTextField extends StatelessWidget {
  final String label;
  final String placeholder;
  final TextEditingController controller;
  final Key? inputKey;
  final Color labelColor;
  final TextInputType keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final TextCapitalization textCapitalization;
  final String? errorText;
  final ValueChanged<String>? onChanged;
  final bool isRequired;
  final Widget? suffixIcon;
  final VoidCallback? onTap;
  final bool readOnly;

  const KycTextField({
    super.key,
    required this.label,
    required this.placeholder,
    required this.controller,
    this.inputKey,
    this.labelColor = const Color(0xFF000000),
    this.keyboardType = TextInputType.text,
    this.inputFormatters,
    this.textCapitalization = TextCapitalization.none,
    this.errorText,
    this.onChanged,
    this.isRequired = false,
    this.suffixIcon,
    this.onTap,
    this.readOnly = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Field Label with optional red asterisk
        if (isRequired)
          RichText(
            text: TextSpan(
              text: label,
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: labelColor,
              ),
              children: const [
                TextSpan(
                  text: ' *',
                  style: TextStyle(
                    color: Color(0xFFDC2626),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          )
        else
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: labelColor,
            ),
          ),
        const SizedBox(height: 8),

        // Text Field Container
        SizedBox(
          height: 48,
          child: TextFormField(
            key: inputKey,
            controller: controller,
            keyboardType: keyboardType,
            inputFormatters: inputFormatters,
            textCapitalization: textCapitalization,
            readOnly: readOnly,
            onTap: onTap,
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF000000),
            ),
            decoration: InputDecoration(
              hintText: placeholder,
              hintStyle: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF5B5B5B),
              ),
              suffixIcon: suffixIcon,
              filled: true,
              fillColor: const Color(0xFFFFFFFF),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 13,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(
                  color: Color(0xFFC4C4C4),
                  width: 1.0,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: errorText != null
                      ? RiderColors.errorRed
                      : const Color(0xFFC4C4C4),
                  width: 1.0,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(
                  color: errorText != null
                      ? RiderColors.errorRed
                      : RiderColors.inputFocusedBorder,
                  width: 1.8,
                ),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(
                  color: RiderColors.errorRed,
                  width: 1.0,
                ),
              ),
              focusedErrorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(
                  color: RiderColors.errorRed,
                  width: 1.8,
                ),
              ),
            ),
            onChanged: onChanged,
          ),
        ),

        // Inline Error Message
        if (errorText != null) ...[
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.only(left: 4.0),
            child: Text(
              errorText!,
              key: const Key('kyc_text_field_error'),
              style: GoogleFonts.poppins(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: RiderColors.errorRed,
              ),
            ),
          ),
        ],
      ],
    );
  }
}
