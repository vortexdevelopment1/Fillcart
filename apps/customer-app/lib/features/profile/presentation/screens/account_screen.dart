import 'package:fillcart_customer/features/authentication/presentation/screens/login_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/about_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/app_settings_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/faq_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/personal_info_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/saved_address_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Account Screen matching Figma reference media_1795670070020_72a758b0.jpg.
class AccountScreen extends StatelessWidget {
  final String userName;
  final String phoneNumber;
  final String avatarPath;

  const AccountScreen({
    super.key,
    this.userName = 'Divya',
    this.phoneNumber = '+91 - 1236555866',
    this.avatarPath = 'assets/images/user_avatar_highres.png',
  });

  void _showNotice(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(milliseconds: 900),
      ),
    );
  }

  void _onLogout(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: const Text('Log out'),
        content: const Text('Are you sure you want to log out of Fillcarts?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogCtx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE11D48),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.of(dialogCtx).pop();
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute<void>(builder: (_) => const LoginScreen()),
                (route) => false,
              );
            },
            child: const Text('Log Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        systemNavigationBarColor: Color(0xFFFFFCF3),
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFCF3),
        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Warm Yellow Gradient Header with Navigation & Profile
              _buildHeader(context),
              const SizedBox(height: 18),

              // 3 Quick Action Cards: Saved Address, Payment Modes, Fillcarts Money
              _buildQuickActionCards(context),
              const SizedBox(height: 22),

              // Grouped Section: ACCOUNT
              _buildSectionGroup(
                context,
                title: 'ACCOUNT',
                items: [
                  _MenuItem(
                    icon: Icons.person_outline_rounded,
                    iconBg: const Color(0xFFFEF9C3),
                    iconColor: const Color(0xFFD97706),
                    title: 'Personal info',
                    subtitle: 'Name, phone, email',
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const PersonalInfoScreen(),
                        ),
                      );
                    },
                  ),
                  _MenuItem(
                    icon: Icons.card_giftcard_rounded,
                    iconBg: const Color(0xFFFEF9C3),
                    iconColor: const Color(0xFFD97706),
                    title: 'Refer & Earn',
                    subtitle: 'Get ₹100 for each referral',
                    onTap: () => _showNotice(context, 'Refer & Earn clicked'),
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Grouped Section: PREFERENCES
              _buildSectionGroup(
                context,
                title: 'PREFERENCES',
                items: [
                  _MenuItem(
                    icon: Icons.settings_outlined,
                    iconBg: const Color(0xFFFEF9C3),
                    iconColor: const Color(0xFFD97706),
                    title: 'App settings',
                    subtitle: 'Language, notifications, theme',
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const AppSettingsScreen(),
                        ),
                      );
                    },
                  ),
                  _MenuItem(
                    icon: Icons.headset_mic_outlined,
                    iconBg: const Color(0xFFFEF9C3),
                    iconColor: const Color(0xFFD97706),
                    title: 'Help & Support',
                    subtitle: 'FAQs, live chat, call us',
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const FaqScreen(),
                        ),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 18),

              // Grouped Section: MORE
              _buildSectionGroup(
                context,
                title: 'MORE',
                items: [
                  _MenuItem(
                    icon: Icons.description_outlined,
                    iconBg: const Color(0xFFFFEDD5),
                    iconColor: const Color(0xFFEA580C),
                    title: 'About Us',
                    subtitle: 'Terms, privacy and about the app',
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const AboutScreen(),
                        ),
                      );
                    },
                  ),
                  _MenuItem(
                    icon: Icons.logout_rounded,
                    iconBg: const Color(0xFFFFE4E6),
                    iconColor: const Color(0xFFE11D48),
                    title: 'Log out',
                    titleColor: const Color(0xFFE11D48),
                    subtitle: 'See you next time!',
                    onTap: () => _onLogout(context),
                  ),
                ],
              ),
              const SizedBox(height: 36),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFF9BF15),
            Color(0xFFFCD34D),
            Color(0xFFFEF08A),
            Color(0xFFFFFBEB),
            Color(0xFFFFFCF3),
          ],
          stops: [0.0, 0.40, 0.70, 0.90, 1.0],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Column(
            children: [
              // Navigation Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).maybePop(),
                    behavior: HitTestBehavior.opaque,
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: const Icon(Icons.arrow_back, color: Color(0xFF1E1E1E), size: 20),
                    ),
                  ),
                  const Text(
                    'Account',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1E1E1E),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => _showNotice(context, 'Support contact opened'),
                    behavior: HitTestBehavior.opaque,
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.9),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: const Icon(Icons.headset_mic_outlined, color: Color(0xFF1E1E1E), size: 20),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Profile Avatar with edit pencil badge
              Center(
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(24),
                        child: Image.asset(
                          avatarPath,
                          fit: BoxFit.cover,
                          errorBuilder: (_, _, _) => Image.asset(
                            'assets/images/image 6.png',
                            fit: BoxFit.cover,
                            errorBuilder: (_, _, _) => Container(
                              color: const Color(0xFF3B82F6),
                              child: const Icon(Icons.person, size: 54, color: Colors.white),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      right: -4,
                      bottom: -4,
                      child: GestureDetector(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => const PersonalInfoScreen(),
                            ),
                          );
                        },
                        child: Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFF1EEE6), width: 1.5),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.08),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          alignment: Alignment.center,
                          child: const Icon(
                            Icons.edit_outlined,
                            size: 15,
                            color: Color(0xFF1E1E1E),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // User Name
              Text(
                userName,
                style: const TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E1E1E),
                ),
              ),
              const SizedBox(height: 4),

              // User Phone
              Text(
                phoneNumber,
                style: const TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF4B5563),
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActionCards(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: _buildActionCard(
              context: context,
              icon: Icons.location_on_outlined,
              label: 'Saved\nAddress',
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const SavedAddressScreen(),
                  ),
                );
              },
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildActionCard(
              context: context,
              icon: Icons.credit_card_outlined,
              label: 'Payment\nModes',
              onTap: () => _showNotice(context, 'Payment Modes clicked'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildActionCard(
              context: context,
              icon: Icons.account_balance_wallet_outlined,
              label: 'Fillcarts\nMoney',
              onTap: () => _showNotice(context, 'Fillcarts Money clicked'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard({
    required BuildContext context,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        constraints: const BoxConstraints(minHeight: 102),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFF1EEE6)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.035),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 26,
              color: const Color(0xFFD97706),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E1E1E),
                height: 1.25,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionGroup(
    BuildContext context, {
    required String title,
    required List<_MenuItem> items,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF6B7280),
                letterSpacing: 0.8,
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFF1EEE6)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: List.generate(items.length, (idx) {
                final item = items[idx];
                final isLast = idx == items.length - 1;
                return Column(
                  children: [
                    InkWell(
                      onTap: item.onTap,
                      borderRadius: BorderRadius.vertical(
                        top: idx == 0 ? const Radius.circular(18) : Radius.zero,
                        bottom: isLast ? const Radius.circular(18) : Radius.zero,
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                        child: Row(
                          children: [
                            Container(
                              width: 38,
                              height: 38,
                              decoration: BoxDecoration(
                                color: item.iconBg,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              alignment: Alignment.center,
                              child: Icon(item.icon, size: 20, color: item.iconColor),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.title,
                                    style: TextStyle(
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w700,
                                      color: item.titleColor ?? const Color(0xFF1E1E1E),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    item.subtitle,
                                    style: const TextStyle(
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w500,
                                      color: Color(0xFF9CA3AF),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(
                              Icons.chevron_right_rounded,
                              size: 20,
                              color: Color(0xFF9CA3AF),
                            ),
                          ],
                        ),
                      ),
                    ),
                    if (!isLast)
                      const Divider(
                        height: 1,
                        thickness: 1,
                        indent: 14,
                        endIndent: 14,
                        color: Color(0xFFF3F4F6),
                      ),
                  ],
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final Color iconBg;
  final Color iconColor;
  final String title;
  final Color? titleColor;
  final String subtitle;
  final VoidCallback onTap;

  const _MenuItem({
    required this.icon,
    required this.iconBg,
    required this.iconColor,
    required this.title,
    this.titleColor,
    required this.subtitle,
    required this.onTap,
  });
}
