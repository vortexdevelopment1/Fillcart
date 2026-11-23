import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/kyc_bloc.dart';
import '../../bloc/kyc_event.dart';

/// Screen inserted after Aadhaar Details (Figma Node 2164:20215).
///
/// Implements 6-digit OTP verification for Aadhaar with:
/// - 56 px Header ("Aadhaar Verification" + back arrow)
/// - Centered "Enter OTP" heading and Aadhaar masked-phone subtitle
/// - 6 individual 44 x 52 px OTP cells with auto-advance, backspace, and paste support
/// - 30-second resend countdown + clickable "Change Number?" action
/// - Full-width yellow "Verify Aadhaar" button with mock validation
class AadhaarOtpVerificationScreen extends StatefulWidget {
  final String maskedPhoneSuffix;

  const AadhaarOtpVerificationScreen({
    super.key,
    this.maskedPhoneSuffix = '4785',
  });

  @override
  State<AadhaarOtpVerificationScreen> createState() =>
      _AadhaarOtpVerificationScreenState();
}

class _AadhaarOtpVerificationScreenState
    extends State<AadhaarOtpVerificationScreen> {
  static const int _otpLength = 6;
  late final List<TextEditingController> _controllers;
  late final List<FocusNode> _focusNodes;
  late final List<FocusNode> _keyboardFocusNodes;

  int _resendCountdown = 30;
  Timer? _timer;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(_otpLength, (_) => TextEditingController());
    _focusNodes = List.generate(_otpLength, (_) => FocusNode());
    _keyboardFocusNodes = List.generate(_otpLength, (_) => FocusNode());
    _startResendTimer();
  }

  void _startResendTimer() {
    _timer?.cancel();
    setState(() {
      _resendCountdown = 30;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendCountdown > 0) {
        setState(() => _resendCountdown--);
      } else {
        timer.cancel();
      }
    });
  }

  void _onResendPressed() {
    if (_resendCountdown > 0) return;
    setState(() => _errorMessage = null);
    _startResendTimer();
  }

  void _onChangeNumberPressed() {
    // Return to Aadhaar Details screen preserving all entered state
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/kyc/aadhaar');
    }
  }

  void _handleBackNavigation() {
    _onChangeNumberPressed();
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
    for (final node in _keyboardFocusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  String get _currentOtp => _controllers.map((c) => c.text).join();

  void _onDigitChanged(int index, String value) {
    setState(() => _errorMessage = null);

    // Support paste: if user pastes a multi-digit string (e.g. 6 digits)
    if (value.length > 1) {
      final digits = value.replaceAll(RegExp(r'\D'), '');
      if (digits.isNotEmpty) {
        for (int i = 0; i < _otpLength; i++) {
          if (i < digits.length) {
            _controllers[i].text = digits[i];
          }
        }
        final nextIndex = digits.length < _otpLength
            ? digits.length
            : _otpLength - 1;
        _focusNodes[nextIndex].requestFocus();
        setState(() {});
        return;
      }
    }

    if (value.isNotEmpty) {
      if (index < _otpLength - 1) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
      }
    }
    setState(() {});
  }

  void _submitOtp() {
    final otp = _currentOtp;
    if (otp.length != _otpLength) return;

    // Mock validation rule: 000000 simulates invalid OTP
    if (otp == '000000') {
      setState(() {
        _errorMessage = 'Invalid OTP. Please check the code and try again.';
      });
      return;
    }

    // Success: notify bloc and navigate to Aadhaar Verify Success screen
    context.read<KycBloc>().add(const KycAadhaarOtpVerified());
    context.push('/kyc/aadhaar-success');
  }

  @override
  Widget build(BuildContext context) {
    final isOtpComplete = _currentOtp.length == _otpLength;

    return Scaffold(
      backgroundColor: RiderColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Exact 56 px Header
            SizedBox(
              height: 56,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  children: [
                    InkWell(
                      key: const Key('aadhaar_otp_back_button'),
                      onTap: _handleBackNavigation,
                      borderRadius: BorderRadius.circular(24),
                      child: const SizedBox(
                        width: 48,
                        height: 48,
                        child: Center(
                          child: Icon(
                            Icons.arrow_back,
                            size: 24,
                            color: Color(0xFF000000),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Aadhaar Verification',
                      key: const Key('aadhaar_otp_header_title'),
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF000000),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Gap below header: 48 px
                    const SizedBox(height: 48),

                    // Heading: "Enter OTP"
                    Text(
                      'Enter OTP',
                      key: const Key('aadhaar_otp_heading'),
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF000000),
                      ),
                    ),

                    // Gap: 8 px
                    const SizedBox(height: 8),

                    // Subtitle with max width 290 px
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 290),
                      child: Text(
                        'OTP sent to your Aadhaar linked mobile number ending with ${widget.maskedPhoneSuffix}.',
                        key: const Key('aadhaar_otp_subtitle'),
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF5B5B5B),
                          height: 1.45,
                        ),
                      ),
                    ),

                    // Gap: 24 px
                    const SizedBox(height: 24),

                    // 6 OTP Input Cells
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(_otpLength, (index) {
                        return SizedBox(
                          width: 44,
                          height: 52,
                          child: KeyboardListener(
                            focusNode: _keyboardFocusNodes[index],
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
                              key: Key('aadhaar_otp_cell_$index'),
                              controller: _controllers[index],
                              focusNode: _focusNodes[index],
                              keyboardType: TextInputType.number,
                              textAlign: TextAlign.center,
                              maxLength: 1,
                              style: GoogleFonts.poppins(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF1B1C17),
                              ),
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                              ],
                              decoration: InputDecoration(
                                counterText: '',
                                filled: true,
                                fillColor: const Color(0xFFFFFFFF),
                                contentPadding: EdgeInsets.zero,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                  borderSide: const BorderSide(
                                    color: Color(0xFFCACACA),
                                    width: 1.0,
                                  ),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                  borderSide: const BorderSide(
                                    color: Color(0xFFCACACA),
                                    width: 1.0,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
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

                    // Gap: 16 px
                    const SizedBox(height: 16),

                    // Resend and Change Number row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (_resendCountdown > 0)
                          Text(
                            'Resend code in 00:${_resendCountdown.toString().padLeft(2, '0')}',
                            key: const Key('aadhaar_otp_resend_countdown'),
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF5B5B5B),
                            ),
                          )
                        else
                          GestureDetector(
                            key: const Key('aadhaar_otp_resend_button'),
                            onTap: _onResendPressed,
                            child: Text(
                              'Resend code',
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF000000),
                              ),
                            ),
                          ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          key: const Key('aadhaar_otp_change_number_button'),
                          onTap: _onChangeNumberPressed,
                          child: Text(
                            'Change Number?',
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF000000),
                            ),
                          ),
                        ),
                      ],
                    ),

                    // Error Banner if invalid OTP entered
                    if (_errorMessage != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        key: const Key('aadhaar_otp_error_banner'),
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
                  ],
                ),
              ),
            ),

            // Bottom "Verify Aadhaar" button
            Padding(
              padding: const EdgeInsets.only(
                left: 16.0,
                right: 16.0,
                bottom: 16.0,
              ),
              child: SizedBox(
                width: 328,
                height: 48,
                child: ElevatedButton(
                  key: const Key('verify_aadhaar_button'),
                  onPressed: isOtpComplete ? _submitOtp : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: RiderColors.primaryYellow,
                    foregroundColor: const Color(0xFF000000),
                    disabledBackgroundColor: RiderColors.primaryYellow
                        .withValues(alpha: 0.5),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Verify Aadhaar',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF000000),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
