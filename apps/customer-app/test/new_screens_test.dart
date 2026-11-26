import 'package:fillcart_customer/features/profile/presentation/screens/about_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/account_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/add_address_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/app_settings_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/faq_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/personal_info_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/privacy_policy_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/saved_address_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/terms_of_service_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/categories_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/orders_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/search_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/store_details_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/order_tracking_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Widget wrap(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('New Screens (Categories, Orders, Search) Test Suite', () {
    testWidgets('CategoriesScreen renders header, search input, category sections, and matches background', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CategoriesScreen()));
      await tester.pumpAndSettle();

      // Top location header
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Bengali, Indore'), findsOneWidget);

      // Search input placeholder
      expect(find.text("Search stores, groceries, etc."), findsOneWidget);

      // Section titles
      expect(find.text('Grocery'), findsOneWidget);
      expect(find.text('Fresh'), findsOneWidget);
      expect(find.text('Snacks & Beverages'), findsOneWidget);

      // Active Categories tab in bottom nav
      expect(find.text('Categories'), findsOneWidget);

      // Verify Scaffold background color matches Figma #FFFCF3
      final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
      expect(scaffold.backgroundColor, const Color(0xFFFFFCF3));
    });

    testWidgets('OrdersScreen renders active order, tabs, buy again grid, and order history', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const OrdersScreen()));
      await tester.pumpAndSettle();

      // Header title
      expect(find.text('Orders'), findsOneWidget);

      // Active Ongoing Order card
      expect(find.text('Out for delivery'), findsOneWidget);
      expect(find.text('4 min'), findsOneWidget);
      expect(find.text('Fresh Mart'), findsOneWidget);
      expect(find.text('Order #VL-8042'), findsOneWidget);
      expect(find.text('Placed at 9:38 AM • 3 Items'), findsOneWidget);
      expect(find.text('Order\nplaced'), findsOneWidget);
      expect(find.text('Picking\nitems'), findsOneWidget);
      expect(find.text('Out for\nDelivery'), findsOneWidget);
      expect(find.text('Arjun S.'), findsOneWidget);
      expect(find.text('Fortune Atta 5kg'), findsOneWidget);
      expect(find.text('₹350'), findsOneWidget);

      // Track order button
      final trackButton = find.text('Track Order');
      expect(trackButton, findsOneWidget);

      // Segmented Tabs
      expect(find.text('Buy Again'), findsOneWidget);
      expect(find.text('Order History'), findsOneWidget);

      // Buy Again caption & products
      expect(find.text('Items from your past orders — add them back with one tap.'), findsOneWidget);
      expect(find.text('Fortune Atta'), findsWidgets);

      // Switch to Order History tab
      await tester.tap(find.text('Order History'));
      await tester.pumpAndSettle();

      // Order History cards
      expect(find.text('ORD-8790'), findsWidgets);
      expect(find.text('ORD-8763'), findsOneWidget);
      expect(find.text('ORD-8741'), findsOneWidget);
      expect(find.text('✓ Delivered'), findsWidgets);
      expect(find.text('✕ Cancelled'), findsOneWidget);
      expect(find.text('₹40.50'), findsWidgets);
      expect(find.text('₹3,423'), findsOneWidget);

      // Switch back to Buy Again tab
      await tester.tap(find.text('Buy Again'));
      await tester.pumpAndSettle();

      // Tap Track Order navigates to OrderTrackingScreen
      await tester.tap(trackButton);
      await tester.pumpAndSettle();

      expect(find.byType(OrderTrackingScreen), findsOneWidget);
    });

    testWidgets('AccountScreen renders profile info, quick action cards, and navigates to PersonalInfoScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const AccountScreen()));
      await tester.pumpAndSettle();

      // Header and user profile
      expect(find.text('Account'), findsOneWidget);
      expect(find.text('Divya'), findsOneWidget);
      expect(find.text('+91 - 1236555866'), findsOneWidget);

      // Quick action cards
      expect(find.text('Saved\nAddress'), findsOneWidget);
      expect(find.text('Payment\nModes'), findsOneWidget);
      expect(find.text('Fillcarts\nMoney'), findsOneWidget);

      // Sections
      expect(find.text('ACCOUNT'), findsOneWidget);
      expect(find.text('Personal info'), findsOneWidget);
      expect(find.text('Refer & Earn'), findsOneWidget);

      expect(find.text('PREFERENCES'), findsOneWidget);
      expect(find.text('App settings'), findsOneWidget);
      expect(find.text('Help & Support'), findsOneWidget);

      expect(find.text('MORE'), findsOneWidget);
      expect(find.text('About Us'), findsOneWidget);
      expect(find.text('Log out'), findsOneWidget);

      // Tap Personal info navigates to PersonalInfoScreen
      await tester.tap(find.text('Personal info'));
      await tester.pumpAndSettle();

      expect(find.byType(PersonalInfoScreen), findsOneWidget);
    });

    testWidgets('PersonalInfoScreen renders form fields, gender selector, and saves changes', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const PersonalInfoScreen()));
      await tester.pumpAndSettle();

      // Header
      expect(find.text('Personal Info'), findsOneWidget);

      // Form field labels and values
      expect(find.text('FULL NAME'), findsOneWidget);
      expect(find.text('Jamie Donovan'), findsOneWidget);

      expect(find.text('PHONE NUMBER'), findsOneWidget);
      expect(find.text('+91'), findsOneWidget);
      expect(find.text('98765 43210'), findsOneWidget);
      expect(find.text('Verify new number'), findsOneWidget);

      expect(find.text('EMAIL ADDRESS'), findsOneWidget);
      expect(find.text('jamie@example.com'), findsOneWidget);

      expect(find.text('DATE OF BIRTH'), findsOneWidget);

      // Gender choices
      expect(find.text('Male'), findsOneWidget);
      expect(find.text('Female'), findsOneWidget);
      expect(find.text('Other'), findsOneWidget);

      // Select Female
      await tester.tap(find.text('Female'));
      await tester.pumpAndSettle();

      // Save button
      final saveButton = find.text('Save Changes');
      expect(saveButton, findsOneWidget);

      await tester.tap(saveButton);
      await tester.pumpAndSettle();

      expect(find.text('Personal info updated successfully!'), findsOneWidget);
    });

    testWidgets('SearchScreen renders search bar, recent search chips, promo banner, and product sections', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const SearchScreen()));
      await tester.pumpAndSettle();

      // Search placeholder
      expect(find.text("Search for 'Store'"), findsOneWidget);

      // Recent search section and chips
      expect(find.text('Recent'), findsOneWidget);
      expect(find.text('Almond butter'), findsOneWidget);
      expect(find.text('iPhone cable'), findsOneWidget);
      expect(find.text('Face wash'), findsOneWidget);
      expect(find.text('Highlighters'), findsOneWidget);

      // Hero Promo banner (image 69.png) is rendered
      final bannerFinder = find.byWidgetPredicate(
        (w) => w is Image && w.image is AssetImage && (w.image as AssetImage).assetName == 'assets/images/image 69.png',
      );
      expect(bannerFinder, findsOneWidget);

      // Trending section
      expect(find.text('🔥 Trending'), findsOneWidget);
      expect(find.text('Popular Right Now'), findsOneWidget);
    });

    testWidgets('SearchScreen search functionality allows typing and filtering results', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const SearchScreen()));
      await tester.pumpAndSettle();

      // Enter search term "Atta"
      await tester.enterText(find.byType(TextField), 'Atta');
      await tester.pumpAndSettle();

      // Results header appears
      expect(find.textContaining('Results for "Atta"'), findsOneWidget);
      expect(find.textContaining('found'), findsOneWidget);

      // Matches Fortune Atta, Nature Fresh Atta, Aashirvaad Wheat Atta
      expect(find.text('Fortune Atta'), findsWidgets);
      expect(find.text('Nature Fresh Atta'), findsWidgets);
      expect(find.text('Aashirvaad Wheat Atta'), findsWidgets);

      // Clear search button clears text and returns to default view
      final clearButton = find.byIcon(Icons.close);
      expect(clearButton, findsOneWidget);
      await tester.tap(clearButton);
      await tester.pumpAndSettle();

      expect(find.text('Recent'), findsOneWidget);
      expect(find.text('🔥 Trending'), findsOneWidget);
    });

    testWidgets('SearchScreen recent search chip triggers search on tap', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const SearchScreen()));
      await tester.pumpAndSettle();

      // Tap on "Almond butter" chip
      await tester.tap(find.text('Almond butter'));
      await tester.pumpAndSettle();

      // Results for "Almond butter" are displayed
      expect(find.textContaining('Results for "Almond butter"'), findsOneWidget);
      expect(find.text('Almond butter'), findsWidgets);
    });

    testWidgets('StoreDetailsScreen renders Fresh Mart header, categories, products, and footer', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const StoreDetailsScreen(storeName: 'Fresh Mart', autoCycleCartBar: false)));
      await tester.pumpAndSettle();

      // Store Title, badges, and rating
      expect(find.text('Fresh Mart'), findsOneWidget);
      expect(find.text('Top Rated'), findsOneWidget);
      expect(find.text('Open'), findsOneWidget);
      expect(find.text('4.8 (1.2k reviews)'), findsOneWidget);
      expect(find.text('Grocery • Vegetables • 15–20 mins'), findsOneWidget);

      // Search bar
      expect(find.text('Search stores, groceries, etc.'), findsOneWidget);

      // 10% OFF Promo Banner
      expect(find.textContaining('10% OFF'), findsOneWidget);

      // Store Category Sections
      expect(find.text('Grocery'), findsOneWidget);
      expect(find.text('Fresh'), findsOneWidget);
      expect(find.text('Snacks & Beverages'), findsOneWidget);

      // Product Sections
      expect(find.text('Best Selling'), findsOneWidget);
      expect(find.text('Discounted Products'), findsOneWidget);
      expect(find.text('Top Picks for you'), findsOneWidget);
      expect(find.text('See all >'), findsWidgets);

      // Daily Essentials Red Banner
      expect(find.text('Daily Essentials'), findsOneWidget);
      expect(find.text('Lowest price guaranteed'), findsOneWidget);
      expect(find.text('VIEW ALL >'), findsOneWidget);

      // Footer
      expect(find.textContaining('Your\nneighborhood,\nnow online. ⭐'), findsOneWidget);
    });

    testWidgets('StoreDetailsScreen cart button navigates to CartScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const StoreDetailsScreen(autoCycleCartBar: false)));
      await tester.pumpAndSettle();

      final cartButtonFinder = find.byIcon(Icons.shopping_bag_outlined);
      expect(cartButtonFinder, findsOneWidget);

      await tester.tap(cartButtonFinder);
      await tester.pumpAndSettle();

      expect(find.byType(CartScreen), findsOneWidget);
    });

    testWidgets('StoreDetailsScreen Cart Bar animates sequentially across State 1, State 2, and State 3', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const StoreDetailsScreen(autoCycleCartBar: true, initialCartBarIndex: 0)));
      await tester.pump();

      // State 1: 10% OFF
      expect(find.textContaining('10% OFF'), findsOneWidget);
      expect(find.textContaining('– On orders above ₹499'), findsOneWidget);

      // Advance timer by 3 seconds for sequential animation to State 2
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();

      // State 2: Free Delivery
      expect(find.textContaining('Free Delivery'), findsOneWidget);
      expect(find.textContaining('– On orders above ₹299'), findsOneWidget);

      // Advance timer by another 3 seconds for sequential animation to State 3
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();

      // State 3: Subscribe & save 5% ⭐
      expect(find.text('Subscribe & save 5% ⭐'), findsOneWidget);

      // Tap on the bar cycles immediately back to State 1
      await tester.tap(find.text('Subscribe & save 5% ⭐'));
      await tester.pumpAndSettle();

      expect(find.textContaining('10% OFF'), findsOneWidget);
    });

    testWidgets('AppSettingsScreen renders appearance, language, notification switches, and about sections', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const AppSettingsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('App Setting'), findsOneWidget);
      expect(find.text('APPEARANCE'), findsOneWidget);
      expect(find.text('Light'), findsOneWidget);
      expect(find.text('Dark'), findsOneWidget);

      expect(find.text('LANGUAGE'), findsOneWidget);
      expect(find.text('English'), findsOneWidget);
      expect(find.text('Hindi'), findsOneWidget);

      expect(find.text('NOTIFICATIONS'), findsOneWidget);
      expect(find.text('Order updates'), findsOneWidget);
      expect(find.text('Offers & deals'), findsOneWidget);

      expect(find.text('PRIVACY'), findsOneWidget);
      expect(find.text('Location access'), findsOneWidget);
      expect(find.text('Share analytics'), findsOneWidget);

      expect(find.text('ABOUT'), findsOneWidget);
      expect(find.text('App version'), findsOneWidget);
      expect(find.text('v4.12.1'), findsOneWidget);
    });

    testWidgets('FaqScreen renders search, chips, expandable questions, and chat button', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const FaqScreen()));
      await tester.pumpAndSettle();

      expect(find.text("FAQ's"), findsOneWidget);
      expect(find.text('Search FAQs...'), findsOneWidget);
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(find.text('Wallet & Payments'), findsOneWidget);

      expect(find.text('Where is my order?'), findsOneWidget);
      expect(find.text('How do I cancel an order?'), findsOneWidget);
      expect(find.text('Still need help?'), findsOneWidget);
      expect(find.text('Chat'), findsOneWidget);

      // Expand another question
      await tester.tap(find.text('How do I cancel an order?'));
      await tester.pumpAndSettle();

      expect(find.textContaining('Orders can be cancelled before the store finishes packing'), findsOneWidget);
    });

    testWidgets('SavedAddressScreen renders addresses, edit/delete actions, and navigates to AddAddressScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const SavedAddressScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Saved Address'), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Default'), findsOneWidget);
      expect(find.text('Work'), findsOneWidget);
      expect(find.text("Mom's Place"), findsOneWidget);
      expect(find.text('Edit'), findsWidgets);
      expect(find.text('Delete'), findsWidgets);

      // Tap Add New Address button
      final addAddressButton = find.text('Add New Address');
      expect(addAddressButton, findsOneWidget);

      await tester.tap(addAddressButton);
      await tester.pumpAndSettle();

      expect(find.byType(AddAddressScreen), findsOneWidget);
    });

    testWidgets('AddAddressScreen renders map preview, type selector, and form inputs', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 1050));
      await tester.pumpWidget(wrap(const AddAddressScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Add Address'), findsOneWidget);
      expect(find.text('Use my location'), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Work'), findsOneWidget);
      expect(find.text('Other'), findsOneWidget);

      expect(find.text('FULL NAME*'), findsOneWidget);
      expect(find.text('Jamie Donovan'), findsOneWidget);
      expect(find.text('PHONE NUMBER*'), findsOneWidget);
      expect(find.text('HOUSE/APARTMENT*'), findsOneWidget);
      expect(find.text('STREET ADDRESS'), findsOneWidget);
      expect(find.text('Set as default address'), findsOneWidget);

      final saveButton = find.text('Save Address');
      expect(saveButton, findsOneWidget);
    });

    testWidgets('AddAddressScreen Auto-Detection mode renders map, current location card, and confirms location', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const AddAddressScreen(initialFullMapMode: true)));
      await tester.pumpAndSettle();

      expect(find.text('Add Address'), findsOneWidget);
      expect(find.text('Current Location'), findsOneWidget);
      expect(find.textContaining('Vijay Nagar Mg road Near Medanta Hospital'), findsOneWidget);
      expect(find.text('HOUSE/APARTMENT*'), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Work'), findsOneWidget);
      expect(find.text('Other'), findsOneWidget);

      final confirmButton = find.text('Confirm Location');
      expect(confirmButton, findsOneWidget);

      // Tap Confirm Location
      await tester.tap(confirmButton);
      await tester.pumpAndSettle();

      // Returns to form mode with updated street, city, pin
      expect(find.text('Save Address'), findsOneWidget);
      expect(find.text('Vijay Nagar Mg road Near Medanta Hospital'), findsOneWidget);
      expect(find.text('Indore'), findsOneWidget);
      expect(find.text('452020'), findsOneWidget);
    });

    testWidgets('AboutScreen renders logo, version, and navigates to Terms and Privacy screens', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const AboutScreen()));
      await tester.pumpAndSettle();

      expect(find.text('About'), findsOneWidget);
      expect(find.text('FillCarts'), findsOneWidget);
      expect(find.text('Version: 1.0.0'), findsOneWidget);

      final termsTile = find.text('Terms of Service');
      final privacyTile = find.text('Privacy Policy');

      expect(termsTile, findsOneWidget);
      expect(privacyTile, findsOneWidget);

      // Tap Terms of Service
      await tester.tap(termsTile);
      await tester.pumpAndSettle();

      expect(find.byType(TermsOfServiceScreen), findsOneWidget);
      expect(find.text('1. Use of the App'), findsOneWidget);

      // Pop back to About using back icon
      final backButton = find.byIcon(Icons.arrow_back);
      expect(backButton, findsOneWidget);
      await tester.tap(backButton);
      await tester.pumpAndSettle();

      // Tap Privacy Policy
      await tester.tap(privacyTile);
      await tester.pumpAndSettle();

      expect(find.byType(PrivacyPolicyScreen), findsOneWidget);
      expect(find.text('1. Information We Collect'), findsOneWidget);
    });
  });
}
