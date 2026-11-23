import 'package:fillcart_vendor/features/authentication/authentication.dart';
import 'package:fillcart_vendor/features/onboarding/onboarding.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('Authentication & Registration Flow Tests', () {
    testWidgets('LoginScreen renders all elements and validates inputs', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(buildTestableWidget(const LoginScreen()));
      await tester.pumpAndSettle();

      // Verify title & subtitle
      expect(find.text('Log in to your store'), findsOneWidget);
      expect(
        find.text(
          'Enter your registered mobile number. We will send you a 4-digit OTP.',
        ),
        findsOneWidget,
      );

      // Verify prefix & labels
      expect(find.text('Mobile Number'), findsOneWidget);
      expect(find.text('+91'), findsOneWidget);
      expect(find.text('Agree to our Terms & Conditions'), findsOneWidget);
      expect(find.text('Send OTP'), findsOneWidget);

      // Tap Send OTP without input shows validation
      await tester.tap(find.text('Send OTP'));
      await tester.pumpAndSettle();
      expect(find.text('Please enter a valid 10-digit mobile number'), findsOneWidget);

      // Enter 10 digits
      await tester.enterText(find.byType(TextField), '9865814795');
      await tester.pumpAndSettle();

      // Uncheck terms to verify validation works
      await tester.tap(find.text('Agree to our Terms & Conditions'));
      await tester.pumpAndSettle();

      // Tap Send OTP when terms is unchecked
      await tester.tap(find.text('Send OTP'));
      await tester.pumpAndSettle();
      expect(find.text('Please agree to our Terms & Conditions to proceed.'), findsOneWidget);

      // Re-check terms checkbox
      await tester.tap(find.text('Agree to our Terms & Conditions'));
      await tester.pumpAndSettle();

      // Tap Send OTP and verify navigation to OtpVerificationScreen
      await tester.tap(find.text('Send OTP'));
      await tester.pumpAndSettle();

      expect(find.byType(OtpVerificationScreen), findsOneWidget);
      expect(find.text('Enter the 4 digit code sent to +91 9865814795'), findsOneWidget);
    });

    testWidgets('OtpVerificationScreen allows typing OTP and navigates to BusinessInformationScreen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const OtpVerificationScreen(phoneNumber: '+91 9343568411'),
        ),
      );
      await tester.pumpAndSettle();

      // Verify Header
      expect(find.text('Enter OTP'), findsOneWidget);
      expect(find.text('Enter the 4 digit code sent to +91 9343568411'), findsOneWidget);
      expect(find.text('4-digit code'), findsOneWidget);
      expect(find.text('Change Number?'), findsOneWidget);
      expect(find.text('Verify & Continue'), findsOneWidget);
      expect(find.text('Didn’t receive the OTP? '), findsOneWidget);

      // Verify 4 input boxes
      final textFields = find.byType(TextField);
      expect(textFields, findsNWidgets(4));

      // Enter 4 digits: 4, 8, 2, 9
      await tester.enterText(textFields.at(0), '4');
      await tester.enterText(textFields.at(1), '8');
      await tester.enterText(textFields.at(2), '2');
      await tester.enterText(textFields.at(3), '9');
      await tester.pumpAndSettle();

      // Tap Verify & Continue
      await tester.tap(find.text('Verify & Continue'));
      await tester.pumpAndSettle();

      expect(find.byType(BusinessInformationScreen), findsOneWidget);
      expect(find.text('Business Information'), findsOneWidget);
      expect(find.text('1/5'), findsOneWidget);
    });

    testWidgets('BusinessInformationScreen renders all fields and verified badge', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const BusinessInformationScreen(phoneNumber: '+91 98658147958'),
        ),
      );
      await tester.pumpAndSettle();

      // Verify header & progress indicator
      expect(find.text('Business Information'), findsOneWidget);
      expect(find.text('1/5'), findsOneWidget);

      // Verify form fields
      expect(find.text('Fresh Mart Supermarket'), findsOneWidget);
      expect(find.text('Gopal Yadav'), findsOneWidget);
      expect(find.text('+91 98658147958'), findsOneWidget);
      expect(find.text('Verified'), findsOneWidget);
      expect(find.text('Category'), findsOneWidget);
      expect(find.text('Sub Category'), findsOneWidget);
      expect(find.text('Continue'), findsOneWidget);

      // Tap Category selector to open BottomSheet 1
      await tester.tap(find.text('Grocery, Beauty'));
      await tester.pumpAndSettle();

      expect(find.byType(CategorySelectionBottomSheet), findsOneWidget);
      expect(find.text('Select categories'), findsOneWidget);
      expect(find.text('Apply (2)'), findsOneWidget);

      // Apply selection to close sheet
      await tester.tap(find.text('Apply (2)'));
      await tester.pumpAndSettle();
      expect(find.byType(CategorySelectionBottomSheet), findsNothing);

      // Tap Sub Category selector to open BottomSheet 2
      await tester.ensureVisible(find.text('Continue'));
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.keyboard_arrow_down_rounded).last);
      await tester.pumpAndSettle();

      expect(find.byType(SubCategorySelectionBottomSheet), findsOneWidget);
      expect(find.text('Select Sub Categories'), findsOneWidget);
      expect(find.text('Apply (6)'), findsOneWidget);

      // Apply selection to close sheet
      await tester.tap(find.text('Apply (6)'));
      await tester.pumpAndSettle();
      expect(find.byType(SubCategorySelectionBottomSheet), findsNothing);
    });

    testWidgets('OnboardingScreen Get Started navigates to LoginScreen by default', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const MaterialApp(home: OnboardingScreen()));
      await tester.pumpAndSettle();

      // Navigate to slide 2
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Navigate to slide 3
      await tester.tap(find.text('Next'));
      await tester.pumpAndSettle();

      // Tap Get Started
      expect(find.text('Get Started'), findsOneWidget);
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();

      // Verify LoginScreen is opened
      expect(find.byType(LoginScreen), findsOneWidget);
      expect(find.text('Log in to your store'), findsOneWidget);
    });
  });
}
