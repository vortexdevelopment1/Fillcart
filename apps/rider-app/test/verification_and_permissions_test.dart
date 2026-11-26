import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/app/router/app_router.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_bloc.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_state.dart';
import 'package:fillcart_rider/features/kyc/models/aadhaar_details_model.dart';
import 'package:fillcart_rider/features/kyc/models/driving_license_model.dart';
import 'package:fillcart_rider/features/kyc/models/vehicle_details_model.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/pending_verification_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/permissions_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _createTestWidget({required Widget child, KycBloc? kycBloc}) {
  return BlocProvider<KycBloc>.value(
    value: kycBloc ?? KycBloc(),
    child: MaterialApp(home: child),
  );
}

Widget _createRouterApp({required String initialLocation, KycBloc? kycBloc}) {
  final router = AppRouter.createRouter(initialLocation: initialLocation);
  return RiderApp(router: router, kycBloc: kycBloc ?? KycBloc());
}

void main() {
  group('Batch 1.3: 4-Screen Verification & Permissions Flow', () {
    testWidgets(
      'PendingVerificationScreen renders in-progress state and taps/navigates to rejected',
      (tester) async {
        final kycBloc = KycBloc();

        await tester.pumpWidget(
          _createRouterApp(
            initialLocation: '/kyc/pending',
            kycBloc: kycBloc,
          ),
        );
        await tester.pump();
        await tester.pump();

        // Check screen and text elements
        expect(find.byType(PendingVerificationScreen), findsOneWidget);
        expect(
          find.byKey(const Key('pending_verification_title')),
          findsOneWidget,
        );
        expect(find.text('Verification In Progress'), findsOneWidget);
        expect(
          find.byKey(const Key('pending_verification_subtitle')),
          findsOneWidget,
        );
        expect(
          find.text(
            "You'll be notified once your account is verified and ready to go online.",
          ),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('pending_verification_image')),
          findsOneWidget,
        );

        // Verification status is inProgress
        expect(
          kycBloc.state.verificationStatus,
          KycVerificationStatus.inProgress,
        );

        // Tap screen target advances to rejected
        final tapTarget = find.byKey(
          const Key('pending_verification_tap_target'),
        );
        expect(tapTarget, findsOneWidget);
        await tester.tap(tapTarget);
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 400));

        // Verify navigation reaches Document Rejected screen
        expect(
          find.byKey(const Key('document_rejection_title')),
          findsOneWidget,
        );
        expect(find.text('Documents Rejected'), findsOneWidget);

        expect(
          kycBloc.state.verificationStatus,
          KycVerificationStatus.rejected,
        );

        await tester.pumpWidget(const SizedBox.shrink());
        await tester.runAsync(() async {
          await kycBloc.close();
        });
      },
    );

    testWidgets(
      'PendingVerificationScreen debug query param ?outcome=success navigates to Verification Successful',
      (tester) async {
        final kycBloc = KycBloc();

        await tester.pumpWidget(
          _createRouterApp(
            initialLocation: '/kyc/pending?outcome=success',
            kycBloc: kycBloc,
          ),
        );
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 950));

        // Should now be on Verification Success screen
        expect(
          find.byKey(const Key('verification_success_title')),
          findsOneWidget,
        );
        expect(find.text('Verification Successful'), findsOneWidget);
        expect(
          kycBloc.state.verificationStatus,
          KycVerificationStatus.successful,
        );

        await tester.pumpWidget(const SizedBox.shrink());
        await tester.runAsync(() async {
          await kycBloc.close();
        });
      },
    );

    testWidgets(
      'PendingVerificationScreen debug query param ?outcome=rejected navigates to Document Rejected',
      (tester) async {
        final kycBloc = KycBloc();

        await tester.pumpWidget(
          _createRouterApp(
            initialLocation: '/kyc/pending?outcome=rejected',
            kycBloc: kycBloc,
          ),
        );
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 400));

        // Should now be on unified Document Rejected screen
        expect(
          find.byKey(const Key('document_rejection_title')),
          findsOneWidget,
        );
        expect(find.text('Documents Rejected'), findsOneWidget);
        expect(
          kycBloc.state.verificationStatus,
          KycVerificationStatus.rejected,
        );

        await tester.pumpWidget(const SizedBox.shrink());
        await tester.runAsync(() async {
          await kycBloc.close();
        });
      },
    );

    testWidgets(
      'VerificationSuccessScreen renders checkmark animation and tap navigates to Permissions',
      (tester) async {
        final kycBloc = KycBloc();

        await tester.pumpWidget(
          _createRouterApp(initialLocation: '/kyc/success', kycBloc: kycBloc),
        );
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 500));

        // Check elements
        expect(
          find.byKey(const Key('verification_success_title')),
          findsOneWidget,
        );
        expect(find.text('Verification Successful'), findsOneWidget);
        expect(
          find.byKey(const Key('verification_success_subtitle')),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('verification_success_icon_container')),
          findsOneWidget,
        );

        // Tap anywhere on the screen
        final tapTarget = find.byKey(
          const Key('verification_success_tap_target'),
        );
        expect(tapTarget, findsOneWidget);
        await tester.tap(tapTarget);
        await tester.pumpAndSettle();

        // Should now be on Permissions screen
        expect(
          find.byKey(const Key('permissions_header_title')),
          findsOneWidget,
        );
        expect(find.text('Allow Permission to proceed'), findsOneWidget);

        await tester.pumpWidget(const SizedBox.shrink());
        await tester.runAsync(() async {
          await kycBloc.close();
        });
      },
    );

    testWidgets(
      'DocumentRejectedScreen: Upload Documents button directly below subtitle navigates to Verification Successful',
      (tester) async {
        final kycBloc = KycBloc();

        await tester.pumpWidget(
          _createRouterApp(initialLocation: '/kyc/rejected', kycBloc: kycBloc),
        );
        await tester.pump();

        expect(
          find.byKey(const Key('document_rejection_title')),
          findsOneWidget,
        );
        expect(find.text('Documents Rejected'), findsOneWidget);
        expect(
          find.byKey(const Key('document_rejection_subtitle')),
          findsOneWidget,
        );
        expect(
          find.text(
            'Some documents need updating to\nactivate your rider account.',
          ),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('document_rejection_image')),
          findsOneWidget,
        );

        // Tap Upload Documents button
        final submitBtn = find.byKey(const Key('upload_documents_button'));
        expect(submitBtn, findsOneWidget);
        await tester.tap(submitBtn);
        await tester.pumpAndSettle();

        // Should progress to Verification Successful
        expect(
          find.byKey(const Key('verification_success_title')),
          findsOneWidget,
        );
        expect(
          kycBloc.state.verificationStatus,
          KycVerificationStatus.successful,
        );

        await tester.pumpWidget(const SizedBox.shrink());
        await tester.runAsync(() async {
          await kycBloc.close();
        });
      },
    );

    testWidgets(
      'PermissionsScreen renders literal Figma text (Option A), asset icons, and toggles',
      (tester) async {
        final kycBloc = KycBloc();

        await tester.pumpWidget(
          _createTestWidget(child: const PermissionsScreen(), kycBloc: kycBloc),
        );
        await tester.pump();

        // Verify header
        expect(find.text('Allow Permission to proceed'), findsOneWidget);

        // Verify Card 1 (literal text and double spaces preserved)
        expect(find.text('Display Over other apps'), findsOneWidget);
        expect(
          find.text('Helps  find rides based  on location'),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('permission_icon_location')),
          findsOneWidget,
        );

        // Verify Card 2 (literal text and typo preserved)
        expect(find.text('Background Location'), findsOneWidget);
        expect(
          find.text(
            'Permit app to display  o top of other apps to get rides alerts',
          ),
          findsOneWidget,
        );
        expect(
          find.byKey(const Key('permission_icon_display_overlay')),
          findsOneWidget,
        );

        // Verify Card 3
        expect(find.text('Battery Usage'), findsOneWidget);
        expect(find.text('Help app run in background'), findsOneWidget);
        expect(
          find.byKey(const Key('permission_icon_battery')),
          findsOneWidget,
        );

        final card1Switch = find.byKey(const Key('permission_card_1_switch'));
        final card2Switch = find.byKey(const Key('permission_card_2_switch'));
        final card3Switch = find.byKey(const Key('permission_card_3_switch'));

        expect(card1Switch, findsOneWidget);
        expect(card2Switch, findsOneWidget);
        expect(card3Switch, findsOneWidget);

        // Toggle Switch 1
        await tester.tap(card1Switch);
        await tester.pump();
        expect(kycBloc.state.isDisplayOverAppsGranted, isTrue);

        // Toggle Switch 2
        await tester.tap(card2Switch);
        await tester.pump();
        expect(kycBloc.state.isBackgroundLocationGranted, isTrue);

        // Toggle Switch 3
        await tester.tap(card3Switch);
        await tester.pump();
        expect(kycBloc.state.isBatteryUsageGranted, isTrue);
        expect(kycBloc.state.areAllPermissionsGranted, isTrue);

        await tester.pumpWidget(const SizedBox.shrink());
        await tester.runAsync(() async {
          await kycBloc.close();
        });
      },
    );

    testWidgets(
      'BankDetails submission navigates to PendingVerificationScreen preserving complete state',
      (tester) async {
        final kycBloc = KycBloc(
          initialState: const KycState(
            vehicleDetails: VehicleDetailsModel(
              vehicleRcNumber: '22 BH 1234 AA',
            ),
            aadhaarDetails: AadhaarDetailsModel(
              aadhaarNumber: '123456789012',
              frontImageName: 'front.jpg',
              backImageName: 'back.jpg',
            ),
            drivingLicenseDetails: DrivingLicenseModel(
              licenseNumber: 'DL1420110012345',
              licenseImageName: 'dl.jpg',
              expiryDate: '15/08/2030',
            ),
            isStageAComplete: true,
          ),
        );

        await tester.pumpWidget(
          _createRouterApp(initialLocation: '/kyc/bank', kycBloc: kycBloc),
        );
        await tester.pumpAndSettle();

        // Fill Bank Details fields
        final textFields = find.byType(TextField);
        expect(textFields, findsNWidgets(5));

        await tester.enterText(textFields.at(0), 'Rider Name');
        await tester.enterText(textFields.at(1), 'HDFC Bank');
        await tester.enterText(textFields.at(2), 'HDFC0001234');
        await tester.enterText(textFields.at(3), '1234567890');
        await tester.enterText(textFields.at(4), '1234567890');
        await tester.pump();

        // Tap Next
        final nextBtn = find.byKey(const Key('bank_next_button'));
        await tester.tap(nextBtn);
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 400));

        // Should now be on Pending Verification screen
        expect(
          find.byKey(const Key('pending_verification_title')),
          findsOneWidget,
        );

        // Completed KYC state is fully preserved in KycBloc
        expect(kycBloc.state.isVehicleStepValid, isTrue);
        expect(kycBloc.state.isAadhaarStepValid, isTrue);
        expect(kycBloc.state.isDrivingLicenseStepValid, isTrue);
        expect(kycBloc.state.isBankDetailsStepValid, isTrue);
        expect(kycBloc.state.isKycComplete, isTrue);

        await tester.pumpWidget(const SizedBox.shrink());
        await tester.runAsync(() async {
          await kycBloc.close();
        });
      },
    );
  });
}
