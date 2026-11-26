import 'package:fillcart_customer/features/authentication/presentation/screens/enter_otp_screen.dart';
import 'package:fillcart_customer/features/authentication/presentation/screens/login_screen.dart';
import 'package:fillcart_customer/features/home/presentation/screens/customer_home_screen.dart';
import 'package:fillcart_customer/features/location/presentation/screens/confirm_location_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/category_listing_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/orders_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/store_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Widget wrap(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('Interactive Elements Test Suite', () {
    testWidgets('Home Screen location bar is clickable and opens ConfirmLocationScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CustomerHomeScreen()));
      await tester.pumpAndSettle();

      final locationFinder = find.text('Bengali Indore');
      expect(locationFinder, findsOneWidget);

      await tester.tap(locationFinder);
      await tester.pumpAndSettle();

      expect(find.byType(ConfirmLocationScreen), findsOneWidget);
      expect(find.text('Is this your current location?'), findsOneWidget);
    });

    testWidgets('Home Screen search bar is clickable and navigates to CategoryListingScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CustomerHomeScreen()));
      await tester.pumpAndSettle();

      final searchFinder = find.textContaining('Fortune oil, chocolate, milk');
      expect(searchFinder, findsOneWidget);

      await tester.tap(searchFinder);
      await tester.pumpAndSettle();

      expect(find.byType(CategoryListingScreen), findsOneWidget);
      expect(find.text('Search'), findsOneWidget);
    });

    testWidgets('Home Screen category card is clickable and navigates', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CustomerHomeScreen()));
      await tester.pumpAndSettle();

      final attaFinder = find.textContaining('Atta, Dal');
      expect(attaFinder, findsOneWidget);

      await tester.tap(attaFinder);
      await tester.pumpAndSettle();

      expect(find.byType(CategoryListingScreen), findsOneWidget);
      expect(find.text('Atta, Dal & Rice'), findsOneWidget);
    });

    testWidgets('Home Screen See All button is clickable and navigates', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CustomerHomeScreen()));
      await tester.pumpAndSettle();

      await tester.drag(find.byType(SingleChildScrollView).first, const Offset(0, -1800));
      await tester.pumpAndSettle();

      final seeAllFinders = find.text('See all >');
      expect(seeAllFinders, findsWidgets);

      await tester.tap(seeAllFinders.first);
      await tester.pumpAndSettle();

      expect(find.byType(CategoryListingScreen), findsOneWidget);
      expect(find.text('Featured Stores'), findsOneWidget);
    });

    testWidgets('Home Screen Featured Store card is clickable and navigates', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CustomerHomeScreen()));
      await tester.pumpAndSettle();

      await tester.drag(find.byType(SingleChildScrollView).first, const Offset(0, -1800));
      await tester.pumpAndSettle();

      final freshMartFinder = find.text('Fresh Mart');
      expect(freshMartFinder, findsOneWidget);

      await tester.tap(freshMartFinder);
      await tester.pumpAndSettle();

      expect(find.byType(StoreDetailsScreen), findsOneWidget);
      expect(find.text('Fresh Mart'), findsWidgets);
    });

    testWidgets('Home Screen Bottom Navigation Order tab opens OrdersScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CustomerHomeScreen()));
      await tester.pumpAndSettle();

      final cartNavFinder = find.byWidgetPredicate(
        (w) => w is Image && w.image is AssetImage && (w.image as AssetImage).assetName == 'assets/card-icons/Order 4.png',
      );
      expect(cartNavFinder, findsOneWidget);

      await tester.tap(cartNavFinder);
      await tester.pumpAndSettle();

      expect(find.byType(OrdersScreen), findsOneWidget);
    });

    testWidgets('CategoryListingScreen sort dropdown opens and selects options', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CategoryListingScreen()));
      await tester.pumpAndSettle();

      final sortButton = find.textContaining('Sort: Popular');
      expect(sortButton, findsOneWidget);

      await tester.tap(sortButton);
      await tester.pumpAndSettle();

      expect(find.text('Price: Low to High'), findsOneWidget);
      expect(find.text('Price: High to Low'), findsOneWidget);

      await tester.tap(find.text('Price: Low to High'));
      await tester.pumpAndSettle();

      expect(find.textContaining('Sort: Price: Low to High'), findsOneWidget);
    });

    testWidgets('Login Screen social login buttons are clickable and navigate to OTP', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const LoginScreen()));
      await tester.pumpAndSettle();

      final getOtpButton = find.text('Get OTP');
      expect(getOtpButton, findsOneWidget);

      await tester.tap(getOtpButton);
      await tester.pumpAndSettle();

      expect(find.byType(EnterOtpScreen), findsOneWidget);
      expect(find.text('Enter OTP'), findsOneWidget);
    });
  });
}
