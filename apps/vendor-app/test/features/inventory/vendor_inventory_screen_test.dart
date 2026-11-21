import 'package:fillcart_vendor/features/inventory/inventory.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('VendorInventoryScreen Widget Tests', () {
    testWidgets('renders Products tab by default with search and products list', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VendorInventoryScreen()));
      await tester.pumpAndSettle();

      // Verify Header
      expect(find.text('Products & Inventory'), findsOneWidget);

      // Verify Dual-Tab Switcher
      expect(find.text('Products (324)'), findsOneWidget);
      expect(find.text('Inventory'), findsOneWidget);

      // Verify Filters
      expect(find.text('All (324)'), findsOneWidget);
      expect(find.text('In Stock (286)'), findsOneWidget);
      expect(find.text('Low Stock (24)'), findsOneWidget);

      // Verify Sample Products
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('Britannia White Bread (400 g)'), findsOneWidget);

      // Verify Add Product FAB
      expect(find.text('Add Product'), findsOneWidget);
    });

    testWidgets('switching to Inventory tab renders metrics and quick actions', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VendorInventoryScreen()));
      await tester.pumpAndSettle();

      // Tap on Inventory tab
      await tester.tap(find.text('Inventory'));
      await tester.pumpAndSettle();

      // Verify Inventory Overview Section
      expect(find.text('Inventory Overview'), findsOneWidget);
      expect(find.text('324'), findsOneWidget);
      expect(find.text('Low Stock'), findsWidgets);
      expect(find.text('Out of Stock'), findsWidgets);
      expect(find.text('Expiring Soon'), findsOneWidget);

      // Verify Stock Availability Card
      expect(find.text('Stock Availability'), findsOneWidget);
      expect(find.byType(StockAvailabilityCard), findsOneWidget);

      // Verify Quick Actions
      expect(find.text('Quick Actions'), findsOneWidget);
      expect(find.text('Update Stock'), findsOneWidget);
      expect(find.text('Stock History'), findsOneWidget);
      expect(find.text('Bulk Update'), findsOneWidget);
      expect(find.text('Alert Settings'), findsOneWidget);
    });

    testWidgets('tapping product card in Products tab navigates to UpdateStockScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VendorInventoryScreen()));
      await tester.pumpAndSettle();

      // Tap on the first product
      await tester.tap(find.text('Amul Taaza Milk (1 L)'));
      await tester.pumpAndSettle();

      // Verify Update Stock Screen
      expect(find.byType(UpdateStockScreen), findsOneWidget);
      expect(find.text('Current Stock'), findsOneWidget);
      expect(find.text('120 units'), findsOneWidget);
      expect(find.text('Adjustment Type'), findsOneWidget);
      expect(find.text('Add Stock'), findsOneWidget);
      expect(find.text('Reduce Stock'), findsOneWidget);
      expect(find.text('Correct Stock'), findsOneWidget);
    });

    testWidgets('tapping Update Stock quick action opens product selector then UpdateStockScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VendorInventoryScreen()));
      await tester.pumpAndSettle();

      // Go to Inventory tab
      await tester.tap(find.text('Inventory'));
      await tester.pumpAndSettle();

      // Scroll and Tap Update Stock quick action
      await tester.ensureVisible(find.text('Update Stock'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Update Stock'));
      await tester.pumpAndSettle();

      // Verify Product Selection Screen
      expect(find.byType(InventoryProductSelectionScreen), findsOneWidget);

      // Select Amul Taaza Milk
      await tester.tap(find.text('Amul Taaza Milk (1 L)'));
      await tester.pumpAndSettle();

      // Lands on UpdateStockScreen
      expect(find.byType(UpdateStockScreen), findsOneWidget);
    });

    testWidgets('tapping Stock History quick action opens product selector then StockHistoryScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VendorInventoryScreen()));
      await tester.pumpAndSettle();

      // Go to Inventory tab
      await tester.tap(find.text('Inventory'));
      await tester.pumpAndSettle();

      // Scroll and Tap Stock History quick action
      await tester.ensureVisible(find.text('Stock History'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Stock History'));
      await tester.pumpAndSettle();

      // Verify Product Selection Screen
      expect(find.byType(InventoryProductSelectionScreen), findsOneWidget);

      // Select Amul Taaza Milk
      await tester.tap(find.text('Amul Taaza Milk (1 L)'));
      await tester.pumpAndSettle();

      // Lands on StockHistoryScreen
      expect(find.byType(StockHistoryScreen), findsOneWidget);
      expect(find.text('SKU: AMU-MLK-1L'), findsOneWidget);
      expect(find.text('Last 30 Days'), findsOneWidget);
      expect(find.text('+50'), findsOneWidget);
      expect(find.text('-6'), findsWidgets);
    });

    testWidgets('tapping Alert Settings quick action navigates to StockAlertSettingsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VendorInventoryScreen()));
      await tester.pumpAndSettle();

      // Go to Inventory tab
      await tester.tap(find.text('Inventory'));
      await tester.pumpAndSettle();

      // Scroll and Tap Alert Settings quick action
      await tester.ensureVisible(find.text('Alert Settings'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Alert Settings'));
      await tester.pumpAndSettle();

      // Verify StockAlertSettingsScreen
      expect(find.byType(StockAlertSettingsScreen), findsOneWidget);
      expect(find.text('Low Stock Alert'), findsOneWidget);
      expect(find.text('Expiry Alert'), findsOneWidget);
      expect(find.text('Save Settings'), findsOneWidget);
    });
  });
}
