import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:fillcart_customer/features/authentication/presentation/screens/enter_otp_screen.dart';
import 'package:fillcart_customer/features/authentication/presentation/screens/sign_up_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Customer Login Screen accurately matching Figma design.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  final FocusNode _phoneFocusNode = FocusNode();
  bool _isPhoneFocused = false;

  @override
  void initState() {
    super.initState();
    _phoneFocusNode.addListener(_onFocusChange);
  }

  void _onFocusChange() {
    setState(() {
      _isPhoneFocused = _phoneFocusNode.hasFocus;
    });
  }

  @override
  void dispose() {
    _phoneFocusNode.removeListener(_onFocusChange);
    _phoneFocusNode.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _onGetOtp() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => EnterOtpScreen(
          phoneNumber: _phoneController.text.trim().isEmpty
              ? '+91- 1215656466'
              : _phoneController.text.trim(),
        ),
      ),
    );
  }

  void _onSignUp() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const SignUpScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: Colors.black,
        resizeToAvoidBottomInset: true,
        body: Stack(
          children: [
            // Clean Background Image (no status bar, no baked-in login component)
            Positioned.fill(
              child: Image.asset(
                AppAssets.loginBg,
                fit: BoxFit.cover,
                alignment: Alignment.topCenter,
              ),
            ),

            // Top gradient overlay for text readability
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              height: 240,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.55),
                      Colors.black.withValues(alpha: 0.25),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

            // Main scrollable content preventing keyboard overflow
            Positioned.fill(
              child: SafeArea(
                child: CustomScrollView(
                  physics: const ClampingScrollPhysics(),
                  slivers: [
                    SliverFillRemaining(
                      hasScrollBody: false,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 60),

                          // Headline: "Everything You Need. One Trusted Platform."
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 22),
                            child: Text.rich(
                              TextSpan(
                                style: const TextStyle(
                                  fontSize: 34,
                                  fontWeight: FontWeight.w800,
                                  height: 1.22,
                                  letterSpacing: -0.6,
                                  fontFamily: 'Roboto',
                                ),
                                children: const [
                                  TextSpan(
                                    text: 'Everything You\nNeed. One Trusted\n',
                                    style: TextStyle(color: Colors.white),
                                  ),
                                  TextSpan(
                                    text: 'Platform.',
                                    style: TextStyle(color: Color(0xFFF5B014)),
                                  ),
                                ],
                              ),
                            ),
                          ),

                          const Spacer(),

                          // Single authoritative White Login Card
                          Padding(
                            padding: const EdgeInsets.only(
                              left: 18,
                              right: 18,
                              bottom: 18,
                            ),
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.fromLTRB(20, 22, 20, 18),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(32),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.12),
                                    blurRadius: 24,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Title: Login
                                  const Text(
                                    'Login',
                                    style: TextStyle(
                                      fontSize: 26,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFF212121),
                                      letterSpacing: -0.4,
                                    ),
                                  ),

                                  const SizedBox(height: 16),

                                  // Label: Mobile *
                                  Text.rich(
                                    TextSpan(
                                      text: 'Mobile ',
                                      style: const TextStyle(
                                        fontSize: 15.5,
                                        fontWeight: FontWeight.w500,
                                        color: Color(0xFF262626),
                                      ),
                                      children: const [
                                        TextSpan(
                                          text: '*',
                                          style: TextStyle(
                                            color: Color(0xFFE53935),
                                            fontWeight: FontWeight.w700,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),

                                  const SizedBox(height: 8),

                                  // Phone number input field matching Figma borders and states
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    height: 52,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF3F4F6),
                                      borderRadius: BorderRadius.circular(14),
                                      border: Border.all(
                                        color: _isPhoneFocused
                                            ? const Color(0xFFF5B014)
                                            : const Color(0xFFE5E7EB),
                                        width: _isPhoneFocused ? 1.5 : 1.0,
                                      ),
                                    ),
                                    alignment: Alignment.centerLeft,
                                    padding: const EdgeInsets.symmetric(horizontal: 16),
                                    child: TextField(
                                      controller: _phoneController,
                                      focusNode: _phoneFocusNode,
                                      keyboardType: TextInputType.phone,
                                      style: const TextStyle(
                                        fontSize: 15.5,
                                        fontWeight: FontWeight.w500,
                                        color: Color(0xFF212121),
                                      ),
                                      decoration: const InputDecoration(
                                        hintText: 'Enter Phone number',
                                        hintStyle: TextStyle(
                                          color: Color(0xFF9E9E9E),
                                          fontSize: 15.5,
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
                                  ),

                                  const SizedBox(height: 18),

                                  // Get OTP Button with rounded corners & shadow
                                  GestureDetector(
                                    onTap: _onGetOtp,
                                    behavior: HitTestBehavior.opaque,
                                    child: Container(
                                      height: 52,
                                      width: double.infinity,
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFF5B014),
                                        borderRadius: BorderRadius.circular(14),
                                        boxShadow: [
                                          BoxShadow(
                                            color: const Color(0xFFF5B014)
                                                .withValues(alpha: 0.35),
                                            blurRadius: 12,
                                            offset: const Offset(0, 4),
                                          ),
                                        ],
                                      ),
                                      alignment: Alignment.center,
                                      child: const Text(
                                        'Get OTP',
                                        style: TextStyle(
                                          fontSize: 16.5,
                                          fontWeight: FontWeight.w700,
                                          color: Colors.black,
                                          letterSpacing: -0.2,
                                        ),
                                      ),
                                    ),
                                  ),

                                  const SizedBox(height: 18),

                                  // Divider with "Or sign in with"
                                  const Row(
                                    children: [
                                      Expanded(
                                        child: Divider(
                                          color: Color(0xFFDED8F3),
                                          thickness: 1,
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsets.symmetric(horizontal: 12),
                                        child: Text(
                                          'Or sign in with',
                                          style: TextStyle(
                                            fontSize: 13.5,
                                            fontWeight: FontWeight.w400,
                                            color: Color(0xFF8E8EA9),
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Divider(
                                          color: Color(0xFFDED8F3),
                                          thickness: 1,
                                        ),
                                      ),
                                    ],
                                  ),

                                  const SizedBox(height: 16),

                                  // Social Login Buttons (Apple & Google)
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      GestureDetector(
                                        onTap: _onGetOtp,
                                        behavior: HitTestBehavior.opaque,
                                        child: Image.asset(
                                          AppAssets.appleIcon,
                                          width: 62,
                                          height: 46,
                                          fit: BoxFit.contain,
                                        ),
                                      ),
                                      const SizedBox(width: 20),
                                      GestureDetector(
                                        onTap: _onGetOtp,
                                        behavior: HitTestBehavior.opaque,
                                        child: Image.asset(
                                          AppAssets.googleIcon,
                                          width: 62,
                                          height: 46,
                                          fit: BoxFit.contain,
                                        ),
                                      ),
                                    ],
                                  ),

                                  const SizedBox(height: 16),

                                  // Footer: No account? Sign up
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Text(
                                        'No account? ',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Color(0xFF424242),
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: _onSignUp,
                                        behavior: HitTestBehavior.opaque,
                                        child: const Text(
                                          'Sign up',
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: Color(0xFF6C3EF8),
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
