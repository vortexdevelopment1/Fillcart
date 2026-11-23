import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';
import '../../bloc/kyc_state.dart';

/// Pre-Ride System Permissions Screen (Figma Node 1848:52002).
///
/// Figma Specifications (360 x 800 px):
/// - Header (Frame 2147227320): Height 44 px at y=48.
///   - Back arrow: Icons.arrow_back (24 px, #000000).
///   - Title: "Allow Permission to proceed" (Poppins Medium 16 px, #000000).
/// - Content Container (Frame 2147227321): Width 328 px, padded 16 px horizontally, gap 16 px below header.
/// - 3 Permission Cards with exact Figma dimensions and literal text (Option A):
///   1. Card 1 (Frame 1848:52012): 328 x 73 px
///      - Icon: permission_location.png (24 x 24 px) in 38 x 38 px container.
///      - Title: "Display Over other apps" (Poppins Medium 14 px, #000000).
///      - Subtitle: "Helps  find rides based  on location" (Poppins Medium 12 px, #5B5B5B, double spaces preserved).
///   2. Card 2 (Frame 1848:52021): 328 x 83 px
///      - Icon: permission_display_overlay.png (38 x 38 px badge).
///      - Title: "Background Location" (Poppins Medium 14 px, #000000).
///      - Subtitle: "Permit app to display  o top of other apps to get rides alerts"
///        (Poppins Regular 12 px, #5B5B5B, literal typo and double spaces preserved).
///   3. Card 3 (Frame 1848:52034): 328 x 73 px
///      - Icon: permission_battery.png (24 x 24 px) in 38 x 38 px container.
///      - Title: "Battery Usage" (Poppins Medium 14 px, #000000).
///      - Subtitle: "Help app run in background" (Poppins Medium 12 px, #5B5B5B).
/// - Mock boolean state only. No native permission packages, GPS, or overlay APIs.
/// - No Continue button in the design.
class PermissionsScreen extends StatefulWidget {
  const PermissionsScreen({super.key});

  @override
  State<PermissionsScreen> createState() => _PermissionsScreenState();
}

class _PermissionsScreenState extends State<PermissionsScreen> {
  late bool _card1Enabled;
  late bool _card2Enabled;
  late bool _card3Enabled;

  @override
  void initState() {
    super.initState();
    final state = context.read<KycBloc>().state;
    _card1Enabled = state.isDisplayOverAppsGranted;
    _card2Enabled = state.isBackgroundLocationGranted;
    _card3Enabled = state.isBatteryUsageGranted;
  }

  void _handleBackNavigation() {
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/kyc/success');
    }
  }

  void _onCard1Toggled(bool value) {
    setState(() => _card1Enabled = value);
    context.read<KycBloc>().add(
      KycPermissionsChanged(isDisplayOverAppsGranted: value),
    );
  }

  void _onCard2Toggled(bool value) {
    setState(() => _card2Enabled = value);
    context.read<KycBloc>().add(
      KycPermissionsChanged(isBackgroundLocationGranted: value),
    );
  }

  void _onCard3Toggled(bool value) {
    setState(() => _card3Enabled = value);
    context.read<KycBloc>().add(
      KycPermissionsChanged(isBatteryUsageGranted: value),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<KycBloc, KycState>(
      builder: (context, state) {
        return Scaffold(
          backgroundColor: RiderColors.background,
          body: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header (Exact Figma 44 px with back button and title)
                SizedBox(
                  height: 44,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Row(
                      children: [
                        InkWell(
                          key: const Key('permissions_back_button'),
                          onTap: _handleBackNavigation,
                          borderRadius: BorderRadius.circular(12),
                          child: const Padding(
                            padding: EdgeInsets.all(4.0),
                            child: Icon(
                              Icons.arrow_back,
                              size: 24,
                              color: Color(0xFF000000),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Allow Permission to proceed',
                          key: const Key('permissions_header_title'),
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF000000),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Exact gap below header: 16 px
                const SizedBox(height: 16),

                // Card List: Width 328 px
                Expanded(
                  child: SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Column(
                      children: [
                        // Card 1 (Frame 1848:52012): 328 x 73 px
                        _buildPermissionCard(
                          cardKey: const Key('permission_card_1'),
                          titleKey: const Key('permission_card_1_title'),
                          subtitleKey: const Key('permission_card_1_subtitle'),
                          switchKey: const Key('permission_card_1_switch'),
                          height: 73,
                          iconWidget: Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF6F6F6),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            alignment: Alignment.center,
                            child: Image.asset(
                              'assets/icons/permission_location.png',
                              key: const Key('permission_icon_location'),
                              width: 24,
                              height: 24,
                              fit: BoxFit.contain,
                            ),
                          ),
                          title: 'Display Over other apps',
                          subtitle: 'Helps  find rides based  on location',
                          isEnabled: _card1Enabled,
                          onChanged: _onCard1Toggled,
                        ),

                        // Exact vertical gap: 16 px
                        const SizedBox(height: 16),

                        // Card 2 (Frame 1848:52021): 328 x 83 px (10px taller for 2-line subtitle)
                        _buildPermissionCard(
                          cardKey: const Key('permission_card_2'),
                          titleKey: const Key('permission_card_2_title'),
                          subtitleKey: const Key('permission_card_2_subtitle'),
                          switchKey: const Key('permission_card_2_switch'),
                          height: 83,
                          iconWidget: Image.asset(
                            'assets/icons/permission_display_overlay.png',
                            key: const Key('permission_icon_display_overlay'),
                            width: 38,
                            height: 38,
                            fit: BoxFit.contain,
                          ),
                          title: 'Background Location',
                          subtitle:
                              'Permit app to display  o top of other apps to get rides alerts',
                          isEnabled: _card2Enabled,
                          onChanged: _onCard2Toggled,
                        ),

                        // Exact vertical gap: 16 px
                        const SizedBox(height: 16),

                        // Card 3 (Frame 1848:52034): 328 x 73 px
                        _buildPermissionCard(
                          cardKey: const Key('permission_card_3'),
                          titleKey: const Key('permission_card_3_title'),
                          subtitleKey: const Key('permission_card_3_subtitle'),
                          switchKey: const Key('permission_card_3_switch'),
                          height: 73,
                          iconWidget: Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF6F6F6),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            alignment: Alignment.center,
                            child: Image.asset(
                              'assets/icons/permission_battery.png',
                              key: const Key('permission_icon_battery'),
                              width: 24,
                              height: 24,
                              fit: BoxFit.contain,
                            ),
                          ),
                          title: 'Battery Usage',
                          subtitle: 'Help app run in background',
                          isEnabled: _card3Enabled,
                          onChanged: _onCard3Toggled,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPermissionCard({
    required Key cardKey,
    required Key titleKey,
    required Key subtitleKey,
    required Key switchKey,
    required double height,
    required Widget iconWidget,
    required String title,
    required String subtitle,
    required bool isEnabled,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      key: cardKey,
      constraints: BoxConstraints(minHeight: height),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB), width: 1.0),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Icon Box
          iconWidget,

          // Gap between icon container and text: 10 px
          const SizedBox(width: 10),

          // Titles column
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  key: titleKey,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF000000),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  key: subtitleKey,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF5B5B5B),
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8),

          // Switch Toggle matching blue theme (#4AA2FF)
          Switch(
            key: switchKey,
            value: isEnabled,
            onChanged: onChanged,
            activeTrackColor: RiderColors.permissionBlue,
            activeColor: const Color(0xFFFFFFFF),
            inactiveTrackColor: const Color(0xFFE5E7EB),
            inactiveThumbColor: const Color(0xFFFFFFFF),
            trackOutlineColor: WidgetStateProperty.resolveWith<Color?>((
              states,
            ) {
              if (states.contains(WidgetState.selected)) {
                return RiderColors.permissionBlue;
              }
              return const Color(0xFFE5E7EB);
            }),
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
        ],
      ),
    );
  }
}
