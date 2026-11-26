import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../widgets/notification_preference_tile.dart';

/// Notification Settings screen matching Figma node `2225:59694`.
///
/// Features:
/// - Light-grey screen background (#F0F0F0)
/// - Top App Bar:
///   * Back button (32 x 28 px touch target) pops back to caller or falls back to /notifications
///   * Title: "Notification Setting" (Poppins SemiBold 18 px, #1B1C17)
///   * No right-side action
/// - Section 1: "Notification permission"
///   * One white rounded card containing "Enable Notification" (initial state: OFF)
/// - Section 2: "Notification preference"
///   * One white rounded card containing 4 vertically stacked rows with subtle dividers:
///     1. Orders (initial: OFF)
///     2. Payouts & Earnings (initial: OFF)
///     3. Safety Alerts (initial: ON)
///     4. Announcements (initial: ON)
/// - Immediate local state changes, independent toggles, no persistent storage, no Save button.
/// - Standalone full-screen destination (bottom navigation bar hidden).
class NotificationPreferencesScreen extends StatefulWidget {
  const NotificationPreferencesScreen({super.key});

  @override
  State<NotificationPreferencesScreen> createState() =>
      _NotificationPreferencesScreenState();
}

class _NotificationPreferencesScreenState
    extends State<NotificationPreferencesScreen> {
  // Initial toggle states matching specification:
  bool _enableNotification = false; // OFF
  bool _orders = false; // OFF
  bool _payouts = false; // OFF
  bool _safetyAlerts = true; // ON
  bool _announcements = true; // ON

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      body: SafeArea(
        child: Column(
          children: [
            // Header: Top Bar matching specification
            _buildHeader(context),

            // Body: Scrollable sections
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 16.0,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // --- Section 1: Notification permission ---
                    _buildSectionHeader('Notification permission'),
                    const SizedBox(height: 8),
                    _buildPermissionCard(),

                    const SizedBox(height: 24),

                    // --- Section 2: Notification preference ---
                    _buildSectionHeader('Notification preference'),
                    const SizedBox(height: 8),
                    _buildPreferencesCard(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Top App Bar matching specification:
  /// - Back button on the left (returns to NotificationScreen)
  /// - Title: "Notification Setting"
  /// - No right-side action
  Widget _buildHeader(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      alignment: Alignment.center,
      color: Colors.transparent,
      child: SizedBox(
        width: 328,
        height: 30,
        child: Row(
          children: [
            // Left: Back button (32 x 28 px touch target)
            InkWell(
              key: const Key('notification_preferences_back_button'),
              onTap: () {
                if (Navigator.of(context).canPop()) {
                  Navigator.of(context).pop();
                } else {
                  context.go('/notifications');
                }
              },
              borderRadius: BorderRadius.circular(4),
              child: const SizedBox(
                width: 32,
                height: 28,
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Icon(
                    Icons.arrow_back,
                    size: 20,
                    color: Color(0xFF1B1C17),
                  ),
                ),
              ),
            ),

            // Title: "Notification Setting"
            Expanded(
              child: Text(
                'Notification Setting',
                key: const Key('notification_preferences_title'),
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF1B1C17),
                  height: 1.2,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Section Header
  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4.0),
      child: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: const Color(0xFF5B5B5B),
          height: 1.3,
        ),
      ),
    );
  }

  /// Section 1: Notification permission card
  Widget _buildPermissionCard() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB), width: 1.0),
      ),
      child: NotificationPreferenceTile(
        tileKey: const Key('notification_setting_enable_tile'),
        titleKey: const Key('notification_setting_enable_title'),
        descriptionKey: const Key('notification_setting_enable_desc'),
        switchKey: const Key('notification_setting_enable_switch'),
        iconWidget: Image.asset(
          'assets/icons/notification_permission.png',
          width: 20,
          height: 20,
          fit: BoxFit.contain,
        ),
        title: 'Enable Notification',
        description: 'Receive important updates from fillcarts.',
        isEnabled: _enableNotification,
        onChanged: (val) {
          setState(() {
            _enableNotification = val;
          });
        },
      ),
    );
  }

  /// Section 2: Notification preference card with 4 rows & dividers
  Widget _buildPreferencesCard() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB), width: 1.0),
      ),
      child: Column(
        children: [
          // Row 1: Orders (Initial: OFF)
          NotificationPreferenceTile(
            tileKey: const Key('notification_setting_orders_tile'),
            titleKey: const Key('notification_setting_orders_title'),
            descriptionKey: const Key('notification_setting_orders_desc'),
            switchKey: const Key('notification_setting_orders_switch'),
            iconWidget: Image.asset(
              'assets/icons/notification_orders.png',
              width: 20,
              height: 20,
              fit: BoxFit.contain,
            ),
            title: 'Orders',
            description:
                'New orders, order updates, cancellations and delivery status.',
            isEnabled: _orders,
            onChanged: (val) {
              setState(() {
                _orders = val;
              });
            },
          ),
          const Divider(
            height: 1,
            thickness: 1,
            color: Color(0xFFF2F4F7),
            indent: 16,
            endIndent: 16,
          ),

          // Row 2: Payouts & Earnings (Initial: OFF)
          NotificationPreferenceTile(
            tileKey: const Key('notification_setting_payouts_tile'),
            titleKey: const Key('notification_setting_payouts_title'),
            descriptionKey: const Key('notification_setting_payouts_desc'),
            switchKey: const Key('notification_setting_payouts_switch'),
            iconWidget: Image.asset(
              'assets/icons/notification_payouts.png',
              width: 20,
              height: 20,
              fit: BoxFit.contain,
            ),
            title: 'Payouts & Earnings',
            description:
                'Payouts, settlement updates and earnings summaries.',
            isEnabled: _payouts,
            onChanged: (val) {
              setState(() {
                _payouts = val;
              });
            },
          ),
          const Divider(
            height: 1,
            thickness: 1,
            color: Color(0xFFF2F4F7),
            indent: 16,
            endIndent: 16,
          ),

          // Row 3: Safety Alerts (Initial: ON)
          NotificationPreferenceTile(
            tileKey: const Key('notification_setting_safety_tile'),
            titleKey: const Key('notification_setting_safety_title'),
            descriptionKey: const Key('notification_setting_safety_desc'),
            switchKey: const Key('notification_setting_safety_switch'),
            iconWidget: Image.asset(
              'assets/icons/notification_safety.png',
              width: 20,
              height: 20,
              fit: BoxFit.contain,
            ),
            title: 'Safety Alerts',
            description: 'Emergency and safety alerts',
            isEnabled: _safetyAlerts,
            onChanged: (val) {
              setState(() {
                _safetyAlerts = val;
              });
            },
          ),
          const Divider(
            height: 1,
            thickness: 1,
            color: Color(0xFFF2F4F7),
            indent: 16,
            endIndent: 16,
          ),

          // Row 4: Announcements (Initial: ON)
          NotificationPreferenceTile(
            tileKey: const Key('notification_setting_announcements_tile'),
            titleKey: const Key('notification_setting_announcements_title'),
            descriptionKey: const Key('notification_setting_announcements_desc'),
            switchKey: const Key('notification_setting_announcements_switch'),
            iconWidget: Image.asset(
              'assets/icons/notification_announcements.png',
              width: 20,
              height: 20,
              fit: BoxFit.contain,
            ),
            title: 'Announcements',
            description:
                'New features, policy changes and important updates.',
            isEnabled: _announcements,
            onChanged: (val) {
              setState(() {
                _announcements = val;
              });
            },
          ),
        ],
      ),
    );
  }
}
