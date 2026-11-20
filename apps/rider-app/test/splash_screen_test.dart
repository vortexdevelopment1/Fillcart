import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/onboarding/presentation/onboarding_screen.dart';
import 'package:fillcart_rider/features/onboarding/presentation/splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('SplashScreen Widget Tests (Figma 1848:51661)', () {
    testWidgets('displays Rider logo asset at 192x192 logical size', (
      tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(home: SplashScreen(delay: Duration(seconds: 10))),
      );
      await tester.pump();

      final logoFinder = find.byKey(const Key('splash_rider_logo'));
      expect(logoFinder, findsOneWidget);

      final Image logoImage = tester.widget<Image>(logoFinder);
      expect(logoImage.width, equals(192));
      expect(logoImage.height, equals(192));
      expect(logoImage.fit, equals(BoxFit.contain));

      final AssetImage assetImage = logoImage.image as AssetImage;
      expect(assetImage.assetName, equals('assets/logo/rider_logo.png'));
    });

    testWidgets('automatically navigates to OnboardingScreen after delay', (
      tester,
    ) async {
      await tester.pumpWidget(const RiderApp());
      await tester.pump();

      expect(find.byType(SplashScreen), findsOneWidget);
      expect(find.byType(OnboardingScreen), findsNothing);

      // Advance clock past the 2s splash timer
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      expect(find.byType(SplashScreen), findsNothing);
      expect(find.byType(OnboardingScreen), findsOneWidget);
      expect(find.text('Start Delivering with Ease'), findsOneWidget);
    });
  });
}
