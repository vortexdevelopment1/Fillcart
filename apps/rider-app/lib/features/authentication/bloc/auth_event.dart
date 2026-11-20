import 'package:equatable/equatable.dart';

/// Base class for all authentication events.
sealed class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

/// Event dispatched when a user submits their phone number.
final class AuthPhoneNumberSubmitted extends AuthEvent {
  final String phoneNumber;

  const AuthPhoneNumberSubmitted(this.phoneNumber);

  @override
  List<Object?> get props => [phoneNumber];
}

/// Event dispatched when a user submits their 4-digit OTP.
final class AuthOtpSubmitted extends AuthEvent {
  final String phoneNumber;
  final String otp;

  const AuthOtpSubmitted({required this.phoneNumber, required this.otp});

  @override
  List<Object?> get props => [phoneNumber, otp];
}

/// Event dispatched to reset authentication state (e.g. edit phone or logout).
final class AuthResetRequested extends AuthEvent {
  const AuthResetRequested();
}
