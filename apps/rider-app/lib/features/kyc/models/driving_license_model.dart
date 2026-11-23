import 'package:equatable/equatable.dart';

/// Immutable model representing Driving License details in KYC Step 3/4 (Figma 1848:51867).
class DrivingLicenseModel extends Equatable {
  final String licenseNumber;
  final String? licenseImageName;
  final String? licenseImageSize;
  final String expiryDate;

  const DrivingLicenseModel({
    this.licenseNumber = '',
    this.licenseImageName,
    this.licenseImageSize,
    this.expiryDate = '',
  });

  bool get hasLicenseImage =>
      licenseImageName != null && licenseImageName!.isNotEmpty;

  bool get isComplete => licenseNumber.trim().isNotEmpty && hasLicenseImage;

  DrivingLicenseModel copyWith({
    String? licenseNumber,
    String? licenseImageName,
    String? licenseImageSize,
    String? expiryDate,
    bool clearLicenseImage = false,
  }) {
    return DrivingLicenseModel(
      licenseNumber: licenseNumber ?? this.licenseNumber,
      licenseImageName: clearLicenseImage
          ? null
          : (licenseImageName ?? this.licenseImageName),
      licenseImageSize: clearLicenseImage
          ? null
          : (licenseImageSize ?? this.licenseImageSize),
      expiryDate: expiryDate ?? this.expiryDate,
    );
  }

  @override
  List<Object?> get props => [
    licenseNumber,
    licenseImageName,
    licenseImageSize,
    expiryDate,
  ];
}
