import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/features/product_insights/presentation/screens/product_insights_screen.dart';
import 'package:fillcart_vendor/features/product_insights/presentation/widgets/product_insight_tile.dart';
import 'package:fillcart_vendor/features/product_insights/presentation/widgets/product_metric_card.dart';
import 'package:fillcart_vendor/features/product_insights/presentation/widgets/product_sales_trend_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ProductInsightsScreen Widget Tests', () {
    testWidgets('renders all components and data correctly', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: ProductInsightsScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Top bar
      expect(find.text('Product Insights'), findsOneWidget);
      expect(find.byType(SvgPicture), findsWidgets);

      // Product Header Card
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('SKU: AMU-MLK-1L'), findsOneWidget);
      expect(find.text('₹68'), findsOneWidget);

      // Performance Section
      expect(find.text('Performance (Last 7 Days)'), findsOneWidget);
      expect(find.text('126'), findsWidgets);
      expect(find.text('Units Sold'), findsOneWidget);
      expect(find.text('₹10,710'), findsOneWidget);
      expect(find.text('Revenue'), findsOneWidget);
      expect(find.text('₹85'), findsOneWidget);
      expect(find.text('Avg. Price'), findsOneWidget);
      expect(find.byType(ProductMetricCard), findsNWidgets(3));

      // Sales Trend Section
      expect(find.text('Sales Trend'), findsOneWidget);
      expect(find.byType(ProductSalesTrendChart), findsOneWidget);
      expect(find.text('2.5K'), findsOneWidget);
      expect(find.text('Mon'), findsOneWidget);
      expect(find.text('Sun'), findsOneWidget);

      // More Insights Section
      expect(find.text('More Insights'), findsOneWidget);
      expect(find.text('Stock Movement'), findsOneWidget);
      expect(find.text('126 sold · 40 in stock'), findsOneWidget);
      expect(find.text('Order Distribution'), findsOneWidget);
      expect(find.text('Added in 48 orders'), findsOneWidget);
      expect(find.text('Customer Demand'), findsOneWidget);
      expect(find.text('+18% higher than previous 7 days'), findsOneWidget);
      expect(find.byType(ProductInsightTile), findsNWidgets(3));
    });
  });
}
