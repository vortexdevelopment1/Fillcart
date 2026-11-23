import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/app/router/app_router.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_bloc.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/aadhaar_details_screen.dart';
import 'package:fillcart_rider/features/kyc/presentation/screens/vehicle_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Vehicle Details System Back Behavior Tests', () {
    Widget createVehicleApp() {
      final kycBloc = KycBloc();
      final router = AppRouter.createRouter(initialLocation: '/kyc/vehicle');
      return RiderApp(router: router, kycBloc: kycBloc);
    }

    testWidgets(
      'first system back press does not exit and shows exit reminder SnackBar',
      (tester) async {
        await tester.pumpWidget(createVehicleApp());
        await tester.pumpAndSettle();

        expect(find.byType(VehicleDetailsScreen), findsOneWidget);
        expect(find.text('Vehicle Details'), findsOneWidget);
        // Confirms no in-app back button exists
        expect(find.byKey(const Key('kyc_header_back_button')), findsNothing);

        // Simulate 1st system pop (e.g. Android back)
        final dynamic widgetsAppState = tester.state(find.byType(WidgetsApp));
        await widgetsAppState.didPopRoute();
        await tester.pump();

        // Stays on Vehicle Details
        expect(find.byType(VehicleDetailsScreen), findsOneWidget);
        expect(find.text('Press back again to exit'), findsOneWidget);
      },
    );

    testWidgets(
      'vehicle details to aadhaar and back preserves single RC value and does not exit',
      (tester) async {
        await tester.pumpWidget(createVehicleApp());
        await tester.pumpAndSettle();

        // 1. Enter single vehicle RC data
        await tester.enterText(
          find.byKey(const Key('vehicle_rc_number_field')),
          '22 BH 1234 AA',
        );
        await tester.pump();

        // 2. Next to Aadhaar
        await tester.tap(find.byKey(const Key('vehicle_next_button')));
        await tester.pumpAndSettle();
        expect(find.byType(AadhaarDetailsScreen), findsOneWidget);

        // 3. Aadhaar back button returns to Vehicle Details
        await tester.tap(find.byKey(const Key('kyc_header_back_button')));
        await tester.pumpAndSettle();

        // 4. Vehicle Details is restored with single RC value intact
        expect(find.byType(VehicleDetailsScreen), findsOneWidget);
        expect(find.text('22 BH 1234 AA'), findsOneWidget);
      },
    );
  });
}
