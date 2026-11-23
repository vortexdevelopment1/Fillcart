import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/authentication/data/mock_auth_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('OTP Verification Flow Tests (Figma 1848:51901)', () {
    Future<void> navigateToOtpScreen(WidgetTester tester) async {
      await tester.pumpWidget(
        RiderApp(
          key: UniqueKey(),
          initialLocation: '/phone',
          authRepository: const MockAuthRepository(delay: Duration.zero),
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
        find.text('Enter the 6-digit OTP sent to +91', findRichText: true),
        findsOneWidget,
      );
      expect(find.text('9876543210'), findsOneWidget);
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

    testWidgets(
      'renders subtitle with exact format: Enter the 6-digit OTP sent to +91 and dynamic phone number',
      (tester) async {
        await tester.pumpWidget(
          RiderApp(
            key: UniqueKey(),
            initialLocation: '/phone',
            authRepository: const MockAuthRepository(delay: Duration.zero),
          ),
        );
        await tester.pumpAndSettle();

        // Enter a custom 10-digit number
        await tester.enterText(
          find.byKey(const Key('phone_number_input_field')),
          '8123456789',
        );
        await tester.pump();
        await tester.tap(find.byKey(const Key('phone_continue_button')));
        await tester.pumpAndSettle();

        // Check line 1 and line 2
        expect(
          find.text('Enter the 6-digit OTP sent to +91', findRichText: true),
          findsOneWidget,
        );
        expect(find.text('8123456789'), findsOneWidget);

        // Check styling attributes
        final firstLineFinder = find.byKey(
          const Key('otp_subtitle_first_line'),
        );
        expect(firstLineFinder, findsOneWidget);
        final firstLineWidget = tester.widget<Text>(firstLineFinder);
        final rootSpan = firstLineWidget.textSpan as TextSpan;
        expect(rootSpan.text, 'Enter the 6-digit OTP sent to ');
        expect(rootSpan.style?.color, const Color(0xFF5B5B5B));
        expect(rootSpan.style?.fontWeight, FontWeight.w400);

        final plus91Span = rootSpan.children!.first as TextSpan;
        expect(plus91Span.text, '+91');
        expect(plus91Span.style?.fontWeight, FontWeight.w700);

        final phoneTextFinder = find.byKey(const Key('otp_phone_number_text'));
        expect(phoneTextFinder, findsOneWidget);
        final phoneTextWidget = tester.widget<Text>(phoneTextFinder);
        expect(phoneTextWidget.style?.color, const Color(0xFF000000));
        expect(phoneTextWidget.style?.fontWeight, FontWeight.w700);
      },
    );

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
      'successfully verifies OTP 1234, navigates to OTP Success screen, and then to Vehicle Details',
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

        // Confirms routed to OTP Verified Successfully screen
        expect(find.text('OTP Verified Successfully!'), findsOneWidget);
        expect(
          find.text('Your mobile number has been verified successfully.'),
          findsOneWidget,
        );

        // Advance 5-second timer
        await tester.pump(const Duration(seconds: 5));
        await tester.pumpAndSettle();

        // Confirms navigated to Vehicle Details
        expect(find.text('Vehicle Details'), findsOneWidget);
        expect(find.text('1/4'), findsOneWidget);
        expect(
          find.byKey(const Key('vehicle_rc_number_field')),
          findsOneWidget,
        );
      },
    );

    testWidgets(
      'successfully verifies 6-digit OTP 123456 and auto-advances to Vehicle Details after 5 seconds',
      (tester) async {
        await navigateToOtpScreen(tester);

        // Enter valid 6-digit mock OTP '123456'
        await tester.enterText(find.byKey(const Key('otp_cell_0')), '1');
        await tester.enterText(find.byKey(const Key('otp_cell_1')), '2');
        await tester.enterText(find.byKey(const Key('otp_cell_2')), '3');
        await tester.enterText(find.byKey(const Key('otp_cell_3')), '4');
        await tester.enterText(find.byKey(const Key('otp_cell_4')), '5');
        await tester.enterText(find.byKey(const Key('otp_cell_5')), '6');
        await tester.pump();

        if (find.byKey(const Key('otp_verify_button')).evaluate().isNotEmpty) {
          await tester.tap(
            find.byKey(const Key('otp_verify_button')),
            warnIfMissed: false,
          );
        }
        await tester.pumpAndSettle();

        // Confirms routed to OTP Verified Successfully screen
        expect(find.text('OTP Verified Successfully!'), findsOneWidget);

        // Advance 5-second timer
        await tester.pump(const Duration(seconds: 5));
        await tester.pumpAndSettle();

        // Confirms navigated to Vehicle Details
        expect(find.text('Vehicle Details'), findsOneWidget);
        expect(find.text('1/4'), findsOneWidget);
      },
    );

    testWidgets(
      'verifies OTP 1234, reaches Vehicle Details via Success screen, and confirms no back button exists',
      (tester) async {
        await navigateToOtpScreen(tester);

        // 1. Enter valid mock OTP '1234'
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

        // 2. Confirms OTP success screen
        expect(find.text('OTP Verified Successfully!'), findsOneWidget);

        // 3. Advance timer to Vehicle Details
        await tester.pump(const Duration(seconds: 5));
        await tester.pumpAndSettle();

        // 4. Confirms directly on Vehicle Details and NO back button exists per Figma
        expect(find.text('Vehicle Details'), findsOneWidget);
        expect(find.text('1/4'), findsOneWidget);
        expect(find.byKey(const Key('kyc_header_back_button')), findsNothing);
      },
    );
  });
}
