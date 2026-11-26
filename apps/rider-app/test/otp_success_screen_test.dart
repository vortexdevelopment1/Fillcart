import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/app/router/app_router.dart';
import 'package:fillcart_rider/features/authentication/presentation/otp_success_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/vehicle_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('OTP Success Screen Tests', () {
    testWidgets(
      'renders all visual elements correctly according to Figma update',
      (tester) async {
        final router = AppRouter.createRouter(initialLocation: '/otp-success');
        await tester.pumpWidget(RiderApp(router: router));
        await tester.pump();

        // Verify screen elements
        expect(find.byType(OtpSuccessScreen), findsOneWidget);
        expect(
          find.byKey(const Key('otp_success_icon_container')),
          findsOneWidget,
        );
        expect(find.text('OTP Verified Successfully!'), findsOneWidget);
        expect(
          find.text('Your mobile number has been verified successfully.'),
          findsOneWidget,
        );

        // Verify no back button, skip button, or action buttons exist
        expect(find.byType(ElevatedButton), findsNothing);
        expect(find.byType(IconButton), findsNothing);
        expect(find.byKey(const Key('kyc_header_back_button')), findsNothing);

        // Clean up timer by advancing
        await tester.pump(const Duration(seconds: 5));
        await tester.pumpAndSettle();
      },
    );

    testWidgets('automatically navigates to Vehicle Details after 5 seconds', (
      tester,
    ) async {
      final router = AppRouter.createRouter(initialLocation: '/otp-success');
      await tester.pumpWidget(RiderApp(router: router));
      await tester.pump();

      expect(find.byType(OtpSuccessScreen), findsOneWidget);
      expect(find.byType(VehicleDetailsScreen), findsNothing);

      // Advance by 3 seconds - still on success screen
      await tester.pump(const Duration(seconds: 3));
      expect(find.byType(OtpSuccessScreen), findsOneWidget);
      expect(find.byType(VehicleDetailsScreen), findsNothing);

      // Advance remaining 2 seconds (total 5 seconds)
      await tester.pump(const Duration(seconds: 2));
      await tester.pumpAndSettle();

      // Confirms navigation to Vehicle Details
      expect(find.byType(VehicleDetailsScreen), findsOneWidget);
      expect(find.text('Vehicle Details'), findsOneWidget);
      expect(find.text('1/4'), findsOneWidget);
    });

    testWidgets('cancels timer gracefully when disposed before 5 seconds', (
      tester,
    ) async {
      final router = AppRouter.createRouter(initialLocation: '/otp-success');
      await tester.pumpWidget(RiderApp(router: router));
      await tester.pump();

      expect(find.byType(OtpSuccessScreen), findsOneWidget);

      // Displace widget by pumping a completely different widget tree
      await tester.pumpWidget(
        const MaterialApp(home: Scaffold(body: Text('Replaced'))),
      );
      await tester.pump();

      // Advance beyond 5 seconds to ensure no late-timer exceptions are thrown
      await tester.pump(const Duration(seconds: 6));
      await tester.pumpAndSettle();

      expect(find.text('Replaced'), findsOneWidget);
    });

    testWidgets('prevents back navigation (PopScope canPop is false)', (
      tester,
    ) async {
      final router = AppRouter.createRouter(initialLocation: '/otp-success');
      await tester.pumpWidget(RiderApp(router: router));
      await tester.pump();

      expect(find.byType(OtpSuccessScreen), findsOneWidget);

      // Attempt system pop
      final didPop = await tester.binding.handlePopRoute();
      await tester.pump();

      // Handled and prevented
      expect(didPop, isTrue);
      expect(find.byType(OtpSuccessScreen), findsOneWidget);

      // Clean up timer
      await tester.pump(const Duration(seconds: 5));
      await tester.pumpAndSettle();
    });
  });
}
