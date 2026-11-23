import 'package:equatable/equatable.dart';
import '../models/aadhaar_details_model.dart';
import '../models/bank_details_model.dart';
import '../models/driving_license_model.dart';
import '../models/vehicle_details_model.dart';

/// Verification status for the rider KYC workflow.
enum KycVerificationStatus { initial, inProgress, successful, rejected }

/// Central state representation for the entire KYC registration wizard.
class KycState extends Equatable {
  final VehicleDetailsModel vehicleDetails;
  final AadhaarDetailsModel aadhaarDetails;
  final DrivingLicenseModel drivingLicenseDetails;
  final BankDetailsModel bankDetails;
  final bool isStageAComplete;
  final bool isStageBComplete;
  final KycVerificationStatus verificationStatus;
  final String? resubmittedDocumentName;
  final String? resubmittedDocumentSize;
  final bool isDisplayOverAppsGranted;
  final bool isBackgroundLocationGranted;
  final bool isBatteryUsageGranted;
  final bool isAadhaarOtpVerified;

  const KycState({
    this.vehicleDetails = const VehicleDetailsModel(),
    this.aadhaarDetails = const AadhaarDetailsModel(),
    this.drivingLicenseDetails = const DrivingLicenseModel(),
    this.bankDetails = const BankDetailsModel(),
    this.isStageAComplete = false,
    this.isStageBComplete = false,
    this.verificationStatus = KycVerificationStatus.initial,
    this.resubmittedDocumentName,
    this.resubmittedDocumentSize,
    this.isDisplayOverAppsGranted = false,
    this.isBackgroundLocationGranted = false,
    this.isBatteryUsageGranted = false,
    this.isAadhaarOtpVerified = false,
  });

  bool get isVehicleStepValid => vehicleDetails.isComplete;
  bool get isAadhaarStepValid => aadhaarDetails.isComplete;
  bool get isDrivingLicenseStepValid => drivingLicenseDetails.isComplete;
  bool get isBankDetailsStepValid => bankDetails.isComplete;
  bool get isKycComplete => isStageAComplete && isStageBComplete;

  bool get areAllPermissionsGranted =>
      isDisplayOverAppsGranted &&
      isBackgroundLocationGranted &&
      isBatteryUsageGranted;

  KycState copyWith({
    VehicleDetailsModel? vehicleDetails,
    AadhaarDetailsModel? aadhaarDetails,
    DrivingLicenseModel? drivingLicenseDetails,
    BankDetailsModel? bankDetails,
    bool? isStageAComplete,
    bool? isStageBComplete,
    KycVerificationStatus? verificationStatus,
    String? resubmittedDocumentName,
    String? resubmittedDocumentSize,
    bool clearResubmittedDocument = false,
    bool? isDisplayOverAppsGranted,
    bool? isBackgroundLocationGranted,
    bool? isBatteryUsageGranted,
    bool? isAadhaarOtpVerified,
  }) {
    return KycState(
      vehicleDetails: vehicleDetails ?? this.vehicleDetails,
      aadhaarDetails: aadhaarDetails ?? this.aadhaarDetails,
      drivingLicenseDetails:
          drivingLicenseDetails ?? this.drivingLicenseDetails,
      bankDetails: bankDetails ?? this.bankDetails,
      isStageAComplete: isStageAComplete ?? this.isStageAComplete,
      isStageBComplete: isStageBComplete ?? this.isStageBComplete,
      verificationStatus: verificationStatus ?? this.verificationStatus,
      resubmittedDocumentName: clearResubmittedDocument
          ? null
          : (resubmittedDocumentName ?? this.resubmittedDocumentName),
      resubmittedDocumentSize: clearResubmittedDocument
          ? null
          : (resubmittedDocumentSize ?? this.resubmittedDocumentSize),
      isDisplayOverAppsGranted:
          isDisplayOverAppsGranted ?? this.isDisplayOverAppsGranted,
      isBackgroundLocationGranted:
          isBackgroundLocationGranted ?? this.isBackgroundLocationGranted,
      isBatteryUsageGranted:
          isBatteryUsageGranted ?? this.isBatteryUsageGranted,
      isAadhaarOtpVerified:
          isAadhaarOtpVerified ?? this.isAadhaarOtpVerified,
    );
  }

  @override
  List<Object?> get props => [
    vehicleDetails,
    aadhaarDetails,
    drivingLicenseDetails,
    bankDetails,
    isStageAComplete,
    isStageBComplete,
    verificationStatus,
    resubmittedDocumentName,
    resubmittedDocumentSize,
    isDisplayOverAppsGranted,
    isBackgroundLocationGranted,
    isBatteryUsageGranted,
    isAadhaarOtpVerified,
  ];
}
