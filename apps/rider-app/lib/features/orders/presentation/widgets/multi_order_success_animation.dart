import 'package:flutter/material.dart';

/// Reusable animated circular success badge and checkmark for Multi-Order
/// confirmation screens (`Payment Received` node `1569:60680` and
/// `Delivery Completed` node `1569:60724`, both using a `150 x 140` slot).
class MultiOrderSuccessAnimation extends StatefulWidget {
  final double width;
  final double height;
  final Duration duration;
  final Color badgeColor;
  final Color haloColor;
  final Color checkColor;
  final bool animate;

  const MultiOrderSuccessAnimation({
    super.key,
    this.width = 150,
    this.height = 140,
    this.duration = const Duration(milliseconds: 900),
    this.badgeColor = const Color(0xFF22C55E),
    this.haloColor = const Color(0xFFE7F9E8),
    this.checkColor = Colors.white,
    this.animate = true,
  });

  @override
  State<MultiOrderSuccessAnimation> createState() =>
      _MultiOrderSuccessAnimationState();
}

class _MultiOrderSuccessAnimationState extends State<MultiOrderSuccessAnimation>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _haloScaleAnimation;
  late final Animation<double> _badgeScaleAnimation;
  late final Animation<double> _checkmarkProgress;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );

    _haloScaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.0, 0.50, curve: Curves.easeOutCubic),
      ),
    );

    _badgeScaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.08, 0.58, curve: Curves.easeOutBack),
      ),
    );

    _checkmarkProgress = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.42, 1.0, curve: Curves.easeInOutCubic),
      ),
    );

    if (widget.animate) {
      _controller.forward();
    } else {
      _controller.value = 1.0;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final shortestSide =
        widget.width < widget.height ? widget.width : widget.height;
    final haloDiameter = shortestSide * 0.88;
    final badgeDiameter = shortestSide * 0.70;
    final strokeWidth = (badgeDiameter * 0.075).clamp(5.0, 9.0);

    return SizedBox(
      key: const Key('multi_order_success_animation'),
      width: widget.width,
      height: widget.height,
      child: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            ScaleTransition(
              scale: _haloScaleAnimation,
              child: Container(
                width: haloDiameter,
                height: haloDiameter,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.haloColor,
                ),
              ),
            ),
            ScaleTransition(
              scale: _badgeScaleAnimation,
              child: Container(
                key: const Key('multi_order_success_badge'),
                width: badgeDiameter,
                height: badgeDiameter,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.badgeColor,
                ),
                child: AnimatedBuilder(
                  animation: _checkmarkProgress,
                  builder: (context, _) {
                    return CustomPaint(
                      painter: _SuccessCheckmarkPainter(
                        progress: _checkmarkProgress.value,
                        color: widget.checkColor,
                        strokeWidth: strokeWidth,
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SuccessCheckmarkPainter extends CustomPainter {
  final double progress;
  final Color color;
  final double strokeWidth;

  const _SuccessCheckmarkPainter({
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

    final path = Path()
      ..moveTo(size.width * 0.28, size.height * 0.52)
      ..lineTo(size.width * 0.44, size.height * 0.68)
      ..lineTo(size.width * 0.73, size.height * 0.36);

    final metrics = path.computeMetrics().toList();
    if (metrics.isEmpty) return;

    final metric = metrics.first;
    final extracted = metric.extractPath(
      0.0,
      metric.length * progress.clamp(0.0, 1.0),
    );
    canvas.drawPath(extracted, paint);
  }

  @override
  bool shouldRepaint(covariant _SuccessCheckmarkPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
