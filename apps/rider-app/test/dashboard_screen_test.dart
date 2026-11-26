import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/dashboard/presentation/screens/dashboard_screen.dart';
import 'package:fillcart_rider/features/earnings/presentation/screens/earnings_screen.dart';
import 'package:fillcart_rider/features/home/presentation/screens/home_screen.dart';
import 'package:fillcart_rider/features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import 'package:fillcart_rider/features/orders/presentation/screens/orders_screen.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('DashboardScreen & Widgets Tests (Batch 4)', () {
    testWidgets('DashboardScreen renders at 360 px without overflow and displays all specifications', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const DashboardScreen()),
      );
      await tester.pumpAndSettle();

      // 1. Header: Profile Name & Location
      expect(find.byKey(const Key('dashboard_rider_name')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('dashboard_rider_name'))).data,
        equals('Ms Dhoni'),
      );
      expect(find.byKey(const Key('dashboard_rider_location')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('dashboard_rider_location'))).data,
        equals('Vijay Nagar, Indore'),
      );
      expect(find.byKey(const Key('dashboard_notification_button')), findsOneWidget);

      // Header Action Bars: Toggle & Earnings
      expect(find.byKey(const Key('rider_online_toggle_bar')), findsOneWidget);
      expect(find.byKey(const Key('today_earnings_bar')), findsOneWidget);

      // 2. Section 1: Today's Summary
      expect(find.byKey(const Key('todays_summary_heading')), findsOneWidget);
      expect(find.byKey(const Key('available_orders_card')), findsOneWidget);
      expect(find.byKey(const Key('available_orders_count')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('available_orders_count'))).data,
        equals('0'),
      );
      expect(find.byKey(const Key('completed_orders_card')), findsOneWidget);
      expect(find.byKey(const Key('completed_orders_count')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('completed_orders_count'))).data,
        equals('0'),
      );

      // 3. Section 2: Today's Earnings Snapshot
      expect(find.byKey(const Key('earnings_snapshot_heading')), findsOneWidget);
      expect(find.byKey(const Key('earnings_snapshot_card')), findsOneWidget);
      expect(find.byKey(const Key('earned_today_label')), findsOneWidget);
      expect(find.byKey(const Key('earned_today_amount')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('earned_today_amount'))).data,
        equals('₹0'),
      );
      expect(find.byKey(const Key('view_earnings_button')), findsOneWidget);

      // 4. Section 3: Performance Overview
      expect(find.byKey(const Key('performance_overview_heading')), findsOneWidget);
      expect(find.byKey(const Key('online_hours_card')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('online_hours_value'))).data,
        equals('0'),
      );
      expect(find.byKey(const Key('rider_rating_card')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('rider_rating_value'))).data,
        equals('0'),
      );
      expect(find.byKey(const Key('distance_covered_card')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('distance_covered_value'))).data,
        equals('0'),
      );
      expect(find.byKey(const Key('orders_completed_card')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('orders_completed_value'))).data,
        equals('0'),
      );

      // 5. Scroll down to verify Sections 4 and 5
      await tester.drag(find.byKey(const Key('dashboard_scroll_view')), const Offset(0, -400));
      await tester.pumpAndSettle();

      // Section 4: Incentives Progress
      expect(find.byKey(const Key('incentives_progress_heading')), findsOneWidget);
      expect(find.byKey(const Key('incentive_progress_card')), findsOneWidget);
      expect(find.byKey(const Key('incentive_bonus_title')), findsOneWidget);
      expect(find.byKey(const Key('incentive_subtitle')), findsOneWidget);
      expect(find.byKey(const Key('incentive_orders_counter')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('incentive_orders_counter'))).data,
        equals('0/5 orders'),
      );

      // Section 5: Ratings Breakdown
      expect(find.byKey(const Key('ratings_heading')), findsOneWidget);
      expect(find.byKey(const Key('ratings_breakdown_card')), findsOneWidget);
      expect(find.byKey(const Key('rating_row_5')), findsOneWidget);
      expect(find.byKey(const Key('rating_row_4')), findsOneWidget);
      expect(find.byKey(const Key('rating_row_3')), findsOneWidget);
      expect(find.byKey(const Key('rating_row_2')), findsOneWidget);
      expect(find.byKey(const Key('rating_row_1')), findsOneWidget);
      expect(find.byKey(const Key('rating_score_value')), findsOneWidget);
      expect(
        tester.widget<Text>(find.byKey(const Key('rating_score_value'))).data,
        equals('0'),
      );
      expect(find.byKey(const Key('rating_star_icon')), findsOneWidget);

      // 6. Bottom Navigation Bar with Index 3 active
      final navBarFinder = find.byType(RiderBottomNavBar);
      expect(navBarFinder, findsOneWidget);
      final RiderBottomNavBar navBar = tester.widget<RiderBottomNavBar>(navBarFinder);
      expect(navBar.selectedIndex, equals(3));

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('Online/Offline toggle updates state without error', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const DashboardScreen()),
      );
      await tester.pumpAndSettle();

      // Initially Online
      final statusTextFinder = find.byKey(const Key('rider_status_text'));
      expect(statusTextFinder, findsOneWidget);
      final Text statusText1 = tester.widget<Text>(statusTextFinder);
      expect(statusText1.textSpan!.toPlainText(), contains('Online'));

      // Tap toggle button
      await tester.tap(find.byKey(const Key('rider_toggle_switch_button')));
      await tester.pumpAndSettle();

      // State is now Offline
      final Text statusText2 = tester.widget<Text>(statusTextFinder);
      expect(statusText2.textSpan!.toPlainText(), contains('Offline'));

      // Tap toggle button again
      await tester.tap(find.byKey(const Key('rider_toggle_switch_button')));
      await tester.pumpAndSettle();

      // State is restored to Online
      final Text statusText3 = tester.widget<Text>(statusTextFinder);
      expect(statusText3.textSpan!.toPlainText(), contains('Online'));

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('DashboardScreen renders without overflow at narrow 320 px width', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(320, 700));

      await tester.pumpWidget(
        buildTestableWidget(const DashboardScreen()),
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('dashboard_screen_scaffold')), findsOneWidget);
      expect(find.byKey(const Key('todays_summary_heading')), findsOneWidget);
      expect(find.byKey(const Key('earnings_snapshot_heading')), findsOneWidget);

      // No overflow exceptions thrown
      expect(tester.takeException(), isNull);

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('Every supplied Figma icon asset renders successfully in Dashboard and BottomNav', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const DashboardScreen()),
      );
      await tester.pumpAndSettle();

      // Notification icon
      final notificationImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('dashboard_notification_button')),
          matching: find.byType(Image),
        ),
      );
      expect((notificationImage.image as AssetImage).assetName, equals('assets/icons/home_notification.png'));

      // Available orders icon
      final availOrdersImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('available_orders_card')),
          matching: find.byType(Image),
        ),
      );
      expect((availOrdersImage.image as AssetImage).assetName, equals('assets/icons/dashboard_available_orders.png'));

      // Completed orders icon
      final completedOrdersImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('completed_orders_card')),
          matching: find.byType(Image),
        ),
      );
      expect((completedOrdersImage.image as AssetImage).assetName, equals('assets/icons/dashboard_completed_orders.png'));

      // Earned today icon
      final earnedTodayImage = tester.widget<Image>(
        find.byKey(const Key('earned_today_icon')),
      );
      expect((earnedTodayImage.image as AssetImage).assetName, equals('assets/icons/dashboard_earned_today.png'));

      // Online hours icon
      final onlineHoursImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('online_hours_card')),
          matching: find.byType(Image),
        ),
      );
      expect((onlineHoursImage.image as AssetImage).assetName, equals('assets/icons/dashboard_online_hours.png'));

      // Rider rating star icon
      final riderRatingImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('rider_rating_card')),
          matching: find.byType(Image),
        ),
      );
      expect((riderRatingImage.image as AssetImage).assetName, equals('assets/icons/dashboard_rider_rating.png'));

      // Distance covered icon
      final distanceImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('distance_covered_card')),
          matching: find.byType(Image),
        ),
      );
      expect((distanceImage.image as AssetImage).assetName, equals('assets/icons/dashboard_distance.png'));

      // Orders completed icon
      final ordersCompletedImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('orders_completed_card')),
          matching: find.byType(Image),
        ),
      );
      expect((ordersCompletedImage.image as AssetImage).assetName, equals('assets/icons/dashboard_orders_completed.png'));

      // Scroll to bottom
      await tester.drag(find.byKey(const Key('dashboard_scroll_view')), const Offset(0, -400));
      await tester.pumpAndSettle();

      // Incentive icon
      final incentiveImage = tester.widget<Image>(
        find.byKey(const Key('incentive_trophy_icon')),
      );
      expect((incentiveImage.image as AssetImage).assetName, equals('assets/icons/dashboard_incentive.png'));

      // Rating badge star icon (shared!)
      final badgeStarImage = tester.widget<Image>(
        find.byKey(const Key('rating_star_icon')),
      );
      expect((badgeStarImage.image as AssetImage).assetName, equals('assets/icons/dashboard_rider_rating.png'));

      // Nav icons
      final navHomeImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('nav_tab_home')),
          matching: find.byType(Image),
        ),
      );
      expect((navHomeImage.image as AssetImage).assetName, equals('assets/icons/nav_home.png'));

      final navOrdersImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('nav_tab_orders')),
          matching: find.byType(Image),
        ),
      );
      expect((navOrdersImage.image as AssetImage).assetName, equals('assets/icons/nav_orders.png'));

      final navEarningsImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('nav_tab_earnings')),
          matching: find.byType(Image),
        ),
      );
      expect((navEarningsImage.image as AssetImage).assetName, equals('assets/icons/nav_earnings.png'));

      final navDashboardImage = tester.widget<Image>(
        find.descendant(
          of: find.byKey(const Key('nav_tab_dashboard')),
          matching: find.byType(Image),
        ),
      );
      expect((navDashboardImage.image as AssetImage).assetName, equals('assets/icons/nav_dashboard_active.png'));

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('RiderApp navigates to /dashboard, View Earnings navigates, and cross-navigation works', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      // 1. Initial location /dashboard
      await tester.pumpWidget(
        const RiderApp(initialLocation: '/dashboard'),
      );
      await tester.pumpAndSettle();

      expect(find.byType(DashboardScreen), findsOneWidget);

      // 2. Tap View Earnings button inside Today's Earnings Snapshot card
      await tester.tap(find.byKey(const Key('view_earnings_button')));
      await tester.pumpAndSettle();

      // Navigated to EarningsScreen
      expect(find.byType(EarningsScreen), findsOneWidget);
      expect(find.byKey(const Key('earnings_screen_heading')), findsOneWidget);

      // 3. Tap Dashboard Tab in bottom navigation bar
      await tester.tap(find.byKey(const Key('nav_tab_dashboard')));
      await tester.pumpAndSettle();
      expect(find.byType(DashboardScreen), findsOneWidget);

      // 4. Tap Home Tab in bottom navigation bar
      await tester.tap(find.byKey(const Key('nav_tab_home')));
      await tester.pumpAndSettle();
      expect(find.byType(HomeScreen), findsOneWidget);

      // 5. Tap Orders Tab in bottom navigation bar
      await tester.tap(find.byKey(const Key('nav_tab_orders')));
      await tester.pumpAndSettle();
      expect(find.byType(OrdersScreen), findsOneWidget);

      // 6. Return to Dashboard Tab
      await tester.tap(find.byKey(const Key('nav_tab_dashboard')));
      await tester.pumpAndSettle();
      expect(find.byType(DashboardScreen), findsOneWidget);

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('Active/inactive navigation icons switch correctly across all 4 screens', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      String getIconAssetForTab(Key tabKey) {
        final image = tester.widget<Image>(
          find.descendant(
            of: find.byKey(tabKey),
            matching: find.byType(Image),
          ),
        );
        return (image.image as AssetImage).assetName;
      }

      // 1. Home Screen: Home is active, others inactive
      await tester.pumpWidget(
        const RiderApp(initialLocation: '/home'),
      );
      await tester.pumpAndSettle();

      expect(getIconAssetForTab(const Key('nav_tab_home')), equals('assets/icons/nav_home_active.png'));
      expect(getIconAssetForTab(const Key('nav_tab_orders')), equals('assets/icons/nav_orders.png'));
      expect(getIconAssetForTab(const Key('nav_tab_earnings')), equals('assets/icons/nav_earnings.png'));
      expect(getIconAssetForTab(const Key('nav_tab_dashboard')), equals('assets/icons/nav_dashboard.png'));

      // 2. Navigate to Orders Screen: Orders becomes active, Home becomes inactive
      await tester.tap(find.byKey(const Key('nav_tab_orders')));
      await tester.pumpAndSettle();

      expect(getIconAssetForTab(const Key('nav_tab_home')), equals('assets/icons/nav_home.png'));
      expect(getIconAssetForTab(const Key('nav_tab_orders')), equals('assets/icons/nav_orders_active.png'));
      expect(getIconAssetForTab(const Key('nav_tab_earnings')), equals('assets/icons/nav_earnings.png'));
      expect(getIconAssetForTab(const Key('nav_tab_dashboard')), equals('assets/icons/nav_dashboard.png'));

      // 3. Navigate to Earnings Screen: Earnings becomes active, Orders becomes inactive
      await tester.tap(find.byKey(const Key('nav_tab_earnings')));
      await tester.pumpAndSettle();

      expect(getIconAssetForTab(const Key('nav_tab_home')), equals('assets/icons/nav_home.png'));
      expect(getIconAssetForTab(const Key('nav_tab_orders')), equals('assets/icons/nav_orders.png'));
      expect(getIconAssetForTab(const Key('nav_tab_earnings')), equals('assets/icons/nav_earnings_active.png'));
      expect(getIconAssetForTab(const Key('nav_tab_dashboard')), equals('assets/icons/nav_dashboard.png'));

      // 4. Navigate to Dashboard Screen: Dashboard becomes active, Earnings becomes inactive
      await tester.tap(find.byKey(const Key('nav_tab_dashboard')));
      await tester.pumpAndSettle();

      expect(getIconAssetForTab(const Key('nav_tab_home')), equals('assets/icons/nav_home.png'));
      expect(getIconAssetForTab(const Key('nav_tab_orders')), equals('assets/icons/nav_orders.png'));
      expect(getIconAssetForTab(const Key('nav_tab_earnings')), equals('assets/icons/nav_earnings.png'));
      expect(getIconAssetForTab(const Key('nav_tab_dashboard')), equals('assets/icons/nav_dashboard_active.png'));

      // 5. Navigate back to Home: Home becomes active again, Dashboard becomes inactive
      await tester.tap(find.byKey(const Key('nav_tab_home')));
      await tester.pumpAndSettle();

      expect(getIconAssetForTab(const Key('nav_tab_home')), equals('assets/icons/nav_home_active.png'));
      expect(getIconAssetForTab(const Key('nav_tab_orders')), equals('assets/icons/nav_orders.png'));
      expect(getIconAssetForTab(const Key('nav_tab_earnings')), equals('assets/icons/nav_earnings.png'));
      expect(getIconAssetForTab(const Key('nav_tab_dashboard')), equals('assets/icons/nav_dashboard.png'));

      await tester.binding.setSurfaceSize(null);
    });
  });
}
