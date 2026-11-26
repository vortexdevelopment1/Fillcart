import 'package:equatable/equatable.dart';
import '../models/rider_profile_model.dart';

/// Central immutable state for the Rider Profile feature.
class ProfileState extends Equatable {
  final RiderProfileModel profile;
  final ProfileDocumentsModel documents;
  final ProfileBankModel bankAccount;

  const ProfileState({
    this.profile = const RiderProfileModel(),
    this.documents = const ProfileDocumentsModel(),
    this.bankAccount = const ProfileBankModel(),
  });

  ProfileState copyWith({
    RiderProfileModel? profile,
    ProfileDocumentsModel? documents,
    ProfileBankModel? bankAccount,
  }) {
    return ProfileState(
      profile: profile ?? this.profile,
      documents: documents ?? this.documents,
      bankAccount: bankAccount ?? this.bankAccount,
    );
  }

  @override
  List<Object?> get props => [profile, documents, bankAccount];
}
