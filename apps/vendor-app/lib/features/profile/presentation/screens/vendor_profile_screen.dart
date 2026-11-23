import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/bank_account_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/edit_profile_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/help_support_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/privacy_about_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/store_business_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Main Vendor Profile Screen (Profile Tab).
/// Matches Figma design: Profile (Image 1).
class VendorProfileScreen extends StatelessWidget {
  const VendorProfileScreen({super.key});

  void _showLogoutDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: const Text(
          'Log Out',
          style: TextStyle(
            fontFamily: 'Inter',
            fontWeight: FontWeight.w700,
          ),
        ),
        content: const Text(
          'Are you sure you want to log out of your Fillcart vendor account?',
          style: TextStyle(
            fontFamily: 'Inter',
            color: Color(0xFF4B5563),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text(
              'Cancel',
              style: TextStyle(
                fontFamily: 'Inter',
                color: Color(0xFF6B7280),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Logged out successfully.'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Log Out',
              style: TextStyle(
                fontFamily: 'Inter',
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Screen Title: Profile
              const Padding(
                padding: EdgeInsets.only(left: 4, bottom: 16),
                child: Text(
                  'Profile',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
              ),

              // 1. Lime Green Profile Banner Card
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const EditProfileScreen(),
                    ),
                  );
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFCFF777),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      // Avatar with Camera Badge
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
                          Container(
                            width: 56,
                            height: 56,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              image: const DecorationImage(
                                image: AssetImage(AppAssets.vendorAvatar),
                                fit: BoxFit.cover,
                              ),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.6),
                                width: 1.5,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              width: 18,
                              height: 18,
                              decoration: const BoxDecoration(
                                color: Colors.black,
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: SvgPicture.asset(
                                  AppAssets.svgCamera,
                                  width: 10,
                                  height: 10,
                                  colorFilter: const ColorFilter.mode(
                                    Colors.white,
                                    BlendMode.srcIn,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 14),

                      // Name, Vendor ID, Verified Badge
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Rakesh Kumar',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 17,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF111827),
                              ),
                            ),
                            const SizedBox(height: 2),
                            const Text(
                              'Vendor ID: VND12345',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 13,
                                fontWeight: FontWeight.w400,
                                color: Color(0xFF4B5563),
                              ),
                            ),
                            const SizedBox(height: 8),

                            // Verified Pill Badge
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  SvgPicture.asset(
                                    AppAssets.svgAccountVerify,
                                    width: 14,
                                    height: 14,
                                  ),
                                  const SizedBox(width: 5),
                                  const Text(
                                    'Verified',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.black,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Chevron right
                      const Icon(
                        Icons.chevron_right_rounded,
                        color: Color(0xFF111827),
                        size: 24,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // 2. Metrics Card (Matte Black)
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(20),
                ),
                padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 16),
                child: Row(
                  children: [
                    // Total Sales
                    const Expanded(
                      child: Column(
                        children: [
                          Text(
                            '12.5K',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Total Sales',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF9CA3AF),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Divider
                    Container(
                      width: 1,
                      height: 32,
                      color: Colors.white.withValues(alpha: 0.15),
                    ),

                    // Orders
                    const Expanded(
                      child: Column(
                        children: [
                          Text(
                            '842',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Orders',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF9CA3AF),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Divider
                    Container(
                      width: 1,
                      height: 32,
                      color: Colors.white.withValues(alpha: 0.15),
                    ),

                    // Rating
                    Expanded(
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                '4.8',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(width: 5),
                              Image.asset(
                                AppAssets.cardStar,
                                width: 14,
                                height: 14,
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Rating',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF9CA3AF),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // 3. Section: Account & Business
              const Padding(
                padding: EdgeInsets.only(left: 4, bottom: 12),
                child: Text(
                  'Account & Business',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
              ),

              // Card: Store & Business Details
              _buildMenuCard(
                iconAsset: AppAssets.cardStore,
                title: 'Store & Business Details',
                subtitle: 'Name, category, address',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const StoreBusinessDetailsScreen(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),

              // Card: Bank Account
              _buildMenuCard(
                iconAsset: AppAssets.cardBankAccount,
                title: 'Bank Account',
                subtitle: 'Bank details',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const BankAccountScreen(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),

              // 4. Section: Support & Information
              const Padding(
                padding: EdgeInsets.only(left: 4, bottom: 12),
                child: Text(
                  'Support & Information',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
              ),

              // Card: Help & Support
              _buildMenuCard(
                iconAsset: AppAssets.cardSupport,
                title: 'Help & Support',
                subtitle: 'FAQ, contact support',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const HelpSupportScreen(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),

              // Card: Privacy & About
              _buildMenuCard(
                iconAsset: AppAssets.cardPrivacy,
                title: 'Privacy & About',
                subtitle: 'Privacy police, app information',
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const PrivacyAboutScreen(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),

              // 5. Log Out Action Button
              InkWell(
                onTap: () => _showLogoutDialog(context),
                borderRadius: BorderRadius.circular(12),
                child: const Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 8,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.logout_rounded,
                        color: Color(0xFFEF4444),
                        size: 22,
                      ),
                      SizedBox(width: 10),
                      Text(
                        'Log Out',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFFEF4444),
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
    );
  }

  Widget _buildMenuCard({
    required String iconAsset,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: const Color(0xFFE5E7EB),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            // Cards Icon - 48x48
            Image.asset(
              iconAsset,
              width: 48,
              height: 48,
              fit: BoxFit.contain,
            ),
            const SizedBox(width: 14),

            // Title and Subtitle
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
            ),

            // Chevron
            const Icon(
              Icons.chevron_right_rounded,
              color: Color(0xFF111827),
              size: 22,
            ),
          ],
        ),
      ),
    );
  }
}
