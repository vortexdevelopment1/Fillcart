import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../bloc/profile_bloc.dart';
import '../../bloc/profile_state.dart';
import '../../models/rider_profile_model.dart';
import '../widgets/profile_theme_constants.dart';

/// Documents Details Screen matching Figma Documents Details screen.
class DocumentsDetailsScreen extends StatelessWidget {
  const DocumentsDetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('documents_details_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            const ProfileScreenHeader(title: 'Documents Details'),
            Expanded(
              child: BlocBuilder<ProfileBloc, ProfileState>(
                builder: (context, state) {
                  final docs = state.documents;
                  return SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                    child: Column(
                      children: [
                        _DocumentSummaryCard(
                          cardKey: const Key('doc_card_driving_license'),
                          svgAsset: 'assets/svg/driving_license.svg',
                          title: 'Driving License',
                          subtitle: docs.drivingLicenseNumber,
                          status: docs.drivingLicenseStatus,
                        ),
                        const SizedBox(height: 14),
                        _DocumentSummaryCard(
                          cardKey: const Key('doc_card_aadhaar'),
                          svgAsset: 'assets/svg/Aadhaar_Card.svg',
                          title: 'Aadhaar Card',
                          subtitle: docs.aadhaarNumber,
                          status: docs.aadhaarStatus,
                        ),
                        const SizedBox(height: 14),
                        _DocumentSummaryCard(
                          cardKey: const Key('doc_card_vehicle_rc'),
                          svgAsset: 'assets/svg/Detaileddocument.svg',
                          title: 'Vehicle RC',
                          subtitle: docs.vehicleRcNumber,
                          status: docs.vehicleRcStatus,
                          footerActionLabel: 'Change Vehicle',
                          onFooterTap: () {
                            try {
                              GoRouter.of(context).push('/profile/vehicle');
                            } catch (_) {}
                          },
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DocumentSummaryCard extends StatelessWidget {
  final Key cardKey;
  final String svgAsset;
  final String title;
  final String subtitle;
  final ProfileDocumentStatus status;
  final String? footerActionLabel;
  final VoidCallback? onFooterTap;

  const _DocumentSummaryCard({
    required this.cardKey,
    required this.svgAsset,
    required this.title,
    required this.subtitle,
    required this.status,
    this.footerActionLabel,
    this.onFooterTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: cardKey,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
            child: Row(
              children: [
                SvgPicture.asset(svgAsset, width: 32, height: 32),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.poppins(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: ProfileTokens.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                _StatusIndicator(status: status),
              ],
            ),
          ),
          if (footerActionLabel != null && onFooterTap != null) ...[
            const Divider(height: 1, thickness: 1, color: ProfileTokens.divider),
            InkWell(
              key: const Key('change_vehicle_button'),
              onTap: onFooterTap,
              borderRadius: const BorderRadius.vertical(
                bottom: Radius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      footerActionLabel!,
                      style: GoogleFonts.poppins(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w400,
                        color: Colors.black,
                      ),
                    ),
                    const Icon(
                      Icons.chevron_right,
                      size: 20,
                      color: Color(0xFF4B5563),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _StatusIndicator extends StatelessWidget {
  final ProfileDocumentStatus status;

  const _StatusIndicator({required this.status});

  @override
  Widget build(BuildContext context) {
    if (status == ProfileDocumentStatus.pendingVerification) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: ProfileTokens.pendingAmberBg,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SvgPicture.asset(
              'assets/svg/pending_verification.svg',
              width: 14,
              height: 14,
            ),
            const SizedBox(width: 5),
            Text(
              'Pending',
              style: GoogleFonts.poppins(
                fontSize: 12.5,
                fontWeight: FontWeight.w500,
                color: ProfileTokens.pendingAmber,
              ),
            ),
          ],
        ),
      );
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(
          Icons.check_circle,
          size: 18,
          color: ProfileTokens.verifiedGreen,
        ),
        const SizedBox(width: 5),
        Text(
          'Verified',
          style: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: ProfileTokens.verifiedGreen,
          ),
        ),
      ],
    );
  }
}
