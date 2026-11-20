import 'package:equatable/equatable.dart';

/// Base class for all authentication states.
sealed class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

/// Initial unauthenticated state.
final class AuthInitial extends AuthState {
  const AuthInitial();
}

/// State while phone number submission / OTP generation is in progress.
final class AuthPhoneSubmitting extends AuthState {
  final String phoneNumber;

  const AuthPhoneSubmitting(this.phoneNumber);

  @override
  List<Object?> get props => [phoneNumber];
}

/// State when OTP has been sent successfully to the user's phone.
final class AuthOtpSent extends AuthState {
  final String phoneNumber;

  const AuthOtpSent(this.phoneNumber);

  @override
  List<Object?> get props => [phoneNumber];
}

/// State while OTP verification is in progress.
final class AuthVerifying extends AuthState {
  final String phoneNumber;
  final String otp;

  const AuthVerifying({required this.phoneNumber, required this.otp});

  @override
  List<Object?> get props => [phoneNumber, otp];
}

/// State when authentication is successfully verified.
final class AuthSuccess extends AuthState {
  final String phoneNumber;
  final String riderId;

  const AuthSuccess({required this.phoneNumber, required this.riderId});

  @override
  List<Object?> get props => [phoneNumber, riderId];
}

/// State when an error occurs during phone submission or OTP verification.
final class AuthFailure extends AuthState {
  final String message;
  final String? phoneNumber;

  const AuthFailure({required this.message, this.phoneNumber});

  @override
  List<Object?> get props => [message, phoneNumber];
}
