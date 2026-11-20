import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/constants/rider_colors.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

/// Screen allowing riders to verify their phone number using a 6-digit OTP.
///
/// Implemented according to Figma Frame 1848:51901 ("OTP Verification" / "Enter OTP").
class OtpVerificationScreen extends StatefulWidget {
  final String phoneNumber;

  const OtpVerificationScreen({super.key, required this.phoneNumber});

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  static const int _otpLength = 6;
  late final List<TextEditingController> _controllers;
  late final List<FocusNode> _focusNodes;

  int _resendCountdown = 30;
  Timer? _timer;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(_otpLength, (_) => TextEditingController());
    _focusNodes = List.generate(_otpLength, (_) => FocusNode());
    _startResendTimer();
  }

  void _startResendTimer() {
    _timer?.cancel();
    setState(() => _resendCountdown = 30);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendCountdown > 0) {
        setState(() => _resendCountdown--);
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (final controller in _controllers) {
      controller.dispose();
    }
    for (final node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  String get _currentOtp => _controllers.map((c) => c.text).join();

  void _onDigitChanged(int index, String value) {
    setState(() => _errorMessage = null);

    if (value.isNotEmpty) {
      if (value.length > 1) {
        _controllers[index].text = value.substring(value.length - 1);
      }
      if (index < _otpLength - 1) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
        if (_currentOtp.length == _otpLength) {
          _submitOtp();
        }
      }
    }
  }

  void _submitOtp() {
    setState(() => _errorMessage = null);
    final otp = _currentOtp;

    if (otp.length < 4) {
      setState(() {
        _errorMessage = 'Please enter verification code';
      });
      return;
    }

    context.read<AuthBloc>().add(
      AuthOtpSubmitted(phoneNumber: widget.phoneNumber, otp: otp),
    );
  }

  void _resendOtp() {
    if (_resendCountdown == 0) {
      context.read<AuthBloc>().add(
        AuthPhoneNumberSubmitted(widget.phoneNumber),
      );
      _startResendTimer();
      for (final c in _controllers) {
        c.clear();
      }
      _focusNodes[0].requestFocus();
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthSuccess) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              key: const Key('auth_success_snackbar'),
              content: Text(
                'Phone verified (+91 ${state.phoneNumber}). Next: Vehicle Details (1848:51738) in Batch 2.',
                style: GoogleFonts.poppins(),
              ),
              backgroundColor: RiderColors.onSurfaceDark,
              duration: const Duration(seconds: 4),
            ),
          );
        } else if (state is AuthFailure) {
          setState(() {
            _errorMessage = state.message;
          });
        }
      },
      builder: (context, state) {
        final isVerifying = state is AuthVerifying;
        final isSuccess = state is AuthSuccess;

        return Scaffold(
          backgroundColor: RiderColors.background,
          body: SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 24),

                    // Centered Title
                    Center(
                      child: Text(
                        'Enter OTP',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 24,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF000000),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Centered Subtitle
                    Center(
                      child: Text(
                        'We sent an sms with a 6-digit code to your registered Email. Please enter it so we can be sure that this Email belongs to you.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF5B5B5B),
                          height: 1.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Field Label
                    Text(
                      'OTP',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF000000),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // 6 OTP Input Cells
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(_otpLength, (index) {
                        return SizedBox(
                          width: 48,
                          height: 56,
                          child: KeyboardListener(
                            focusNode: FocusNode(),
                            onKeyEvent: (event) {
                              if (event is KeyDownEvent &&
                                  event.logicalKey ==
                                      LogicalKeyboardKey.backspace &&
                                  _controllers[index].text.isEmpty &&
                                  index > 0) {
                                _focusNodes[index - 1].requestFocus();
                              }
                            },
                            child: TextField(
                              key: Key('otp_cell_$index'),
                              controller: _controllers[index],
                              focusNode: _focusNodes[index],
                              keyboardType: TextInputType.number,
                              textAlign: TextAlign.center,
                              maxLength: 1,
                              style: GoogleFonts.poppins(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: RiderColors.onSurfaceDark,
                              ),
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                              ],
                              decoration: InputDecoration(
                                counterText: '',
                                filled: true,
                                fillColor: RiderColors.background,
                                contentPadding: EdgeInsets.zero,
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
                              onChanged: (val) => _onDigitChanged(index, val),
                            ),
                          ),
                        );
                      }),
                    ),

                    // Error Text Banner
                    if (_errorMessage != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        key: const Key('otp_error_text'),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: RiderColors.errorRed.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.error_outline,
                              size: 16,
                              color: RiderColors.errorRed,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  color: RiderColors.errorRed,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    // Development confirmation banner (shows only on successful verification)
                    if (isSuccess) ...[
                      const SizedBox(height: 16),
                      Container(
                        key: const Key('dev_auth_success_banner'),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: RiderColors.onlineGreen.withValues(
                            alpha: 0.12,
                          ),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: RiderColors.onlineGreen),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.check_circle,
                              color: RiderColors.onlineGreen,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                '[DEV] Verified +91 ${(state).phoneNumber}. Next Figma screen: Vehicle Details (1848:51738) in Batch 2.',
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: RiderColors.onSurfaceDark,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 24),

                    // Verify Button (directly below OTP cells)
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        key: const Key('otp_verify_button'),
                        onPressed: (isVerifying || isSuccess)
                            ? null
                            : _submitOtp,
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
                        child: isVerifying
                            ? const SizedBox(
                                height: 22,
                                width: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  color: RiderColors.onSurfaceDark,
                                ),
                              )
                            : Text(
                                isSuccess ? 'Verified' : 'Verify',
                                style: GoogleFonts.poppins(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w500,
                                  color: const Color(0xFF000000),
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Resend Section
                    Center(
                      child: GestureDetector(
                        key: const Key('resend_otp_button'),
                        onTap: _resendCountdown == 0 ? _resendOtp : null,
                        child: RichText(
                          textAlign: TextAlign.center,
                          text: TextSpan(
                            children: [
                              TextSpan(
                                text: 'Didn\'t recieve the OTP? ',
                                style: GoogleFonts.montserrat(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: const Color(0xFF5B5B5B),
                                ),
                              ),
                              TextSpan(
                                text: _resendCountdown > 0
                                    ? 'Resend (${_resendCountdown}s)'
                                    : 'Resend',
                                style: GoogleFonts.montserrat(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF000000),
                                ),
                              ),
                            ],
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
        );
      },
    );
  }
}
