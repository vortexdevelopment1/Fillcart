import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/home/presentation/screens/home_screen.dart';
import 'package:fillcart_rider/features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import 'package:fillcart_rider/features/orders/presentation/screens/orders_screen.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/orders_slider_bar.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('OrdersScreen & Widgets Tests (Batch 2)', () {
    testWidgets('OrdersSliderBar switches tabs and fires callback', (
      WidgetTester tester,
    ) async {
      int? tappedIndex;

      await tester.pumpWidget(
        buildTestableWidget(
          Scaffold(
            body: OrdersSliderBar(
              selectedIndex: 0,
              onTabChanged: (val) => tappedIndex = val,
            ),
          ),
        ),
      );

      expect(find.byKey(const Key('orders_slider_bar')), findsOneWidget);
      expect(find.text('Active Orders'), findsOneWidget);
      expect(find.text('Completed Orders'), findsOneWidget);

      // Tap Completed Orders tab
      await tester.tap(find.byKey(const Key('orders_slider_completed_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(1));

      // Tap Active Orders tab
      await tester.tap(find.byKey(const Key('orders_slider_active_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(0));
    });

    testWidgets('OrdersScreen renders initial Active Orders empty state correctly', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const OrdersScreen()),
      );
      await tester.pumpAndSettle();

      // 1. Heading
      final headingFinder = find.byKey(const Key('orders_screen_heading'));
      expect(headingFinder, findsOneWidget);
      expect(tester.widget<Text>(headingFinder).data, equals('Orders'));

      // 2. Orders Slider
      expect(find.byKey(const Key('orders_slider_bar')), findsOneWidget);
      expect(find.byKey(const Key('orders_slider_active_tab')), findsOneWidget);
      expect(find.byKey(const Key('orders_slider_completed_tab')), findsOneWidget);

      // 3. Active Empty-State Illustration & Text
      final activeIllustrationFinder = find.byKey(const Key('orders_active_illustration'));
      expect(activeIllustrationFinder, findsOneWidget);
      final Image activeImage = tester.widget<Image>(activeIllustrationFinder);
      expect(activeImage.width, equals(328));
      expect(activeImage.height, equals(254));
      expect(activeImage.fit, equals(BoxFit.contain));
      expect(
        (activeImage.image as AssetImage).assetName,
        equals('assets/images/rider_scooter_empty.png'),
      );

      expect(find.byKey(const Key('orders_active_empty_title')), findsOneWidget);
      expect(find.text('No Delivery Requests Yet'), findsOneWidget);
      expect(find.byKey(const Key('orders_active_empty_subtitle')), findsOneWidget);
      expect(find.text('Stay online to receive delivery requests.'), findsOneWidget);

      // Completed empty state should not be visible initially
      expect(find.byKey(const Key('orders_completed_illustration')), findsNothing);
      expect(find.text('No Completed Orders Yet'), findsNothing);

      // 4. Bottom Navigation Bar with Index 1 active
      expect(find.byKey(const Key('rider_bottom_nav_bar')), findsOneWidget);
      final navBarFinder = find.byType(RiderBottomNavBar);
      expect(navBarFinder, findsOneWidget);
      final RiderBottomNavBar navBar = tester.widget<RiderBottomNavBar>(navBarFinder);
      expect(navBar.selectedIndex, equals(1));

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('Tapping Completed Orders displays completed state, and tapping Active returns', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const OrdersScreen()),
      );
      await tester.pumpAndSettle();

      // Initially on Active Orders
      expect(find.text('No Delivery Requests Yet'), findsOneWidget);
      expect(find.text('No Completed Orders Yet'), findsNothing);

      // Tap Completed Orders Tab
      await tester.tap(find.byKey(const Key('orders_slider_completed_tab')));
      await tester.pumpAndSettle();

      // Now Completed Orders state should be shown
      expect(find.text('No Delivery Requests Yet'), findsNothing);
      expect(find.text('No Completed Orders Yet'), findsOneWidget);
      expect(find.text('Your completed orders will appear here.'), findsOneWidget);

      final completedIllustrationFinder = find.byKey(const Key('orders_completed_illustration'));
      expect(completedIllustrationFinder, findsOneWidget);
      final Image completedImage = tester.widget<Image>(completedIllustrationFinder);
      expect(completedImage.width, equals(218));
      expect(completedImage.height, equals(192));
      expect(completedImage.fit, equals(BoxFit.contain));
      expect(
        (completedImage.image as AssetImage).assetName,
        equals('assets/images/completed_orders_empty.png'),
      );

      // Tap back to Active Orders Tab
      await tester.tap(find.byKey(const Key('orders_slider_active_tab')));
      await tester.pumpAndSettle();

      // Returned to Active Orders state
      expect(find.text('No Delivery Requests Yet'), findsOneWidget);
      expect(find.text('No Completed Orders Yet'), findsNothing);

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('RiderApp navigates to /orders route and Home tab returns to /home', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        const RiderApp(initialLocation: '/orders'),
      );
      await tester.pumpAndSettle();

      // Verify OrdersScreen is loaded
      expect(find.byType(OrdersScreen), findsOneWidget);
      final headingFinder = find.byKey(const Key('orders_screen_heading'));
      expect(headingFinder, findsOneWidget);
      expect(tester.widget<Text>(headingFinder).data, equals('Orders'));
      expect(find.text('No Delivery Requests Yet'), findsOneWidget);

      // Tap Home Tab in Bottom Navigation
      await tester.tap(find.byKey(const Key('nav_tab_home')));
      await tester.pumpAndSettle();

      // Verify HomeScreen is loaded
      expect(find.byType(HomeScreen), findsOneWidget);
      expect(find.text('Ms Dhoni'), findsOneWidget);

      await tester.binding.setSurfaceSize(null);
    });
  });
}
