import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/onboarding/presentation/splash_screen.dart';
import 'package:fillcart_rider/shared/constants/rider_colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Rider App Startup & Theme Tests', () {
    testWidgets('App starts up and displays SplashScreen by default', (
      tester,
    ) async {
      await tester.pumpWidget(const RiderApp());
      await tester.pump();

      expect(find.byType(RiderApp), findsOneWidget);
      expect(find.byType(SplashScreen), findsOneWidget);
      expect(find.byKey(const Key('splash_rider_logo')), findsOneWidget);

      // Settle the 2s splash timer
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();
    });

    testWidgets('App applies Material 3 and Rider brand theme correctly', (
      tester,
    ) async {
      await tester.pumpWidget(const RiderApp());
      await tester.pump();

      final BuildContext context = tester.element(find.byType(SplashScreen));
      final theme = Theme.of(context);

      expect(theme.useMaterial3, isTrue);
      expect(theme.colorScheme.primary, equals(RiderColors.primaryYellow));
      expect(theme.colorScheme.onPrimary, equals(RiderColors.onSurfaceDark));
      expect(theme.scaffoldBackgroundColor, equals(RiderColors.background));

      // Settle timer
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();
    });
  });
}
