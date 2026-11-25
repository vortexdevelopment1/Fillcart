import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import '../../models/vendor_notification.dart';
import 'notification_setting_screen.dart';

/// Screen 1: Notification Screen matching Image 1 exactly.
class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  late List<VendorNotification> _todayNotifications;
  late List<VendorNotification> _yesterdayNotifications;

  @override
  void initState() {
    super.initState();
    _initNotifications();
  }

  void _initNotifications() {
    _todayNotifications = [
      VendorNotification(
        id: '1',
        title: 'New order received',
        subtitle: 'Order #FC9284 for ₹1,240. Prepare it for pickup.',
        timeAgo: '2 min ago',
        isToday: true,
        isRead: false,
      ),
      VendorNotification(
        id: '2',
        title: 'Payout processed',
        subtitle:
            'Your weekly payout of ₹8,700 has been initiated to your bank account.',
        timeAgo: '16 min ago',
        isToday: true,
        isRead: false,
      ),
      VendorNotification(
        id: '3',
        title: 'Order delivered',
        subtitle: 'Order #FC9210 has been delivered successfully.',
        timeAgo: '1 hr ago',
        isToday: true,
        isRead: true,
      ),
    ];

    _yesterdayNotifications = [
      VendorNotification(
        id: '4',
        title: 'Earnings updated',
        subtitle: 'Your earnings for 10 Nov are ₹2,450.',
        timeAgo: '1 day ago',
        isToday: false,
        isRead: true,
      ),
      VendorNotification(
        id: '5',
        title: 'Bank Account verifed',
        subtitle:
            'Your weekly payout of ₹8,700 has been initiated to your bank account.',
        timeAgo: '1 day ago',
        isToday: false,
        isRead: true,
      ),
      VendorNotification(
        id: '6',
        title: 'Order delivered',
        subtitle: 'Order #FC9210 has been delivered successfully.',
        timeAgo: '1 day ago',
        isToday: false,
        isRead: true,
      ),
    ];
  }

  void _markAllAsRead() {
    setState(() {
      for (var item in _todayNotifications) {
        item.isRead = true;
      }
    });
  }

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
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                    const Text(
                      'Notification',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF111827),
                        height: 28 / 20,
                        letterSpacing: 0,
                      ),
                    ),
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: const Color.fromRGBO(255, 255, 255, 0.36),
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
                          AppAssets.svgSettings,
                          width: 20,
                          height: 20,
                          colorFilter: const ColorFilter.mode(
                            Color(0xFF111827),
                            BlendMode.srcIn,
                          ),
                        ),
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => const NotificationSettingScreen(),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Notification Cards
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                children: [
                  // Today Header Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Today',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      InkWell(
                        onTap: _markAllAsRead,
                        borderRadius: BorderRadius.circular(6),
                        child: const Padding(
                          padding:
                              EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                          child: Text(
                            'Mark all as read',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF2563EB),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Today Cards
                  ..._todayNotifications.map(_buildNotificationCard),

                  const SizedBox(height: 16),

                  // Yesterday Header Row
                  const Text(
                    'Yesterday',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Yesterday Cards
                  ..._yesterdayNotifications.map(_buildNotificationCard),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationCard(VendorNotification notification) {
    final bool isUnread = !notification.isRead;
    const Color unreadBg = Color(0xFFDCFB77);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUnread ? unreadBg : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: isUnread
            ? null
            : [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title & TimeAgo Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  notification.title,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF0F172A),
                    height: 1.2,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                notification.timeAgo,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 13,
                  fontWeight: FontWeight.w400,
                  color:
                      isUnread ? const Color(0xFF4B5563) : const Color(0xFF6B7280),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Subtitle
          Text(
            notification.subtitle,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: isUnread ? const Color(0xFF374151) : const Color(0xFF6B7280),
              height: 1.35,
            ),
          ),
        ],
      ),
    );
  }
}
