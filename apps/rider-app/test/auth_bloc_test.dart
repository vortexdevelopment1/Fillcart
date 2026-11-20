import 'package:bloc_test/bloc_test.dart';
import 'package:fillcart_rider/features/authentication/bloc/auth_bloc.dart';
import 'package:fillcart_rider/features/authentication/bloc/auth_event.dart';
import 'package:fillcart_rider/features/authentication/bloc/auth_state.dart';
import 'package:fillcart_rider/features/authentication/data/mock_auth_repository.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AuthBloc Unit Tests', () {
    late MockAuthRepository repository;

    setUp(() {
      repository = const MockAuthRepository(delay: Duration.zero);
    });

    test('initial state is AuthInitial', () {
      expect(AuthBloc(repository: repository).state, const AuthInitial());
    });

    blocTest<AuthBloc, AuthState>(
      'emits [AuthPhoneSubmitting, AuthOtpSent] when phone number is valid 10 digits',
      build: () => AuthBloc(repository: repository),
      act: (bloc) => bloc.add(const AuthPhoneNumberSubmitted('9876543210')),
      expect: () => [
        const AuthPhoneSubmitting('9876543210'),
        const AuthOtpSent('9876543210'),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthPhoneSubmitting, AuthFailure] when phone number is invalid length',
      build: () => AuthBloc(repository: repository),
      act: (bloc) => bloc.add(const AuthPhoneNumberSubmitted('123')),
      expect: () => [
        const AuthPhoneSubmitting('123'),
        const AuthFailure(
          message: 'Please enter a valid 10-digit mobile number.',
          phoneNumber: '123',
        ),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthVerifying, AuthSuccess] when OTP is 1234',
      build: () => AuthBloc(repository: repository),
      act: (bloc) => bloc.add(
        const AuthOtpSubmitted(phoneNumber: '9876543210', otp: '1234'),
      ),
      expect: () => [
        const AuthVerifying(phoneNumber: '9876543210', otp: '1234'),
        const AuthSuccess(phoneNumber: '9876543210', riderId: 'RIDER-TEST-001'),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthVerifying, AuthFailure] when OTP is incorrect',
      build: () => AuthBloc(repository: repository),
      act: (bloc) => bloc.add(
        const AuthOtpSubmitted(phoneNumber: '9876543210', otp: '9999'),
      ),
      expect: () => [
        const AuthVerifying(phoneNumber: '9876543210', otp: '9999'),
        const AuthFailure(
          message:
              'Invalid verification code. Enter 1234 for mock verification.',
          phoneNumber: '9876543210',
        ),
      ],
    );

    blocTest<AuthBloc, AuthState>(
      'emits [AuthInitial] when AuthResetRequested is dispatched',
      build: () => AuthBloc(repository: repository),
      act: (bloc) => bloc.add(const AuthResetRequested()),
      expect: () => [const AuthInitial()],
    );
  });
}
