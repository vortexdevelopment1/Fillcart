import 'package:equatable/equatable.dart';
import '../models/aadhaar_details_model.dart';
import '../models/bank_details_model.dart';
import '../models/driving_license_model.dart';
import '../models/vehicle_details_model.dart';
import 'kyc_state.dart';

abstract class KycEvent extends Equatable {
  const KycEvent();

  @override
  List<Object?> get props => [];
}

/// Dispatched when the user submits or updates vehicle details (Step 1/4).
class KycVehicleDetailsSubmitted extends KycEvent {
  final VehicleDetailsModel vehicleDetails;

  const KycVehicleDetailsSubmitted(this.vehicleDetails);

  @override
  List<Object?> get props => [vehicleDetails];
}

/// Dispatched when the user submits or updates Aadhaar details (Step 2/4).
class KycAadhaarDetailsSubmitted extends KycEvent {
  final AadhaarDetailsModel aadhaarDetails;

  const KycAadhaarDetailsSubmitted(this.aadhaarDetails);

  @override
  List<Object?> get props => [aadhaarDetails];
}

/// Dispatched to attach a mock front image of Aadhaar.
class KycAadhaarFrontUploaded extends KycEvent {
  final String imageName;
  final String imageSize;

  const KycAadhaarFrontUploaded({
    this.imageName = 'aadhaar_front.jpg',
    this.imageSize = '1.4 MB',
  });

  @override
  List<Object?> get props => [imageName, imageSize];
}

/// Dispatched to remove the attached front image of Aadhaar.
class KycAadhaarFrontRemoved extends KycEvent {
  const KycAadhaarFrontRemoved();
}

/// Dispatched to attach a mock back image of Aadhaar.
class KycAadhaarBackUploaded extends KycEvent {
  final String imageName;
  final String imageSize;

  const KycAadhaarBackUploaded({
    this.imageName = 'aadhaar_back.jpg',
    this.imageSize = '1.2 MB',
  });

  @override
  List<Object?> get props => [imageName, imageSize];
}

/// Dispatched to remove the attached back image of Aadhaar.
class KycAadhaarBackRemoved extends KycEvent {
  const KycAadhaarBackRemoved();
}

/// Dispatched when Aadhaar OTP is successfully verified.
class KycAadhaarOtpVerified extends KycEvent {
  const KycAadhaarOtpVerified();
}

/// Dispatched when the user submits or updates Driving License details (Step 3/4).
class KycDrivingLicenseSubmitted extends KycEvent {
  final DrivingLicenseModel drivingLicenseDetails;

  const KycDrivingLicenseSubmitted(this.drivingLicenseDetails);

  @override
  List<Object?> get props => [drivingLicenseDetails];
}

/// Dispatched to attach a mock Driving License image.
class KycDrivingLicenseImageUploaded extends KycEvent {
  final String imageName;
  final String imageSize;

  const KycDrivingLicenseImageUploaded({
    this.imageName = 'driving_license.jpg',
    this.imageSize = '1.8 MB',
  });

  @override
  List<Object?> get props => [imageName, imageSize];
}

/// Dispatched to remove the attached Driving License image.
class KycDrivingLicenseImageRemoved extends KycEvent {
  const KycDrivingLicenseImageRemoved();
}

/// Dispatched when the user submits or updates Bank details (Step 4/4).
class KycBankDetailsSubmitted extends KycEvent {
  final BankDetailsModel bankDetails;

  const KycBankDetailsSubmitted(this.bankDetails);

  @override
  List<Object?> get props => [bankDetails];
}

/// Dispatched when verification status changes (pending, verified, rejected).
class KycVerificationStatusChanged extends KycEvent {
  final KycVerificationStatus status;

  const KycVerificationStatusChanged(this.status);

  @override
  List<Object?> get props => [status];
}

/// Dispatched when documents are resubmitted after rejection.
class KycDocumentResubmitted extends KycEvent {
  final String documentName;
  final String documentSize;

  const KycDocumentResubmitted({
    this.documentName = 'replacement_document.jpg',
    this.documentSize = '1.5 MB',
  });

  @override
  List<Object?> get props => [documentName, documentSize];
}

/// Dispatched when mock pre-ride permissions are toggled.
class KycPermissionsChanged extends KycEvent {
  final bool? isDisplayOverAppsGranted;
  final bool? isBackgroundLocationGranted;
  final bool? isBatteryUsageGranted;

  const KycPermissionsChanged({
    this.isDisplayOverAppsGranted,
    this.isBackgroundLocationGranted,
    this.isBatteryUsageGranted,
  });

  @override
  List<Object?> get props => [
    isDisplayOverAppsGranted,
    isBackgroundLocationGranted,
    isBatteryUsageGranted,
  ];
}

/// Resets all KYC wizard state.
class KycResetRequested extends KycEvent {
  const KycResetRequested();
}
