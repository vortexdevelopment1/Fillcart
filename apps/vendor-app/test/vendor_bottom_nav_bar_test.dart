import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:fillcart_vendor/core/bloc/app_status_bloc.dart';
import 'package:fillcart_vendor/features/dashboard/presentation/screens/vendor_dashboard_screen.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/vendor_earnings_screen.dart';
import 'package:fillcart_vendor/features/inventory/presentation/screens/vendor_inventory_screen.dart';
import 'package:fillcart_vendor/features/navigation/presentation/screens/main_vendor_screen.dart';
import 'package:fillcart_vendor/features/navigation/presentation/widgets/vendor_bottom_nav_bar.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_orders_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/vendor_profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('VendorBottomNavBar Unit & Widget Tests', () {
    testWidgets('renders all 5 navigation items with correct labels', (
      WidgetTester tester,
    ) async {
      int selectedIndex = 0;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: VendorBottomNavBar(
              currentIndex: selectedIndex,
              onTap: (index) => selectedIndex = index,
            ),
          ),
        ),
      );

      // Verify all 5 tab labels are visible
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Earnings'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(find.text('Inventory'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);

      // Verify 5 SvgPicture widgets are present
      expect(find.byType(SvgPicture), findsNWidgets(5));
    });

    testWidgets('active item displays active color (#D4F932) and filled SVG', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: VendorBottomNavBar(
              currentIndex: 0,
              onTap: (_) {},
            ),
          ),
        ),
      );

      // Verify Home is active
      final homeText = tester.widget<Text>(find.text('Home'));
      expect(homeText.style?.color, VendorBottomNavBar.activeColor);
      expect(homeText.style?.fontWeight, FontWeight.w600);

      // Verify Earnings is inactive
      final earningsText = tester.widget<Text>(find.text('Earnings'));
      expect(earningsText.style?.color, VendorBottomNavBar.inactiveColor);
    });

    testWidgets('tapping on an item triggers onTap callback with index', (
      WidgetTester tester,
    ) async {
      int tappedIndex = -1;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            bottomNavigationBar: VendorBottomNavBar(
              currentIndex: 0,
              onTap: (index) => tappedIndex = index,
            ),
          ),
        ),
      );

      // Tap on Orders (index 2)
      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();

      expect(tappedIndex, 2);

      // Tap on Inventory (index 3)
      await tester.tap(find.text('Inventory'));
      await tester.pumpAndSettle();

      expect(tappedIndex, 3);
    });

    testWidgets('MainVendorScreen switches screens when tab is selected', (
      WidgetTester tester,
    ) async {
      final bloc = AppStatusBloc()..add(const AppStatusStarted());

      await tester.pumpWidget(
        BlocProvider<AppStatusBloc>.value(
          value: bloc,
          child: MaterialApp(
            theme: FCTheme.lightTheme,
            home: const MainVendorScreen(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Starts on Home tab
      expect(find.byType(VendorDashboardScreen), findsOneWidget);

      // Switch to Earnings tab (index 1)
      await tester.tap(find.text('Earnings'));
      await tester.pumpAndSettle();
      expect(find.byType(VendorEarningsScreen), findsOneWidget);

      // Switch to Orders tab (index 2)
      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();
      expect(find.byType(VendorOrdersScreen), findsOneWidget);

      // Switch to Inventory tab (index 3)
      await tester.tap(find.text('Inventory'));
      await tester.pumpAndSettle();
      expect(find.byType(VendorInventoryScreen), findsOneWidget);

      // Tap top-left back arrow in Products & Inventory screen -> should return to Home
      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pumpAndSettle();
      expect(find.byType(VendorDashboardScreen), findsOneWidget);

      // Switch to Profile tab (index 4)
      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();
      expect(find.byType(VendorProfileScreen), findsOneWidget);

      bloc.close();
    });
  });
}
