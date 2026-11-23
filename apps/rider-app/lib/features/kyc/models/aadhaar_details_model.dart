import 'package:equatable/equatable.dart';

/// Immutable model representing Aadhaar details entered in KYC Step 2/4 (Figma 1848:51834).
class AadhaarDetailsModel extends Equatable {
  final String aadhaarNumber;
  final String? frontImageName;
  final String? frontImageSize;
  final String? backImageName;
  final String? backImageSize;

  const AadhaarDetailsModel({
    this.aadhaarNumber = '',
    this.frontImageName,
    this.frontImageSize,
    this.backImageName,
    this.backImageSize,
  });

  bool get hasFrontImage =>
      frontImageName != null && frontImageName!.isNotEmpty;
  bool get hasBackImage => backImageName != null && backImageName!.isNotEmpty;

  static bool isValidAadhaarNumber(String number) {
    final digits = number.trim().replaceAll(RegExp(r'\D'), '');
    return digits.length == 12;
  }

  bool get isComplete =>
      isValidAadhaarNumber(aadhaarNumber) && hasFrontImage && hasBackImage;

  AadhaarDetailsModel copyWith({
    String? aadhaarNumber,
    String? frontImageName,
    String? frontImageSize,
    String? backImageName,
    String? backImageSize,
    bool clearFrontImage = false,
    bool clearBackImage = false,
  }) {
    return AadhaarDetailsModel(
      aadhaarNumber: aadhaarNumber ?? this.aadhaarNumber,
      frontImageName: clearFrontImage
          ? null
          : (frontImageName ?? this.frontImageName),
      frontImageSize: clearFrontImage
          ? null
          : (frontImageSize ?? this.frontImageSize),
      backImageName: clearBackImage
          ? null
          : (backImageName ?? this.backImageName),
      backImageSize: clearBackImage
          ? null
          : (backImageSize ?? this.backImageSize),
    );
  }

  @override
  List<Object?> get props => [
    aadhaarNumber,
    frontImageName,
    frontImageSize,
    backImageName,
    backImageSize,
  ];
}
