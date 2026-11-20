import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/constants/rider_colors.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

/// Screen allowing riders to enter their mobile phone number for authentication.
///
/// Implemented according to Figma Frame 1848:51719 ("Add Phone Number").
class PhoneNumberInputScreen extends StatefulWidget {
  const PhoneNumberInputScreen({super.key});

  @override
  State<PhoneNumberInputScreen> createState() => _PhoneNumberInputScreenState();
}

class _PhoneNumberInputScreenState extends State<PhoneNumberInputScreen> {
  final _phoneController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String? _validationError;

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _submitPhoneNumber() {
    setState(() => _validationError = null);
    final rawNumber = _phoneController.text.trim();
    final digitsOnly = rawNumber.replaceAll(RegExp(r'\D'), '');

    if (digitsOnly.length != 10) {
      setState(() {
        _validationError = 'Please enter a valid 10-digit mobile number';
      });
      return;
    }

    context.read<AuthBloc>().add(AuthPhoneNumberSubmitted(digitsOnly));
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthOtpSent) {
          context.push('/otp?phone=${state.phoneNumber}');
        } else if (state is AuthFailure) {
          setState(() {
            _validationError = state.message;
          });
        }
      },
      builder: (context, state) {
        final isLoading = state is AuthPhoneSubmitting;

        return Scaffold(
          backgroundColor: RiderColors.background,
          body: SafeArea(
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 24),
                      Text(
                        'Add Phone Number',
                        style: GoogleFonts.roboto(
                          fontSize: 24,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF000000),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Input a phone number what you\'d like to add to your account',
                        style: GoogleFonts.montserrat(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF5B5B5B),
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Label above field
                      Text(
                        'Phone Number',
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF000000),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Single unified Phone Input Field with +91 Prefix
                      TextFormField(
                        key: const Key('phone_number_input_field'),
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(10),
                        ],
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF000000),
                          letterSpacing: 0.5,
                        ),
                        decoration: InputDecoration(
                          prefixIcon: Padding(
                            padding: const EdgeInsets.only(
                              left: 16.0,
                              right: 10.0,
                            ),
                            child: Text(
                              '+91',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w400,
                                color: const Color(0xFF5B5B5B),
                              ),
                            ),
                          ),
                          prefixIconConstraints: const BoxConstraints(
                            minWidth: 0,
                            minHeight: 0,
                          ),
                          fillColor: RiderColors.background,
                          filled: true,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                              color: Color(0xFFC4C4C4),
                              width: 1.0,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                              color: Color(0xFFC4C4C4),
                              width: 1.0,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(
                              color: RiderColors.primaryYellow,
                              width: 1.8,
                            ),
                          ),
                        ),
                        onChanged: (_) {
                          if (_validationError != null) {
                            setState(() => _validationError = null);
                          }
                        },
                      ),

                      // Error Message
                      if (_validationError != null) ...[
                        const SizedBox(height: 8),
                        Padding(
                          padding: const EdgeInsets.only(left: 4.0),
                          child: Text(
                            _validationError!,
                            key: const Key('phone_error_text'),
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              color: RiderColors.errorRed,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],

                      const SizedBox(height: 24),

                      // Continue Button (directly below input field)
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          key: const Key('phone_continue_button'),
                          onPressed: isLoading ? null : _submitPhoneNumber,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: RiderColors.primaryYellow,
                            foregroundColor: RiderColors.onSurfaceDark,
                            disabledBackgroundColor: RiderColors.primaryYellow
                                .withValues(alpha: 0.5),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 0,
                          ),
                          child: isLoading
                              ? const SizedBox(
                                  height: 22,
                                  width: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.5,
                                    color: RiderColors.onSurfaceDark,
                                  ),
                                )
                              : Text(
                                  'Continue',
                                  style: GoogleFonts.poppins(
                                    fontSize: 20,
                                    fontWeight: FontWeight.w500,
                                    color: const Color(0xFF000000),
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
