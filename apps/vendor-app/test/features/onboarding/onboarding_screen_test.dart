import 'package:fillcart_vendor/features/onboarding/onboarding.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableOnboarding({
    VoidCallback? onFinish,
    Widget? nextScreen,
  }) {
    return MaterialApp(
      home: OnboardingScreen(
        onFinish: onFinish,
        nextScreen: nextScreen,
      ),
    );
  }

  group('OnboardingScreen Widget Tests', () {
    testWidgets('renders first onboarding screen correctly without back or skip', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableOnboarding());
      await tester.pumpAndSettle();

      // Screen 1 Title and Description
      expect(find.text('Open your\ndigital store'), findsOneWidget);
      expect(
        find.text(
          'Take your shop online and reach more customers in your city with fillcarts.',
        ),
        findsOneWidget,
      );

      // Back and skip should NOT be visible on first page
      expect(find.byIcon(Icons.arrow_back), findsNothing);
      expect(find.text('skip'), findsNothing);

      // Next button with arrow icon should be visible
      expect(find.text('Next'), findsOneWidget);
      expect(find.byIcon(Icons.arrow_forward_rounded), findsOneWidget);
      expect(find.byType(OnboardingDotIndicator), findsOneWidget);
    });

    testWidgets('tapping Next navigates to screen 2 with back and skip buttons', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableOnboarding());
      await tester.pumpAndSettle();

      // Tap Next
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Screen 2 Title and Description
      expect(find.text('Manage your\nstore with ease.'), findsOneWidget);
      expect(
        find.text(
          'Add products, track orders and keep your inventory up to date, all in one place.',
        ),
        findsOneWidget,
      );

      // Back and skip should now be visible
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
      expect(find.text('skip'), findsOneWidget);

      // Next button still present
      expect(find.text('Next'), findsOneWidget);
    });

    testWidgets('tapping Back on screen 2 returns to screen 1', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableOnboarding());
      await tester.pumpAndSettle();

      // Advance to Screen 2
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();
      expect(find.text('Manage your\nstore with ease.'), findsOneWidget);

      // Tap Back
      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pumpAndSettle();

      // Should be back on Screen 1
      expect(find.text('Open your\ndigital store'), findsOneWidget);
      expect(find.byIcon(Icons.arrow_back), findsNothing);
    });

    testWidgets('navigating to screen 3 shows "Get Started" without arrow', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableOnboarding());
      await tester.pumpAndSettle();

      // Move to Screen 2
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Move to Screen 3
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Screen 3 Title and Description
      expect(find.text('Track earnings,\nget paid weekly'), findsOneWidget);
      expect(
        find.text(
          'See your daily earnings, track settlements and receive payouts directly to your bank, every week.',
        ),
        findsOneWidget,
      );

      // Button should now be 'Get Started' without arrow icon
      expect(find.text('Get Started'), findsOneWidget);
      expect(find.byIcon(Icons.arrow_forward_rounded), findsNothing);

      // Back and skip should be visible
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
      expect(find.text('skip'), findsOneWidget);
    });

    testWidgets('tapping Get Started on screen 3 triggers completion', (
      WidgetTester tester,
    ) async {
      bool completed = false;
      await tester.pumpWidget(
        buildTestableOnboarding(onFinish: () => completed = true),
      );
      await tester.pumpAndSettle();

      // Advance to Screen 3
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Tap Get Started
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();

      expect(completed, isTrue);
    });

    testWidgets('tapping skip on screen 2 triggers completion', (
      WidgetTester tester,
    ) async {
      bool completed = false;
      await tester.pumpWidget(
        buildTestableOnboarding(onFinish: () => completed = true),
      );
      await tester.pumpAndSettle();

      // Advance to Screen 2
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Tap skip
      await tester.tap(find.text('skip'));
      await tester.pumpAndSettle();

      expect(completed, isTrue);
    });
  });
}
