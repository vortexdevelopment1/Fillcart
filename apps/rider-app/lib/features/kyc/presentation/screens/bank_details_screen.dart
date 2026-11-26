import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';
import '../../bloc/kyc_state.dart';
import '../../models/bank_details_model.dart';
import '../widgets/kyc_next_button.dart';
import '../widgets/kyc_step_header.dart';
import '../widgets/kyc_step_progress_bar.dart';
import '../widgets/kyc_text_field.dart';

/// Screen 4/4 of KYC Wizard: Bank Details (Figma Frame 1848:51788).
///
/// Specifications:
/// - Screen title: "Bank Details", step counter: "4/4"
/// - Material left arrow back button (Icons.arrow_back)
/// - Height 56 px header with 1 px #CACACA bottom border
/// - 4-segment progress bar (all 4 segments active)
/// - 5 Mandatory fields with approved copy:
///   1. Account Holder Name* (placeholder: Enter Holder Name)
///   2. Bank Name* (placeholder: Enter Bank Name)
///   3. IFSC Code* (placeholder: Enter Number)
///   4. Account Number* (placeholder: Enter Account Number)
///   5. Confirm Account Number* (placeholder: Confirm Account Number)
/// - Account Number and Confirm Account Number must match
/// - Pinned yellow Next button
class BankDetailsScreen extends StatefulWidget {
  const BankDetailsScreen({super.key});

  @override
  State<BankDetailsScreen> createState() => _BankDetailsScreenState();
}

class _BankDetailsScreenState extends State<BankDetailsScreen> {
  late final TextEditingController _holderNameController;
  late final TextEditingController _bankNameController;
  late final TextEditingController _ifscCodeController;
  late final TextEditingController _accountNumberController;
  late final TextEditingController _confirmAccountController;

  String? _holderNameError;
  String? _bankNameError;
  String? _ifscCodeError;
  String? _accountNumberError;
  String? _confirmAccountError;

  @override
  void initState() {
    super.initState();
    final currentDetails = context.read<KycBloc>().state.bankDetails;
    _holderNameController = TextEditingController(
      text: currentDetails.accountHolderName,
    );
    _bankNameController = TextEditingController(text: currentDetails.bankName);
    _ifscCodeController = TextEditingController(text: currentDetails.ifscCode);
    _accountNumberController = TextEditingController(
      text: currentDetails.accountNumber,
    );
    _confirmAccountController = TextEditingController(
      text: currentDetails.confirmAccountNumber,
    );
  }

  @override
  void dispose() {
    _holderNameController.dispose();
    _bankNameController.dispose();
    _ifscCodeController.dispose();
    _accountNumberController.dispose();
    _confirmAccountController.dispose();
    super.dispose();
  }

  void _handleBackNavigation() {
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/kyc/driving-license');
    }
  }

  bool _validateForm() {
    bool isValid = true;
    setState(() {
      _holderNameError = null;
      _bankNameError = null;
      _ifscCodeError = null;
      _accountNumberError = null;
      _confirmAccountError = null;

      if (_holderNameController.text.trim().isEmpty) {
        _holderNameError = 'Please enter account holder name';
        isValid = false;
      }

      if (_bankNameController.text.trim().isEmpty) {
        _bankNameError = 'Please enter bank name';
        isValid = false;
      }

      final ifsc = _ifscCodeController.text.trim();
      if (ifsc.isEmpty) {
        _ifscCodeError = 'Please enter IFSC code';
        isValid = false;
      }

      final acc = _accountNumberController.text.trim();
      if (acc.isEmpty) {
        _accountNumberError = 'Please enter account number';
        isValid = false;
      }

      final confirmAcc = _confirmAccountController.text.trim();
      if (confirmAcc.isEmpty) {
        _confirmAccountError = 'Please confirm account number';
        isValid = false;
      } else if (acc != confirmAcc) {
        _confirmAccountError = 'Account numbers do not match';
        isValid = false;
      }
    });

    return isValid;
  }

  void _onNextPressed() {
    if (!_validateForm()) return;

    final details = BankDetailsModel(
      accountHolderName: _holderNameController.text.trim(),
      bankName: _bankNameController.text.trim(),
      ifscCode: _ifscCodeController.text.trim().toUpperCase(),
      accountNumber: _accountNumberController.text.trim(),
      confirmAccountNumber: _confirmAccountController.text.trim(),
    );

    context.read<KycBloc>().add(KycBankDetailsSubmitted(details));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        key: Key('kyc_all_steps_completed_snackbar'),
        content: Text('All KYC steps completed successfully'),
      ),
    );
    context.push('/kyc/pending');
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<KycBloc, KycState>(
      builder: (context, state) {
        return Scaffold(
          backgroundColor: RiderColors.background,
          body: SafeArea(
            child: Column(
              children: [
                // Exact 56 px Header with 1 px #CACACA bottom border
                KycStepHeader(
                  title: 'Bank Details',
                  stepCounter: '4/4',
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

                                  // 4-segment progress indicator (all 4 active)
                                  const KycStepProgressBar(currentStep: 4),

                                  const SizedBox(height: 24),

                                  // Field 1: Account Holder Name*
                                  KycTextField(
                                    inputKey: const Key(
                                      'bank_holder_name_field',
                                    ),
                                    label: 'Account Holder Name',
                                    isRequired: true,
                                    placeholder: 'Enter Holder Name',
                                    controller: _holderNameController,
                                    textCapitalization:
                                        TextCapitalization.words,
                                    errorText: _holderNameError,
                                    onChanged: (_) {
                                      if (_holderNameError != null) {
                                        setState(() => _holderNameError = null);
                                      }
                                    },
                                  ),

                                  const SizedBox(height: 24),

                                  // Field 2: Bank Name*
                                  KycTextField(
                                    inputKey: const Key('bank_name_field'),
                                    label: 'Bank Name',
                                    isRequired: true,
                                    placeholder: 'Enter Bank Name',
                                    controller: _bankNameController,
                                    textCapitalization:
                                        TextCapitalization.words,
                                    errorText: _bankNameError,
                                    onChanged: (_) {
                                      if (_bankNameError != null) {
                                        setState(() => _bankNameError = null);
                                      }
                                    },
                                  ),

                                  const SizedBox(height: 24),

                                  // Field 3: IFSC Code*
                                  KycTextField(
                                    inputKey: const Key('bank_ifsc_code_field'),
                                    label: 'IFSC Code',
                                    isRequired: true,
                                    placeholder: 'Enter Number',
                                    controller: _ifscCodeController,
                                    textCapitalization:
                                        TextCapitalization.characters,
                                    errorText: _ifscCodeError,
                                    onChanged: (_) {
                                      if (_ifscCodeError != null) {
                                        setState(() => _ifscCodeError = null);
                                      }
                                    },
                                  ),

                                  const SizedBox(height: 24),

                                  // Field 4: Account Number*
                                  KycTextField(
                                    inputKey: const Key(
                                      'bank_account_number_field',
                                    ),
                                    label: 'Account Number',
                                    isRequired: true,
                                    placeholder: 'Enter Account Number',
                                    controller: _accountNumberController,
                                    keyboardType: TextInputType.number,
                                    inputFormatters: [
                                      FilteringTextInputFormatter.digitsOnly,
                                    ],
                                    errorText: _accountNumberError,
                                    onChanged: (_) {
                                      if (_accountNumberError != null) {
                                        setState(
                                          () => _accountNumberError = null,
                                        );
                                      }
                                    },
                                  ),

                                  const SizedBox(height: 24),

                                  // Field 5: Confirm Account Number*
                                  KycTextField(
                                    inputKey: const Key(
                                      'bank_confirm_account_field',
                                    ),
                                    label: 'Confirm Account Number',
                                    isRequired: true,
                                    placeholder: 'Confirm Account Number',
                                    controller: _confirmAccountController,
                                    keyboardType: TextInputType.number,
                                    inputFormatters: [
                                      FilteringTextInputFormatter.digitsOnly,
                                    ],
                                    errorText: _confirmAccountError,
                                    onChanged: (_) {
                                      if (_confirmAccountError != null) {
                                        setState(
                                          () => _confirmAccountError = null,
                                        );
                                      }
                                    },
                                  ),

                                  const Spacer(),

                                  // Bottom Pinned Next Button
                                  KycNextButton(
                                    buttonKey: const Key('bank_next_button'),
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
        );
      },
    );
  }
}
