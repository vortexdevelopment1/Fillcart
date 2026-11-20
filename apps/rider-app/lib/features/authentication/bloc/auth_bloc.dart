import 'package:flutter_bloc/flutter_bloc.dart';
import '../data/mock_auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

/// BLoC managing the Rider authentication lifecycle.
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _repository;

  AuthBloc({AuthRepository? repository})
    : _repository = repository ?? const MockAuthRepository(),
      super(const AuthInitial()) {
    on<AuthPhoneNumberSubmitted>(_onPhoneNumberSubmitted);
    on<AuthOtpSubmitted>(_onOtpSubmitted);
    on<AuthResetRequested>(_onResetRequested);
  }

  Future<void> _onPhoneNumberSubmitted(
    AuthPhoneNumberSubmitted event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthPhoneSubmitting(event.phoneNumber));
    try {
      await _repository.sendOtp(phoneNumber: event.phoneNumber);
      emit(AuthOtpSent(event.phoneNumber));
    } on AuthException catch (e) {
      emit(AuthFailure(message: e.message, phoneNumber: event.phoneNumber));
    } catch (e) {
      emit(
        AuthFailure(
          message: 'An unexpected error occurred. Please try again.',
          phoneNumber: event.phoneNumber,
        ),
      );
    }
  }

  Future<void> _onOtpSubmitted(
    AuthOtpSubmitted event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthVerifying(phoneNumber: event.phoneNumber, otp: event.otp));
    try {
      final result = await _repository.verifyOtp(
        phoneNumber: event.phoneNumber,
        otp: event.otp,
      );
      emit(
        AuthSuccess(
          phoneNumber: event.phoneNumber,
          riderId: result['riderId'] as String? ?? 'RIDER-TEST-001',
        ),
      );
    } on AuthException catch (e) {
      emit(AuthFailure(message: e.message, phoneNumber: event.phoneNumber));
    } catch (e) {
      emit(
        AuthFailure(
          message: 'Verification failed. Please try again.',
          phoneNumber: event.phoneNumber,
        ),
      );
    }
  }

  void _onResetRequested(AuthResetRequested event, Emitter<AuthState> emit) {
    emit(const AuthInitial());
  }
}
