import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../../authentication/bloc/auth_bloc.dart';
import '../../../authentication/bloc/auth_event.dart';
import '../../bloc/profile_bloc.dart';
import '../../bloc/profile_event.dart';
import '../../bloc/profile_state.dart';
import '../widgets/profile_avatar.dart';
import '../widgets/profile_theme_constants.dart';

/// Main Rider Profile Screen matching Figma Profile screen.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  void _navigateTo(BuildContext context, String route) {
    try {
      GoRouter.of(context).push(route);
    } catch (_) {}
  }

  Future<void> _confirmLogout(BuildContext context) async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Log Out',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 18),
        ),
        content: Text(
          'Are you sure you want to log out of your rider account?',
          style: GoogleFonts.poppins(
            fontSize: 13,
            color: ProfileTokens.textSecondary,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(
              'Cancel',
              style: GoogleFonts.poppins(color: ProfileTokens.textSecondary),
            ),
          ),
          ElevatedButton(
            key: const Key('confirm_logout_button'),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: RiderColors.primaryYellow,
              foregroundColor: RiderColors.onSurfaceDark,
              minimumSize: const Size(96, 40),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Text(
              'Log Out',
              style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );

    if (shouldLogout == true && context.mounted) {
      try {
        context.read<AuthBloc>().add(const AuthResetRequested());
      } catch (_) {}
      try {
        context.read<ProfileBloc>().add(const ProfileResetRequested());
      } catch (_) {}
      try {
        GoRouter.of(context).go('/phone');
      } catch (_) {}
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('profile_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: BlocBuilder<ProfileBloc, ProfileState>(
          builder: (context, state) {
            final profile = state.profile;
            return Column(
              children: [
                const ProfileScreenHeader(title: 'Profile'),
                Expanded(
                  child: SingleChildScrollView(
                    key: const Key('profile_scroll_view'),
                    physics: const ClampingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                    child: Column(
                      children: [
                        ProfileAvatar(profile: profile, size: 96),
                        const SizedBox(height: 12),
                        Text(
                          profile.fullName,
                          key: const Key('profile_rider_name'),
                          style: GoogleFonts.poppins(
                            fontSize: 17,
                            fontWeight: FontWeight.w500,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 12),
                        _EditProfileButton(
                          key: const Key('edit_profile_button'),
                          onTap: () => _navigateTo(context, '/profile/edit'),
                        ),
                        const SizedBox(height: 16),
                        _StatsSummaryCard(
                          mobile: profile.mobileNumber,
                          rating: profile.rating.toStringAsFixed(1),
                          riderId: profile.riderId,
                        ),
                        const SizedBox(height: 14),
                        _MenuSectionCard(
                          title: 'Your Account',
                          items: [
                            _MenuItemData(
                              key: const Key('menu_incentives_rewards'),
                              svgAsset: 'assets/svg/incentive.svg',
                              label: 'Incentives & Rewards',
                              onTap: () =>
                                  _navigateTo(context, '/profile/incentives'),
                            ),
                            _MenuItemData(
                              key: const Key('menu_documents_details'),
                              svgAsset: 'assets/svg/Detaileddocument.svg',
                              label: 'Documents Details',
                              onTap: () =>
                                  _navigateTo(context, '/profile/documents'),
                            ),
                            _MenuItemData(
                              key: const Key('menu_bank_details'),
                              svgAsset: 'assets/svg/Bank.svg',
                              label: 'Bank Details',
                              onTap: () => _navigateTo(context, '/profile/bank'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        _MenuSectionCard(
                          title: 'Help & Support',
                          items: [
                            _MenuItemData(
                              key: const Key('menu_faqs'),
                              svgAsset: "assets/svg/faq's.svg",
                              label: "FAQ'S",
                              onTap: () => _navigateTo(context, '/profile/faq'),
                            ),
                            _MenuItemData(
                              key: const Key('menu_contact_support'),
                              svgAsset: 'assets/svg/contactsupport.svg',
                              label: 'Contact Support',
                              onTap: () =>
                                  _navigateTo(context, '/profile/support'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        _MenuSectionCard(
                          title: 'About App',
                          items: [
                            _MenuItemData(
                              key: const Key('menu_about_app'),
                              svgAsset: 'assets/svg/about.svg',
                              label: 'About App',
                              onTap: () =>
                                  _navigateTo(context, '/profile/about'),
                            ),
                            _MenuItemData(
                              key: const Key('menu_privacy_policy'),
                              svgAsset: 'assets/svg/privacypolicy.svg',
                              label: 'Privacy Policy',
                              onTap: () => _navigateTo(
                                context,
                                '/profile/privacy-policy',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        InkWell(
                          key: const Key('profile_logout_button'),
                          onTap: () => _confirmLogout(context),
                          borderRadius: BorderRadius.circular(12),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
                            child: Row(
                              children: [
                                SvgPicture.asset(
                                  'assets/svg/logout.svg',
                                  width: 22,
                                  height: 22,
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  'Log Out',
                                  style: GoogleFonts.poppins(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _EditProfileButton extends StatelessWidget {
  final VoidCallback onTap;

  const _EditProfileButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      elevation: 2,
      shadowColor: const Color(0x14000000),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SvgPicture.asset('assets/svg/edit.svg', width: 17, height: 17),
              const SizedBox(width: 8),
              Text(
                'Edit Profile',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatsSummaryCard extends StatelessWidget {
  final String mobile;
  final String rating;
  final String riderId;

  const _StatsSummaryCard({
    required this.mobile,
    required this.rating,
    required this.riderId,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
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
      child: IntrinsicHeight(
        child: Row(
          children: [
            Expanded(
              flex: 4,
              child: _StatColumn(
                svgAsset: 'assets/svg/phone_icon.svg',
                iconSize: 18,
                value: mobile,
                label: 'Mobile',
              ),
            ),
            const VerticalDivider(
              width: 1,
              thickness: 1,
              indent: 6,
              endIndent: 6,
              color: Color(0xFFE5E7EB),
            ),
            Expanded(
              flex: 3,
              child: _StatColumn(
                svgAsset: 'assets/svg/rating.svg',
                iconSize: 18,
                value: rating,
                label: 'Rating',
              ),
            ),
            const VerticalDivider(
              width: 1,
              thickness: 1,
              indent: 6,
              endIndent: 6,
              color: Color(0xFFE5E7EB),
            ),
            Expanded(
              flex: 3,
              child: _StatColumn(
                svgAsset: 'assets/svg/id.svg',
                iconSize: 22,
                value: riderId,
                label: 'ID',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatColumn extends StatelessWidget {
  final String svgAsset;
  final double iconSize;
  final String value;
  final String label;

  const _StatColumn({
    required this.svgAsset,
    required this.iconSize,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            height: 22,
            child: Center(
              child: SvgPicture.asset(
                svgAsset,
                width: iconSize,
                height: iconSize,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              fontSize: 12.5,
              fontWeight: FontWeight.w500,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: ProfileTokens.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuItemData {
  final Key key;
  final String svgAsset;
  final String label;
  final VoidCallback onTap;

  const _MenuItemData({
    required this.key,
    required this.svgAsset,
    required this.label,
    required this.onTap,
  });
}

class _MenuSectionCard extends StatelessWidget {
  final String title;
  final List<_MenuItemData> items;

  const _MenuSectionCard({
    required this.title,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 14, 14, 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
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
          const SizedBox(height: 8),
          for (final item in items)
            InkWell(
              key: item.key,
              onTap: item.onTap,
              borderRadius: BorderRadius.circular(10),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  children: [
                    SvgPicture.asset(item.svgAsset, width: 20, height: 20),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        item.label,
                        style: GoogleFonts.poppins(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w400,
                          color: Colors.black,
                        ),
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
      ),
    );
  }
}
