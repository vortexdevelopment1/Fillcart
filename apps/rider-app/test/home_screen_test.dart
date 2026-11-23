import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/home/presentation/screens/home_screen.dart';
import 'package:fillcart_rider/features/home/presentation/widgets/rider_online_toggle_bar.dart';
import 'package:fillcart_rider/features/home/presentation/widgets/today_earnings_bar.dart';
import 'package:fillcart_rider/features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('HomeScreen & Widgets Tests (Batch 1)', () {
    testWidgets('RiderOnlineToggleBar toggles between Online and Offline', (
      WidgetTester tester,
    ) async {
      bool? latestState;

      await tester.pumpWidget(
        buildTestableWidget(
          Scaffold(
            body: RiderOnlineToggleBar(
              initialOnline: true,
              onToggleChanged: (val) => latestState = val,
            ),
          ),
        ),
      );

      // Verify initial Online state
      expect(find.byKey(const Key('rider_online_toggle_bar')), findsOneWidget);
      expect(find.textContaining('Online'), findsOneWidget);
      expect(find.textContaining('Offline'), findsNothing);

      // Tap toggle switch
      await tester.tap(find.byKey(const Key('rider_toggle_switch_button')));
      await tester.pumpAndSettle();

      // Verify toggled Offline state
      expect(latestState, isFalse);
      expect(find.textContaining('Offline'), findsOneWidget);

      // Tap again to switch back to Online
      await tester.tap(find.byKey(const Key('rider_toggle_switch_button')));
      await tester.pumpAndSettle();
      expect(latestState, isTrue);
      expect(find.textContaining('Online'), findsOneWidget);
    });

    testWidgets('TodayEarningsBar displays label and zero amount', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const Scaffold(
            body: TodayEarningsBar(amount: 0),
          ),
        ),
      );

      expect(find.byKey(const Key('today_earnings_bar')), findsOneWidget);
      expect(find.byKey(const Key('today_earnings_label')), findsOneWidget);
      expect(find.text('Today Earnings'), findsOneWidget);
      expect(find.text('₹'), findsOneWidget);
      expect(find.text('0'), findsOneWidget);
    });

    testWidgets('RiderBottomNavBar displays 4 tabs and handles tab taps', (
      WidgetTester tester,
    ) async {
      int? tappedIndex;

      await tester.pumpWidget(
        buildTestableWidget(
          Scaffold(
            body: RiderBottomNavBar(
              selectedIndex: 0,
              onTabSelected: (idx) => tappedIndex = idx,
            ),
          ),
        ),
      );

      expect(find.byKey(const Key('nav_tab_home')), findsOneWidget);
      expect(find.byKey(const Key('nav_tab_orders')), findsOneWidget);
      expect(find.byKey(const Key('nav_tab_earnings')), findsOneWidget);
      expect(find.byKey(const Key('nav_tab_dashboard')), findsOneWidget);

      // Tap Orders tab
      await tester.tap(find.byKey(const Key('nav_tab_orders')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(1));

      // Tap Earnings tab
      await tester.tap(find.byKey(const Key('nav_tab_earnings')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(2));

      // Tap Dashboard tab
      await tester.tap(find.byKey(const Key('nav_tab_dashboard')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(3));
    });

    testWidgets('HomeScreen renders all Figma specifications correctly', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const HomeScreen()),
      );
      await tester.pumpAndSettle();

      // 1. Profile Row
      expect(find.byKey(const Key('home_rider_name')), findsOneWidget);
      expect(find.text('Ms Dhoni'), findsOneWidget);
      expect(find.byKey(const Key('home_rider_location')), findsOneWidget);
      expect(find.text('Vijay Nagar, Indore'), findsOneWidget);
      expect(find.byKey(const Key('home_notification_button')), findsOneWidget);

      // 2. Toggle Bar
      expect(find.byKey(const Key('rider_online_toggle_bar')), findsOneWidget);

      // 3. Earnings Bar
      expect(find.byKey(const Key('today_earnings_bar')), findsOneWidget);

      // 4. Empty-state illustration & texts
      final illustrationFinder = find.byKey(const Key('home_scooter_illustration'));
      expect(illustrationFinder, findsOneWidget);
      final Image imageWidget = tester.widget<Image>(illustrationFinder);
      expect(imageWidget.width, equals(328));
      expect(imageWidget.height, equals(254));
      expect(imageWidget.fit, equals(BoxFit.contain));
      expect(
        (imageWidget.image as AssetImage).assetName,
        equals('assets/images/rider_scooter_empty.png'),
      );
      expect(find.byKey(const Key('home_empty_title')), findsOneWidget);
      expect(find.text('No Delivery Requests Yet'), findsOneWidget);
      expect(find.byKey(const Key('home_empty_subtitle')), findsOneWidget);
      expect(
        find.text(
          'Stay online and ready. We’ll notify you as soon as a delivery request  comes.',
        ),
        findsOneWidget,
      );

      // 5. Fixed Bottom Navigation Bar
      expect(find.byKey(const Key('rider_bottom_nav_bar')), findsOneWidget);

      // 6. Test tapping non-Home tab triggers SnackBar explanation without crash
      await tester.tap(find.byKey(const Key('nav_tab_orders')));
      await tester.pumpAndSettle();
      expect(
        find.text('Orders screen will be available in upcoming batches.'),
        findsOneWidget,
      );

      // Reset surface size
      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('App opens /home route successfully through RiderApp', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        const RiderApp(initialLocation: '/home'),
      );
      await tester.pumpAndSettle();

      expect(find.byType(HomeScreen), findsOneWidget);
      expect(find.text('No Delivery Requests Yet'), findsOneWidget);

      await tester.binding.setSurfaceSize(null);
    });
  });
}
