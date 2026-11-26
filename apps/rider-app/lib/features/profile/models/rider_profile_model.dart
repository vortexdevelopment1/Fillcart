import 'package:equatable/equatable.dart';

/// Photo selection status for the rider avatar.
enum ProfilePhotoSource { defaultAvatar, gallery, camera, removed }

/// Verification state for rider profile documents.
enum ProfileDocumentStatus { verified, pendingVerification, rejected }

/// Immutable model representing the rider's personal profile & emergency contact.
class RiderProfileModel extends Equatable {
  final String fullName;
  final String address;
  final String mobileNumber;
  final String editMobileNumber;
  final String email;
  final String dateOfBirth;
  final double rating;
  final String riderId;
  final String emergencyContactName;
  final String emergencyContactPhone;
  final ProfilePhotoSource photoSource;

  const RiderProfileModel({
    this.fullName = 'Virat kohli (khachedu)',
    this.address = 'London',
    this.mobileNumber = '+91 9350254862',
    this.editMobileNumber = '9350264022',
    this.email = 'viratkholi@gmail.com',
    this.dateOfBirth = '01/04/2003',
    this.rating = 4.7,
    this.riderId = 'AYM451202',
    this.emergencyContactName = 'Virat Kohli',
    this.emergencyContactPhone = '+91 6598132940',
    this.photoSource = ProfilePhotoSource.defaultAvatar,
  });

  bool get hasPhoto => photoSource != ProfilePhotoSource.removed;

  String get initials {
    final words = RegExp(r'[A-Za-z]+')
        .allMatches(fullName)
        .map((m) => m.group(0)!)
        .toList();
    if (words.isEmpty) return 'R';
    if (words.length == 1) return words.first[0].toUpperCase();
    return '${words[0][0]}${words[1][0]}'.toUpperCase();
  }

  RiderProfileModel copyWith({
    String? fullName,
    String? address,
    String? mobileNumber,
    String? editMobileNumber,
    String? email,
    String? dateOfBirth,
    double? rating,
    String? riderId,
    String? emergencyContactName,
    String? emergencyContactPhone,
    ProfilePhotoSource? photoSource,
  }) {
    return RiderProfileModel(
      fullName: fullName ?? this.fullName,
      address: address ?? this.address,
      mobileNumber: mobileNumber ?? this.mobileNumber,
      editMobileNumber: editMobileNumber ?? this.editMobileNumber,
      email: email ?? this.email,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      rating: rating ?? this.rating,
      riderId: riderId ?? this.riderId,
      emergencyContactName: emergencyContactName ?? this.emergencyContactName,
      emergencyContactPhone:
          emergencyContactPhone ?? this.emergencyContactPhone,
      photoSource: photoSource ?? this.photoSource,
    );
  }

  @override
  List<Object?> get props => [
    fullName,
    address,
    mobileNumber,
    editMobileNumber,
    email,
    dateOfBirth,
    rating,
    riderId,
    emergencyContactName,
    emergencyContactPhone,
    photoSource,
  ];
}

/// Immutable model representing verified/pending KYC documents on the Profile flow.
class ProfileDocumentsModel extends Equatable {
  final String drivingLicenseNumber;
  final ProfileDocumentStatus drivingLicenseStatus;
  final String aadhaarNumber;
  final ProfileDocumentStatus aadhaarStatus;
  final String vehicleRcNumber;
  final ProfileDocumentStatus vehicleRcStatus;

  const ProfileDocumentsModel({
    this.drivingLicenseNumber = 'MDMJCML',
    this.drivingLicenseStatus = ProfileDocumentStatus.verified,
    this.aadhaarNumber = '4512 1254 9823',
    this.aadhaarStatus = ProfileDocumentStatus.verified,
    this.vehicleRcNumber = 'MP10BC1012',
    this.vehicleRcStatus = ProfileDocumentStatus.verified,
  });

  /// Formats RC number nicely with spaces if entered compactly, or returns trimmed value.
  String get formattedVehicleRc {
    final compact = vehicleRcNumber.replaceAll(RegExp(r'\s+'), '').toUpperCase();
    final match = RegExp(r'^([A-Z]{2})(\d{2})([A-Z]{1,2})(\d{4})$').firstMatch(compact);
    if (match != null) {
      return '${match.group(1)} ${match.group(2)} ${match.group(3)} ${match.group(4)}';
    }
    return vehicleRcNumber.trim();
  }

  ProfileDocumentsModel copyWith({
    String? drivingLicenseNumber,
    ProfileDocumentStatus? drivingLicenseStatus,
    String? aadhaarNumber,
    ProfileDocumentStatus? aadhaarStatus,
    String? vehicleRcNumber,
    ProfileDocumentStatus? vehicleRcStatus,
  }) {
    return ProfileDocumentsModel(
      drivingLicenseNumber: drivingLicenseNumber ?? this.drivingLicenseNumber,
      drivingLicenseStatus: drivingLicenseStatus ?? this.drivingLicenseStatus,
      aadhaarNumber: aadhaarNumber ?? this.aadhaarNumber,
      aadhaarStatus: aadhaarStatus ?? this.aadhaarStatus,
      vehicleRcNumber: vehicleRcNumber ?? this.vehicleRcNumber,
      vehicleRcStatus: vehicleRcStatus ?? this.vehicleRcStatus,
    );
  }

  @override
  List<Object?> get props => [
    drivingLicenseNumber,
    drivingLicenseStatus,
    aadhaarNumber,
    aadhaarStatus,
    vehicleRcNumber,
    vehicleRcStatus,
  ];
}

/// Immutable model representing the rider's linked bank account.
class ProfileBankModel extends Equatable {
  final String accountHolderName;
  final String bankName;
  final String ifscCode;
  final String accountNumber;
  final bool hasLinkedAccount;

  const ProfileBankModel({
    this.accountHolderName = 'Virat kohli (khachedu)',
    this.bankName = 'State Bank Of India',
    this.ifscCode = 'SBIN0001234',
    this.accountNumber = '123456781224',
    this.hasLinkedAccount = true,
  });

  String get maskedAccountNumber {
    final digits = accountNumber.replaceAll(RegExp(r'\s+'), '');
    if (digits.isEmpty) return '**** **** ----';
    final last4 = digits.length >= 4 ? digits.substring(digits.length - 4) : digits;
    return '**** **** $last4';
  }

  ProfileBankModel copyWith({
    String? accountHolderName,
    String? bankName,
    String? ifscCode,
    String? accountNumber,
    bool? hasLinkedAccount,
  }) {
    return ProfileBankModel(
      accountHolderName: accountHolderName ?? this.accountHolderName,
      bankName: bankName ?? this.bankName,
      ifscCode: ifscCode ?? this.ifscCode,
      accountNumber: accountNumber ?? this.accountNumber,
      hasLinkedAccount: hasLinkedAccount ?? this.hasLinkedAccount,
    );
  }

  @override
  List<Object?> get props => [
    accountHolderName,
    bankName,
    ifscCode,
    accountNumber,
    hasLinkedAccount,
  ];
}
