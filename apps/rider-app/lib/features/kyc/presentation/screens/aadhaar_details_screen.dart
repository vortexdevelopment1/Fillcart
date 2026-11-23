import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';
import '../../bloc/kyc_state.dart';
import '../../models/aadhaar_details_model.dart';
import '../widgets/kyc_next_button.dart';
import '../widgets/kyc_step_header.dart';
import '../widgets/kyc_step_progress_bar.dart';
import '../widgets/kyc_text_field.dart';
import '../widgets/kyc_upload_card.dart';

/// Screen 2/4 of KYC Wizard: Aadhaar Details (Figma Frame 1848:51834).
///
/// Exact Figma specifications applied:
/// - Header: Height 56 px, padding 6/16/6/16 px, bottom border 1 px #CACACA
/// - Main Content Frame: Width 328 px (16 px horizontal padding), 24 px child gaps
/// - 4-segment progress indicator (first 2 segments active)
/// - Mandatory label: "Aadhar Number*"
/// - Two dashed upload cards: "Upload  Front Image" and "Upload Back Image"
/// - Yellow Next button
class AadhaarDetailsScreen extends StatefulWidget {
  const AadhaarDetailsScreen({super.key});

  @override
  State<AadhaarDetailsScreen> createState() => _AadhaarDetailsScreenState();
}

class _AadhaarDetailsScreenState extends State<AadhaarDetailsScreen> {
  late final TextEditingController _aadhaarController;
  String? _aadhaarError;
  String? _frontImageError;
  String? _backImageError;

  @override
  void initState() {
    super.initState();
    final currentDetails = context.read<KycBloc>().state.aadhaarDetails;
    _aadhaarController = TextEditingController(
      text: currentDetails.aadhaarNumber,
    );
  }

  @override
  void dispose() {
    _aadhaarController.dispose();
    super.dispose();
  }

  void _handleBackNavigation() {
    // Back navigation returns to Vehicle Details (Step 1/4)
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/kyc/vehicle');
    }
  }

  void _uploadFrontImage() {
    setState(() => _frontImageError = null);
    context.read<KycBloc>().add(
      const KycAadhaarFrontUploaded(
        imageName: 'aadhaar_front.jpg',
        imageSize: '1.4 MB',
      ),
    );
  }

  void _removeFrontImage() {
    context.read<KycBloc>().add(const KycAadhaarFrontRemoved());
  }

  void _uploadBackImage() {
    setState(() => _backImageError = null);
    context.read<KycBloc>().add(
      const KycAadhaarBackUploaded(
        imageName: 'aadhaar_back.jpg',
        imageSize: '1.2 MB',
      ),
    );
  }

  void _removeBackImage() {
    context.read<KycBloc>().add(const KycAadhaarBackRemoved());
  }

  bool _validateForm(AadhaarDetailsModel details) {
    bool isValid = true;
    setState(() {
      _aadhaarError = null;
      _frontImageError = null;
      _backImageError = null;

      final number = _aadhaarController.text.trim();
      if (number.isEmpty) {
        _aadhaarError = 'Please enter Aadhaar number';
        isValid = false;
      } else if (!AadhaarDetailsModel.isValidAadhaarNumber(number)) {
        _aadhaarError = 'Aadhaar number must be exactly 12 digits';
        isValid = false;
      }

      if (!details.hasFrontImage) {
        _frontImageError = 'Please attach front image of Aadhaar';
        isValid = false;
      }

      if (!details.hasBackImage) {
        _backImageError = 'Please attach back image of Aadhaar';
        isValid = false;
      }
    });

    return isValid;
  }

  void _onNextPressed(AadhaarDetailsModel currentDetails) {
    if (!_validateForm(currentDetails)) return;

    final updatedDetails = currentDetails.copyWith(
      aadhaarNumber: _aadhaarController.text.trim(),
    );

    context.read<KycBloc>().add(KycAadhaarDetailsSubmitted(updatedDetails));
    context.push('/kyc/aadhaar-otp');
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<KycBloc, KycState>(
      builder: (context, state) {
        final aadhaarDetails = state.aadhaarDetails;

        return Scaffold(
          backgroundColor: const Color(0xFFFFFFFF),
          body: SafeArea(
            child: Column(
              children: [
                // Exact 56 px Header with 1 px #CACACA bottom border
                KycStepHeader(
                  title: 'Aadhar Details',
                  stepCounter: '2/4',
                  showBackButton: true,
                  onBack: _handleBackNavigation,
                ),

                // Main Content Frame: Width 328 px (16 px horizontal padding), 24 px child gaps
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        return SingleChildScrollView(
                          child: ConstrainedBox(
                            constraints: BoxConstraints(
                              minHeight: constraints.maxHeight,
                            ),
                            child: IntrinsicHeight(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SizedBox(height: 24),

                                  // 4-segment progress indicator (first 2 segments active)
                                  const KycStepProgressBar(currentStep: 2),

                                  const SizedBox(height: 24),

                                  // Aadhaar Number Input with red asterisk
                                  KycTextField(
                                    label: 'Aadhar Number',
                                    isRequired: true,
                                    placeholder: 'Enter Aadhar Number',
                                    controller: _aadhaarController,
                                    inputKey: const Key('aadhaar_number_field'),
                                    labelColor: const Color(0xFF000000),
                                    keyboardType: TextInputType.number,
                                    inputFormatters: [
                                      FilteringTextInputFormatter.digitsOnly,
                                      LengthLimitingTextInputFormatter(12),
                                    ],
                                    errorText: _aadhaarError,
                                    onChanged: (_) {
                                      if (_aadhaarError != null) {
                                        setState(() => _aadhaarError = null);
                                      }
                                    },
                                  ),

                                  const SizedBox(height: 24),

                                  // Upload Front Image Card
                                  KycUploadCard(
                                    cardKey: const Key(
                                      'aadhaar_front_upload_card',
                                    ),
                                    helperText: 'Upload  Front Image',
                                    attachedFileName:
                                        aadhaarDetails.frontImageName,
                                    attachedFileSize:
                                        aadhaarDetails.frontImageSize,
                                    onUpload: _uploadFrontImage,
                                    onRemove: _removeFrontImage,
                                    errorText: _frontImageError,
                                  ),

                                  const SizedBox(height: 24),

                                  // Upload Back Image Card
                                  KycUploadCard(
                                    cardKey: const Key(
                                      'aadhaar_back_upload_card',
                                    ),
                                    helperText: 'Upload Back Image',
                                    attachedFileName:
                                        aadhaarDetails.backImageName,
                                    attachedFileSize:
                                        aadhaarDetails.backImageSize,
                                    onUpload: _uploadBackImage,
                                    onRemove: _removeBackImage,
                                    errorText: _backImageError,
                                  ),

                                  const Spacer(),

                                  // Bottom Pinned Next Button
                                  KycNextButton(
                                    buttonKey: const Key('aadhaar_next_button'),
                                    onPressed: () =>
                                        _onNextPressed(aadhaarDetails),
                                  ),

                                  const SizedBox(height: 16),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
