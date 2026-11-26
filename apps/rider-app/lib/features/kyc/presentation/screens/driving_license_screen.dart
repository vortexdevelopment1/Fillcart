import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';
import '../../bloc/kyc_state.dart';
import '../../models/driving_license_model.dart';
import '../widgets/kyc_next_button.dart';
import '../widgets/kyc_step_header.dart';
import '../widgets/kyc_step_progress_bar.dart';
import '../widgets/kyc_text_field.dart';
import '../widgets/kyc_upload_card.dart';

/// Screen 3/4 of KYC Wizard: Driving License Details (Figma Frame 1848:51867).
///
/// Specifications:
/// - Screen title: "Driving License", step counter: "3/4"
/// - Left arrow back icon (Icons.arrow_back)
/// - Height 56 px header with 1 px #CACACA bottom border
/// - 4-segment progress bar (first 3 segments active)
/// - Mandatory label: "Driving License Number*"
/// - Dashed upload card: "Upload  License Image"
/// - Expiry date field: "Driving License Expire Date" (no red asterisk, with calendar icon)
/// - Date picker interaction displaying selected date formatted as DD/MM/YYYY
/// - Yellow Next button
class DrivingLicenseScreen extends StatefulWidget {
  const DrivingLicenseScreen({super.key});

  @override
  State<DrivingLicenseScreen> createState() => _DrivingLicenseScreenState();
}

class _DrivingLicenseScreenState extends State<DrivingLicenseScreen> {
  late final TextEditingController _licenseNumberController;
  late final TextEditingController _expiryDateController;

  String? _licenseNumberError;
  String? _licenseImageError;

  @override
  void initState() {
    super.initState();
    final currentDetails = context.read<KycBloc>().state.drivingLicenseDetails;
    _licenseNumberController = TextEditingController(
      text: currentDetails.licenseNumber,
    );
    _expiryDateController = TextEditingController(
      text: currentDetails.expiryDate,
    );
  }

  @override
  void dispose() {
    _licenseNumberController.dispose();
    _expiryDateController.dispose();
    super.dispose();
  }

  void _handleBackNavigation() {
    context.go('/kyc/aadhaar');
  }

  void _uploadLicenseImage() {
    setState(() => _licenseImageError = null);
    context.read<KycBloc>().add(
      const KycDrivingLicenseImageUploaded(
        imageName: 'driving_license.jpg',
        imageSize: '1.8 MB',
      ),
    );
  }

  void _removeLicenseImage() {
    context.read<KycBloc>().add(const KycDrivingLicenseImageRemoved());
  }

  Future<void> _pickExpiryDate(BuildContext context) async {
    final now = DateTime.now();
    final initialDate = now.add(const Duration(days: 365));

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(2000),
      lastDate: DateTime(2050),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: RiderColors.primaryYellow,
              onPrimary: RiderColors.onSurfaceDark,
              onSurface: RiderColors.onSurfaceDark,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      final day = picked.day.toString().padLeft(2, '0');
      final month = picked.month.toString().padLeft(2, '0');
      final formatted = '$day/$month/${picked.year}';
      setState(() {
        _expiryDateController.text = formatted;
      });
    }
  }

  bool _validateForm(DrivingLicenseModel details) {
    bool isValid = true;
    setState(() {
      _licenseNumberError = null;
      _licenseImageError = null;

      final number = _licenseNumberController.text.trim();
      if (number.isEmpty) {
        _licenseNumberError = 'Please enter Driving License number';
        isValid = false;
      }

      if (!details.hasLicenseImage) {
        _licenseImageError = 'Please attach Driving License image';
        isValid = false;
      }
    });

    return isValid;
  }

  void _onNextPressed(DrivingLicenseModel currentDetails) {
    if (!_validateForm(currentDetails)) return;

    final updatedDetails = currentDetails.copyWith(
      licenseNumber: _licenseNumberController.text.trim().toUpperCase(),
      expiryDate: _expiryDateController.text.trim(),
    );

    context.read<KycBloc>().add(KycDrivingLicenseSubmitted(updatedDetails));
    context.push('/kyc/bank');
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<KycBloc, KycState>(
      builder: (context, state) {
        final licenseDetails = state.drivingLicenseDetails;

        return Scaffold(
          backgroundColor: RiderColors.background,
          body: SafeArea(
            child: Column(
              children: [
                // Exact 56 px Header with 1 px #CACACA bottom border
                KycStepHeader(
                  title: 'Driving License',
                  stepCounter: '3/4',
                  showBackButton: true,
                  onBack: _handleBackNavigation,
                ),

                // Main Content Frame: Width 328 px, 24 px child gaps
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

                                  // 4-segment progress indicator (first 3 active)
                                  const KycStepProgressBar(currentStep: 3),

                                  const SizedBox(height: 24),

                                  // Driving License Number with red asterisk
                                  KycTextField(
                                    inputKey: const Key(
                                      'driving_license_number_field',
                                    ),
                                    label: 'Driving License Number',
                                    isRequired: true,
                                    placeholder: 'Enter License Number',
                                    controller: _licenseNumberController,
                                    textCapitalization:
                                        TextCapitalization.characters,
                                    errorText: _licenseNumberError,
                                    onChanged: (_) {
                                      if (_licenseNumberError != null) {
                                        setState(
                                          () => _licenseNumberError = null,
                                        );
                                      }
                                    },
                                  ),

                                  const SizedBox(height: 24),

                                  // Dashed Upload Card (Upload  License Image)
                                  KycUploadCard(
                                    cardKey: const Key(
                                      'driving_license_upload_card',
                                    ),
                                    helperText: 'Upload  License Image',
                                    attachedFileName:
                                        licenseDetails.licenseImageName,
                                    attachedFileSize:
                                        licenseDetails.licenseImageSize,
                                    onUpload: _uploadLicenseImage,
                                    onRemove: _removeLicenseImage,
                                    errorText: _licenseImageError,
                                  ),

                                  const SizedBox(height: 24),

                                  // Expiry Date Field (No asterisk per Figma, with calendar icon)
                                  KycTextField(
                                    inputKey: const Key(
                                      'driving_license_expiry_date_field',
                                    ),
                                    label: 'Driving License Expire Date',
                                    isRequired: false,
                                    placeholder: 'Enter Expire date',
                                    controller: _expiryDateController,
                                    readOnly: true,
                                    onTap: () => _pickExpiryDate(context),
                                    suffixIcon: const Padding(
                                      padding: EdgeInsets.only(right: 12.0),
                                      child: Icon(
                                        Icons.calendar_today_outlined,
                                        size: 20,
                                        color: Color(0xFF5B5B5B),
                                      ),
                                    ),
                                  ),

                                  const Spacer(),

                                  // Pinned Next Button
                                  KycNextButton(
                                    buttonKey: const Key(
                                      'driving_license_next_button',
                                    ),
                                    onPressed: () =>
                                        _onNextPressed(licenseDetails),
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
