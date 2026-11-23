import 'package:flutter_bloc/flutter_bloc.dart';
import 'kyc_event.dart';
import 'kyc_state.dart';

/// Manages form state, document attachment, verification status, resubmission, and permissions across all KYC Wizard steps.
class KycBloc extends Bloc<KycEvent, KycState> {
  KycBloc({KycState? initialState}) : super(initialState ?? const KycState()) {
    on<KycVehicleDetailsSubmitted>(_onVehicleDetailsSubmitted);
    on<KycAadhaarDetailsSubmitted>(_onAadhaarDetailsSubmitted);
    on<KycAadhaarFrontUploaded>(_onAadhaarFrontUploaded);
    on<KycAadhaarFrontRemoved>(_onAadhaarFrontRemoved);
    on<KycAadhaarBackUploaded>(_onAadhaarBackUploaded);
    on<KycAadhaarBackRemoved>(_onAadhaarBackRemoved);
    on<KycAadhaarOtpVerified>(_onAadhaarOtpVerified);
    on<KycDrivingLicenseSubmitted>(_onDrivingLicenseSubmitted);
    on<KycDrivingLicenseImageUploaded>(_onDrivingLicenseImageUploaded);
    on<KycDrivingLicenseImageRemoved>(_onDrivingLicenseImageRemoved);
    on<KycBankDetailsSubmitted>(_onBankDetailsSubmitted);
    on<KycVerificationStatusChanged>(_onVerificationStatusChanged);
    on<KycDocumentResubmitted>(_onDocumentResubmitted);
    on<KycPermissionsChanged>(_onPermissionsChanged);
    on<KycResetRequested>(_onResetRequested);
  }

  void _onVehicleDetailsSubmitted(
    KycVehicleDetailsSubmitted event,
    Emitter<KycState> emit,
  ) {
    emit(state.copyWith(vehicleDetails: event.vehicleDetails));
  }

  void _onAadhaarDetailsSubmitted(
    KycAadhaarDetailsSubmitted event,
    Emitter<KycState> emit,
  ) {
    final updatedAadhaar = event.aadhaarDetails;
    final isStageAComplete =
        state.vehicleDetails.isComplete && updatedAadhaar.isComplete;
    emit(
      state.copyWith(
        aadhaarDetails: updatedAadhaar,
        isStageAComplete: isStageAComplete,
      ),
    );
  }

  void _onAadhaarFrontUploaded(
    KycAadhaarFrontUploaded event,
    Emitter<KycState> emit,
  ) {
    final updatedAadhaar = state.aadhaarDetails.copyWith(
      frontImageName: event.imageName,
      frontImageSize: event.imageSize,
    );
    emit(state.copyWith(aadhaarDetails: updatedAadhaar));
  }

  void _onAadhaarFrontRemoved(
    KycAadhaarFrontRemoved event,
    Emitter<KycState> emit,
  ) {
    final updatedAadhaar = state.aadhaarDetails.copyWith(clearFrontImage: true);
    emit(state.copyWith(aadhaarDetails: updatedAadhaar));
  }

  void _onAadhaarBackUploaded(
    KycAadhaarBackUploaded event,
    Emitter<KycState> emit,
  ) {
    final updatedAadhaar = state.aadhaarDetails.copyWith(
      backImageName: event.imageName,
      backImageSize: event.imageSize,
    );
    emit(state.copyWith(aadhaarDetails: updatedAadhaar));
  }

  void _onAadhaarBackRemoved(
    KycAadhaarBackRemoved event,
    Emitter<KycState> emit,
  ) {
    final updatedAadhaar = state.aadhaarDetails.copyWith(clearBackImage: true);
    emit(state.copyWith(aadhaarDetails: updatedAadhaar));
  }

  void _onAadhaarOtpVerified(
    KycAadhaarOtpVerified event,
    Emitter<KycState> emit,
  ) {
    emit(state.copyWith(isAadhaarOtpVerified: true));
  }

  void _onDrivingLicenseSubmitted(
    KycDrivingLicenseSubmitted event,
    Emitter<KycState> emit,
  ) {
    emit(state.copyWith(drivingLicenseDetails: event.drivingLicenseDetails));
  }

  void _onDrivingLicenseImageUploaded(
    KycDrivingLicenseImageUploaded event,
    Emitter<KycState> emit,
  ) {
    final updatedLicense = state.drivingLicenseDetails.copyWith(
      licenseImageName: event.imageName,
      licenseImageSize: event.imageSize,
    );
    emit(state.copyWith(drivingLicenseDetails: updatedLicense));
  }

  void _onDrivingLicenseImageRemoved(
    KycDrivingLicenseImageRemoved event,
    Emitter<KycState> emit,
  ) {
    final updatedLicense = state.drivingLicenseDetails.copyWith(
      clearLicenseImage: true,
    );
    emit(state.copyWith(drivingLicenseDetails: updatedLicense));
  }

  void _onBankDetailsSubmitted(
    KycBankDetailsSubmitted event,
    Emitter<KycState> emit,
  ) {
    final updatedBank = event.bankDetails;
    final isStageBComplete =
        state.drivingLicenseDetails.isComplete && updatedBank.isComplete;
    emit(
      state.copyWith(
        bankDetails: updatedBank,
        isStageBComplete: isStageBComplete,
      ),
    );
  }

  void _onVerificationStatusChanged(
    KycVerificationStatusChanged event,
    Emitter<KycState> emit,
  ) {
    emit(state.copyWith(verificationStatus: event.status));
  }

  void _onDocumentResubmitted(
    KycDocumentResubmitted event,
    Emitter<KycState> emit,
  ) {
    emit(
      state.copyWith(
        verificationStatus: KycVerificationStatus.inProgress,
        resubmittedDocumentName: event.documentName,
        resubmittedDocumentSize: event.documentSize,
      ),
    );
  }

  void _onPermissionsChanged(
    KycPermissionsChanged event,
    Emitter<KycState> emit,
  ) {
    emit(
      state.copyWith(
        isDisplayOverAppsGranted:
            event.isDisplayOverAppsGranted ?? state.isDisplayOverAppsGranted,
        isBackgroundLocationGranted:
            event.isBackgroundLocationGranted ??
            state.isBackgroundLocationGranted,
        isBatteryUsageGranted:
            event.isBatteryUsageGranted ?? state.isBatteryUsageGranted,
      ),
    );
  }

  void _onResetRequested(KycResetRequested event, Emitter<KycState> emit) {
    emit(const KycState());
  }
}
