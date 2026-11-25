import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/core/widgets/vendor_toggle_switch.dart';

/// Screen 2: Notification Setting Screen matching Image 2 exactly.
class NotificationSettingScreen extends StatefulWidget {
  const NotificationSettingScreen({super.key});

  @override
  State<NotificationSettingScreen> createState() =>
      _NotificationSettingScreenState();
}

class _NotificationSettingScreenState extends State<NotificationSettingScreen> {
  bool _enableNotification = false;
  bool _orders = false;
  bool _payoutsEarnings = false;
  bool _accountVerification = true;
  bool _announcements = true;

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF0F0F0);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: SizedBox(
                height: 52,
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFFFFF),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: const [
                          BoxShadow(
                            offset: Offset(0, 1),
                            blurRadius: 2,
                            color: Color(0x1A000000),
                          ),
                        ],
                      ),
                      child: IconButton(
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                        icon: SvgPicture.asset(
                          AppAssets.svgBackArrow,
                          width: 20,
                          height: 20,
                          colorFilter: const ColorFilter.mode(
                            Color(0xFF111827),
                            BlendMode.srcIn,
                          ),
                        ),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ),
                    const Expanded(
                      child: Center(
                        child: Text(
                          'Notification Setting',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF111827),
                            height: 28 / 20,
                            letterSpacing: 0,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 36),
                  ],
                ),
              ),
            ),

            // Content List
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
                children: [
                  // Section 1: Notification permission
                  const Text(
                    'Notification permission',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3F4F6),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: SvgPicture.asset(
                              AppAssets.svgNotification,
                              width: 20,
                              height: 20,
                              colorFilter: const ColorFilter.mode(
                                Color(0xFF0F172A),
                                BlendMode.srcIn,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Enable Notification',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              SizedBox(height: 3),
                              Text(
                                'Receive important updates from fillcarts.',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 13,
                                  fontWeight: FontWeight.w400,
                                  color: Color(0xFF6B7280),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        VendorToggleSwitch(
                          value: _enableNotification,
                          onChanged: (val) {
                            setState(() {
                              _enableNotification = val;
                            });
                          },
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Section 2: Notification preference
                  const Text(
                    'Notification preference',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Item 1: Orders
                        _buildPreferenceTile(
                          iconPath: AppAssets.svgOrder,
                          title: 'Orders',
                          subtitle:
                              'New orders, order updates, cancellations and delivery status.',
                          value: _orders,
                          onChanged: (val) {
                            setState(() {
                              _orders = val;
                            });
                          },
                        ),
                        const Divider(
                          height: 1,
                          thickness: 1,
                          color: Color(0xFFF3F4F6),
                          indent: 16,
                          endIndent: 16,
                        ),

                        // Item 2: Payouts & Earnings
                        _buildPreferenceTile(
                          iconPath: AppAssets.svgRupees,
                          title: 'Payouts & Earnings',
                          subtitle:
                              'Payouts, settlement updates and earnings summaries.',
                          value: _payoutsEarnings,
                          onChanged: (val) {
                            setState(() {
                              _payoutsEarnings = val;
                            });
                          },
                        ),
                        const Divider(
                          height: 1,
                          thickness: 1,
                          color: Color(0xFFF3F4F6),
                          indent: 16,
                          endIndent: 16,
                        ),

                        // Item 3: Account & Verification
                        _buildPreferenceTile(
                          iconPath: AppAssets.svgAccountVerify,
                          title: 'Account & Verification',
                          subtitle:
                              'KYC, bank verification, document updates.',
                          value: _accountVerification,
                          onChanged: (val) {
                            setState(() {
                              _accountVerification = val;
                            });
                          },
                        ),
                        const Divider(
                          height: 1,
                          thickness: 1,
                          color: Color(0xFFF3F4F6),
                          indent: 16,
                          endIndent: 16,
                        ),

                        // Item 4: Announcements
                        _buildPreferenceTile(
                          iconPath: AppAssets.svgAnnouncement,
                          title: 'Announcements',
                          subtitle:
                              'New features, policy changes and important updates.',
                          value: _announcements,
                          onChanged: (val) {
                            setState(() {
                              _announcements = val;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPreferenceTile({
    required String iconPath,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: SvgPicture.asset(
                iconPath,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF0F172A),
                  BlendMode.srcIn,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
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
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF6B7280),
                    height: 1.25,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          VendorToggleSwitch(
            value: value,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
