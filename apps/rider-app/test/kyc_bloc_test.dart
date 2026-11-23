import 'package:bloc_test/bloc_test.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_bloc.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_event.dart';
import 'package:fillcart_rider/features/kyc/bloc/kyc_state.dart';
import 'package:fillcart_rider/features/kyc/models/aadhaar_details_model.dart';
import 'package:fillcart_rider/features/kyc/models/bank_details_model.dart';
import 'package:fillcart_rider/features/kyc/models/driving_license_model.dart';
import 'package:fillcart_rider/features/kyc/models/vehicle_details_model.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('KycBloc Unit Tests', () {
    late KycBloc kycBloc;

    setUp(() {
      kycBloc = KycBloc();
    });

    tearDown(() {
      kycBloc.close();
    });

    test('initial state has empty models and false completion flags', () {
      expect(kycBloc.state, equals(const KycState()));
      expect(kycBloc.state.isVehicleStepValid, isFalse);
      expect(kycBloc.state.isAadhaarStepValid, isFalse);
      expect(kycBloc.state.isDrivingLicenseStepValid, isFalse);
      expect(kycBloc.state.isBankDetailsStepValid, isFalse);
      expect(kycBloc.state.isStageAComplete, isFalse);
      expect(kycBloc.state.isStageBComplete, isFalse);
      expect(kycBloc.state.isKycComplete, isFalse);
    });

    blocTest<KycBloc, KycState>(
      'emits updated vehicleDetails on KycVehicleDetailsSubmitted',
      build: () => kycBloc,
      act: (bloc) => bloc.add(
        const KycVehicleDetailsSubmitted(
          VehicleDetailsModel(vehicleRcNumber: '22 BH 1234 AA'),
        ),
      ),
      expect: () => [
        isA<KycState>()
            .having(
              (s) => s.vehicleDetails.vehicleRcNumber,
              'vehicleRcNumber',
              '22 BH 1234 AA',
            )
            .having((s) => s.isVehicleStepValid, 'isVehicleStepValid', isTrue),
      ],
    );

    blocTest<KycBloc, KycState>(
      'handles Aadhaar front/back upload and removal events',
      build: () => kycBloc,
      act: (bloc) {
        bloc.add(
          const KycAadhaarFrontUploaded(
            imageName: 'front.jpg',
            imageSize: '1.5 MB',
          ),
        );
        bloc.add(
          const KycAadhaarBackUploaded(
            imageName: 'back.jpg',
            imageSize: '1.3 MB',
          ),
        );
        bloc.add(const KycAadhaarFrontRemoved());
      },
      expect: () => [
        isA<KycState>().having(
          (s) => s.aadhaarDetails.frontImageName,
          'frontImageName',
          'front.jpg',
        ),
        isA<KycState>().having(
          (s) => s.aadhaarDetails.backImageName,
          'backImageName',
          'back.jpg',
        ),
        isA<KycState>().having(
          (s) => s.aadhaarDetails.frontImageName,
          'frontImageName cleared',
          isNull,
        ),
      ],
    );

    blocTest<KycBloc, KycState>(
      'handles Driving License upload and removal events',
      build: () => kycBloc,
      act: (bloc) {
        bloc.add(
          const KycDrivingLicenseImageUploaded(
            imageName: 'dl_image.jpg',
            imageSize: '1.8 MB',
          ),
        );
        bloc.add(const KycDrivingLicenseImageRemoved());
      },
      expect: () => [
        isA<KycState>().having(
          (s) => s.drivingLicenseDetails.licenseImageName,
          'licenseImageName',
          'dl_image.jpg',
        ),
        isA<KycState>().having(
          (s) => s.drivingLicenseDetails.licenseImageName,
          'licenseImageName cleared',
          isNull,
        ),
      ],
    );

    blocTest<KycBloc, KycState>(
      'sets isStageAComplete true when both Vehicle and Aadhaar are valid',
      build: () => kycBloc,
      seed: () => const KycState(
        vehicleDetails: VehicleDetailsModel(vehicleRcNumber: 'MH02CD5678'),
      ),
      act: (bloc) => bloc.add(
        const KycAadhaarDetailsSubmitted(
          AadhaarDetailsModel(
            aadhaarNumber: '123456789012',
            frontImageName: 'front.jpg',
            frontImageSize: '1.4 MB',
            backImageName: 'back.jpg',
            backImageSize: '1.2 MB',
          ),
        ),
      ),
      expect: () => [
        isA<KycState>()
            .having((s) => s.isAadhaarStepValid, 'isAadhaarStepValid', isTrue)
            .having((s) => s.isStageAComplete, 'isStageAComplete', isTrue),
      ],
    );

    blocTest<KycBloc, KycState>(
      'sets isStageBComplete and isKycComplete true when Bank details are submitted with valid DL',
      build: () => kycBloc,
      seed: () => const KycState(
        vehicleDetails: VehicleDetailsModel(vehicleRcNumber: 'MH02CD5678'),
        aadhaarDetails: AadhaarDetailsModel(
          aadhaarNumber: '123456789012',
          frontImageName: 'front.jpg',
          backImageName: 'back.jpg',
        ),
        isStageAComplete: true,
        drivingLicenseDetails: DrivingLicenseModel(
          licenseNumber: 'DL1420110012345',
          licenseImageName: 'dl.jpg',
          expiryDate: '15/08/2030',
        ),
      ),
      act: (bloc) => bloc.add(
        const KycBankDetailsSubmitted(
          BankDetailsModel(
            accountHolderName: 'Rahul Sharma',
            bankName: 'HDFC Bank',
            ifscCode: 'HDFC0001234',
            accountNumber: '50100234567890',
            confirmAccountNumber: '50100234567890',
          ),
        ),
      ),
      expect: () => [
        isA<KycState>()
            .having(
              (s) => s.isBankDetailsStepValid,
              'isBankDetailsStepValid',
              isTrue,
            )
            .having((s) => s.isStageBComplete, 'isStageBComplete', isTrue)
            .having((s) => s.isKycComplete, 'isKycComplete', isTrue),
      ],
    );
  });
}
