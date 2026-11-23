import 'package:flutter/material.dart';

/// Mini map preview widget for rider tracking.
class MiniMapPreview extends StatelessWidget {
  const MiniMapPreview({
    super.key,
    this.etaText = 'Arriving in\n4 min',
  });

  final String etaText;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100,
      height: 80,
      decoration: BoxDecoration(
        color: const Color(0xFF233038),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF334155), width: 1),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(11),
        child: Stack(
          children: [
            // Map grid and road styling
            CustomPaint(
              size: const Size(100, 80),
              painter: _MapRoadsPainter(),
            ),
            // Rider destination marker
            const Positioned(
              top: 14,
              right: 18,
              child: Icon(
                Icons.location_on,
                color: Color(0xFFC8F169),
                size: 18,
              ),
            ),
            // Rider Scooter Icon
            Positioned(
              bottom: 16,
              left: 14,
              child: Container(
                width: 18,
                height: 18,
                decoration: const BoxDecoration(
                  color: Color(0xFFC8F169),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.two_wheeler_rounded,
                  size: 12,
                  color: Color(0xFF111827),
                ),
              ),
            ),
            // ETA Badge
            Positioned(
              bottom: 6,
              left: 6,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF111827).withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  etaText,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 8,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                    height: 1.1,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MapRoadsPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final backgroundPaint = Paint()..color = const Color(0xFF28363F);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), backgroundPaint);

    final roadPaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke;

    final secondaryRoadPaint = Paint()
      ..color = const Color(0xFF334155)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final path = Path()
      ..moveTo(0, size.height * 0.7)
      ..lineTo(size.width * 0.4, size.height * 0.5)
      ..lineTo(size.width * 0.7, size.height * 0.2)
      ..lineTo(size.width, size.height * 0.25);
    canvas.drawPath(path, roadPaint);

    final secondaryPath = Path()
      ..moveTo(size.width * 0.4, 0)
      ..lineTo(size.width * 0.4, size.height)
      ..moveTo(0, size.height * 0.3)
      ..lineTo(size.width, size.height * 0.3);
    canvas.drawPath(secondaryPath, secondaryRoadPaint);

    // Green route line
    final routePaint = Paint()
      ..color = const Color(0xFFC8F169).withValues(alpha: 0.7)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    final route = Path()
      ..moveTo(22, size.height - 20)
      ..lineTo(size.width * 0.4, size.height * 0.5)
      ..lineTo(size.width * 0.7, 24);
    canvas.drawPath(route, routePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
