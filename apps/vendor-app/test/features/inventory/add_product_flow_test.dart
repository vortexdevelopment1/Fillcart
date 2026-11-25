import 'package:fillcart_vendor/features/inventory/inventory.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('Add Product Flow Tests', () {
    testWidgets('Tapping FAB on VendorInventoryScreen opens AddProductBottomSheet', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const VendorInventoryScreen(initialTabIndex: 0),
        ),
      );
      await tester.pumpAndSettle();

      // Verify FAB exists
      expect(find.text('Add Product'), findsOneWidget);

      // Tap FAB
      await tester.tap(find.text('Add Product'));
      await tester.pumpAndSettle();

      // Verify bottom sheet appears
      expect(find.byType(AddProductBottomSheet), findsOneWidget);
      expect(find.text('Upload Photos'), findsOneWidget);
      expect(find.text('Scan Barcode'), findsOneWidget);
      expect(find.text('Add Manually'), findsOneWidget);
    });

    testWidgets('Tapping Upload Photos in bottom sheet navigates to UploadPhotosScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          Builder(
            builder: (context) => ElevatedButton(
              onPressed: () => AddProductBottomSheet.show(context),
              child: const Text('Open Sheet'),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Open sheet
      await tester.tap(find.text('Open Sheet'));
      await tester.pumpAndSettle();

      // Tap Upload Photos
      await tester.tap(find.text('Upload Photos'));
      await tester.pumpAndSettle();

      // Verify UploadPhotosScreen
      expect(find.byType(UploadPhotosScreen), findsOneWidget);
      expect(find.text('Add Front Photo'), findsOneWidget);
      expect(find.text('Add Back Photo'), findsOneWidget);
      expect(find.text('Continue'), findsOneWidget);
    });

    testWidgets('Tapping Continue in UploadPhotosScreen navigates to ProductDetailsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(const UploadPhotosScreen()),
      );
      await tester.pumpAndSettle();

      // Tap Continue
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      // Verify ProductDetailsScreen
      expect(find.byType(ProductDetailsScreen), findsOneWidget);
      expect(find.text('Product Details'), findsOneWidget);
      expect(find.text('Next'), findsOneWidget);
    });

    testWidgets('Tapping Scan Barcode in bottom sheet navigates to ScanBarcodeScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          Builder(
            builder: (context) => ElevatedButton(
              onPressed: () => AddProductBottomSheet.show(context),
              child: const Text('Open Sheet'),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Open sheet
      await tester.tap(find.text('Open Sheet'));
      await tester.pumpAndSettle();

      // Tap Scan Barcode
      await tester.tap(find.text('Scan Barcode'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));

      // Verify ScanBarcodeScreen
      expect(find.byType(ScanBarcodeScreen), findsOneWidget);
      expect(find.text('Scan Barcode'), findsOneWidget);
    });

    testWidgets('ProductDetailsScreen renders all image slots, preview card and form fields', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(const ProductDetailsScreen()),
      );
      await tester.pumpAndSettle();

      // Header and image slots
      expect(find.text('Product Details'), findsOneWidget);
      expect(find.text('1 of 4 uploaded'), findsOneWidget);
      expect(find.text('Add Photo'), findsOneWidget);
      expect(find.text('Back View'), findsOneWidget);

      // Conversion tip
      expect(
        find.text('High-resolution photos with clear product labels convert 35% faster.'),
        findsOneWidget,
      );

      // Product preview card
      expect(find.text('Amul Taaza Milk (1 L)'), findsNWidgets(2)); // Card + form field
      expect(find.text('Amul'), findsNWidgets(2)); // Subtitle + Brand field

      // Form prefilled values
      expect(find.text('Grocery'), findsOneWidget);
      expect(find.text('Dairy'), findsOneWidget);

      // Next button
      expect(find.text('Next'), findsOneWidget);
    });

    testWidgets('Add Product Full Flow: Product Details -> Pricing & Inventory -> Preview & Publish', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(const ProductDetailsScreen()),
      );
      await tester.pumpAndSettle();

      // Tap Next to navigate to Pricing & Inventory
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Verify Pricing & Inventory Screen
      expect(find.byType(PricingAndInventoryScreen), findsOneWidget);
      expect(find.text('Pricing & Inventory'), findsOneWidget);
      expect(find.text('72'), findsOneWidget);
      expect(find.text('68'), findsOneWidget);
      expect(find.text('Discount'), findsOneWidget);
      expect(find.text('5.5% off'), findsOneWidget);
      expect(find.text('5%'), findsOneWidget);
      expect(find.text('120'), findsOneWidget);
      expect(find.text('10'), findsOneWidget);
      expect(find.text('Availability'), findsOneWidget);
      expect(find.text('Show this product in your store'), findsOneWidget);
      expect(find.text('Add size, pack, etc.'), findsOneWidget);

      // Tap Next to navigate to Preview & Publish
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Verify Preview & Publish Screen
      expect(find.byType(PreviewAndPublishScreen), findsOneWidget);
      expect(find.text('Preview & Publish'), findsOneWidget);
      expect(find.text('Amul Taaza Milk (1 L)'), findsOneWidget);
      expect(find.text('Amul • Dairy'), findsOneWidget);
      expect(find.text('₹68'), findsOneWidget);
      expect(find.text('₹72'), findsOneWidget);
      expect(find.text('In Stock (120)'), findsOneWidget);
      expect(find.text('Category'), findsOneWidget);
      expect(find.text('Grocery › Dairy'), findsOneWidget);
      expect(find.text('GST'), findsOneWidget);
      expect(find.text('Unit'), findsOneWidget);
      expect(find.text('1 L'), findsOneWidget);
      expect(find.text('Available'), findsOneWidget);
    });
  });
}
