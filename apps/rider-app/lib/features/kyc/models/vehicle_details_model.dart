import 'package:equatable/equatable.dart';

/// Immutable model representing vehicle details entered in KYC Step 1/4.
///
/// Updated per Figma frame 1848:51738 to contain exactly ONE field:
/// `Enter Vehicle RC No` (e.g. "22 BH 1234 AA").
class VehicleDetailsModel extends Equatable {
  final String vehicleRcNumber;

  const VehicleDetailsModel({this.vehicleRcNumber = ''});

  bool get isComplete => vehicleRcNumber.trim().isNotEmpty;

  VehicleDetailsModel copyWith({String? vehicleRcNumber}) {
    return VehicleDetailsModel(
      vehicleRcNumber: vehicleRcNumber ?? this.vehicleRcNumber,
    );
  }

  @override
  List<Object?> get props => [vehicleRcNumber];
}
