import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'verification_fixes_screen.dart';

/// Screen: "Verification In Progress" (Image 9).
class VerificationInProgressScreen extends StatelessWidget {
  const VerificationInProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final paddingBottom = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFEDEDED),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 36.0),

              // Top Vector Illustration
              GestureDetector(
                key: const Key('verification_illustration'),
                onTap: () {
                  // User can tap illustration to preview fix screen
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const VerificationFixesScreen(),
                    ),
                  );
                },
                child: Center(
                  child: Image.asset(
                    'assets/illustrations/verification_in_progress.png',
                    height: 180.0,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) => const Icon(
                      Icons.document_scanner_outlined,
                      size: 140.0,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 36.0),

              // Title
              Text(
                'Verification In Progress',
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
                'We are checking your documents. This usually takes 4-5 hours. We will notify you once done.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF64748B),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 36.0),

              // 3-Step Timeline Stepper
              _buildTimelineStep(
                indicator: Container(
                  width: 22.0,
                  height: 22.0,
                  decoration: const BoxDecoration(
                    color: Color(0xFF84CC16),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check,
                    size: 14.0,
                    color: Colors.white,
                  ),
                ),
                title: 'Application submitted',
                subtitle: 'Today at 10:45 AM',
                hasConnectingLine: true,
              ),
              _buildTimelineStep(
                indicator: Container(
                  width: 22.0,
                  height: 22.0,
                  decoration: const BoxDecoration(
                    color: Color(0xFFD4F038),
                    shape: BoxShape.circle,
                  ),
                ),
                title: 'Documents under review',
                subtitle: 'Verification team active',
                hasConnectingLine: true,
              ),
              _buildTimelineStep(
                indicator: Container(
                  width: 22.0,
                  height: 22.0,
                  decoration: BoxDecoration(
                    color: Colors.transparent,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFFCBD5E1),
                      width: 2.0,
                    ),
                  ),
                ),
                title: 'Approved & ready to go online',
                subtitle: 'pending review',
                hasConnectingLine: false,
              ),

              const SizedBox(height: 36.0),
              SizedBox(height: 20.0 + paddingBottom),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTimelineStep({
    required Widget indicator,
    required String title,
    required String subtitle,
    required bool hasConnectingLine,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Indicator & connecting vertical line
          Column(
            children: [
              indicator,
              if (hasConnectingLine)
                Expanded(
                  child: Container(
                    width: 2.0,
                    margin: const EdgeInsets.symmetric(vertical: 4.0),
                    color: const Color(0xFFCBD5E1),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14.0),

          // Texts
          Padding(
            padding: const EdgeInsets.only(bottom: 24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
