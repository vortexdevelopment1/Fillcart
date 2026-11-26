import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/rider_profile_model.dart';
import 'profile_event.dart';
import 'profile_state.dart';

/// BLoC managing Rider Profile, Documents, Vehicle RC updates, and Bank details.
class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  ProfileBloc({ProfileState? initialState})
    : super(initialState ?? const ProfileState()) {
    on<ProfileDetailsUpdated>(_onProfileDetailsUpdated);
    on<ProfilePhotoUpdated>(_onProfilePhotoUpdated);
    on<ProfileVehicleRcUpdated>(_onVehicleRcUpdated);
    on<ProfileBankAccountSaved>(_onBankAccountSaved);
    on<ProfileBankAccountDeleted>(_onBankAccountDeleted);
    on<ProfileResetRequested>(_onResetRequested);
  }

  void _onProfileDetailsUpdated(
    ProfileDetailsUpdated event,
    Emitter<ProfileState> emit,
  ) {
    final trimmedMobile = event.mobileNumber.trim();
    final displayMobile = trimmedMobile.startsWith('+')
        ? trimmedMobile
        : '+91 $trimmedMobile';

    emit(
      state.copyWith(
        profile: state.profile.copyWith(
          fullName: event.fullName.trim(),
          editMobileNumber: trimmedMobile,
          mobileNumber: displayMobile,
          email: event.email.trim(),
          dateOfBirth: event.dateOfBirth.trim(),
          emergencyContactName: event.emergencyContactName.trim(),
          emergencyContactPhone: event.emergencyContactPhone.trim(),
        ),
      ),
    );
  }

  void _onProfilePhotoUpdated(
    ProfilePhotoUpdated event,
    Emitter<ProfileState> emit,
  ) {
    emit(
      state.copyWith(
        profile: state.profile.copyWith(photoSource: event.photoSource),
      ),
    );
  }

  void _onVehicleRcUpdated(
    ProfileVehicleRcUpdated event,
    Emitter<ProfileState> emit,
  ) {
    emit(
      state.copyWith(
        documents: state.documents.copyWith(
          vehicleRcNumber: event.vehicleRcNumber.trim().toUpperCase(),
          vehicleRcStatus: ProfileDocumentStatus.pendingVerification,
        ),
      ),
    );
  }

  void _onBankAccountSaved(
    ProfileBankAccountSaved event,
    Emitter<ProfileState> emit,
  ) {
    emit(
      state.copyWith(
        bankAccount: ProfileBankModel(
          accountHolderName: event.accountHolderName.trim(),
          bankName: event.bankName.trim(),
          ifscCode: event.ifscCode.trim().toUpperCase(),
          accountNumber: event.accountNumber.trim(),
          hasLinkedAccount: true,
        ),
      ),
    );
  }

  void _onBankAccountDeleted(
    ProfileBankAccountDeleted event,
    Emitter<ProfileState> emit,
  ) {
    emit(
      state.copyWith(
        bankAccount: const ProfileBankModel(
          accountHolderName: '',
          bankName: '',
          ifscCode: '',
          accountNumber: '',
          hasLinkedAccount: false,
        ),
      ),
    );
  }

  void _onResetRequested(
    ProfileResetRequested event,
    Emitter<ProfileState> emit,
  ) {
    emit(const ProfileState());
  }
}
