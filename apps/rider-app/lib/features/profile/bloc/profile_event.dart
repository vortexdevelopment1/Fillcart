import 'package:equatable/equatable.dart';
import '../models/rider_profile_model.dart';

/// Base class for all Profile feature BLoC events.
sealed class ProfileEvent extends Equatable {
  const ProfileEvent();

  @override
  List<Object?> get props => [];
}

/// Updates editable personal and emergency contact fields.
class ProfileDetailsUpdated extends ProfileEvent {
  final String fullName;
  final String mobileNumber;
  final String email;
  final String dateOfBirth;
  final String emergencyContactName;
  final String emergencyContactPhone;

  const ProfileDetailsUpdated({
    required this.fullName,
    required this.mobileNumber,
    required this.email,
    required this.dateOfBirth,
    required this.emergencyContactName,
    required this.emergencyContactPhone,
  });

  @override
  List<Object?> get props => [
    fullName,
    mobileNumber,
    email,
    dateOfBirth,
    emergencyContactName,
    emergencyContactPhone,
  ];
}

/// Updates the rider's profile photo source (gallery, camera, or removed).
class ProfilePhotoUpdated extends ProfileEvent {
  final ProfilePhotoSource photoSource;

  const ProfilePhotoUpdated(this.photoSource);

  @override
  List<Object?> get props => [photoSource];
}

/// Submits a new Vehicle RC number and marks it as pending verification.
class ProfileVehicleRcUpdated extends ProfileEvent {
  final String vehicleRcNumber;

  const ProfileVehicleRcUpdated(this.vehicleRcNumber);

  @override
  List<Object?> get props => [vehicleRcNumber];
}

/// Saves or updates the linked bank account details.
class ProfileBankAccountSaved extends ProfileEvent {
  final String accountHolderName;
  final String bankName;
  final String ifscCode;
  final String accountNumber;

  const ProfileBankAccountSaved({
    required this.accountHolderName,
    required this.bankName,
    required this.ifscCode,
    required this.accountNumber,
  });

  @override
  List<Object?> get props => [
    accountHolderName,
    bankName,
    ifscCode,
    accountNumber,
  ];
}

/// Deletes the currently linked bank account.
class ProfileBankAccountDeleted extends ProfileEvent {
  const ProfileBankAccountDeleted();
}

/// Resets profile state back to defaults (e.g. on logout).
class ProfileResetRequested extends ProfileEvent {
  const ProfileResetRequested();
}
