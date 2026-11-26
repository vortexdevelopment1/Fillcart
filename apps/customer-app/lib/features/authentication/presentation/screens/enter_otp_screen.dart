import 'dart:async';
import 'package:fillcart_customer/features/location/presentation/screens/enable_location_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Enter OTP Screen pixel-accurately matching the Figma reference images.
class EnterOtpScreen extends StatefulWidget {
  final String phoneNumber;

  const EnterOtpScreen({
    super.key,
    this.phoneNumber = '+91- 1215656466',
  });

  @override
  State<EnterOtpScreen> createState() => _EnterOtpScreenState();
}

class _EnterOtpScreenState extends State<EnterOtpScreen> {
  final List<TextEditingController> _controllers =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());

  int _remainingSeconds = 59;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startCountdown();
    for (final node in _focusNodes) {
      node.addListener(() {
        if (mounted) setState(() {});
      });
    }
  }

  void _startCountdown() {
    _timer?.cancel();
    _remainingSeconds = 59;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() {
          _remainingSeconds--;
        });
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

  String get _currentOtp =>
      _controllers.map((controller) => controller.text).join();

  bool get _isOtpComplete => _currentOtp.length == 6;

  void _onVerify() {
    if (_isOtpComplete) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(
          builder: (_) => const EnableLocationScreen(),
        ),
        (route) => false,
      );
    }
  }

  void _onResend() {
    _startCountdown();
  }

  @override
  Widget build(BuildContext context) {
    final timerString =
        '0.${_remainingSeconds.toString().padLeft(2, '0')}';

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 21),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top margin positioning title exactly as in reference
                const SizedBox(height: 38),

                // Title: Enter OTP
                const Text(
                  'Enter OTP',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF000000),
                    letterSpacing: -0.4,
                  ),
                ),

                const SizedBox(height: 12),

                // Subtitle
                const Text(
                  'We sent an sms with a 6-digit code to your registered Email. Please enter it so we can be sure that this Email belongs to you.',
                  style: TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF6B7280),
                    height: 1.45,
                  ),
                ),

                // Measured 50px gap between subtitle and OTP label
                const SizedBox(height: 50),

                // Header row: OTP on left and 0.59 countdown timer on right
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'OTP',
                      style: TextStyle(
                        fontSize: 15.5,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1F1F1F),
                      ),
                    ),
                    Text(
                      timerString,
                      style: const TextStyle(
                        fontSize: 15.5,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF1F1F1F),
                      ),
                    ),
                  ],
                ),

                // Measured 16px gap between OTP header and boxes
                const SizedBox(height: 16),

                // 6 OTP Pin Code Input Boxes (width ~52, height ~62, radius 14)
                LayoutBuilder(
                  builder: (context, constraints) {
                    final boxWidth = ((constraints.maxWidth - 5 * 18) / 6).clamp(44.0, 54.0);
                    const boxHeight = 62.0;

                    return Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(6, (index) {
                        final hasDigit = _controllers[index].text.isNotEmpty;
                        final isFocused = _focusNodes[index].hasFocus;
                        final isActive = hasDigit || isFocused;

                        return Container(
                          width: boxWidth,
                          height: boxHeight,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isActive
                                  ? const Color(0xFFF5B014)
                                  : const Color(0xFFD6D9E0),
                              width: isActive ? 1.5 : 1.2,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: TextField(
                            controller: _controllers[index],
                            focusNode: _focusNodes[index],
                            keyboardType: TextInputType.number,
                            textAlign: TextAlign.center,
                            maxLength: 1,
                            cursorColor: Colors.transparent,
                            showCursor: false,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                            ],
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF4A4A4A),
                            ),
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                              disabledBorder: InputBorder.none,
                              errorBorder: InputBorder.none,
                              focusedErrorBorder: InputBorder.none,
                              counterText: '',
                              contentPadding: EdgeInsets.zero,
                              isDense: true,
                              filled: false,
                              fillColor: Colors.transparent,
                            ),
                            onChanged: (value) {
                              setState(() {});
                              if (value.isNotEmpty) {
                                if (index < 5) {
                                  _focusNodes[index + 1].requestFocus();
                                } else {
                                  _focusNodes[index].unfocus();
                                }
                              } else if (value.isEmpty && index > 0) {
                                _focusNodes[index - 1].requestFocus();
                              }
                            },
                          ),
                        );
                      }),
                    );
                  },
                ),

                // Measured 26px gap between boxes and Verify button
                const SizedBox(height: 26),

                // Verify Action Button (Height 60, radius 14, grey when empty, yellow when filled)
                GestureDetector(
                  onTap: _isOtpComplete ? _onVerify : null,
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    height: 60,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: _isOtpComplete
                          ? const Color(0xFFF5B014)
                          : const Color(0xFF919191),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'Verify',
                      style: TextStyle(
                        fontSize: 16.5,
                        fontWeight: _isOtpComplete
                            ? FontWeight.w700
                            : FontWeight.w600,
                        color: _isOtpComplete ? Colors.black : Colors.white,
                        letterSpacing: -0.2,
                      ),
                    ),
                  ),
                ),

                // Measured 27px gap between Verify button and footer
                const SizedBox(height: 27),

                // Resend OTP Footer Row
                Center(
                  child: Text.rich(
                    TextSpan(
                      text: 'Didn’t receive the OTP? ',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF1E293B),
                      ),
                      children: [
                        WidgetSpan(
                          alignment: PlaceholderAlignment.middle,
                          child: GestureDetector(
                            onTap: _onResend,
                            behavior: HitTestBehavior.opaque,
                            child: const Text(
                              'Resend',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFFF5B014),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
