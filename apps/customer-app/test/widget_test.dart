import 'package:fillcart_customer/app/customer_app.dart';
import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:fillcart_customer/core/widgets/fc_brand_logo.dart';
import 'package:fillcart_customer/features/authentication/presentation/screens/login_screen.dart';
import 'package:fillcart_customer/features/onboarding/presentation/screens/walkthrough_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('CustomerApp launches with SplashScreen displaying FCBrandLogo',
      (WidgetTester tester) async {
    await tester.pumpWidget(const CustomerApp());
    expect(find.byType(FCBrandLogo), findsOneWidget);
  });

  testWidgets(
      'WalkthroughScreen cycles through all 3 slides and navigates to LoginScreen',
      (WidgetTester tester) async {
    await tester.pumpWidget(const CustomerApp());
    // Fast-forward past splash screen (2400ms) and fade transition (400ms)
    await tester.pump(const Duration(milliseconds: 3000));
    await tester.pumpAndSettle();

    expect(find.byType(WalkthroughScreen), findsOneWidget);

    // Slide 1
    expect(find.text('Your Favorite Stores'), findsOneWidget);
    expect(
      find.text('Explore nearby shops and order\neverything you need.'),
      findsOneWidget,
    );
    expect(find.text('Skip'), findsOneWidget);

    // Tap next button to advance to Slide 2
    final nextButton = find.byWidgetPredicate(
      (widget) =>
          widget is Image &&
          widget.image is AssetImage &&
          (widget.image as AssetImage).assetName == AppAssets.nextIcon,
    );
    expect(nextButton, findsOneWidget);
    await tester.tap(nextButton);
    await tester.pumpAndSettle();

    // Slide 2
    expect(find.text('Quick Doorstep Delivery'), findsOneWidget);
    expect(
      find.text('Track your order and enjoy quick\ndelivery.'),
      findsOneWidget,
    );

    // Tap next button to advance to Slide 3
    await tester.tap(nextButton);
    await tester.pumpAndSettle();

    // Slide 3
    expect(find.text('Delivered in No Time'), findsOneWidget);
    expect(
      find.text(
        'Fast delivery from local stores right to\nyour doorstep.',
      ),
      findsOneWidget,
    );
    expect(find.text('Skip'), findsOneWidget);

    // Tap Next button on last slide to navigate to LoginScreen
    await tester.tap(nextButton);
    await tester.pumpAndSettle();

    expect(find.byType(LoginScreen), findsOneWidget);
  });

  testWidgets('Skip button from slide 1 directly navigates to LoginScreen',
      (WidgetTester tester) async {
    await tester.pumpWidget(const CustomerApp());
    await tester.pump(const Duration(milliseconds: 3000));
    await tester.pumpAndSettle();

    expect(find.byType(WalkthroughScreen), findsOneWidget);
    expect(find.text('Skip'), findsOneWidget);

    await tester.tap(find.text('Skip'));
    await tester.pumpAndSettle();

    expect(find.byType(LoginScreen), findsOneWidget);
  });
}
