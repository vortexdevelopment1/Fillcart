import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Screen displayed immediately after successful Aadhaar OTP verification (Figma Node 2164:20238).
///
/// Specifications (360 x 800 px):
/// - Background: Pure white (#FFFFFF).
/// - Checkmark Box: 104 x 104 px, #22C55E, corner radius 20 px.
/// - Reuses animated checkmark painter from OtpSuccessScreen.
/// - Top margin: 148 px.
/// - Heading: "Aadhaar Verify Success!" (Poppins SemiBold 20 px, line height 30 px, black).
/// - Subtitle: "Your aadhaar verification is successfully verified." (Poppins Regular 13 px, #5B5B5B, line height 1.45, max width 290 px).
/// - Duration: Exactly 5 seconds, then replaces route with /kyc/driving-license.
/// - Back navigation blocked with PopScope(canPop: false).
class AadhaarVerifySuccessScreen extends StatefulWidget {
  final Duration displayDuration;

  const AadhaarVerifySuccessScreen({
    super.key,
    this.displayDuration = const Duration(seconds: 5),
  });

  @override
  State<AadhaarVerifySuccessScreen> createState() =>
      _AadhaarVerifySuccessScreenState();
}

class _AadhaarVerifySuccessScreenState extends State<AadhaarVerifySuccessScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _checkmarkAnimation;
  Timer? _timer;
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.55, curve: Curves.easeOutBack),
      ),
    );

    _checkmarkAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.40, 1.0, curve: Curves.easeInOutCubic),
      ),
    );

    _controller.forward();

    _timer = Timer(widget.displayDuration, _onTimerComplete);
  }

  void _onTimerComplete() {
    if (_hasNavigated || !mounted) return;
    _hasNavigated = true;
    context.replace('/kyc/driving-license');
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: RiderColors.background,
        body: SafeArea(
          child: SizedBox.expand(
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Exact top margin: 148 px
                    const SizedBox(height: 148),

                    // Animated Checkmark Box (104 x 104 px, radius 20 px)
                    ScaleTransition(
                      scale: _scaleAnimation,
                      child: Container(
                        key: const Key('aadhaar_success_icon_container'),
                        width: 104,
                        height: 104,
                        decoration: BoxDecoration(
                          color: const Color(0xFF22C55E),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: AnimatedBuilder(
                          animation: _checkmarkAnimation,
                          builder: (context, child) {
                            return CustomPaint(
                              painter: _CheckmarkPainter(
                                progress: _checkmarkAnimation.value,
                                color: Colors.white,
                                strokeWidth: 7.5,
                              ),
                            );
                          },
                        ),
                      ),
                    ),

                    // Gap after checkmark: 32 px
                    const SizedBox(height: 32),

                    // Heading: "Aadhaar Verify Success!" (Poppins SemiBold 20px, height 30px)
                    SizedBox(
                      height: 30,
                      child: Text(
                        'Aadhaar Verify Success!',
                        key: const Key('aadhaar_success_heading'),
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF000000),
                          letterSpacing: -0.2,
                        ),
                      ),
                    ),

                    // Gap after heading: 8 px
                    const SizedBox(height: 8),

                    // Subtitle: (Poppins Regular 13px, #5B5B5B, height 1.45, max width 290 px)
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 290),
                      child: Text(
                        'Your aadhaar verification is successfully verified.',
                        key: const Key('aadhaar_success_subtitle'),
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF5B5B5B),
                          height: 1.45,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Custom painter that draws the animated checkmark path (reused from OTP success).
class _CheckmarkPainter extends CustomPainter {
  final double progress;
  final Color color;
  final double strokeWidth;

  const _CheckmarkPainter({
    required this.progress,
    required this.color,
    required this.strokeWidth,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (progress <= 0.0) return;

    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final path = Path();
    path.moveTo(size.width * 0.28, size.height * 0.50);
    path.lineTo(size.width * 0.44, size.height * 0.67);
    path.lineTo(size.width * 0.73, size.height * 0.35);

    final pathMetrics = path.computeMetrics().toList();
    if (pathMetrics.isEmpty) return;

    final totalLength = pathMetrics.first.length;
    final currentLength = totalLength * progress.clamp(0.0, 1.0);
    final extractedPath = pathMetrics.first.extractPath(0.0, currentLength);

    canvas.drawPath(extractedPath, paint);
  }

  @override
  bool shouldRepaint(covariant _CheckmarkPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
