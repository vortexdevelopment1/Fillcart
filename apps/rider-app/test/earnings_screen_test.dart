import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:fillcart_rider/features/earnings/presentation/screens/earnings_screen.dart';
import 'package:fillcart_rider/features/earnings/presentation/widgets/earnings_period_slider.dart';
import 'package:fillcart_rider/features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('EarningsScreen & Widgets Tests', () {
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
      expect(find.text("Today's"), findsOneWidget);
      expect(find.text('Weekly'), findsOneWidget);
      expect(find.text('Monthly'), findsOneWidget);

      await tester.tap(find.byKey(const Key('earnings_slider_weekly_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(1));

      await tester.tap(find.byKey(const Key('earnings_slider_monthly_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(2));

      await tester.tap(find.byKey(const Key('earnings_slider_today_tab')));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(0));
    });

    testWidgets("EarningsScreen renders Today's, Weekly, and Monthly views cleanly", (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(360, 800));

      await tester.pumpWidget(
        buildTestableWidget(const EarningsScreen()),
      );
      await tester.pumpAndSettle();

      // 1. Today's view
      expect(find.byKey(const Key('earnings_screen_heading')), findsOneWidget);
      expect(find.text("Today's Summary"), findsOneWidget);
      expect(find.text('Earnings Breakdown'), findsOneWidget);
      expect(find.text('₹ 50'), findsOneWidget);
      expect(find.text('Performance Overview'), findsOneWidget);
      expect(find.text('Distance Covered'), findsOneWidget);
      expect(find.text('Rider Rating'), findsOneWidget);
      expect(find.text('96%'), findsOneWidget);
      expect(find.text('95%'), findsOneWidget);
      expect(find.byType(RiderBottomNavBar), findsOneWidget);

      // 2. Switch to Weekly tab
      await tester.tap(find.byKey(const Key('earnings_slider_weekly_tab')));
      await tester.pumpAndSettle();
      expect(find.text('WEEKLY TOTAL'), findsOneWidget);
      expect(find.text('₹ 2,880'), findsOneWidget);
      expect(find.text('Daily Earnings'), findsOneWidget);
      expect(find.text('Last 01 Days'), findsOneWidget);
      expect(find.text('₹2880'), findsOneWidget);

      // Tap Mon bar in chart -> updates summary
      await tester.ensureVisible(find.text('Mon'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Mon'));
      await tester.pumpAndSettle();
      expect(find.text('Aug 11'), findsOneWidget);

      // 3. Switch to Monthly tab
      await tester.tap(find.byKey(const Key('earnings_slider_monthly_tab')));
      await tester.pumpAndSettle();
      expect(find.text('Last 30 Days'), findsOneWidget);

      await tester.binding.setSurfaceSize(null);
    });
  });
}
