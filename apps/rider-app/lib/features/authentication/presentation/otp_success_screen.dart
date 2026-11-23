import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

/// Screen displayed immediately after successful OTP verification.
///
/// Implements the approved Figma update:
/// - Light grey background.
/// - Green rounded-square container with animated white checkmark.
/// - Heading: "OTP Verified Successfully!"
/// - Helper: "Your mobile number has been verified successfully."
/// - 5-second automatic progression to Vehicle Details (`/kyc/vehicle`).
/// - Blocks back navigation.
class OtpSuccessScreen extends StatefulWidget {
  final Duration displayDuration;

  const OtpSuccessScreen({
    super.key,
    this.displayDuration = const Duration(seconds: 5),
  });

  @override
  State<OtpSuccessScreen> createState() => _OtpSuccessScreenState();
}

class _OtpSuccessScreenState extends State<OtpSuccessScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _checkmarkAnimation;
  late final Animation<double> _fadeAnimation;
  late final Animation<Offset> _slideAnimation;

  Timer? _timer;

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

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.35, 0.85, curve: Curves.easeIn),
      ),
    );

    _slideAnimation =
        Tween<Offset>(begin: const Offset(0.0, 0.2), end: Offset.zero).animate(
          CurvedAnimation(
            parent: _controller,
            curve: const Interval(0.35, 0.85, curve: Curves.easeOutCubic),
          ),
        );

    _controller.forward();

    _timer = Timer(widget.displayDuration, _onTimerComplete);
  }

  void _onTimerComplete() {
    if (mounted) {
      context.replace('/kyc/vehicle');
    }
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
        backgroundColor: const Color(0xFFF2F2F2),
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(flex: 2),

                  // Animated Green Icon Box
                  ScaleTransition(
                    scale: _scaleAnimation,
                    child: Container(
                      key: const Key('otp_success_icon_container'),
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

                  const SizedBox(height: 36),

                  // Animated Text Group
                  SlideTransition(
                    position: _slideAnimation,
                    child: FadeTransition(
                      opacity: _fadeAnimation,
                      child: Column(
                        children: [
                          Text(
                            'OTP Verified Successfully!',
                            key: const Key('otp_success_title'),
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF000000),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Your mobile number has been verified successfully.',
                            key: const Key('otp_success_subtitle'),
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF5B5B5B),
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const Spacer(flex: 3),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Custom painter that draws an animated checkmark path.
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
