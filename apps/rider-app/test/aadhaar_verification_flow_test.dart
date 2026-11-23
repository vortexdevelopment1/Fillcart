import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/app/router/app_router.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_bloc.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/aadhaar_details_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/aadhaar_otp_verification_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/aadhaar_verify_success_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/driving_license_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Aadhaar Verification Flow Tests (Nodes 2164:20215 & 2164:20238)', () {
    Widget createAadhaarFlowTestApp({
      String initialLocation = '/kyc/aadhaar',
      KycBloc? bloc,
    }) {
      final kycBloc = bloc ?? KycBloc();
      final router = AppRouter.createRouter(initialLocation: initialLocation);
      return RiderApp(router: router, kycBloc: kycBloc);
    }

    testWidgets(
      'Scenario 1: Aadhaar Details Next action navigates to /kyc/aadhaar-otp',
      (tester) async {
        await tester.pumpWidget(createAadhaarFlowTestApp());
        await tester.pumpAndSettle();

        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);

        // Fill valid Aadhaar details
        await tester.enterText(
          find.byKey(const Key('aadhaar_number_field')),
          '123456789012',
        );
        await tester.tap(find.byKey(const Key('aadhaar_front_upload_card')));
        await tester.tap(find.byKey(const Key('aadhaar_back_upload_card')));
        await tester.pumpAndSettle();

        // Tap Next
        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();

        // Verify transitioned to AadhaarOtpVerificationScreen
        expect(find.byType(AadhaarOtpVerificationScreen), findsOneWidget);
        expect(find.text('Aadhaar Verification'), findsOneWidget);
        expect(find.text('Enter OTP'), findsOneWidget);
      },
    );

    testWidgets(
      'Scenario 2: OTP screen renders exact title, subtitle ending with 4785, and 6 OTP cells',
      (tester) async {
        await tester.pumpWidget(
          createAadhaarFlowTestApp(initialLocation: '/kyc/aadhaar-otp'),
        );
        await tester.pumpAndSettle();

        expect(find.text('Aadhaar Verification'), findsOneWidget);
        expect(find.text('Enter OTP'), findsOneWidget);
        expect(
          find.text(
            'OTP sent to your Aadhaar linked mobile number ending with 4785.',
          ),
          findsOneWidget,
        );

        for (int i = 0; i < 6; i++) {
          expect(find.byKey(Key('aadhaar_otp_cell_$i')), findsOneWidget);
        }

        expect(find.byKey(const Key('verify_aadhaar_button')), findsOneWidget);
      },
    );

    testWidgets(
      'Scenario 3 & 4: Verify Aadhaar button is disabled until 6 digits entered',
      (tester) async {
        await tester.pumpWidget(
          createAadhaarFlowTestApp(initialLocation: '/kyc/aadhaar-otp'),
        );
        await tester.pumpAndSettle();

        final buttonFinder = find.byKey(const Key('verify_aadhaar_button'));
        expect(tester.widget<ElevatedButton>(buttonFinder).enabled, isFalse);

        // Enter 5 digits
        for (int i = 0; i < 5; i++) {
          await tester.enterText(find.byKey(Key('aadhaar_otp_cell_$i')), '1');
        }
        await tester.pump();
        expect(tester.widget<ElevatedButton>(buttonFinder).enabled, isFalse);

        // Enter 6th digit
        await tester.enterText(
          find.byKey(const Key('aadhaar_otp_cell_5')),
          '1',
        );
        await tester.pump();
        expect(tester.widget<ElevatedButton>(buttonFinder).enabled, isTrue);
      },
    );

    testWidgets(
      'Scenario 5: Invalid OTP 000000 displays error banner without clearing entered digits',
      (tester) async {
        await tester.pumpWidget(
          createAadhaarFlowTestApp(initialLocation: '/kyc/aadhaar-otp'),
        );
        await tester.pumpAndSettle();

        for (int i = 0; i < 6; i++) {
          await tester.enterText(find.byKey(Key('aadhaar_otp_cell_$i')), '0');
        }
        await tester.pump();

        // Tap Verify Aadhaar
        await tester.tap(find.byKey(const Key('verify_aadhaar_button')));
        await tester.pump();

        expect(
          find.text('Invalid OTP. Please check the code and try again.'),
          findsOneWidget,
        );
        // Digits remain intact
        for (int i = 0; i < 6; i++) {
          expect(
            find.descendant(
              of: find.byKey(Key('aadhaar_otp_cell_$i')),
              matching: find.text('0'),
            ),
            findsOneWidget,
          );
        }
      },
    );

    testWidgets(
      'Scenario 6: Valid 6-digit OTP transitions to /kyc/aadhaar-success',
      (tester) async {
        await tester.pumpWidget(
          createAadhaarFlowTestApp(initialLocation: '/kyc/aadhaar-otp'),
        );
        await tester.pumpAndSettle();

        for (int i = 0; i < 6; i++) {
          await tester.enterText(find.byKey(Key('aadhaar_otp_cell_$i')), '1');
        }
        await tester.pump();

        await tester.tap(find.byKey(const Key('verify_aadhaar_button')));
        await tester.pumpAndSettle();

        expect(find.byType(AadhaarVerifySuccessScreen), findsOneWidget);
      },
    );

    testWidgets(
      'Scenario 7, 8 & 9: Resend countdown starts at 00:30, enables Resend code at 0, resets on tap',
      (tester) async {
        await tester.pumpWidget(
          createAadhaarFlowTestApp(initialLocation: '/kyc/aadhaar-otp'),
        );
        await tester.pump();

        expect(find.text('Resend code in 00:30'), findsOneWidget);

        // Advance 10 seconds
        await tester.pump(const Duration(seconds: 10));
        expect(find.text('Resend code in 00:20'), findsOneWidget);

        // Advance remaining 20 seconds
        await tester.pump(const Duration(seconds: 20));
        expect(find.text('Resend code'), findsOneWidget);

        // Tap Resend code
        await tester.tap(find.text('Resend code'));
        await tester.pump();

        expect(find.text('Resend code in 00:30'), findsOneWidget);

        // Pump out remaining timer
        await tester.pump(const Duration(seconds: 31));
      },
    );

    testWidgets(
      'Scenario 10 & 11: Back button and Change Number? return to Aadhaar Details with form data preserved',
      (tester) async {
        final bloc = KycBloc();
        await tester.pumpWidget(createAadhaarFlowTestApp(bloc: bloc));
        await tester.pumpAndSettle();

        // Fill Aadhaar Details
        await tester.enterText(
          find.byKey(const Key('aadhaar_number_field')),
          '987654321098',
        );
        await tester.tap(find.byKey(const Key('aadhaar_front_upload_card')));
        await tester.tap(find.byKey(const Key('aadhaar_back_upload_card')));
        await tester.pumpAndSettle();

        // Tap Next -> moves to OTP screen
        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();
        expect(find.byType(AadhaarOtpVerificationScreen), findsOneWidget);

        // Tap back arrow in OTP header
        await tester.tap(find.byKey(const Key('aadhaar_otp_back_button')));
        await tester.pumpAndSettle();

        // Verify returned to Aadhaar Details and values preserved
        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);
        expect(find.text('987654321098'), findsOneWidget);
        expect(find.text('aadhaar_front.jpg'), findsOneWidget);
        expect(find.text('aadhaar_back.jpg'), findsOneWidget);

        // Re-navigate to OTP screen
        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();
        expect(find.byType(AadhaarOtpVerificationScreen), findsOneWidget);

        // Tap "Change Number?"
        await tester.tap(
          find.byKey(const Key('aadhaar_otp_change_number_button')),
        );
        await tester.pumpAndSettle();

        // Verify returned again to Aadhaar Details with data preserved
        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);
        expect(find.text('987654321098'), findsOneWidget);
      },
    );

    testWidgets(
      'Scenario 12, 13 & 14: Success screen displays exact copy, animated icon, blocks back, and auto-navigates to Driving License after 5s',
      (tester) async {
        await tester.pumpWidget(
          createAadhaarFlowTestApp(initialLocation: '/kyc/aadhaar-success'),
        );
        await tester.pump();

        // Check exact typography and visual elements
        expect(find.text('Aadhaar Verify Success!'), findsOneWidget);
        expect(
          find.text('Your aadhaar verification is successfully verified.'),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('aadhaar_success_icon_container')),
          findsOneWidget,
        );

        // Check PopScope blocks back navigation
        final popScopeFinder = find.byWidgetPredicate((widget) => widget is PopScope);
        expect(popScopeFinder, findsOneWidget);
        final popScopeWidget = tester.widget<PopScope<dynamic>>(popScopeFinder);
        expect(popScopeWidget.canPop, isFalse);

        // Advance 4 seconds: should still be on Success screen
        await tester.pump(const Duration(seconds: 4));
        expect(find.byType(AadhaarVerifySuccessScreen), findsOneWidget);
        expect(find.byType(DrivingLicenseScreen), findsNothing);

        // Advance the 5th second: triggers auto-navigation to Driving License Details
        await tester.pump(const Duration(seconds: 1));
        await tester.pumpAndSettle();

        expect(find.byType(DrivingLicenseScreen), findsOneWidget);
        expect(find.text('Driving License'), findsOneWidget);
        expect(find.text('3/4'), findsOneWidget);
      },
    );
  });
}
