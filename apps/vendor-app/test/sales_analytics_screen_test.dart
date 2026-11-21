import 'package:fillcart_vendor/features/dashboard/presentation/screens/vendor_dashboard_screen.dart';
import 'package:fillcart_vendor/features/sales&analystics/presentation/screens/sales_analytics_screen.dart';
import 'package:fillcart_vendor/features/sales&analystics/presentation/widgets/category_donut_chart.dart';
import 'package:fillcart_vendor/features/sales&analystics/presentation/widgets/recent_order_tile.dart';
import 'package:fillcart_vendor/features/sales&analystics/presentation/widgets/sales_hero_card.dart';
import 'package:fillcart_vendor/features/sales&analystics/presentation/widgets/sales_trend_chart.dart';
import 'package:fillcart_vendor/features/sales&analystics/presentation/widgets/top_product_tile.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('SalesAnalyticsScreen Widget Tests', () {
    testWidgets('renders SalesAnalyticsScreen with Overview tab content initially', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SalesAnalyticsScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Top title and pill tabs
      expect(find.text('Sales Analytics'), findsOneWidget);
      expect(find.text('Overview'), findsOneWidget);
      expect(find.text('Products'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);

      // Date filter
      expect(find.text('Last 7 Days'), findsOneWidget);

      // Overview Tab components
      expect(find.byType(SalesHeroCard), findsOneWidget);
      expect(find.text('Total Sales'), findsOneWidget);
      expect(find.text('₹86,320'), findsOneWidget);
      expect(find.text('+ 12.4%'), findsOneWidget);

      // Overview 2x2 grid cards
      expect(find.text('Total Orders'), findsOneWidget);
      expect(find.text('Avg. Order Value'), findsOneWidget);
      expect(find.text('Item Sold'), findsOneWidget);
      expect(find.text('Net Revenue'), findsOneWidget);

      // Sales trend chart
      expect(find.byType(SalesTrendChart), findsOneWidget);
      expect(find.text('Sales Trend'), findsOneWidget);
      expect(find.text('Revenue'), findsOneWidget);
    });

    testWidgets('switches to Products tab and shows Top Performing Products & Donut Chart', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SalesAnalyticsScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Tap on Products tab
      await tester.tap(find.text('Products'));
      await tester.pumpAndSettle();

      // Products Tab contents
      expect(find.text('Top Performing Products'), findsOneWidget);
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('Farm Eggs (12 pcs)'), findsOneWidget);
      expect(find.text('Britannia White Bread'), findsOneWidget);
      expect(find.byType(TopProductTile), findsNWidgets(3));

      // Category Donut Chart
      expect(find.text('Category Performance'), findsOneWidget);
      expect(find.byType(CategoryDonutChart), findsOneWidget);
      expect(find.text('Dairy'), findsOneWidget);
      expect(find.text('Grocery'), findsOneWidget);
      expect(find.text('Bakery'), findsOneWidget);
    });

    testWidgets('switches to Orders tab and shows Orders Overview & Recent Orders', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SalesAnalyticsScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Tap on Orders tab
      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();

      // Orders Tab contents
      expect(find.text('Orders Overview'), findsOneWidget);
      expect(find.text('Completed'), findsWidgets);
      expect(find.text('Cancelled'), findsWidgets);
      expect(find.text('Returned'), findsOneWidget);

      // Recent Orders list
      expect(find.text('Recent Orders'), findsOneWidget);
      expect(find.text('#FC12847'), findsOneWidget);
      expect(find.text('#FC12846'), findsOneWidget);
      expect(find.text('#FC12845'), findsOneWidget);
      expect(find.text('#FC12844'), findsOneWidget);
      expect(find.byType(RecentOrderTile), findsNWidgets(4));
    });

    testWidgets('tapping Open Sales Analytics on Dashboard navigates to SalesAnalyticsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: VendorDashboardScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Open Sales Analytics'), findsOneWidget);

      await tester.tap(find.text('Open Sales Analytics'));
      await tester.pumpAndSettle();

      expect(find.byType(SalesAnalyticsScreen), findsOneWidget);
    });

    testWidgets('tapping Open Product Insights on Dashboard navigates to ProductInsightsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: VendorDashboardScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Open Product Insights'), findsOneWidget);

      await tester.tap(find.text('Open Product Insights'));
      await tester.pumpAndSettle();

      expect(find.text('Product Insights'), findsOneWidget);
    });

    testWidgets('tapping Open Revenue Analytics on Dashboard navigates to RevenueAnalyticsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: VendorDashboardScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Open Revenue Analytics'), findsOneWidget);

      await tester.tap(find.text('Open Revenue Analytics'));
      await tester.pumpAndSettle();

      expect(find.text('Revenue Analytics'), findsOneWidget);
    });
  });
}
