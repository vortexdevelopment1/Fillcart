import 'package:fillcart_customer/features/authentication/presentation/screens/enter_otp_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Customer Sign Up Screen accurately matching Figma design.
class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  bool _agreeWithTerms = true;

  @override
  void dispose() {
    _nameController.dispose();
    _mobileController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _onGetOtp() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => EnterOtpScreen(
          phoneNumber: _mobileController.text.trim().isEmpty
              ? '+91- 1215656466'
              : _mobileController.text.trim(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 12),

                // Title: Sign Up
                const Text(
                  'Sign Up',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1F1F1F),
                    letterSpacing: -0.6,
                  ),
                ),

                const SizedBox(height: 8),

                // Subtitle: Fill your information below.
                const Text(
                  'Fill your information below.',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF6B7280),
                  ),
                ),

                const SizedBox(height: 28),

                // 1. Name*
                const Text(
                  'Name*',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1F1F1F),
                  ),
                ),
                const SizedBox(height: 8),
                _SignUpInputField(
                  controller: _nameController,
                  hintText: 'Enter your full name',
                ),

                const SizedBox(height: 20),

                // 2. Mobile *
                const Text(
                  'Mobile *',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1F1F1F),
                  ),
                ),
                const SizedBox(height: 8),
                _SignUpInputField(
                  controller: _mobileController,
                  hintText: '+91- 1215656466',
                  keyboardType: TextInputType.phone,
                ),

                const SizedBox(height: 20),

                // 3. Email
                const Text(
                  'Email',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1F1F1F),
                  ),
                ),
                const SizedBox(height: 8),
                _SignUpInputField(
                  controller: _emailController,
                  hintText: 'abc@gmail.com',
                  keyboardType: TextInputType.emailAddress,
                ),

                const SizedBox(height: 22),

                // Checkbox: Agree with terms and condition
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _agreeWithTerms = !_agreeWithTerms;
                    });
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Row(
                    children: [
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          color: _agreeWithTerms
                              ? const Color(0xFFF5B014)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(4),
                          border: Border.all(
                            color: _agreeWithTerms
                                ? const Color(0xFFF5B014)
                                : const Color(0xFF9E9E9E),
                            width: 1.5,
                          ),
                        ),
                        child: _agreeWithTerms
                            ? const Icon(
                                Icons.check,
                                size: 15,
                                color: Colors.white,
                              )
                            : null,
                      ),
                      const SizedBox(width: 10),
                      Text.rich(
                        TextSpan(
                          text: 'Agree with ',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            color: Color(0xFF1F1F1F),
                          ),
                          children: const [
                            TextSpan(
                              text: 'terms and condition',
                              style: TextStyle(
                                color: Color(0xFFF5B014),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                // Get OTP Button
                GestureDetector(
                  onTap: _onGetOtp,
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    height: 52,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5B014),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      'Get OTP',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Colors.black,
                        letterSpacing: -0.2,
                      ),
                    ),
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

class _SignUpInputField extends StatefulWidget {
  final TextEditingController controller;
  final String hintText;
  final TextInputType keyboardType;

  const _SignUpInputField({
    required this.controller,
    required this.hintText,
    this.keyboardType = TextInputType.text,
  });

  @override
  State<_SignUpInputField> createState() => _SignUpInputFieldState();
}

class _SignUpInputFieldState extends State<_SignUpInputField> {
  final FocusNode _focusNode = FocusNode();
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocus);
  }

  void _handleFocus() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocus);
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      height: 52,
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4F6),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: _isFocused
              ? const Color(0xFFF5B014)
              : const Color(0xFFE5E7EB),
          width: _isFocused ? 1.5 : 1.0,
        ),
      ),
      alignment: Alignment.centerLeft,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: TextField(
        controller: widget.controller,
        focusNode: _focusNode,
        keyboardType: widget.keyboardType,
        style: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w500,
          color: Color(0xFF212121),
        ),
        decoration: InputDecoration(
          hintText: widget.hintText,
          hintStyle: const TextStyle(
            color: Color(0xFF9E9E9E),
            fontSize: 15,
            fontWeight: FontWeight.w400,
          ),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          disabledBorder: InputBorder.none,
          errorBorder: InputBorder.none,
          focusedErrorBorder: InputBorder.none,
          isDense: true,
          contentPadding: EdgeInsets.zero,
        ),
      ),
    );
  }
}
