import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/authentication/data/mock_auth_repository.dart';
import 'package:fillcart_rider/features/authentication/presentation/phone_number_input_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('PhoneNumberInputScreen Widget Tests', () {
    testWidgets('renders phone input UI elements properly', (tester) async {
      await tester.pumpWidget(
        const RiderApp(
          initialLocation: '/phone',
          authRepository: MockAuthRepository(delay: Duration.zero),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(PhoneNumberInputScreen), findsOneWidget);
      expect(find.text('Add Phone Number'), findsOneWidget);
      expect(find.text('+91'), findsOneWidget);
      expect(find.byKey(const Key('phone_number_input_field')), findsOneWidget);
      expect(find.byKey(const Key('phone_continue_button')), findsOneWidget);
      expect(find.text('Continue'), findsOneWidget);
    });

    testWidgets(
      'displays validation error when entering fewer than 10 digits',
      (tester) async {
        await tester.pumpWidget(
          const RiderApp(
            initialLocation: '/phone',
            authRepository: MockAuthRepository(delay: Duration.zero),
          ),
        );
        await tester.pumpAndSettle();

        final phoneInput = find.byKey(const Key('phone_number_input_field'));
        final continueButton = find.byKey(const Key('phone_continue_button'));

        await tester.enterText(phoneInput, '98765');
        await tester.pump();

        await tester.tap(continueButton);
        await tester.pump();

        expect(find.byKey(const Key('phone_error_text')), findsOneWidget);
        expect(
          find.text('Please enter a valid 10-digit mobile number'),
          findsOneWidget,
        );
      },
    );

    testWidgets('submits valid 10-digit number and navigates to OTP screen', (
      tester,
    ) async {
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

      // Should now be on OTP screen
      expect(find.text('Enter OTP'), findsOneWidget);
      expect(find.text('OTP'), findsOneWidget);
    });
  });
}
