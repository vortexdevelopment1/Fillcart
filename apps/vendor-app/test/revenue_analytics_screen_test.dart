import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/features/analytics/revenue_analytics/presentation/screens/revenue_analytics_screen.dart';
import 'package:fillcart_vendor/features/analytics/revenue_analytics/presentation/widgets/earnings_breakdown_card.dart';
import 'package:fillcart_vendor/features/analytics/revenue_analytics/presentation/widgets/revenue_category_donut.dart';
import 'package:fillcart_vendor/features/analytics/revenue_analytics/presentation/widgets/revenue_metric_card.dart';
import 'package:fillcart_vendor/features/analytics/revenue_analytics/presentation/widgets/revenue_trend_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('RevenueAnalyticsScreen Widget Tests', () {
    testWidgets('renders all revenue components correctly', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: RevenueAnalyticsScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Top bar
      expect(find.text('Revenue Analytics'), findsOneWidget);
      expect(find.byType(SvgPicture), findsWidgets);

      // Date range filter
      expect(find.text('Last 7 Days'), findsOneWidget);

      // Hero Total Sales
      expect(find.text('Total Sales'), findsOneWidget);
      expect(find.text('₹86,320'), findsWidgets);
      expect(find.text('+ 12.4%'), findsOneWidget);

      // 2x2 Metric Cards
      expect(find.text('Net Revenue'), findsOneWidget);
      expect(find.text('Total Earnings'), findsOneWidget);
      expect(find.text('Discounts Given'), findsOneWidget);
      expect(find.text('Refunds'), findsWidgets);
      expect(find.text('₹3,860'), findsOneWidget);
      expect(find.text('₹4,210'), findsWidgets);
      expect(find.text('₹1,250'), findsWidgets);
      expect(find.byType(RevenueMetricCard), findsNWidgets(4));

      // Revenue Trend Chart
      expect(find.text('Revenue Trend'), findsOneWidget);
      expect(find.text('Revenue'), findsWidgets);
      expect(find.text('Orders'), findsWidgets);
      expect(find.byType(RevenueTrendChart), findsOneWidget);

      // Revenue by Category Donut Chart
      expect(find.text('Revenue by Category'), findsOneWidget);
      expect(find.text('Grocery'), findsOneWidget);
      expect(find.text('Dairy'), findsOneWidget);
      expect(find.text('Snacks'), findsOneWidget);
      expect(find.text('Beverages'), findsOneWidget);
      expect(find.byType(RevenueCategoryDonut), findsOneWidget);

      // Earnings Breakdown
      expect(find.text('Earnings Breakdown'), findsOneWidget);
      expect(find.text('Product Revenue'), findsOneWidget);
      expect(find.text('Platform Commission'), findsOneWidget);
      expect(find.text('Offers & Discounts'), findsOneWidget);
      expect(find.text('Net Earnings'), findsOneWidget);
      expect(find.text('₹73,600'), findsOneWidget);
      expect(find.byType(EarningsBreakdownCard), findsOneWidget);
    });
  });
}
