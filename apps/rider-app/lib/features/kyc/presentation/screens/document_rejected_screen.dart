import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';
import '../../bloc/kyc_state.dart';

/// Screen 3/4 of Verification Suite: Unified Document Rejected (Figma Node 1848:51992).
///
/// Figma & Screenshot Specifications (360 x 800 px):
/// - Background: #FFFFFF (RiderColors.background).
/// - Layout: Centered content in upper-middle viewport matching screenshot.
/// - Top spacing: 56 px.
/// - Illustration: Red circular 3D badge with white X (180 x 180 px).
/// - Gap to title: 24 px.
/// - Title: "Documents Rejected" (Poppins SemiBold 20 px, #000000).
/// - Gap to subtitle: 8 px.
/// - Subtitle: "Some documents need updating to\nactivate your rider account."
///   (Poppins Regular 13 px, #5B5B5B, line height: 1.45).
/// - Gap to button: 24 px.
/// - Action Button: "Upload Documents" directly below subtitle (328 x 48 px, corner radius 12 px, #FFE700).
///
/// Testing Flow:
/// - Progresses to /kyc/success when "Upload Documents" is tapped,
///   or automatically after 3.5 seconds (or screen tap).
class DocumentRejectedScreen extends StatefulWidget {
  const DocumentRejectedScreen({super.key});

  @override
  State<DocumentRejectedScreen> createState() => _DocumentRejectedScreenState();
}

class _DocumentRejectedScreenState extends State<DocumentRejectedScreen> {
  Timer? _autoTransitionTimer;

  @override
  void initState() {
    super.initState();
    _autoTransitionTimer = Timer(const Duration(milliseconds: 3500), () {
      if (mounted) {
        _proceedToSuccess();
      }
    });
  }

  void _proceedToSuccess() {
    _autoTransitionTimer?.cancel();
    if (!mounted) return;
    context.read<KycBloc>().add(
      const KycVerificationStatusChanged(KycVerificationStatus.successful),
    );
    context.replace('/kyc/success');
  }

  @override
  void dispose() {
    _autoTransitionTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: RiderColors.background,
        body: SafeArea(
          child: GestureDetector(
            key: const Key('document_rejected_tap_target'),
            behavior: HitTestBehavior.opaque,
            onTap: _proceedToSuccess,
            child: SizedBox.expand(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Top spacing matching Figma screenshot (upper-middle positioning)
                      const SizedBox(height: 56),

                      // Official Figma Rejection Illustration (180 x 180 px)
                      Center(
                        child: Image.asset(
                          'assets/kyc/document_rejected.png',
                          key: const Key('document_rejection_image'),
                          width: 180,
                          height: 180,
                          fit: BoxFit.contain,
                          semanticLabel: 'Documents Rejected',
                        ),
                      ),

                      // Exact gap: 24 px
                      const SizedBox(height: 24),

                      // Title: "Documents Rejected" (Poppins SemiBold 20px, #000000)
                      Text(
                        'Documents Rejected',
                        key: const Key('document_rejection_title'),
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF000000),
                          letterSpacing: -0.2,
                        ),
                      ),

                      // Exact gap: 8 px
                      const SizedBox(height: 8),

                      // Subtitle matching screenshot text exactly
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 290),
                        child: Text(
                          'Some documents need updating to\nactivate your rider account.',
                          key: const Key('document_rejection_subtitle'),
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF5B5B5B),
                            height: 1.45,
                          ),
                        ),
                      ),

                      // Exact gap: 24 px
                      const SizedBox(height: 24),

                      // Action Button: "Upload Documents" (328 x 48 px, directly under subtitle matching screenshot)
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          key: const Key('upload_documents_button'),
                          onPressed: _proceedToSuccess,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: RiderColors.primaryYellow,
                            foregroundColor: const Color(0xFF000000),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Text(
                            'Upload Documents',
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF000000),
                            ),
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
  }
}
