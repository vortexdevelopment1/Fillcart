import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/app/router/app_router.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_bloc.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/aadhaar_details_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/bank_details_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/driving_license_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/vehicle_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('KYC Wizard Stage B Flow Tests (Figma 1848:51867 & 1848:51788)', () {
    Widget createKycTestApp({String initialLocation = '/kyc/driving-license'}) {
      final kycBloc = KycBloc();
      final router = AppRouter.createRouter(initialLocation: initialLocation);
      return RiderApp(router: router, kycBloc: kycBloc);
    }

    testWidgets('renders Driving License Step 3/4 with all required elements', (
      tester,
    ) async {
      await tester.pumpWidget(createKycTestApp());
      await tester.pumpAndSettle();

      expect(find.byType(DrivingLicenseScreen), findsOneWidget);
      expect(find.text('Driving License'), findsOneWidget);
      expect(find.text('3/4'), findsOneWidget);
      expect(find.byKey(const Key('kyc_header_back_button')), findsOneWidget);

      expect(
        find.byKey(const Key('driving_license_number_field')),
        findsOneWidget,
      );
      expect(
        find.byKey(const Key('driving_license_upload_card')),
        findsOneWidget,
      );
      expect(find.text('Upload  License Image'), findsOneWidget);
      expect(
        find.byKey(const Key('driving_license_expiry_date_field')),
        findsOneWidget,
      );
      expect(
        find.byKey(const Key('driving_license_next_button')),
        findsOneWidget,
      );
    });

    testWidgets(
      'Driving License validates number and license image attachment',
      (tester) async {
        await tester.pumpWidget(createKycTestApp());
        await tester.pumpAndSettle();

        // Tap Next with empty form
        await tester.tap(find.byKey(const Key('driving_license_next_button')));
        await tester.pumpAndSettle();

        expect(
          find.text('Please enter Driving License number'),
          findsOneWidget,
        );

        // Enter valid license number
        await tester.enterText(
          find.byKey(const Key('driving_license_number_field')),
          'DL1420110012345',
        );
        await tester.tap(find.byKey(const Key('driving_license_next_button')));
        await tester.pumpAndSettle();

        // License image error
        expect(
          find.text('Please attach Driving License image'),
          findsOneWidget,
        );

        // Tap upload card
        await tester.tap(find.byKey(const Key('driving_license_upload_card')));
        await tester.pumpAndSettle();
        expect(find.text('driving_license.jpg'), findsOneWidget);

        // Tap Next with complete form -> navigates to Bank Details (Step 4/4)
        await tester.tap(find.byKey(const Key('driving_license_next_button')));
        await tester.pumpAndSettle();

        expect(find.byType(BankDetailsScreen), findsOneWidget);
        expect(find.text('Bank Details'), findsOneWidget);
        expect(find.text('4/4'), findsOneWidget);
      },
    );

    testWidgets('renders Bank Details Step 4/4 with all 5 mandatory fields', (
      tester,
    ) async {
      await tester.pumpWidget(createKycTestApp(initialLocation: '/kyc/bank'));
      await tester.pumpAndSettle();

      expect(find.byType(BankDetailsScreen), findsOneWidget);
      expect(find.text('Bank Details'), findsOneWidget);
      expect(find.text('4/4'), findsOneWidget);
      expect(find.byKey(const Key('kyc_header_back_button')), findsOneWidget);

      expect(find.byKey(const Key('bank_holder_name_field')), findsOneWidget);
      expect(find.byKey(const Key('bank_name_field')), findsOneWidget);
      expect(find.byKey(const Key('bank_ifsc_code_field')), findsOneWidget);
      expect(
        find.byKey(const Key('bank_account_number_field')),
        findsOneWidget,
      );
      expect(
        find.byKey(const Key('bank_confirm_account_field')),
        findsOneWidget,
      );
      expect(find.byKey(const Key('bank_next_button')), findsOneWidget);
    });

    testWidgets(
      'Bank Details validates required fields and account number matching',
      (tester) async {
        await tester.pumpWidget(createKycTestApp(initialLocation: '/kyc/bank'));
        await tester.pumpAndSettle();

        // 1. Submit empty form
        await tester.tap(find.byKey(const Key('bank_next_button')));
        await tester.pumpAndSettle();

        expect(find.text('Please enter account holder name'), findsOneWidget);
        expect(find.text('Please enter bank name'), findsOneWidget);
        expect(find.text('Please enter IFSC code'), findsOneWidget);
        expect(find.text('Please enter account number'), findsOneWidget);
        expect(find.text('Please confirm account number'), findsOneWidget);

        // 2. Fill fields with mismatching account numbers
        await tester.enterText(
          find.byKey(const Key('bank_holder_name_field')),
          'Rahul Sharma',
        );
        await tester.enterText(
          find.byKey(const Key('bank_name_field')),
          'State Bank of India',
        );
        await tester.enterText(
          find.byKey(const Key('bank_ifsc_code_field')),
          'SBIN0001234',
        );
        await tester.enterText(
          find.byKey(const Key('bank_account_number_field')),
          '1234567890',
        );
        await tester.enterText(
          find.byKey(const Key('bank_confirm_account_field')),
          '9876543210',
        );
        await tester.pump();

        await tester.tap(find.byKey(const Key('bank_next_button')));
        await tester.pumpAndSettle();

        expect(find.text('Account numbers do not match'), findsOneWidget);

        // 3. Fix confirm account number to match
        await tester.enterText(
          find.byKey(const Key('bank_confirm_account_field')),
          '1234567890',
        );
        await tester.pump();

        await tester.tap(find.byKey(const Key('bank_next_button')));
        await tester.pumpAndSettle();

        expect(
          find.byKey(const Key('kyc_all_steps_completed_snackbar')),
          findsOneWidget,
        );
      },
    );

    testWidgets(
      'Full backward navigation from Bank Details to Vehicle Details preserves all form state',
      (tester) async {
        await tester.pumpWidget(
          createKycTestApp(initialLocation: '/kyc/vehicle'),
        );
        await tester.pumpAndSettle();

        // 1. Vehicle Details (Step 1/4)
        await tester.enterText(
          find.byKey(const Key('vehicle_rc_number_field')),
          '22 BH 9999 ZZ',
        );
        await tester.tap(find.byKey(const Key('vehicle_next_button')));
        await tester.pumpAndSettle();
        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);

        // 2. Aadhaar Details (Step 2/4)
        await tester.enterText(
          find.byKey(const Key('aadhaar_number_field')),
          '987654321098',
        );
        await tester.tap(find.byKey(const Key('aadhaar_front_upload_card')));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const Key('aadhaar_back_upload_card')));
        await tester.pumpAndSettle();

        await tester.tap(find.byKey(const Key('aadhaar_next_button')));
        await tester.pumpAndSettle();
        expect(find.byType(DrivingLicenseScreen), findsOneWidget);

        // 3. Driving License Details (Step 3/4)
        await tester.enterText(
          find.byKey(const Key('driving_license_number_field')),
          'DL0420220001234',
        );
        await tester.tap(find.byKey(const Key('driving_license_upload_card')));
        await tester.pumpAndSettle();

        await tester.tap(find.byKey(const Key('driving_license_next_button')));
        await tester.pumpAndSettle();
        expect(find.byType(BankDetailsScreen), findsOneWidget);

        // 4. Bank Details (Step 4/4) -> Enter holder name
        await tester.enterText(
          find.byKey(const Key('bank_holder_name_field')),
          'Amit Kumar',
        );
        await tester.pump();

        // 5. Navigate BACK: Bank -> DL
        await tester.tap(find.byKey(const Key('kyc_header_back_button')));
        await tester.pumpAndSettle();
        expect(find.byType(DrivingLicenseScreen), findsOneWidget);
        expect(find.text('DL0420220001234'), findsOneWidget);
        expect(find.text('driving_license.jpg'), findsOneWidget);

        // 6. Navigate BACK: DL -> Aadhaar
        await tester.tap(find.byKey(const Key('kyc_header_back_button')));
        await tester.pumpAndSettle();
        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);
        expect(find.text('987654321098'), findsOneWidget);
        expect(find.text('aadhaar_front.jpg'), findsOneWidget);

        // 7. Navigate BACK: Aadhaar -> Vehicle
        await tester.tap(find.byKey(const Key('kyc_header_back_button')));
        await tester.pumpAndSettle();
        expect(find.byType(VehicleDetailsScreen), findsOneWidget);
        expect(find.text('22 BH 9999 ZZ'), findsOneWidget);
      },
    );
  });
}
