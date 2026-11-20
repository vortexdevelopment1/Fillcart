import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/app/router/app_router.dart';
import 'package:fillcart_rider/features/authentication/presentation/phone_number_input_screen.dart';
import 'package:fillcart_rider/features/onboarding/presentation/onboarding_screen.dart';
import 'package:fillcart_rider/features/onboarding/presentation/widgets/onboarding_page_indicator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Onboarding Walkthrough Tests (Figma 1848:51668, 51685, 51702)', () {
    Widget createOnboardingTestApp() {
      final router = AppRouter.createRouter(initialLocation: '/onboarding');
      return RiderApp(router: router);
    }

    testWidgets('initially displays page 1 with correct text and active dot', (
      tester,
    ) async {
      await tester.pumpWidget(createOnboardingTestApp());
      await tester.pumpAndSettle();

      expect(find.byType(OnboardingScreen), findsOneWidget);
      expect(find.text('Start Delivering with Ease'), findsOneWidget);
      expect(
        find.text(
          'Accept nearby orders, manage deliveries efficiently, and stay connected with customers in real time.',
        ),
        findsOneWidget,
      );
      expect(find.text('Skip'), findsOneWidget);

      // Verify page indicator dots: dot 0 is active (width 16 + 6px margin = 22), dots 1 & 2 inactive (width 6 + 6px margin = 12)
      final dot0Size = tester.getSize(
        find.byKey(const Key('onboarding_dot_0')),
      );
      final dot1Size = tester.getSize(
        find.byKey(const Key('onboarding_dot_1')),
      );
      expect(dot0Size.width, equals(22));
      expect(dot1Size.width, equals(12));

      // Verify page indicator is horizontally centered in the screen
      final screenWidth = tester.getSize(find.byType(OnboardingScreen)).width;
      final indicatorRect = tester.getRect(
        find.byType(OnboardingPageIndicator),
      );
      expect(indicatorRect.center.dx, closeTo(screenWidth / 2, 1.0));
    });

    testWidgets('swiping horizontally updates page and active indicator', (
      tester,
    ) async {
      await tester.pumpWidget(createOnboardingTestApp());
      await tester.pumpAndSettle();

      // Swipe left from page 1 to page 2
      await tester.drag(
        find.byKey(const Key('onboarding_page_view')),
        const Offset(-400, 0),
      );
      await tester.pumpAndSettle();

      // Page 2 text
      expect(find.text('Track Earnings & Rewards'), findsOneWidget);
      expect(
        find.text(
          'Monitor your daily earnings, unlock incentives, and achieve bonus targets as you complete more deliveries.',
        ),
        findsOneWidget,
      );

      final dot1Size = tester.getSize(
        find.byKey(const Key('onboarding_dot_1')),
      );
      expect(dot1Size.width, equals(22));
    });

    testWidgets('tapping Next advances through all 3 pages sequentially', (
      tester,
    ) async {
      await tester.pumpWidget(createOnboardingTestApp());
      await tester.pumpAndSettle();

      final nextButton = find.byKey(const Key('onboarding_next_button'));

      // Page 1
      expect(find.text('Start Delivering with Ease'), findsOneWidget);

      // Tap Next -> Page 2
      await tester.tap(nextButton);
      await tester.pumpAndSettle();
      expect(find.text('Track Earnings & Rewards'), findsOneWidget);

      // Tap Next -> Page 3
      await tester.tap(nextButton);
      await tester.pumpAndSettle();
      expect(find.text('Accept, Navigate & Deliver'), findsOneWidget);
      expect(
        find.text(
          'Receive instant order requests, follow optimized routes, and complete deliveries quickly and smoothly.',
        ),
        findsOneWidget,
      );
    });

    testWidgets(
      'tapping Next on page 3 navigates to existing PhoneNumberInputScreen',
      (tester) async {
        await tester.pumpWidget(createOnboardingTestApp());
        await tester.pumpAndSettle();

        final nextButton = find.byKey(const Key('onboarding_next_button'));

        // Navigate to page 3
        await tester.tap(nextButton);
        await tester.pumpAndSettle();
        await tester.tap(nextButton);
        await tester.pumpAndSettle();

        expect(find.text('Accept, Navigate & Deliver'), findsOneWidget);

        // Tap Next on final page
        await tester.tap(nextButton);
        await tester.pumpAndSettle();

        // Navigated to PhoneNumberInputScreen
        expect(find.byType(PhoneNumberInputScreen), findsOneWidget);
        expect(find.text('Add Phone Number'), findsOneWidget);
      },
    );

    testWidgets(
      'tapping Skip on page 1 navigates directly to PhoneNumberInputScreen',
      (tester) async {
        await tester.pumpWidget(createOnboardingTestApp());
        await tester.pumpAndSettle();

        final skipButton = find.byKey(const Key('onboarding_skip_button'));
        await tester.tap(skipButton);
        await tester.pumpAndSettle();

        expect(find.byType(PhoneNumberInputScreen), findsOneWidget);
        expect(find.text('Add Phone Number'), findsOneWidget);
      },
    );

    testWidgets('rapid taps on Next do not trigger duplicate navigation', (
      tester,
    ) async {
      await tester.pumpWidget(createOnboardingTestApp());
      await tester.pumpAndSettle();

      final nextButton = find.byKey(const Key('onboarding_next_button'));

      // Move to page 3
      await tester.tap(nextButton);
      await tester.pumpAndSettle();
      await tester.tap(nextButton);
      await tester.pumpAndSettle();

      // Multiple rapid taps on the final Next button
      await tester.tap(nextButton);
      await tester.tap(nextButton);
      await tester.tap(nextButton);
      await tester.pumpAndSettle();

      expect(find.byType(PhoneNumberInputScreen), findsOneWidget);
    });
  });
}
