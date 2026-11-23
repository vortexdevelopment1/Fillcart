import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'business_information_screen.dart';

/// Screen 2: "Enter OTP" (Image 2).
class OtpVerificationScreen extends StatefulWidget {
  final String phoneNumber;

  const OtpVerificationScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final List<TextEditingController> _controllers =
      List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());
  final List<FocusNode> _keyboardFocusNodes =
      List.generate(4, (_) => FocusNode());

  int _resendCountdown = 34;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  void _startCountdown() {
    _timer?.cancel();
    setState(() => _resendCountdown = 34);
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
    for (final node in _keyboardFocusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  String get _currentOtp => _controllers.map((c) => c.text).join();

  void _onVerify() {
    final otp = _currentOtp;
    if (otp.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the full 4-digit OTP'),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => BusinessInformationScreen(
          phoneNumber: widget.phoneNumber,
        ),
      ),
    );
  }

  void _handleDigitInput(int index, String value) {
    if (value.isNotEmpty) {
      // Auto-advance to next box if available
      if (index < 3) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
      }
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final paddingBottom = MediaQuery.of(context).padding.bottom;
    final isOtpComplete = _currentOtp.length == 4;

    return Scaffold(
      backgroundColor: const Color(0xFFEDEDED),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 36.0),

              // Title Centered
              Text(
                'Enter OTP',
                style: GoogleFonts.inter(
                  fontSize: 24.0,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8.0),

              // Subtitle Centered
              Text(
                'Enter the 4 digit code sent to ${widget.phoneNumber}',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF64748B),
                ),
              ),
              const SizedBox(height: 36.0),

              // "4-digit code" Label
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  '4-digit code',
                  style: GoogleFonts.inter(
                    fontSize: 14.0,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF0F172A),
                  ),
                ),
              ),
              const SizedBox(height: 12.0),

              // 4 Rounded Squircle Boxes
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(4, (index) => _buildOtpBox(index)),
              ),
              const SizedBox(height: 18.0),

              // Timer & Change Number Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Resend code in 00:${_resendCountdown.toString().padLeft(2, '0')}',
                    style: GoogleFonts.inter(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF64748B),
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Text(
                      'Change Number?',
                      style: GoogleFonts.inter(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                ],
              ),

              const Spacer(),

              // Verify & Continue Button
              SizedBox(
                width: double.infinity,
                height: 56.0,
                child: ElevatedButton(
                  onPressed: isOtpComplete ? _onVerify : _onVerify,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: const StadiumBorder(),
                  ),
                  child: Text(
                    'Verify & Continue',
                    style: GoogleFonts.inter(
                      fontSize: 17.0,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),

              // Subtext "Didn’t receive the OTP? Resend"
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Didn’t receive the OTP? ',
                    style: GoogleFonts.inter(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF64748B),
                    ),
                  ),
                  GestureDetector(
                    onTap: _resendCountdown == 0 ? _startCountdown : null,
                    child: Text(
                      'Resend',
                      style: GoogleFonts.inter(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: _resendCountdown == 0
                            ? const Color(0xFF0F172A)
                            : const Color(0xFF94A3B8),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16.0 + paddingBottom),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOtpBox(int index) {
    final controller = _controllers[index];
    final focusNode = _focusNodes[index];
    final hasValue = controller.text.isNotEmpty;

    return Container(
      width: 66.0,
      height: 72.0,
      decoration: BoxDecoration(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(18.0),
        border: Border.all(
          color: hasValue || focusNode.hasFocus
              ? const Color(0xFF0F172A)
              : const Color(0xFF71717A),
          width: hasValue || focusNode.hasFocus ? 1.8 : 1.0,
        ),
      ),
      alignment: Alignment.center,
      child: KeyboardListener(
        focusNode: _keyboardFocusNodes[index],
        onKeyEvent: (event) {
          if (event is KeyDownEvent &&
              event.logicalKey == LogicalKeyboardKey.backspace &&
              controller.text.isEmpty &&
              index > 0) {
            _focusNodes[index - 1].requestFocus();
            _controllers[index - 1].clear();
          }
        },
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly,
            LengthLimitingTextInputFormatter(1),
          ],
          onChanged: (val) => _handleDigitInput(index, val),
          style: GoogleFonts.inter(
            fontSize: 28.0,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF0F172A),
          ),
          decoration: const InputDecoration(
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            disabledBorder: InputBorder.none,
            errorBorder: InputBorder.none,
            focusedErrorBorder: InputBorder.none,
            filled: false,
            fillColor: Colors.transparent,
            isDense: true,
            contentPadding: EdgeInsets.zero,
          ),
        ),
      ),
    );
  }
}
