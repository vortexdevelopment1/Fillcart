import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../domain/models/rider_notification.dart';
import '../widgets/notification_card.dart';
import '../widgets/notification_empty_view.dart';

/// Notification Screen matching Figma reference (node 492:6449 / 2233:20217).
///
/// Features:
/// - Top App Bar:
///   * Back button on the left (pops navigator back to caller)
///   * Title: "Notification" (singular, Poppins SemiBold 18 px, #1B1C17)
///   * Settings gear icon on the right (24 x 24 px, display-only, Preferences deferred)
/// - Today section header with "Mark as all read" aligned on the right
/// - Displays 3 compact notification cards under Today (2 unread yellow, 1 read white)
/// - "Mark as all read" instantaneously toggles all unread yellow cards to read white cards
/// - Displays NotificationEmptyView when notification list is empty (e.g. /notifications?empty=true)
/// - Background: #F0F0F0
class NotificationScreen extends StatefulWidget {
  final List<RiderNotification>? initialNotifications;

  const NotificationScreen({
    super.key,
    this.initialNotifications,
  });

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  late List<RiderNotification> _notifications;

  @override
  void initState() {
    super.initState();
    _notifications = widget.initialNotifications ??
        RiderNotification.getInitialSampleNotifications();
  }

  /// Mark all notifications as read in local state.
  void _markAllAsRead() {
    setState(() {
      _notifications = _notifications.map((n) {
        return n.copyWith(isNew: false);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // 1. Header: Top Bar matching Figma reference
            _buildTopBar(context),

            // 2. Content: Empty state or Today notification list
            Expanded(
              child: _notifications.isEmpty
                  ? const NotificationEmptyView()
                  : _buildNotificationList(),
            ),
          ],
        ),
      ),
    );
  }

  /// Top App Bar matching Figma reference:
  /// - Back button on left
  /// - Title: "Notification" (singular)
  /// - Settings gear icon on right (display-only)
  Widget _buildTopBar(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 48,
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      alignment: Alignment.center,
      child: SizedBox(
        width: 328,
        height: 30,
        child: Row(
          children: [
            // Left: Back button (32 x 28 px touch target matching Figma node 492:6455)
            InkWell(
              key: const Key('notification_screen_back_button'),
              onTap: () {
                if (Navigator.of(context).canPop()) {
                  Navigator.of(context).pop();
                } else {
                  context.go('/home');
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

            // Center-Left: Heading "Notification" (singular, positioned at x=32 matching Figma node 492:6459)
            Expanded(
              child: Text(
                'Notification',
                key: const Key('notification_screen_title'),
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF1B1C17),
                  height: 1.2,
                ),
              ),
            ),

            // Right: Settings gear button (opens /notifications/preferences)
            InkWell(
              key: const Key('notification_settings_button'),
              onTap: () {
                context.push('/notifications/preferences');
              },
              borderRadius: BorderRadius.circular(20),
              child: const SizedBox(
                width: 24,
                height: 24,
                child: Center(
                  child: Icon(
                    Icons.settings_outlined,
                    key: Key('notification_settings_icon'),
                    size: 22,
                    color: Color(0xFF1B1C17),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Notification List with Today header & compact cards
  Widget _buildNotificationList() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      children: [
        // Section Header Row: "Today" on left, "Mark as all read" on right
        SizedBox(
          height: 32,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Today',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF1B1C17),
                  height: 1.2,
                ),
              ),
              InkWell(
                key: const Key('notification_mark_all_read_button'),
                onTap: _markAllAsRead,
                borderRadius: BorderRadius.circular(4),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 4.0,
                    vertical: 4.0,
                  ),
                  child: Text(
                    'Mark as all read',
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF777980),
                      height: 1.2,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),

        // Three Compact Notification Cards
        for (int i = 0; i < _notifications.length; i++) ...[
          NotificationCard(
            key: Key('notification_card_${_notifications[i].id}'),
            notification: _notifications[i],
          ),
          if (i < _notifications.length - 1) const SizedBox(height: 12),
        ],

        const SizedBox(height: 24),
      ],
    );
  }
}
