import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

/// Screen: "We need a few fixes" (Image 10).
class VerificationFixesScreen extends StatelessWidget {
  const VerificationFixesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEDEDED),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 56.0),

              // Pink circle with red warning SVG
              Container(
                width: 96.0,
                height: 96.0,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFE4E6),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: SvgPicture.asset(
                  'assets/svg/we_need_few_fixes.svg',
                  width: 44.0,
                  height: 44.0,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.warning_amber_rounded,
                    size: 44.0,
                    color: Color(0xFFE11D48),
                  ),
                ),
              ),
              const SizedBox(height: 28.0),

              // Title
              Text(
                'We need a few fixes',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 22.0,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 10.0),

              // Subtitle
              Text(
                'Some uploaded documents couldn’t be verified by our compliance team.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF64748B),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 32.0),

              // Issues to resolve Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18.0),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(16.0),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Issues to resolve:',
                      style: GoogleFonts.inter(
                        fontSize: 15.0,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF991B1B),
                      ),
                    ),
                    const SizedBox(height: 10.0),
                    Text(
                      'GST certificate blurry or text illegible. Please upload clear scan.',
                      style: GoogleFonts.inter(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFB91C1C),
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 12.0),
                    Text(
                      'Bank passbook name did not match PAN registry name.',
                      style: GoogleFonts.inter(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFFB91C1C),
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
