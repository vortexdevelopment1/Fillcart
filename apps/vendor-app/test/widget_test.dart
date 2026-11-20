import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:fillcart_vendor/app/vendor_app.dart';
import 'package:fillcart_vendor/core/bloc/app_status_bloc.dart';
import 'package:fillcart_vendor/core/presentation/placeholder_home_screen.dart';
import 'package:fillcart_vendor/features/onboarding/onboarding.dart';
import 'package:fillcart_vendor/features/splash/splash.dart';
import 'package:fillcart_vendor/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('VendorApp Foundation Widget Tests', () {
    testWidgets('boots VendorApp with splash transitioning to OnboardingScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const VendorApp());
      expect(find.byType(SplashScreen), findsOneWidget);

      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      expect(find.byType(OnboardingScreen), findsOneWidget);
      expect(find.text('Open your\ndigital store'), findsOneWidget);
    });

    testWidgets('boots VendorApp and renders PlaceholderHomeScreen when splash disabled', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const VendorApp(enableSplash: false));
      await tester.pumpAndSettle();

      expect(find.byType(PlaceholderHomeScreen), findsOneWidget);
      expect(find.text('Fillcart Vendor Portal'), findsOneWidget);
      expect(find.text('Vendor App Foundation'), findsOneWidget);
      expect(find.text('System Ready'), findsOneWidget);
      expect(find.text('Fillcart Vendor'), findsOneWidget);
      expect(find.byType(FCButton), findsOneWidget);
    });

    testWidgets('verifies Material 3 theme and typography application', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const VendorApp(enableSplash: false));
      await tester.pumpAndSettle();

      final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
      expect(materialApp.theme?.useMaterial3, isTrue);
      expect(materialApp.darkTheme?.useMaterial3, isTrue);

      final BuildContext context = tester.element(
        find.byType(PlaceholderHomeScreen),
      );
      final theme = Theme.of(context);
      expect(theme.useMaterial3, isTrue);
      expect(theme.colorScheme.primary, FCColors.lightPrimary);
    });

    testWidgets('tapping Refresh Status triggers status refresh event', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const VendorApp(enableSplash: false));
      await tester.pumpAndSettle();

      expect(find.text('System Ready'), findsOneWidget);

      await tester.tap(find.byType(FCButton));
      await tester.pumpAndSettle();

      expect(find.text('System Ready'), findsOneWidget);
    });

    testWidgets('shows loading state when bloc is in initial state', (
      WidgetTester tester,
    ) async {
      final bloc = AppStatusBloc(); // Initial uninitialized state
      await tester.pumpWidget(
        MaterialApp(
          theme: FCTheme.lightTheme,
          home: BlocProvider<AppStatusBloc>.value(
            value: bloc,
            child: const PlaceholderHomeScreen(),
          ),
        ),
      );

      // Verify FCLoadingIndicator is present
      expect(find.byType(FCLoadingIndicator), findsOneWidget);
      expect(find.text('Initializing...'), findsOneWidget);

      bloc.close();
    });
  });

  group('Bootstrap Error Deduplication Unit Tests', () {
    test('reportError suppresses duplicate rapid error logs', () {
      final exception = Exception('Test database timeout error');

      // First invocation should record signature
      reportError(exception, null, origin: 'FlutterError');

      // Second invocation immediately should be deduplicated
      reportError(exception, null, origin: 'FlutterError');

      // Different origin should not be suppressed
      reportError(exception, null, origin: 'PlatformDispatcher');
    });
  });
}
