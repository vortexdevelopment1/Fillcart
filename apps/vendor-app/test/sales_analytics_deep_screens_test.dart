import 'package:fillcart_vendor/features/sales&analystics/sales_analytics.dart';
import 'package:fillcart_vendor/features/product_insights/presentation/screens/product_insights_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Sales Analytics Deep Screens & Flow Tests', () {
    testWidgets('StockMovementScreen renders all components and data correctly', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: StockMovementScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Top bar & Date filter
      expect(find.text('Stock Movement'), findsOneWidget);
      expect(find.text('Last 7 Days'), findsOneWidget);

      // Product Card
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('SKU: AMU-MLK-1L'), findsOneWidget);
      expect(find.text('₹68'), findsOneWidget);

      // Stock Summary Section
      expect(find.text('Stock Summary'), findsOneWidget);
      expect(find.text('40'), findsWidgets);
      expect(find.text('Opening Stock'), findsOneWidget);
      expect(find.text('126'), findsOneWidget);
      expect(find.text('Stock In'), findsWidgets);
      expect(find.text('86'), findsOneWidget);
      expect(find.text('Stock Out'), findsWidgets);
      expect(find.text('80'), findsWidgets);
      expect(find.text('Closing Stock'), findsOneWidget);

      // Daily Movement Details Section & Table
      expect(find.text('Daily Movement Details'), findsOneWidget);
      expect(find.text('Date'), findsOneWidget);
      expect(find.text('Closing\nStock'), findsOneWidget);
      expect(find.text('Sun, 23 Nov'), findsOneWidget);
      expect(find.text('+40'), findsOneWidget);
      expect(find.text('-20'), findsOneWidget);
      expect(find.text('Sat, 22 Nov'), findsOneWidget);
      expect(find.text('+38'), findsOneWidget);
      expect(find.text('-24'), findsOneWidget);
    });

    testWidgets('CustomerDemandScreen renders all components and charts correctly', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: CustomerDemandScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Top bar & Date filter
      expect(find.text('Customer Demand'), findsOneWidget);
      expect(find.text('Last 7 Days'), findsOneWidget);

      // Product Card
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('₹68'), findsOneWidget);

      // Order Summary Section
      expect(find.text('Order Summary'), findsOneWidget);
      expect(find.text('High'), findsOneWidget);
      expect(find.text('Demand Level'), findsOneWidget);
      expect(find.text('236'), findsOneWidget);
      expect(find.text('Total Views'), findsOneWidget);
      expect(find.text('126'), findsWidgets);
      expect(find.text('Add to Cart'), findsOneWidget);
      expect(find.text('48'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);

      // Demand Trend
      expect(find.text('Demand Trend'), findsOneWidget);
      expect(find.text('250'), findsOneWidget);
      expect(find.text('Mon'), findsOneWidget);
      expect(find.text('Sun'), findsOneWidget);

      // Demand by Segment
      expect(find.text('Demand by Segment'), findsOneWidget);
      expect(find.text('Units'), findsOneWidget);
      expect(find.text('Regular Buyer'), findsOneWidget);
      expect(find.text('48% (60)'), findsOneWidget);
      expect(find.text('New Customer'), findsOneWidget);
      expect(find.text('26% (33)'), findsOneWidget);

      // Top Buying Time
      expect(find.text('Top Buying Time'), findsOneWidget);
      expect(find.text('8–11 AM'), findsOneWidget);
      expect(find.text('5–8 PM'), findsOneWidget);
      expect(find.text('36'), findsOneWidget);
    });

    testWidgets('OrderDistributionScreen renders all components and charts correctly', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OrderDistributionScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // Top bar & Date filter
      expect(find.text('Order Distribution'), findsOneWidget);
      expect(find.text('Last 7 Days'), findsOneWidget);

      // Product Card
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('₹68'), findsOneWidget);

      // Order Summary
      expect(find.text('Order Summary'), findsOneWidget);
      expect(find.text('40'), findsOneWidget);
      expect(find.text('Total Orders'), findsOneWidget);
      expect(find.text('126'), findsOneWidget);
      expect(find.text('Units Ordered'), findsOneWidget);
      expect(find.text('₹8,610'), findsOneWidget);
      expect(find.text('Order Value'), findsOneWidget);
      expect(find.text('2.6'), findsOneWidget);
      expect(find.text('Avg. Units/Orders'), findsOneWidget);

      // Daily Order Distribution
      expect(find.text('Daily Order Distribution'), findsOneWidget);
      expect(find.text('30'), findsOneWidget);
      expect(find.text('Mon'), findsOneWidget);
      expect(find.text('Sun'), findsOneWidget);

      // Orders by Channel
      expect(find.text('Orders by Channel'), findsOneWidget);
      expect(find.text('48'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(find.text('App Orders'), findsOneWidget);
      expect(find.text('62% (30)'), findsOneWidget);
      expect(find.text('Website Orders'), findsOneWidget);

      // Order Size Distribution
      expect(find.text('Order Size Distribution'), findsOneWidget);
      expect(find.text('1 Unit'), findsOneWidget);
      expect(find.text('46%'), findsOneWidget);
      expect(find.text('22 orders'), findsOneWidget);
      expect(find.text('2 Units'), findsOneWidget);
      expect(find.text('29%'), findsOneWidget);
    });

    testWidgets('Full navigation flow: ProductInsightsScreen -> StockMovement, OrderDistribution, CustomerDemand', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: ProductInsightsScreen(),
        ),
      );
      await tester.pumpAndSettle();

      // 1. Navigate to Stock Movement
      await tester.ensureVisible(find.text('Stock Movement'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Stock Movement'));
      await tester.pumpAndSettle();

      expect(find.byType(StockMovementScreen), findsOneWidget);
      expect(find.text('Stock Movement'), findsOneWidget);
      expect(find.text('Stock Summary'), findsOneWidget);

      // Pop back to ProductInsightsScreen
      await tester.tap(find.byType(InkWell).first);
      await tester.pumpAndSettle();
      expect(find.byType(ProductInsightsScreen), findsOneWidget);

      // 2. Navigate to Order Distribution
      await tester.ensureVisible(find.text('Order Distribution'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Order Distribution'));
      await tester.pumpAndSettle();

      expect(find.byType(OrderDistributionScreen), findsOneWidget);
      expect(find.text('Order Distribution'), findsOneWidget);
      expect(find.text('Daily Order Distribution'), findsOneWidget);

      // Pop back
      await tester.tap(find.byType(InkWell).first);
      await tester.pumpAndSettle();
      expect(find.byType(ProductInsightsScreen), findsOneWidget);

      // 3. Navigate to Customer Demand
      await tester.ensureVisible(find.text('Customer Demand'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Customer Demand'));
      await tester.pumpAndSettle();

      expect(find.byType(CustomerDemandScreen), findsOneWidget);
      expect(find.text('Customer Demand'), findsOneWidget);
      expect(find.text('Demand Trend'), findsOneWidget);

      // Pop back
      await tester.tap(find.byType(InkWell).first);
      await tester.pumpAndSettle();
      expect(find.byType(ProductInsightsScreen), findsOneWidget);
    });
  });
}
