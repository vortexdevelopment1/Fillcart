import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/app/router/app_router.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_bloc.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/aadhaar_details_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/aadhaar_otp_verification_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/vehicle_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('KYC Wizard Stage A Flow Tests (Figma 1848:51738 & 1848:51834)', () {
    Widget createKycTestApp({String initialLocation = '/kyc/vehicle'}) {
      final kycBloc = KycBloc();
      final router = AppRouter.createRouter(initialLocation: initialLocation);
      return RiderApp(router: router, kycBloc: kycBloc);
    }

    testWidgets(
      'renders Vehicle Details Step 1/4 with single RC field and progress bar',
      (tester) async {
        await tester.pumpWidget(createKycTestApp());
        await tester.pumpAndSettle();

        expect(find.byType(VehicleDetailsScreen), findsOneWidget);
        expect(find.text('Vehicle Details'), findsOneWidget);
        expect(find.text('1/4'), findsOneWidget);
        // Vehicle Details has no back button per Figma
        expect(find.byKey(const Key('kyc_header_back_button')), findsNothing);

        // Single mandatory field
        expect(
          find.textContaining('Enter Vehicle RC No', findRichText: true),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('vehicle_rc_number_field')),
          findsOneWidget,
        );
        expect(find.byKey(const Key('vehicle_next_button')), findsOneWidget);
      },
    );

    testWidgets('shows validation error when Vehicle RC field is empty', (
      tester,
    ) async {
      await tester.pumpWidget(createKycTestApp());
      await tester.pumpAndSettle();

      // Tap Next with empty field
      await tester.tap(find.byKey(const Key('vehicle_next_button')));
      await tester.pumpAndSettle();

      expect(find.text('Please enter vehicle RC number'), findsOneWidget);
    });

    testWidgets(
      'navigates from Vehicle Details to Aadhaar Details on valid RC input',
      (tester) async {
        await tester.pumpWidget(createKycTestApp());
        await tester.pumpAndSettle();

        // Fill valid vehicle RC number
        await tester.enterText(
          find.byKey(const Key('vehicle_rc_number_field')),
          '22 BH 1234 AA',
        );
        await tester.pump();

        // Tap Next
        await tester.tap(find.byKey(const Key('vehicle_next_button')));
        await tester.pumpAndSettle();

        // Should now be on Aadhaar Details (Step 2/4)
        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);
        expect(find.text('Aadhar Details'), findsOneWidget);
        expect(find.text('2/4'), findsOneWidget);
        expect(find.textContaining('Aadhar Number'), findsOneWidget);
        expect(find.text('Upload  Front Image'), findsOneWidget);
        expect(find.text('Upload Back Image'), findsOneWidget);
      },
    );

    testWidgets(
      'Aadhaar Details validates 12-digit number and mock attachments',
      (tester) async {
        await tester.pumpWidget(
          createKycTestApp(initialLocation: '/kyc/aadhaar'),
        );
        await tester.pumpAndSettle();

        // Try submitting empty
        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();

        expect(find.text('Please enter Aadhaar number'), findsOneWidget);

        // Enter invalid short number
        await tester.enterText(
          find.byKey(const Key('aadhaar_number_field')),
          '12345',
        );
        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();

        expect(
          find.text('Aadhaar number must be exactly 12 digits'),
          findsOneWidget,
        );

        // Enter valid 12-digit number
        await tester.enterText(
          find.byKey(const Key('aadhaar_number_field')),
          '123456789012',
        );
        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();

        // Complain about missing images
        expect(
          find.text('Please attach front image of Aadhaar'),
          findsOneWidget,
        );
        expect(
          find.text('Please attach back image of Aadhaar'),
          findsOneWidget,
        );

        // Tap upload front image card
        await tester.tap(find.byKey(const Key('aadhaar_front_upload_card')));
        await tester.pumpAndSettle();
        expect(find.text('aadhaar_front.jpg'), findsOneWidget);

        // Tap upload back image card
        await tester.tap(find.byKey(const Key('aadhaar_back_upload_card')));
        await tester.pumpAndSettle();
        expect(find.text('aadhaar_back.jpg'), findsOneWidget);

        // Tap Next button with complete form -> navigates to Aadhaar Verification OTP
        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();

        expect(find.byType(AadhaarOtpVerificationScreen), findsOneWidget);
        expect(find.text('Aadhaar Verification'), findsOneWidget);
        expect(find.text('Enter OTP'), findsOneWidget);
      },
    );

    testWidgets(
      'back navigation from Aadhaar Details preserves Vehicle Details single RC state',
      (tester) async {
        await tester.pumpWidget(createKycTestApp());
        await tester.pumpAndSettle();

        // Fill vehicle RC details
        await tester.enterText(
          find.byKey(const Key('vehicle_rc_number_field')),
          'KA01XY9999',
        );
        await tester.pump();

        // Navigate to Step 2
        await tester.tap(find.byKey(const Key('vehicle_next_button')));
        await tester.pumpAndSettle();
        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);

        // Tap back button
        await tester.tap(find.byKey(const Key('kyc_header_back_button')));
        await tester.pumpAndSettle();

        // Verifies returned to Vehicle Details and single RC value is preserved
        expect(find.byType(VehicleDetailsScreen), findsOneWidget);
        expect(find.byKey(const Key('kyc_header_back_button')), findsNothing);
        expect(find.text('KA01XY9999'), findsOneWidget);
      },
    );
  });
}
