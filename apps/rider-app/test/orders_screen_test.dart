import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fillcart_rider/features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import 'package:fillcart_rider/features/orders/presentation/screens/order_view_details_screen.dart';
import 'package:fillcart_rider/features/orders/presentation/screens/orders_screen.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/orders_slider_bar.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/rate_card_sheet.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('OrdersScreen & Flow Tests', () {
    testWidgets('OrdersSliderBar switches Available and Completed tabs', (
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
      expect(find.text('Available'), findsOneWidget);
      expect(find.text('Completed'), findsOneWidget);

      await tester.tap(find.byKey(const Key('orders_slider_completed_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(1));

      await tester.tap(find.byKey(const Key('orders_slider_active_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(0));
    });

    testWidgets('OrdersScreen full flow: Available -> Completed -> View Details -> Rate Card', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const OrdersScreen()),
      );
      await tester.pumpAndSettle();

      // 1. Available Tab
      expect(find.text('Order Details'), findsOneWidget);
      expect(find.byKey(const Key('available_order_card')), findsOneWidget);
      expect(find.text('Restaurant Hub'), findsOneWidget);
      expect(find.text('Radisson Square, Indore'), findsOneWidget);
      expect(find.text('Accept'), findsOneWidget);
      expect(find.byType(RiderBottomNavBar), findsOneWidget);

      // 2. Switch to Completed Tab
      await tester.tap(find.byKey(const Key('orders_slider_completed_tab')));
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('completed_order_card')), findsOneWidget);
      expect(find.text('Completed'), findsNWidgets(2)); // tab + badge
      expect(find.text('Total Travel Distance'), findsOneWidget);
      expect(find.text('6.4 Km'), findsOneWidget);
      expect(find.text('₹95'), findsOneWidget);
      expect(find.text('View Details'), findsOneWidget);

      // 3. Tap View Details -> navigates to OrderViewDetailsScreen
      await tester.tap(find.byKey(const Key('view_details_button')));
      await tester.pumpAndSettle();

      expect(find.byType(OrderViewDetailsScreen), findsOneWidget);
      expect(find.text('#ORD12345'), findsOneWidget);
      expect(find.text('Your Earnings'), findsOneWidget);
      expect(find.text('₹45'), findsNWidgets(2));
      expect(find.text('Payment info'), findsOneWidget);
      expect(find.text('Earnings Breakdown'), findsOneWidget);

      // 4. Tap Earnings Breakdown -> opens Rate Card sheet
      await tester.tap(find.text('Earnings Breakdown'));
      await tester.pumpAndSettle();

      expect(find.byType(RateCardSheet), findsOneWidget);
      expect(find.text('Rate Card'), findsOneWidget);
      expect(find.text('₹6 per km'), findsOneWidget);
      expect(
        find.text('EXTRA FARE (NOT APPLICABLE ON ALL ORDERS)'),
        findsOneWidget,
      );

      await tester.binding.setSurfaceSize(null);
    });

    testWidgets('Accept slider transitions through 3 steps: 70% Accepted -> end black SVG -> Checkmark', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const OrdersScreen()),
      );
      await tester.pumpAndSettle();

      // Step 1: Initial Accept state with white SVG thumb
      expect(find.text('Accept'), findsOneWidget);
      expect(find.text('Accepted'), findsNothing);
      expect(find.byKey(const ValueKey<String>('swip_white_icon')), findsOneWidget);
      expect(find.byKey(const Key('accept_slider_checkmark')), findsNothing);

      // Step 2: Drag past 70% (~185px of ~248px) -> "Accepted" & yellow background, still white SVG before end
      final sliderFinder = find.byKey(const Key('accept_order_slider'));
      final gesture = await tester.startGesture(
        tester.getTopLeft(find.byKey(const Key('accept_slider_thumb'))) +
            const Offset(20, 20),
      );
      await gesture.moveBy(const Offset(25, 0)); // cross touch slop
      await tester.pump();
      await gesture.moveBy(const Offset(185, 0)); // > 70%, < 95%
      await tester.pump();

      expect(find.text('Accepted'), findsOneWidget);
      final Container midThumb = tester.widget<Container>(
        find.byKey(const Key('accept_slider_thumb')),
      );
      final BoxDecoration midDecoration = midThumb.decoration! as BoxDecoration;
      expect(midDecoration.color, isNot(equals(Colors.white)));
      expect(midDecoration.color, isNot(equals(const Color(0xFF000000))));

      // Step 3a: Drag to the right end -> white SVG turns into black SVG
      await gesture.moveBy(const Offset(80, 0));
      await tester.pump();
      await gesture.up();
      await tester.pump();

      expect(find.byKey(const ValueKey<String>('swip_black_icon')), findsOneWidget);

      // Step 3b: After 700ms -> turns into centered black checkmark
      await tester.pump(const Duration(milliseconds: 720));
      await tester.pumpAndSettle();
      expect(find.byKey(const Key('accept_slider_checkmark')), findsOneWidget);
      expect(find.text('Accept'), findsNothing);
      expect(find.text('Accepted'), findsNothing);
      expect(sliderFinder, findsOneWidget);

      await tester.binding.setSurfaceSize(null);
    });
  });
}
