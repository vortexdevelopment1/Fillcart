import 'package:flutter/material.dart';

/// Dark Hero card displaying Total Sales with smooth line graph wave.
class SalesHeroCard extends StatelessWidget {
  const SalesHeroCard({
    super.key,
    required this.amount,
    required this.growthRate,
    this.onTap,
  });

  final String amount;
  final String growthRate;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        height: 100,
        width: double.infinity,
        decoration: BoxDecoration(
          color: const Color(0xFF1E2124),
          borderRadius: BorderRadius.circular(20),
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          children: [
            // Background bezier wave chart
            Positioned.fill(
              child: CustomPaint(
                painter: _WaveChartPainter(),
              ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Total Sales',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      color: Color(0xFF9CA3AF),
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Text(
                        amount,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          color: Colors.white,
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFC8F169).withValues(alpha: 0.18),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          growthRate,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            color: Color(0xFFC8F169),
                            fontSize: 11.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _WaveChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final path = Path();
    final fillPath = Path();

    // Start wave from mid-bottom
    final startX = size.width * 0.35;
    final startY = size.height * 0.98;

    path.moveTo(startX, startY);
    fillPath.moveTo(startX, size.height);
    fillPath.lineTo(startX, startY);

    final cp1x = size.width * 0.52;
    final cp1y = size.height * 0.70;
    final p1x = size.width * 0.65;
    final p1y = size.height * 0.82;

    path.quadraticBezierTo(cp1x, cp1y, p1x, p1y);
    fillPath.quadraticBezierTo(cp1x, cp1y, p1x, p1y);

    final cp2x = size.width * 0.82;
    final cp2y = size.height * 0.92;
    final endX = size.width;
    final endY = size.height * 0.28;

    path.quadraticBezierTo(cp2x, cp2y, endX, endY);
    fillPath.quadraticBezierTo(cp2x, cp2y, endX, endY);

    fillPath.lineTo(size.width, size.height);
    fillPath.close();

    // Fill paint
    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF22C55E).withValues(alpha: 0.35),
          const Color(0xFF22C55E).withValues(alpha: 0.0),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawPath(fillPath, fillPaint);

    // Stroke paint
    final strokePaint = Paint()
      ..color = const Color(0xFF4ADE80)
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawPath(path, strokePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
