import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fillcart_vendor/features/dashboard/presentation/screens/vendor_dashboard_screen.dart';
import 'package:fillcart_vendor/features/notifications/presentation/screens/notification_screen.dart';
import 'package:fillcart_vendor/features/notifications/presentation/screens/notification_setting_screen.dart';

void main() {
  group('NotificationScreen Widget Tests', () {
    testWidgets('renders NotificationScreen with all components matching Image 1',
        (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: NotificationScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Verify Header
      expect(find.text('Notification'), findsOneWidget);

      // Verify Today section & "Mark all as read"
      expect(find.text('Today'), findsOneWidget);
      expect(find.text('Mark all as read'), findsOneWidget);

      // Verify Today notification cards
      expect(find.text('New order received'), findsOneWidget);
      expect(find.text('2 min ago'), findsOneWidget);
      expect(
        find.text('Order #FC9284 for ₹1,240. Prepare it for pickup.'),
        findsOneWidget,
      );

      expect(find.text('Payout processed'), findsOneWidget);
      expect(find.text('16 min ago'), findsOneWidget);
      expect(
        find.text(
          'Your weekly payout of ₹8,700 has been initiated to your bank account.',
        ),
        findsWidgets, // Also in Yesterday
      );

      // Verify Yesterday section
      expect(find.text('Yesterday'), findsOneWidget);
      expect(find.text('Earnings updated'), findsOneWidget);
      expect(find.text('1 day ago'), findsWidgets);
      expect(find.text('Your earnings for 10 Nov are ₹2,450.'), findsOneWidget);
      expect(find.text('Bank Account verifed'), findsOneWidget);
      expect(
        find.text('Order #FC9210 has been delivered successfully.'),
        findsWidgets,
      );

      // Tap "Mark all as read"
      await tester.tap(find.text('Mark all as read'));
      await tester.pumpAndSettle();

      // Notification cards remain with updated read status
      expect(find.text('New order received'), findsOneWidget);
    });

    testWidgets('tapping Settings gear navigates to NotificationSettingScreen',
        (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: NotificationScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Find top right IconButton (Settings)
      final iconButtons = find.byType(IconButton);
      expect(iconButtons, findsWidgets);

      // Tap the second icon button (gear)
      await tester.tap(iconButtons.at(1));
      await tester.pumpAndSettle();

      expect(find.byType(NotificationSettingScreen), findsOneWidget);
      expect(find.text('Notification Setting'), findsOneWidget);
    });
  });

  group('NotificationSettingScreen Widget Tests', () {
    testWidgets(
        'renders NotificationSettingScreen with permission and preference cards matching Image 2',
        (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: NotificationSettingScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Verify Header
      expect(find.text('Notification Setting'), findsOneWidget);

      // Section 1: Notification permission
      expect(find.text('Notification permission'), findsOneWidget);
      expect(find.text('Enable Notification'), findsOneWidget);
      expect(
        find.text('Receive important updates from fillcarts.'),
        findsOneWidget,
      );

      // Section 2: Notification preference
      expect(find.text('Notification preference'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(
        find.text(
          'New orders, order updates, cancellations and delivery status.',
        ),
        findsOneWidget,
      );
      expect(find.text('Payouts & Earnings'), findsOneWidget);
      expect(
        find.text('Payouts, settlement updates and earnings summaries.'),
        findsOneWidget,
      );
      expect(find.text('Account & Verification'), findsOneWidget);
      expect(
        find.text('KYC, bank verification, document updates.'),
        findsOneWidget,
      );
      expect(find.text('Announcements'), findsOneWidget);
      expect(
        find.text('New features, policy changes and important updates.'),
        findsOneWidget,
      );

      // Tap first switch (Enable Notification)
      final switches = find.byType(GestureDetector);
      expect(switches, findsWidgets);
      await tester.tap(switches.first);
      await tester.pumpAndSettle();
    });

    testWidgets('tapping back button pops screen', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: NotificationSettingScreen(),
        ),
      );
      await tester.pumpAndSettle();

      final backBtn = find.byType(IconButton).first;
      await tester.tap(backBtn);
      await tester.pumpAndSettle();
    });
  });

  group('Dashboard to Notification Navigation', () {
    testWidgets('tapping notification icon on dashboard opens NotificationScreen',
        (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: VendorDashboardScreen(),
        ),
      );
      await tester.pumpAndSettle();

      final bellBtn = find.byKey(const Key('dashboard_notification_button'));
      expect(bellBtn, findsOneWidget);

      await tester.tap(bellBtn);
      await tester.pumpAndSettle();

      expect(find.byType(NotificationScreen), findsOneWidget);
    });
  });
}
