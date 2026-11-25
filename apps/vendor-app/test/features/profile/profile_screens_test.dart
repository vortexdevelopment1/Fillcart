import 'package:fillcart_vendor/features/profile/presentation/screens/bank_account_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/edit_profile_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/faqs_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/help_support_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/privacy_about_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/store_business_details_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/vendor_profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('VendorProfileScreen Widget Tests', () {
    testWidgets('renders all components and navigation cards correctly',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const VendorProfileScreen()));
      await tester.pumpAndSettle();

      // Screen title
      expect(find.text('Profile'), findsOneWidget);

      // Profile banner card
      expect(find.text('Rakesh Kumar'), findsOneWidget);
      expect(find.text('Vendor ID: VND12345'), findsOneWidget);
      expect(find.text('Verified'), findsOneWidget);

      // Metrics
      expect(find.text('12.5K'), findsOneWidget);
      expect(find.text('Total Sales'), findsOneWidget);
      expect(find.text('842'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(find.text('4.8'), findsOneWidget);
      expect(find.text('Rating'), findsOneWidget);

      // Section headers
      expect(find.text('Account & Business'), findsOneWidget);
      expect(find.text('Support & Information'), findsOneWidget);

      // Account & Business cards
      expect(find.text('Store & Business Details'), findsOneWidget);
      expect(find.text('Name, category, address'), findsOneWidget);
      expect(find.text('Bank Account'), findsOneWidget);
      expect(find.text('Bank details'), findsOneWidget);

      // Support & Information cards
      expect(find.text('Help & Support'), findsOneWidget);
      expect(find.text('FAQ, contact support'), findsOneWidget);
      expect(find.text('Privacy & About'), findsOneWidget);
      expect(find.text('Privacy police, app information'), findsOneWidget);

      // Log out button
      expect(find.text('Log Out'), findsOneWidget);
    });

    testWidgets('tapping Store & Business Details card navigates to screen',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const VendorProfileScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Store & Business Details'));
      await tester.pumpAndSettle();

      expect(find.byType(StoreBusinessDetailsScreen), findsOneWidget);
      expect(find.text('Store Information'), findsOneWidget);
      expect(find.text('Contact information'), findsOneWidget);
    });

    testWidgets('tapping Bank Account card navigates to screen',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const VendorProfileScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Bank Account'));
      await tester.pumpAndSettle();

      expect(find.byType(BankAccountScreen), findsOneWidget);
      expect(find.text('Bank Name'), findsOneWidget);
      expect(find.text('Update Bank Account'), findsOneWidget);
    });

    testWidgets('tapping Help & Support card navigates to screen',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const VendorProfileScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Help & Support'));
      await tester.pumpAndSettle();

      expect(find.byType(HelpSupportScreen), findsOneWidget);
      expect(find.text('How can we help?'), findsOneWidget);
    });

    testWidgets('tapping banner card navigates to EditProfileScreen',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const VendorProfileScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Rakesh Kumar'));
      await tester.pumpAndSettle();

      expect(find.byType(EditProfileScreen), findsOneWidget);
      expect(find.text('Personal details'), findsOneWidget);
    });

    testWidgets('tapping Log Out opens confirmation dialog', (tester) async {
      await tester.pumpWidget(buildTestableWidget(const VendorProfileScreen()));
      await tester.pumpAndSettle();

      await tester.scrollUntilVisible(find.text('Log Out'), 200);
      await tester.tap(find.text('Log Out'));
      await tester.pumpAndSettle();

      expect(
        find.text(
            'Are you sure you want to log out of your Fillcart vendor account?'),
        findsOneWidget,
      );
      expect(find.text('Cancel'), findsOneWidget);
    });
  });

  group('EditProfileScreen Widget Tests', () {
    testWidgets('renders edit profile form with prefilled values',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const EditProfileScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Edit Profile'), findsOneWidget);
      expect(find.text('Rakesh Mart'), findsNWidgets(2));
      expect(find.text('Personal details'), findsOneWidget);
      expect(find.text('Rakesh Yadav'), findsOneWidget);
      expect(find.text('+91 98765 43210'), findsOneWidget);
      expect(find.text('rakesh@gmail.com'), findsOneWidget);
      expect(find.text('Save changes'), findsOneWidget);
    });
  });

  group('StoreBusinessDetailsScreen Widget Tests', () {
    testWidgets('renders store information and contact information',
        (tester) async {
      await tester.pumpWidget(
          buildTestableWidget(const StoreBusinessDetailsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Store & Business Details'), findsOneWidget);
      expect(find.text('Store Information'), findsOneWidget);
      expect(find.text('Shop Name*'), findsOneWidget);
      expect(find.text('Category*'), findsOneWidget);
      expect(find.text('Sub Category*'), findsOneWidget);
      expect(find.text('Beauty'), findsNWidgets(2));
      expect(find.text('Grocery'), findsNWidgets(2));
      expect(find.text('Contact information'), findsOneWidget);
      expect(find.text('Business Mobile Number'), findsOneWidget);
      expect(find.text('Alternate Mobile Number'), findsOneWidget);
      expect(find.text('Business Email'), findsOneWidget);
      expect(find.text('Save changes'), findsOneWidget);
    });
  });

  group('BankAccountScreen Widget Tests', () {
    testWidgets('renders bank details and update button', (tester) async {
      await tester.pumpWidget(buildTestableWidget(const BankAccountScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Bank Account'), findsOneWidget);
      expect(find.text('Bank Name'), findsOneWidget);
      expect(find.text('Account holder name'), findsOneWidget);
      expect(find.text('Account Number'), findsOneWidget);
      expect(find.text('Confirm account number'), findsOneWidget);
      expect(find.text('IFSC code'), findsOneWidget);
      expect(find.text('Update Bank Account'), findsOneWidget);
    });
  });

  group('HelpSupportScreen & FAQs Widget Tests', () {
    testWidgets('renders help and support screen with action cards',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const HelpSupportScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Help & Support'), findsOneWidget);
      expect(find.text('How can we help?'), findsOneWidget);
      expect(find.text('Search help topics...'), findsOneWidget);
      expect(find.text('FAQs'), findsOneWidget);
      expect(find.text('Contact Support'), findsOneWidget);
      expect(find.text('Call Us'), findsOneWidget);
      expect(find.text('Email Support'), findsOneWidget);
    });

    testWidgets('FAQs screen expands accordion items on tap and filters',
        (tester) async {
      await tester.pumpWidget(buildTestableWidget(const FaqsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('FAQs'), findsOneWidget);
      expect(find.text('How do I update my store details?'), findsOneWidget);
      // First item expanded by default
      expect(
        find.text(
            'Go to Profile > Store & Business Details and update the information. Click on \'Save Changes\' to keep the updates.'),
        findsOneWidget,
      );

      // Tap another question to expand it
      await tester.tap(find.text('Can I change my store logo?'));
      await tester.pumpAndSettle();

      expect(
        find.text(
            'Yes, you can update your store logo anytime from Profile > Edit Profile and tapping the edit pencil icon on your avatar.'),
        findsOneWidget,
      );

      // Test real-time search filter
      await tester.enterText(
          find.widgetWithText(TextField, 'Search help topics...'), 'commission');
      await tester.pumpAndSettle();

      expect(find.text('What is the commission charge?'), findsOneWidget);
      expect(find.text('How do I update my store details?'), findsNothing);
    });
  });

  group('PrivacyAboutScreen Widget Tests', () {
    testWidgets('renders privacy policy and terms of service', (tester) async {
      await tester.pumpWidget(buildTestableWidget(const PrivacyAboutScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Privacy & About'), findsOneWidget);
      expect(find.text('Fillcart Vendor'), findsOneWidget);
      expect(find.text('Privacy Policy'), findsOneWidget);
      expect(find.text('Terms of Service'), findsOneWidget);
    });
  });
}
