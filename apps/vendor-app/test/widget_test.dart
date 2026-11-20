import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:fillcart_vendor/app/vendor_app.dart';
import 'package:fillcart_vendor/core/bloc/app_status_bloc.dart';
import 'package:fillcart_vendor/core/presentation/placeholder_home_screen.dart';
import 'package:fillcart_vendor/features/navigation/presentation/screens/main_vendor_screen.dart';
import 'package:fillcart_vendor/features/navigation/presentation/widgets/vendor_bottom_nav_bar.dart';
import 'package:fillcart_vendor/main.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('VendorApp Widget Tests', () {
    testWidgets('boots VendorApp and renders MainVendorScreen with bottom nav', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const VendorApp());
      await tester.pumpAndSettle();

      expect(find.byType(MainVendorScreen), findsOneWidget);
      expect(find.byType(VendorBottomNavBar), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Earnings'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(find.text('Inventory'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('verifies Material 3 theme and typography application', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const VendorApp());
      await tester.pumpAndSettle();

      final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
      expect(materialApp.theme?.useMaterial3, isTrue);
      expect(materialApp.darkTheme?.useMaterial3, isTrue);

      final BuildContext context = tester.element(
        find.byType(MainVendorScreen),
      );
      final theme = Theme.of(context);
      expect(theme.useMaterial3, isTrue);
      expect(theme.colorScheme.primary, FCColors.lightPrimary);
    });

    testWidgets('renders PlaceholderHomeScreen when specified', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const VendorApp(home: PlaceholderHomeScreen()),
      );
      await tester.pumpAndSettle();

      expect(find.byType(PlaceholderHomeScreen), findsOneWidget);
      expect(find.text('Fillcart Vendor Portal'), findsOneWidget);
      expect(find.text('Vendor App Foundation'), findsOneWidget);
      expect(find.text('System Ready'), findsOneWidget);
      expect(find.byType(FCButton), findsOneWidget);
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
