import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';
import '../../bloc/kyc_state.dart';

/// Screen 1/4 of Verification Suite: Verification In Progress (Figma Node 1848:51923).
///
/// Figma Specifications (360 x 800 px):
/// - Background: #FFFFFF (RiderColors.background).
/// - Content Box: x=16, y=110, width=328, height=343.
/// - Illustration: Group (1848:51927) 288 x 241 px at x=20, y=0.
/// - Gap to title: 24 px.
/// - Heading: "Verification In Progress" (Poppins SemiBold 20 px, #000000).
/// - Gap to subtitle: 8 px.
/// - Subtitle: "You'll be notified once your account is verified and ready to go online."
///   (Poppins Regular 14 px, #5B5B5B, line height: 1.45, max width: 300 px).
///
/// Testing Flow:
/// - Automatically progresses to Document Rejected (/kyc/rejected) after 2.5 seconds,
///   or immediately when tapping anywhere on the screen.
/// - Development URL parameters (?outcome=success / ?outcome=rejected) remain supported in kDebugMode.
class PendingVerificationScreen extends StatefulWidget {
  final String? simulatedOutcome;

  const PendingVerificationScreen({super.key, this.simulatedOutcome});

  @override
  State<PendingVerificationScreen> createState() =>
      _PendingVerificationScreenState();
}

class _PendingVerificationScreenState extends State<PendingVerificationScreen> {
  Timer? _autoTransitionTimer;

  @override
  void initState() {
    super.initState();

    // Notify bloc of in-progress status
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<KycBloc>().add(
        const KycVerificationStatusChanged(KycVerificationStatus.inProgress),
      );

      // Handle development-only outcome simulation guarded strictly by kDebugMode
      if (kDebugMode && widget.simulatedOutcome != null) {
        if (widget.simulatedOutcome == 'success') {
          _triggerSuccess();
          return;
        } else if (widget.simulatedOutcome == 'rejected') {
          _triggerRejection();
          return;
        }
      }

      // Testing flow: automatically progress to Document Rejected screen after 2.5 seconds
      _autoTransitionTimer = Timer(const Duration(milliseconds: 2500), () {
        if (mounted) {
          _triggerRejection();
        }
      });
    });
  }

  void _triggerSuccess() {
    _autoTransitionTimer?.cancel();
    if (!mounted) return;
    context.read<KycBloc>().add(
      const KycVerificationStatusChanged(KycVerificationStatus.successful),
    );
    context.replace('/kyc/success');
  }

  void _triggerRejection() {
    _autoTransitionTimer?.cancel();
    if (!mounted) return;
    context.read<KycBloc>().add(
      const KycVerificationStatusChanged(KycVerificationStatus.rejected),
    );
    context.replace('/kyc/rejected');
  }

  @override
  void dispose() {
    _autoTransitionTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<KycBloc, KycState>(
      builder: (context, state) {
        return PopScope(
          canPop: false,
          child: Scaffold(
            backgroundColor: RiderColors.background,
            body: SafeArea(
              child: GestureDetector(
                key: const Key('pending_verification_tap_target'),
                behavior: HitTestBehavior.opaque,
                onTap: _triggerRejection,
                child: SizedBox.expand(
                  child: SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // Top spacing matching Figma mockup (upper-middle positioning)
                          const SizedBox(height: 56),

                          // Verification in progress illustration
                          Center(
                            child: Image.asset(
                              'assets/kyc/verification_in_progress.png',
                              key: const Key('pending_verification_image'),
                              width: 288,
                              height: 241,
                              fit: BoxFit.contain,
                              semanticLabel: 'Verification In Progress',
                            ),
                          ),

                          // Exact Figma gap: 24 px
                          const SizedBox(height: 24),

                          // Heading: "Verification In Progress" (Poppins SemiBold 20px, #000000)
                          Text(
                            'Verification In Progress',
                            key: const Key('pending_verification_title'),
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF000000),
                              letterSpacing: -0.2,
                            ),
                          ),

                          // Exact Figma gap: 8 px
                          const SizedBox(height: 8),

                          // Subtitle: (Poppins Regular 14px, #5B5B5B)
                          ConstrainedBox(
                            constraints: const BoxConstraints(maxWidth: 300),
                            child: Text(
                              "You'll be notified once your account is verified and ready to go online.",
                              key: const Key('pending_verification_subtitle'),
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                color: const Color(0xFF5B5B5B),
                                height: 1.45,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
