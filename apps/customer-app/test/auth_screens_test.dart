import 'package:fillcart_customer/features/authentication/presentation/screens/enter_otp_screen.dart';
import 'package:fillcart_customer/features/authentication/presentation/screens/login_screen.dart';
import 'package:fillcart_customer/features/authentication/presentation/screens/sign_up_screen.dart';
import 'package:fillcart_customer/features/location/presentation/screens/enable_location_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('LoginScreen renders all Figma components and navigates',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    await tester.pumpAndSettle();

    // Check header text
    expect(find.textContaining('Everything You'), findsOneWidget);
    expect(find.textContaining('Platform.'), findsOneWidget);

    // Check login card components
    expect(find.text('Login'), findsOneWidget);
    expect(find.textContaining('Mobile'), findsOneWidget);
    expect(find.text('Enter Phone number'), findsOneWidget);
    expect(find.text('Get OTP'), findsOneWidget);
    expect(find.text('Or sign in with'), findsOneWidget);
    expect(find.text('No account? '), findsOneWidget);
    expect(find.text('Sign up'), findsOneWidget);

    // Tap Get OTP to navigate to EnterOtpScreen
    await tester.tap(find.text('Get OTP'));
    await tester.pumpAndSettle();
    expect(find.byType(EnterOtpScreen), findsOneWidget);
  });

  testWidgets('LoginScreen Sign up link navigates to SignUpScreen',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: LoginScreen()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Sign up'));
    await tester.pumpAndSettle();
    expect(find.byType(SignUpScreen), findsOneWidget);
  });

  testWidgets('SignUpScreen renders inputs, checkbox, and navigates to OTP',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: SignUpScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Sign Up'), findsOneWidget);
    expect(find.text('Fill your information below.'), findsOneWidget);
    expect(find.text('Name*'), findsOneWidget);
    expect(find.text('Mobile *'), findsOneWidget);
    expect(find.text('Email'), findsOneWidget);
    expect(find.textContaining('terms and condition'), findsOneWidget);
    expect(find.text('Get OTP'), findsOneWidget);

    // Toggle checkbox
    final checkboxFinder = find.byType(GestureDetector).at(0);
    await tester.tap(checkboxFinder);
    await tester.pumpAndSettle();

    // Tap Get OTP
    await tester.tap(find.text('Get OTP'));
    await tester.pumpAndSettle();
    expect(find.byType(EnterOtpScreen), findsOneWidget);
  });

  testWidgets('EnterOtpScreen handles OTP entry, enables Verify, and navigates',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: EnterOtpScreen()));
    await tester.pump();

    expect(find.text('Enter OTP'), findsOneWidget);
    expect(find.textContaining('We sent an sms'), findsOneWidget);
    expect(find.text('OTP'), findsOneWidget);
    expect(find.text('Verify'), findsOneWidget);
    expect(find.text('Resend'), findsOneWidget);

    // Enter 6 digits in OTP fields
    final textFields = find.byType(TextField);
    expect(textFields, findsNWidgets(6));

    for (int i = 0; i < 6; i++) {
      await tester.enterText(textFields.at(i), '1');
      await tester.pump();
    }
    await tester.pumpAndSettle();

    // Tap Verify
    await tester.tap(find.text('Verify'));
    await tester.pumpAndSettle();

    expect(find.byType(EnableLocationScreen), findsOneWidget);
  });
}
