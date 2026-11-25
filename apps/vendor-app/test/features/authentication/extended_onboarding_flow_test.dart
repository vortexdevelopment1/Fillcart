import 'package:fillcart_vendor/features/authentication/authentication.dart';
import 'package:fillcart_vendor/features/dashboard/presentation/screens/vendor_dashboard_screen.dart';
import 'package:fillcart_vendor/features/navigation/presentation/screens/main_vendor_screen.dart';
import 'package:fillcart_vendor/features/navigation/presentation/widgets/vendor_bottom_nav_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('Extended Vendor Onboarding Flow Tests (10 Screens)', () {
    testWidgets('StoreDetailsScreen auto-fills on Use current location and expands map on tap', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const StoreDetailsScreen()));
      await tester.pumpAndSettle();

      // Verify Header & Step
      expect(find.text('Store details'), findsOneWidget);
      expect(find.text('2/5'), findsOneWidget);
      expect(find.text('Use current location'), findsOneWidget);
      expect(find.text('Select on map'), findsOneWidget);
      expect(find.text('Store is Online'), findsOneWidget);
      expect(find.text('Continue'), findsOneWidget);

      // Verify map initial height is 100.0
      final animatedContainerFinder = find.byType(AnimatedContainer);
      expect(animatedContainerFinder, findsOneWidget);
      AnimatedContainer containerWidget =
          tester.widget<AnimatedContainer>(animatedContainerFinder);
      expect(containerWidget.constraints?.maxHeight ?? 100.0, 100.0);

      // Tap on the map to expand it double in size (to 200.0)
      await tester.tap(animatedContainerFinder);
      await tester.pumpAndSettle();

      containerWidget =
          tester.widget<AnimatedContainer>(animatedContainerFinder);
      expect(containerWidget.constraints?.maxHeight ?? 200.0, 200.0);

      // Tap "Use current location"
      await tester.tap(find.text('Use current location'));
      await tester.pumpAndSettle();

      // Fields should be filled automatically
      expect(
        find.text('Plot 42, Chinnakalu Avenue, Near Purnima School'),
        findsOneWidget,
      );
      expect(find.text('Indore'), findsOneWidget);
      expect(find.text('452010'), findsOneWidget);

      // Scroll and Tap Continue and verify navigation to PanDetailsScreen
      await tester.ensureVisible(find.text('Continue'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      expect(find.byType(PanDetailsScreen), findsOneWidget);
      expect(find.text('PAN Details'), findsOneWidget);
      expect(find.text('3/5'), findsOneWidget);
    });

    testWidgets('PanDetailsScreen navigates to AadhaarDetailsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const PanDetailsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('PAN Details'), findsOneWidget);
      expect(find.text('3/5'), findsOneWidget);
      expect(find.text('Enter your 10-character PAN as mentioned on your PAN card.'), findsOneWidget);

      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      expect(find.byType(AadhaarDetailsScreen), findsOneWidget);
      expect(find.text('Aadhaar Details'), findsOneWidget);
      expect(find.text('4/5'), findsOneWidget);
    });

    testWidgets('AadhaarDetailsScreen and AadhaarVerificationScreen flow', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const AadhaarDetailsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Aadhaar Details'), findsOneWidget);
      expect(find.text('Upload  Front Image'), findsOneWidget);
      expect(find.text('Upload  Back Image'), findsOneWidget);
      expect(find.text('Please Note'), findsOneWidget);

      // Tap Send OTP
      await tester.tap(find.text('Send OTP'));
      await tester.pumpAndSettle();

      expect(find.byType(AadhaarVerificationScreen), findsOneWidget);
      expect(find.text('Aadhaar Verification'), findsOneWidget);
      expect(find.text('OTP sent to your Aadhaar linked mobile number ending with 4785.'), findsOneWidget);

      // Tap Verify Aadhaar
      await tester.tap(find.text('Verify Aadhaar'));
      await tester.pumpAndSettle();

      expect(find.byType(AadhaarSuccessScreen), findsOneWidget);
      expect(find.text('Aadhaar Verify Success!'), findsOneWidget);
    });

    testWidgets('AadhaarSuccessScreen navigates to BusinessDocumentsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const AadhaarSuccessScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Aadhaar Verify Success!'), findsOneWidget);

      // Tap anywhere on screen to proceed
      await tester.tap(find.byType(GestureDetector).first);
      await tester.pumpAndSettle();

      expect(find.byType(BusinessDocumentsScreen), findsOneWidget);
      expect(find.text('Business Documents'), findsOneWidget);
      expect(find.text('Gumasta Certificate'), findsOneWidget);
      expect(find.text('Electricity Bill'), findsOneWidget);
    });

    testWidgets('BusinessDocumentsScreen allows selection and navigates to BankDetailsScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const BusinessDocumentsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Business Documents'), findsOneWidget);
      expect(find.text('4/5'), findsOneWidget);

      // All 4 cards should be closed by default
      expect(find.text('Upload File'), findsNothing);
      expect(find.text('Shop Owner'), findsNothing);

      // Tap Gumasta Certificate -> opens Upload File
      await tester.tap(find.text('Gumasta Certificate'));
      await tester.pumpAndSettle();
      expect(find.text('Upload File'), findsOneWidget);

      // Upload file in Gumasta
      await tester.tap(find.text('Upload File'));
      await tester.pumpAndSettle();
      expect(find.text('File Uploaded ✓'), findsOneWidget);

      // Tap FSSAI Certificate -> previous upload is cleared automatically
      await tester.tap(find.text('FSSAI Certificate'));
      await tester.pumpAndSettle();
      expect(find.text('File Uploaded ✓'), findsNothing);
      expect(find.text('Upload File'), findsOneWidget);

      // Tap Electricity Bill -> shows Shop Owner / On Rent and Upload File
      await tester.tap(find.text('Electricity Bill'));
      await tester.pumpAndSettle();
      expect(find.text('Shop Owner'), findsOneWidget);
      expect(find.text('On Rent'), findsOneWidget);
      expect(find.text('Upload File'), findsOneWidget);

      // Scroll and Tap Continue
      await tester.ensureVisible(find.text('Continue'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      expect(find.byType(BankDetailsScreen), findsOneWidget);
      expect(find.text('Bank details'), findsOneWidget);
    });

    testWidgets('BankDetailsScreen navigates to SummaryCheckScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const BankDetailsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Bank details'), findsOneWidget);

      // Scroll and Tap Continue
      await tester.ensureVisible(find.text('Continue'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Continue'));
      await tester.pumpAndSettle();

      expect(find.byType(SummaryCheckScreen), findsOneWidget);
      expect(find.text('Summary check'), findsOneWidget);
      expect(find.text('#FC2822'), findsOneWidget);
      expect(find.text('Delivered'), findsOneWidget);
    });

    testWidgets('SummaryCheckScreen submits to VerificationInProgressScreen and can view fixes', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const SummaryCheckScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Summary check'), findsOneWidget);
      expect(find.text('Business'), findsOneWidget);
      expect(find.text('Store'), findsOneWidget);
      expect(find.text('Bank'), findsOneWidget);
      expect(find.text('Documents'), findsOneWidget);

      // Scroll and Tap Submit for verification
      await tester.ensureVisible(find.text('Submit for verification'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Submit for verification'));
      await tester.pumpAndSettle();

      expect(find.byType(VerificationInProgressScreen), findsOneWidget);
      expect(find.text('Verification In Progress'), findsOneWidget);
      expect(find.text('Application submitted'), findsOneWidget);
      expect(find.text('Documents under review'), findsOneWidget);
      expect(find.text('Approved & ready to go online'), findsOneWidget);
    });

    testWidgets('SummaryCheckScreen edit buttons redirect to respective screens', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const SummaryCheckScreen()));
      await tester.pumpAndSettle();

      // Find all Edit buttons
      final editButtons = find.text('Edit');
      expect(editButtons, findsNWidgets(4));

      // 1. Tap Edit on Business Card (index 0)
      await tester.tap(editButtons.at(0));
      await tester.pumpAndSettle();
      expect(find.byType(BusinessInformationScreen), findsOneWidget);
      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pumpAndSettle();

      // 2. Tap Edit on Store Card (index 1)
      await tester.tap(editButtons.at(1));
      await tester.pumpAndSettle();
      expect(find.byType(StoreDetailsScreen), findsOneWidget);
      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pumpAndSettle();

      // 3. Tap Edit on Bank Card (index 2)
      await tester.tap(editButtons.at(2));
      await tester.pumpAndSettle();
      expect(find.byType(BankDetailsScreen), findsOneWidget);
      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pumpAndSettle();

      // 4. Tap Edit on Documents Card (index 3)
      await tester.ensureVisible(editButtons.at(3));
      await tester.pumpAndSettle();
      await tester.tap(editButtons.at(3));
      await tester.pumpAndSettle();
      expect(find.byType(BusinessDocumentsScreen), findsOneWidget);
    });

    testWidgets('VerificationFixesScreen renders issues to resolve correctly', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const VerificationFixesScreen()));
      await tester.pumpAndSettle();

      expect(find.text('We need a few fixes'), findsOneWidget);
      expect(find.text('Issues to resolve:'), findsOneWidget);
      expect(
        find.text('GST certificate blurry or text illegible. Please upload clear scan.'),
        findsOneWidget,
      );
      expect(
        find.text('Bank passbook name did not match PAN registry name.'),
        findsOneWidget,
      );
    });

    testWidgets(
      'VerificationInProgressScreen redirects to MainVendorScreen after delay',
      (WidgetTester tester) async {
        await tester.pumpWidget(
          buildTestableWidget(
            const VerificationInProgressScreen(
              redirectDelay: Duration(seconds: 2),
            ),
          ),
        );
        await tester.pump();
        expect(find.byType(VerificationInProgressScreen), findsOneWidget);

        // Advance past redirectDelay -> should land on MainVendorScreen
        await tester.pump(const Duration(seconds: 2));
        await tester.pumpAndSettle();

        expect(find.byType(MainVendorScreen), findsOneWidget);
        expect(find.byType(VendorBottomNavBar), findsOneWidget);
        expect(find.byType(VendorDashboardScreen), findsOneWidget);
      },
    );
  });
}
