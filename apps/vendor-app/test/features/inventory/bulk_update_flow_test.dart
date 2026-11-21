import 'package:fillcart_vendor/features/inventory/inventory.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('Bulk Update Stock Flow Tests', () {
    testWidgets('BulkUpdateStockScreen renders header, hero, action tiles, and products list', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const BulkUpdateStockScreen()));
      await tester.pumpAndSettle();

      // Header
      expect(find.text('Bulk Update Stock'), findsOneWidget);

      // Hero text
      expect(find.text('Update stock for multiple\nproducts in just a few steps'), findsOneWidget);
      expect(find.text('Choose products, set quantity and update\nstock in bulk.'), findsOneWidget);

      // Quick action cards
      expect(find.text('Scan\nBarcode'), findsOneWidget);
      expect(find.text('Upload\nFile'), findsOneWidget);

      // Section title
      expect(find.text('Select Products'), findsOneWidget);

      // Product cards
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('SKU: AMU-MLK-1L'), findsOneWidget);
      expect(find.text('In Stock'), findsWidgets);
      expect(find.text('Britannia White Bread (400 g)'), findsOneWidget);
      expect(find.text('Low Stock'), findsOneWidget);
      expect(find.text('Farm Eggs (12 pcs)'), findsOneWidget);
      expect(find.text('Surf Excel Detergent (1 kg)'), findsOneWidget);
      expect(find.text('Out of Stock'), findsOneWidget);

      // Bottom button
      expect(find.text('Next'), findsOneWidget);
    });

    testWidgets('tapping a product in BulkUpdateStockScreen navigates to ReviewAndUpdateScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const BulkUpdateStockScreen()));
      await tester.pumpAndSettle();

      // Tap on Amul Taaza Milk
      await tester.tap(find.text('Amul Taaza Milk (1 L)'));
      await tester.pumpAndSettle();

      // Verify Review & Update Screen
      expect(find.byType(ReviewAndUpdateScreen), findsOneWidget);
      expect(find.text('Review & Update'), findsOneWidget);
      expect(find.text('2 Products Selected'), findsOneWidget);
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('Current Stock: 120 units'), findsOneWidget);
      expect(find.text('Farm Eggs (12 pcs)'), findsOneWidget);
      expect(find.text('Current Stock: 56 units'), findsOneWidget);
      expect(find.text('0/100'), findsOneWidget);
      expect(find.text('Stock will be updated immediately in your inventory.'), findsOneWidget);
      expect(find.text('Confirm Update'), findsOneWidget);
    });

    testWidgets('tapping Next button in BulkUpdateStockScreen navigates to ReviewAndUpdateScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const BulkUpdateStockScreen()));
      await tester.pumpAndSettle();

      // Tap Next button
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Verify ReviewAndUpdateScreen opened
      expect(find.byType(ReviewAndUpdateScreen), findsOneWidget);
    });

    testWidgets('ReviewAndUpdateScreen allows typing in note field and updating counter', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const ReviewAndUpdateScreen(selectedItems: [])));
      await tester.pumpAndSettle();

      // Verify initial note counter
      expect(find.text('0/100'), findsOneWidget);

      // Enter text into note
      final textField = find.byType(TextField);
      expect(textField, findsOneWidget);
      const testNote = 'Batch #2026-X';
      await tester.enterText(textField, testNote);
      await tester.pumpAndSettle();

      // Counter should now show length/100
      expect(find.text('${testNote.length}/100'), findsOneWidget);

      // Tap Confirm Update
      await tester.tap(find.text('Confirm Update'));
      await tester.pumpAndSettle();
    });

    testWidgets('Bulk Update quick action from VendorInventoryScreen navigates to BulkUpdateStockScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VendorInventoryScreen()));
      await tester.pumpAndSettle();

      // Switch to Inventory tab
      await tester.tap(find.text('Inventory'));
      await tester.pumpAndSettle();

      // Tap Bulk Update quick action
      await tester.ensureVisible(find.text('Bulk Update'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Bulk Update'));
      await tester.pumpAndSettle();

      // Verify BulkUpdateStockScreen is visible
      expect(find.byType(BulkUpdateStockScreen), findsOneWidget);
      expect(find.text('Bulk Update Stock'), findsOneWidget);
    });
  });
}
