import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Decorative top background shapes and 3D golden spheres for walkthrough slides.
class WalkthroughSlideDecoration extends StatelessWidget {
  final int slideIndex;

  const WalkthroughSlideDecoration({super.key, required this.slideIndex});

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: IgnorePointer(
        child: CustomPaint(
          painter: _SlideDecorationPainter(slideIndex: slideIndex),
        ),
      ),
    );
  }
}

class _SlideDecorationPainter extends CustomPainter {
  final int slideIndex;

  const _SlideDecorationPainter({required this.slideIndex});

  @override
  void paint(Canvas canvas, Size size) {
    switch (slideIndex) {
      case 0:
        _paintSlide0(canvas, size);
        break;
      case 1:
        _paintSlide1(canvas, size);
        break;
      case 2:
      default:
        _paintSlide2(canvas, size);
        break;
    }

    // Common 3D golden spheres across slides
    _drawUpperGoldSphere(canvas, size);
    _drawLowerGoldSphere(canvas, size);
  }

  /// Slide 0: Soft cream yellow blob on top-left, vivid magenta arc on top-right.
  void _paintSlide0(Canvas canvas, Size size) {
    // 1. Top-left soft cream yellow blob
    final yellowPaint = Paint()
      ..color = const Color(0xFFFEF0C0)
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width * 0.28, 0)
      ..cubicTo(
        size.width * 0.26,
        size.height * 0.12,
        size.width * 0.22,
        size.height * 0.22,
        0,
        size.height * 0.24,
      )
      ..close();
    canvas.drawPath(path, yellowPaint);

    // 2. Top-right magenta ring arc
    final magentaPaint = Paint()
      ..color = const Color(0xFFFA3EA4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.11
      ..strokeCap = StrokeCap.round;

    final arcRect = Rect.fromCircle(
      center: Offset(size.width * 1.05, size.height * 0.14),
      radius: size.width * 0.27,
    );
    canvas.drawArc(arcRect, math.pi * 0.52, math.pi * 0.82, false, magentaPaint);
  }

  /// Slide 1: Soft yellow blob on top-left, rich purple arc on top-right.
  void _paintSlide1(Canvas canvas, Size size) {
    // 1. Top-left soft yellow blob
    final yellowPaint = Paint()
      ..color = const Color(0xFFFEE38D)
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width * 0.26, 0)
      ..cubicTo(
        size.width * 0.28,
        size.height * 0.10,
        size.width * 0.20,
        size.height * 0.20,
        0,
        size.height * 0.22,
      )
      ..close();
    canvas.drawPath(path, yellowPaint);

    // 2. Top-right purple ring arc
    final purplePaint = Paint()
      ..color = const Color(0xFF784AFE)
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.11
      ..strokeCap = StrokeCap.round;

    final arcRect = Rect.fromCircle(
      center: Offset(size.width * 1.05, size.height * 0.14),
      radius: size.width * 0.27,
    );
    canvas.drawArc(arcRect, math.pi * 0.52, math.pi * 0.82, false, purplePaint);
  }

  /// Slide 2: Lime-green ring arc on top-left, peach organic blob on top-right.
  void _paintSlide2(Canvas canvas, Size size) {
    // 1. Top-left lime-green ring arc
    final limePaint = Paint()
      ..color = const Color(0xFFE2F955)
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.11
      ..strokeCap = StrokeCap.round;

    final arcRect = Rect.fromCircle(
      center: Offset(-size.width * 0.05, size.height * 0.14),
      radius: size.width * 0.27,
    );
    canvas.drawArc(arcRect, -math.pi * 0.32, math.pi * 0.82, false, limePaint);

    // 2. Top-right peach organic blob
    final peachPaint = Paint()
      ..color = const Color(0xFFEDA570)
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(size.width, 0)
      ..lineTo(size.width * 0.72, 0)
      ..cubicTo(
        size.width * 0.74,
        size.height * 0.08,
        size.width * 0.82,
        size.height * 0.19,
        size.width,
        size.height * 0.20,
      )
      ..close();
    canvas.drawPath(path, peachPaint);
  }

  /// Upper 3D golden sphere (near top-left shape)
  void _drawUpperGoldSphere(Canvas canvas, Size size) {
    final center = Offset(size.width * 0.23, size.height * 0.20);
    final radius = size.width * 0.028;
    _draw3DGoldSphere(canvas, center, radius);
  }

  /// Lower 3D golden sphere (just below illustration on right)
  void _drawLowerGoldSphere(Canvas canvas, Size size) {
    final center = Offset(size.width * 0.835, size.height * 0.59);
    final radius = size.width * 0.024;
    _draw3DGoldSphere(canvas, center, radius);
  }

  /// Renders a photorealistic 3D golden sphere matching the Figma reference.
  void _draw3DGoldSphere(Canvas canvas, Offset center, double radius) {
    final shader = RadialGradient(
      center: const Alignment(-0.35, -0.35),
      radius: 0.9,
      colors: const [
        Color(0xFFFDE885), // highlight
        Color(0xFFDCA414), // golden mid-tone
        Color(0xFFA67800), // deep shadow tone
      ],
      stops: const [0.0, 0.65, 1.0],
    ).createShader(Rect.fromCircle(center: center, radius: radius));

    final paint = Paint()
      ..shader = shader
      ..style = PaintingStyle.fill;

    canvas.drawCircle(center, radius, paint);
  }

  @override
  bool shouldRepaint(covariant _SlideDecorationPainter oldDelegate) =>
      oldDelegate.slideIndex != slideIndex;
}

/// Static bottom-left soft cream wave present across all walkthrough screens.
class WalkthroughBottomWave extends StatelessWidget {
  const WalkthroughBottomWave({super.key});

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 0,
      left: 0,
      child: IgnorePointer(
        child: CustomPaint(
          size: Size(
            MediaQuery.sizeOf(context).width * 0.5,
            MediaQuery.sizeOf(context).height * 0.22,
          ),
          painter: _BottomWavePainter(),
        ),
      ),
    );
  }
}

class _BottomWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final wavePaint = Paint()
      ..color = const Color(0xFFFFF6D8)
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, size.height)
      ..lineTo(0, size.height * 0.22)
      ..cubicTo(
        size.width * 0.20,
        size.height * 0.35,
        size.width * 0.65,
        size.height * 0.70,
        size.width * 0.88,
        size.height,
      )
      ..close();

    canvas.drawPath(path, wavePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
