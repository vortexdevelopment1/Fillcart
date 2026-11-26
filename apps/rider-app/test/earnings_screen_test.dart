import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/earnings/presentation/screens/earnings_screen.dart';
import 'package:fillcart_rider/features/earnings/presentation/widgets/earnings_period_slider.dart';
import 'package:fillcart_rider/features/home/presentation/screens/home_screen.dart';
import 'package:fillcart_rider/features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import 'package:fillcart_rider/features/orders/presentation/screens/orders_screen.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('EarningsScreen & Widgets Tests (Batch 3)', () {
    testWidgets('EarningsPeriodSlider renders 3 tabs and handles switching', (
      WidgetTester tester,
    ) async {
      int? tappedIndex;

      await tester.pumpWidget(
        buildTestableWidget(
          Scaffold(
            body: EarningsPeriodSlider(
              selectedIndex: 0,
              onPeriodChanged: (val) => tappedIndex = val,
            ),
          ),
        ),
      );

      expect(find.byKey(const Key('earnings_period_slider')), findsOneWidget);
      expect(find.text('Today'), findsOneWidget);
      expect(find.text('Weekly'), findsOneWidget);
      expect(find.text('Monthly'), findsOneWidget);

      // Tap Weekly
      await tester.tap(find.byKey(const Key('earnings_slider_weekly_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(1));

      // Tap Monthly
      await tester.tap(find.byKey(const Key('earnings_slider_monthly_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(2));

      // Tap Today
      await tester.tap(find.byKey(const Key('earnings_slider_today_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(0));
    });

    testWidgets('EarningsScreen renders at 360 px without overflow and displays all specifications', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const EarningsScreen()),
      );
      await tester.pumpAndSettle();

      // 1. Heading
      final headingFinder = find.byKey(const Key('earnings_screen_heading'));
      expect(headingFinder, findsOneWidget);
      expect(tester.widget<Text>(headingFinder).data, equals('Earnings'));

      // 2. Earnings Period Slider
      expect(find.byKey(const Key('earnings_period_slider')), findsOneWidget);
      expect(find.byKey(const Key('earnings_slider_today_tab')), findsOneWidget);
      expect(find.byKey(const Key('earnings_slider_weekly_tab')), findsOneWidget);
      expect(find.byKey(const Key('earnings_slider_monthly_tab')), findsOneWidget);

      // 3. Line 13 Divider on Today screen
      expect(find.byKey(const Key('earnings_today_divider')), findsOneWidget);

      // 4. Wallet empty-state illustration & subtitle
      final walletFinder = find.byKey(const Key('earnings_wallet_illustration'));
      expect(walletFinder, findsOneWidget);
      final Image walletImage = tester.widget<Image>(walletFinder);
      expect(walletImage.width, equals(228));
      expect(walletImage.height, equals(193));
      expect(walletImage.fit, equals(BoxFit.contain));
      expect(
        (walletImage.image as AssetImage).assetName,
        equals('assets/images/wallet_empty.png'),
      );

      expect(find.byKey(const Key('earnings_empty_subtitle')), findsOneWidget);
      expect(
        find.text(
          'Complete your first delivery to start earning. Your earnings will appear here.',
        ),
        findsOneWidget,
      );

      // 5. Bottom Navigation Bar with Index 2 active
      final navBarFinder = find.byType(RiderBottomNavBar);
      expect(navBarFinder, findsOneWidget);
      final RiderBottomNavBar navBar = tester.widget<RiderBottomNavBar>(navBarFinder);
      expect(navBar.selectedIndex, equals(2));

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('Switching period tabs updates state without overflow', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const EarningsScreen()),
      );
      await tester.pumpAndSettle();

      // Initially Today: Line 13 is visible
      expect(find.byKey(const Key('earnings_today_divider')), findsOneWidget);

      // Switch to Weekly
      await tester.tap(find.byKey(const Key('earnings_slider_weekly_tab')));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('earnings_today_divider')), findsNothing);
      expect(find.byKey(const Key('earnings_wallet_illustration')), findsOneWidget);
      expect(
        find.text('Complete your first delivery to start earning. Your earnings will appear here.'),
        findsOneWidget,
      );

      // Switch to Monthly
      await tester.tap(find.byKey(const Key('earnings_slider_monthly_tab')));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('earnings_today_divider')), findsNothing);
      expect(find.byKey(const Key('earnings_wallet_illustration')), findsOneWidget);

      // Switch back to Today
      await tester.tap(find.byKey(const Key('earnings_slider_today_tab')));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('earnings_today_divider')), findsOneWidget);

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('RiderApp navigates to /earnings, and Home and Orders tabs navigate correctly', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      // 1. Initial location /earnings
      await tester.pumpWidget(
        const RiderApp(initialLocation: '/earnings'),
      );
      await tester.pumpAndSettle();

      expect(find.byType(EarningsScreen), findsOneWidget);
      final headingFinder = find.byKey(const Key('earnings_screen_heading'));
      expect(tester.widget<Text>(headingFinder).data, equals('Earnings'));

      // 2. Tap Home Tab in Bottom Navigation
      await tester.tap(find.byKey(const Key('nav_tab_home')));
      await tester.pumpAndSettle();
      expect(find.byType(HomeScreen), findsOneWidget);
      expect(find.text('Virat kohli (khachedu)'), findsOneWidget);

      // 3. From Home, tap Earnings Tab
      await tester.tap(find.byKey(const Key('nav_tab_earnings')));
      await tester.pumpAndSettle();
      expect(find.byType(EarningsScreen), findsOneWidget);

      // 4. Tap Orders Tab in Bottom Navigation
      await tester.tap(find.byKey(const Key('nav_tab_orders')));
      await tester.pumpAndSettle();
      expect(find.byType(OrdersScreen), findsOneWidget);
      expect(find.text('No Delivery Requests Yet'), findsOneWidget);

      await tester.binding.setSurfaceSize(null);
    });
  });
}
