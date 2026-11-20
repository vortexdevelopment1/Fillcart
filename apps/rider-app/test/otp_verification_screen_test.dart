import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/authentication/data/mock_auth_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('OTP Verification Flow Tests (Figma 1848:51901)', () {
    Future<void> navigateToOtpScreen(WidgetTester tester) async {
      await tester.pumpWidget(
        const RiderApp(
          initialLocation: '/phone',
          authRepository: MockAuthRepository(delay: Duration.zero),
        ),
      );
      await tester.pumpAndSettle();

      final phoneInput = find.byKey(const Key('phone_number_input_field'));
      final continueButton = find.byKey(const Key('phone_continue_button'));

      await tester.enterText(phoneInput, '9876543210');
      await tester.pump();
      await tester.tap(continueButton);
      await tester.pumpAndSettle();
    }

    testWidgets('renders OTP verification screen correctly matching Figma', (
      tester,
    ) async {
      await navigateToOtpScreen(tester);

      expect(find.text('Enter OTP'), findsOneWidget);
      expect(
        find.text(
          'We sent an sms with a 6-digit code to your registered Email. Please enter it so we can be sure that this Email belongs to you.',
        ),
        findsOneWidget,
      );
      expect(find.text('OTP'), findsOneWidget);
      expect(find.byKey(const Key('otp_cell_0')), findsOneWidget);
      expect(find.byKey(const Key('otp_cell_1')), findsOneWidget);
      expect(find.byKey(const Key('otp_cell_2')), findsOneWidget);
      expect(find.byKey(const Key('otp_cell_3')), findsOneWidget);
      expect(find.byKey(const Key('otp_cell_4')), findsOneWidget);
      expect(find.byKey(const Key('otp_cell_5')), findsOneWidget);
      expect(find.byKey(const Key('otp_verify_button')), findsOneWidget);
      expect(find.text('Verify'), findsOneWidget);
      expect(find.byKey(const Key('resend_otp_button')), findsOneWidget);
    });

    testWidgets('shows error when incorrect OTP is submitted', (tester) async {
      await navigateToOtpScreen(tester);

      // Enter incorrect OTP '0000'
      await tester.enterText(find.byKey(const Key('otp_cell_0')), '0');
      await tester.enterText(find.byKey(const Key('otp_cell_1')), '0');
      await tester.enterText(find.byKey(const Key('otp_cell_2')), '0');
      await tester.enterText(find.byKey(const Key('otp_cell_3')), '0');
      await tester.pump();

      await tester.tap(
        find.byKey(const Key('otp_verify_button')),
        warnIfMissed: false,
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('otp_error_text')), findsOneWidget);
      expect(
        find.text(
          'Invalid verification code. Enter 1234 for mock verification.',
        ),
        findsOneWidget,
      );
    });

    testWidgets(
      'successfully verifies OTP 1234 without navigating to an invented screen',
      (tester) async {
        await navigateToOtpScreen(tester);

        // Enter valid mock OTP '1234'
        await tester.enterText(find.byKey(const Key('otp_cell_0')), '1');
        await tester.enterText(find.byKey(const Key('otp_cell_1')), '2');
        await tester.enterText(find.byKey(const Key('otp_cell_2')), '3');
        await tester.enterText(find.byKey(const Key('otp_cell_3')), '4');
        await tester.pump();

        await tester.tap(
          find.byKey(const Key('otp_verify_button')),
          warnIfMissed: false,
        );
        await tester.pumpAndSettle();

        // Confirms verification occurred on the OTP screen with dev confirmation banner
        expect(
          find.byKey(const Key('dev_auth_success_banner')),
          findsOneWidget,
        );
        expect(
          find.text(
            '[DEV] Verified +91 9876543210. Next Figma screen: Vehicle Details (1848:51738) in Batch 2.',
          ),
          findsOneWidget,
        );
        expect(find.text('Verified'), findsOneWidget);
      },
    );

    testWidgets('successfully verifies 6-digit OTP 123456', (tester) async {
      await navigateToOtpScreen(tester);

      // Enter valid 6-digit mock OTP '123456'
      await tester.enterText(find.byKey(const Key('otp_cell_0')), '1');
      await tester.enterText(find.byKey(const Key('otp_cell_1')), '2');
      await tester.enterText(find.byKey(const Key('otp_cell_2')), '3');
      await tester.enterText(find.byKey(const Key('otp_cell_3')), '4');
      await tester.enterText(find.byKey(const Key('otp_cell_4')), '5');
      await tester.enterText(find.byKey(const Key('otp_cell_5')), '6');
      await tester.pump();

      await tester.tap(
        find.byKey(const Key('otp_verify_button')),
        warnIfMissed: false,
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('dev_auth_success_banner')), findsOneWidget);
      expect(find.text('Verified'), findsOneWidget);
    });
  });
}
