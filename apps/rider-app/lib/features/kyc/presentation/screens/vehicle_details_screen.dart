import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';
import '../../bloc/kyc_state.dart';
import '../../models/vehicle_details_model.dart';
import '../widgets/kyc_next_button.dart';
import '../widgets/kyc_step_header.dart';
import '../widgets/kyc_step_progress_bar.dart';
import '../widgets/kyc_text_field.dart';

/// Screen 1/4 of KYC Wizard: Vehicle Details (Figma Frame 1848:51738).
///
/// Exact Figma specifications applied:
/// - Header: Height 56 px, padding 6/16/6/16 px, bottom border 1 px #CACACA
/// - Main Content Frame: Width 328 px (16 px horizontal padding), 24 px child gaps
/// - 4-segment progress indicator (1st segment active)
/// - Single mandatory input: "Enter Vehicle RC No*" (placeholder: "22 BH 1234 AA")
/// - Double-back-to-exit on Android (first back press shows exit reminder SnackBar)
/// - Pinned full-width yellow Next button
class VehicleDetailsScreen extends StatefulWidget {
  const VehicleDetailsScreen({super.key});

  @override
  State<VehicleDetailsScreen> createState() => _VehicleDetailsScreenState();
}

class _VehicleDetailsScreenState extends State<VehicleDetailsScreen> {
  late final TextEditingController _rcNumberController;
  String? _rcNumberError;
  DateTime? _lastBackPressTime;

  @override
  void initState() {
    super.initState();
    final currentDetails = context.read<KycBloc>().state.vehicleDetails;
    _rcNumberController = TextEditingController(
      text: currentDetails.vehicleRcNumber,
    );
  }

  @override
  void dispose() {
    _rcNumberController.dispose();
    super.dispose();
  }

  void _handlePopInvoked(bool didPop) {
    if (didPop) return;

    final now = DateTime.now();
    if (_lastBackPressTime == null ||
        now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
      _lastBackPressTime = now;
      ScaffoldMessenger.of(context).clearSnackBars();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Press back again to exit',
            style: GoogleFonts.poppins(color: const Color(0xFFFFFFFF)),
          ),
          backgroundColor: RiderColors.onSurfaceDark,
          duration: const Duration(seconds: 2),
        ),
      );
      return;
    }

    // Second back press within 2 seconds: attempt exit
    SystemNavigator.pop();
  }

  bool _validateForm() {
    final rc = _rcNumberController.text.trim();
    if (rc.isEmpty) {
      setState(() {
        _rcNumberError = 'Please enter vehicle RC number';
      });
      return false;
    }

    setState(() {
      _rcNumberError = null;
    });
    return true;
  }

  void _onNextPressed() {
    if (!_validateForm()) return;

    final cleanRc = _rcNumberController.text.trim().toUpperCase();
    final details = VehicleDetailsModel(vehicleRcNumber: cleanRc);

    context.read<KycBloc>().add(KycVehicleDetailsSubmitted(details));
    context.push('/kyc/aadhaar');
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<KycBloc, KycState>(
      builder: (context, state) {
        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, result) => _handlePopInvoked(didPop),
          child: Scaffold(
            backgroundColor: RiderColors.background,
            body: SafeArea(
              child: Column(
                children: [
                  // Exact 56 px Header with 1 px #CACACA bottom border
                  const KycStepHeader(
                    title: 'Vehicle Details',
                    stepCounter: '1/4',
                    showBackButton: false,
                  ),

                  // Main Content Frame: Width 328 px (16 px horizontal padding), 24 px gap
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

                                    // 4-segment progress indicator
                                    const KycStepProgressBar(currentStep: 1),

                                    const SizedBox(height: 24),

                                    // Single mandatory field
                                    KycTextField(
                                      inputKey: const Key(
                                        'vehicle_rc_number_field',
                                      ),
                                      label: 'Enter Vehicle RC No',
                                      isRequired: true,
                                      placeholder: '22 BH 1234 AA',
                                      controller: _rcNumberController,
                                      textCapitalization:
                                          TextCapitalization.characters,
                                      errorText: _rcNumberError,
                                      onChanged: (_) {
                                        if (_rcNumberError != null) {
                                          setState(() => _rcNumberError = null);
                                        }
                                      },
                                    ),

                                    const Spacer(),

                                    // Bottom Pinned Next Button
                                    KycNextButton(
                                      buttonKey: const Key(
                                        'vehicle_next_button',
                                      ),
                                      onPressed: _onNextPressed,
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
          ),
        );
      },
    );
  }
}
