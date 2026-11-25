import 'package:fillcart_vendor/features/promotions/presentation/screens/choose_promotion_type_screen.dart';
import 'package:fillcart_vendor/features/promotions/presentation/screens/discount_offer_screen.dart';
import 'package:fillcart_vendor/features/promotions/presentation/screens/promotion_performance_screen.dart';
import 'package:fillcart_vendor/features/promotions/presentation/screens/promotions_screen.dart';
import 'package:fillcart_vendor/features/promotions/presentation/screens/review_publish_screen.dart';
import 'package:fillcart_vendor/features/promotions/presentation/screens/select_products_screen.dart';
import 'package:fillcart_vendor/features/promotions/presentation/widgets/promotion_step_indicator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('PromotionsScreen renders dashboard elements properly',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: PromotionsScreen(),
      ),
    );

    expect(find.text('Promotions'), findsOneWidget);
    expect(find.text('Choose Promotion Type'), findsOneWidget);
    expect(find.text('Run Offers &\nGrow Sales'), findsOneWidget);
    expect(find.text('Create Promotion +'), findsOneWidget);
    expect(find.text('Sales Lift'), findsOneWidget);
    expect(find.text('+24%'), findsOneWidget);
    expect(find.text('Promo Orders'), findsOneWidget);
    expect(find.text('1,420'), findsOneWidget);
    expect(find.text('Promo Revenue'), findsOneWidget);
    expect(find.text('₹1.24L'), findsOneWidget);
    expect(find.text('Your Promotions'), findsOneWidget);
    expect(find.text('Flat 10% Off'), findsOneWidget);
    expect(find.text('Buy 2 Get 1 Free'), findsOneWidget);
    expect(find.text('Weekend Deal'), findsOneWidget);
    expect(find.text('Create Promotion'), findsOneWidget);
  });

  testWidgets('ChoosePromotionTypeScreen renders and selects options',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: ChoosePromotionTypeScreen(),
      ),
    );

    expect(find.text('Create Promotion'), findsOneWidget);
    expect(find.text('Choose Promotion Type'), findsOneWidget);
    expect(find.text('Percentage / Flat Discount'), findsOneWidget);
    expect(find.text('Buy X Get Y Free'), findsOneWidget);
    expect(find.text('Combo Offer'), findsOneWidget);
    expect(find.text('Order Value Offer'), findsOneWidget);
    expect(find.text('Flash Deal'), findsOneWidget);
    expect(find.text('Continue'), findsOneWidget);

    // Tap Buy X Get Y Free
    await tester.tap(find.text('Buy X Get Y Free'));
    await tester.pumpAndSettle();
  });

  testWidgets('SelectProductsScreen renders step 1 and checklists',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: SelectProductsScreen(),
      ),
    );

    expect(find.text('Select Products'), findsOneWidget);
    expect(find.text('Categories'), findsOneWidget);
    expect(find.text('Products'), findsWidgets);
    expect(find.text('Dairy (24)'), findsOneWidget);
    expect(find.text('Snacks (18)'), findsOneWidget);
    expect(find.text('Beverages (12)'), findsOneWidget);
    expect(find.text('Next'), findsOneWidget);
  });

  testWidgets('DiscountOfferScreen renders step 2 form fields',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: DiscountOfferScreen(),
      ),
    );

    expect(find.text('Discount Offer'), findsOneWidget);
    expect(find.textContaining('Offer Name'), findsOneWidget);
    expect(find.text('Discount Type'), findsOneWidget);
    expect(find.text('Percentage'), findsOneWidget);
    expect(find.text('Flat Amount'), findsOneWidget);
    expect(find.textContaining('Discount Value'), findsOneWidget);
    expect(find.text('Applicable On'), findsOneWidget);
    expect(find.text('Offer Duration'), findsOneWidget);
    expect(find.text('Next'), findsOneWidget);
  });

  testWidgets('ReviewPublishScreen renders summary and impact',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: ReviewPublishScreen(),
      ),
    );

    expect(find.text('Review & Publish'), findsOneWidget);
    expect(find.text('Flat 10% Off'), findsWidgets);
    expect(find.text('OFFER SUMMARY'), findsOneWidget);
    expect(find.text('Estimated Impact'), findsOneWidget);
    expect(find.text('Publish Offer'), findsOneWidget);
  });

  testWidgets('PromotionPerformanceScreen renders metrics and chart',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: PromotionPerformanceScreen(),
      ),
    );

    expect(find.text('Promotion Performance'), findsOneWidget);
    expect(find.text('Flat 10% Off'), findsOneWidget);
    expect(find.text('Orders'), findsOneWidget);
    expect(find.text('286'), findsOneWidget);
    expect(find.text('Revenue'), findsWidgets);
    expect(find.text('₹24,680'), findsOneWidget);
    expect(find.text('Discount Given'), findsOneWidget);
    expect(find.text('₹2,468'), findsOneWidget);
    expect(find.text('Unique Customers'), findsOneWidget);
    expect(find.text('214'), findsOneWidget);
    expect(find.text('Daily Performance'), findsOneWidget);
    expect(find.text('Publish Offer'), findsOneWidget);
  });

  testWidgets('PromotionStepIndicator renders steps correctly',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: PromotionStepIndicator(currentStep: 2),
        ),
      ),
    );

    expect(find.text('Products'), findsOneWidget);
    expect(find.text('Details'), findsOneWidget);
    expect(find.text('Review'), findsOneWidget);
  });

  testWidgets(
      'Tapping three dots on PromotionCardTile in PromotionsScreen opens options (Edit, Deactivate, Delete)',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: PromotionsScreen(),
      ),
    );

    // Tap the first three-dots icon in the promotions cards list
    final threeDots = find.byIcon(Icons.more_vert).first;
    expect(threeDots, findsOneWidget);
    await tester.ensureVisible(threeDots);
    await tester.pumpAndSettle();
    await tester.tap(threeDots);
    await tester.pumpAndSettle();

    // Verify Edit, Deactivate, and Delete options appear
    expect(find.text('Edit'), findsOneWidget);
    expect(find.text('Deactivate'), findsOneWidget);
    expect(find.text('Delete'), findsOneWidget);

    // Tap Deactivate
    await tester.tap(find.text('Deactivate'));
    await tester.pumpAndSettle();

    expect(find.textContaining('deactivated'), findsOneWidget);
  });

  testWidgets(
      'Tapping three dots on PromotionPerformanceScreen opens options (Edit, Deactivate, Delete)',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: PromotionPerformanceScreen(),
      ),
    );

    // Tap the three dots icon in top bar
    final threeDots = find.byIcon(Icons.more_vert);
    expect(threeDots, findsOneWidget);
    await tester.tap(threeDots);
    await tester.pumpAndSettle();

    // Verify options appear
    expect(find.text('Edit'), findsOneWidget);
    expect(find.text('Deactivate'), findsOneWidget);
    expect(find.text('Delete'), findsOneWidget);

    // Tap Delete
    await tester.tap(find.text('Delete'));
    await tester.pumpAndSettle();

    expect(find.textContaining('deleted'), findsOneWidget);
  });
}
