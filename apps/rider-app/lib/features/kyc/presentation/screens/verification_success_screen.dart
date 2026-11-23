import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Screen 2/4 of Verification Suite: Verification Successful (Figma Node 1848:51974).
///
/// Figma Specifications (360 x 800 px):
/// - Background: #FFFFFF (RiderColors.background).
/// - Content Box: Frame 2147227262 at x=33, y=110, width=294, height=309.
/// - Success Checkmark: Reuses the OTP verified checkmark animation.
/// - Gap to title: 24 px.
/// - Title: "Verification Successful" (Poppins SemiBold 20 px, #000000, height: 30 px).
/// - Gap to subtitle: 8 px.
/// - Subtitle: "You're ready to ride. Accept your first\n delivery and start earning."
///   (Poppins Regular 12 px, #5B5B5B, height: 1.5, line-break preserved).
///
/// Navigation & Interaction:
/// - Progresses to /kyc/permissions after 2.5 seconds OR when tapping anywhere on the screen.
class VerificationSuccessScreen extends StatefulWidget {
  const VerificationSuccessScreen({super.key});

  @override
  State<VerificationSuccessScreen> createState() =>
      _VerificationSuccessScreenState();
}

class _VerificationSuccessScreenState extends State<VerificationSuccessScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _checkmarkAnimation;
  Timer? _autoTransitionTimer;

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

    // Auto-proceed to permissions after 2.5 seconds for testing flow
    _autoTransitionTimer = Timer(const Duration(milliseconds: 2500), () {
      if (mounted) {
        _proceed();
      }
    });
  }

  void _proceed() {
    _autoTransitionTimer?.cancel();
    if (mounted) {
      context.go('/kyc/permissions');
    }
  }

  @override
  void dispose() {
    _autoTransitionTimer?.cancel();
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
          child: GestureDetector(
            key: const Key('verification_success_tap_target'),
            behavior: HitTestBehavior.opaque,
            onTap: _proceed,
            child: SizedBox.expand(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Reused Animated Green Checkmark Box from OTP Success
                    ScaleTransition(
                      scale: _scaleAnimation,
                      child: Container(
                        key: const Key('verification_success_icon_container'),
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

                    // Exact Figma gap: 24 px
                    const SizedBox(height: 24),

                    // Title: "Verification Successful" (Poppins SemiBold 20px, height: 30px)
                    SizedBox(
                      height: 30,
                      child: Text(
                        'Verification Successful',
                        key: const Key('verification_success_title'),
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF000000),
                          letterSpacing: -0.2,
                        ),
                      ),
                    ),

                    // Exact Figma gap: 8 px
                    const SizedBox(height: 8),

                    // Subtitle: (Poppins Regular 12px, #5B5B5B, height: 1.5)
                    SizedBox(
                      height: 36,
                      child: Text(
                        "You're ready to ride. Accept your first\n delivery and start earning.",
                        key: const Key('verification_success_subtitle'),
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF5B5B5B),
                          height: 1.5,
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

/// Custom painter that draws the animated checkmark path (identical to OTP success).
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
