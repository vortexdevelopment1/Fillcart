import 'package:flutter/material.dart';

/// Smooth spline line chart for Product Sales Trend with gradient fill.
class ProductSalesTrendChart extends StatelessWidget {
  const ProductSalesTrendChart({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          SizedBox(
            height: 180,
            child: Row(
              children: [
                // Y-Axis Labels
                const SizedBox(
                  width: 34,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('2.5K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                      Text('2.0K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                      Text('1.5K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                      Text('1.0K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                      Text('500', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                      Text('0', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                // Chart Area
                Expanded(
                  child: CustomPaint(
                    painter: _ProductTrendPainter(),
                    size: Size.infinite,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // X-Axis Day Labels
          const Padding(
            padding: EdgeInsets.only(left: 42),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Mon', style: TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
                Text('Tue', style: TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
                Text('Wed', style: TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
                Text('Thu', style: TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
                Text('Fri', style: TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
                Text('Sat', style: TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
                Text('Sun', style: TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ProductTrendPainter extends CustomPainter {
  // Normalized points (0 to 1) for [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  // Values: ~[250, 900, 750, 1250, 1650, 1600, 1950] relative to 2500 max
  final List<double> normalizedPoints = const [
    0.10, // Mon ~250
    0.36, // Tue ~900
    0.30, // Wed ~750
    0.50, // Thu ~1250
    0.66, // Fri ~1650
    0.64, // Sat ~1600
    0.78, // Sun ~1950
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final double stepX = size.width / (normalizedPoints.length - 1);

    // Draw horizontal dashed grid lines
    final gridPaint = Paint()
      ..color = const Color(0xFFF3F4F6)
      ..strokeWidth = 1;

    for (int i = 0; i < 6; i++) {
      final y = size.height * (i / 5);
      _drawDashedLine(canvas, Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Build spline path
    final points = <Offset>[];
    for (int i = 0; i < normalizedPoints.length; i++) {
      final x = i * stepX;
      final y = size.height - (normalizedPoints[i] * size.height);
      points.add(Offset(x, y));
    }

    final path = Path();
    path.moveTo(points.first.dx, points.first.dy);

    for (int i = 0; i < points.length - 1; i++) {
      final p0 = points[i];
      final p1 = points[i + 1];
      final controlPointX = (p0.dx + p1.dx) / 2;
      path.cubicTo(
        controlPointX,
        p0.dy,
        controlPointX,
        p1.dy,
        p1.dx,
        p1.dy,
      );
    }

    // Area fill gradient
    final fillPath = Path.from(path)
      ..lineTo(points.last.dx, size.height)
      ..lineTo(points.first.dx, size.height)
      ..close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF22C55E).withValues(alpha: 0.25),
          const Color(0xFF22C55E).withValues(alpha: 0.0),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawPath(fillPath, fillPaint);

    // Main line stroke
    final linePaint = Paint()
      ..color = const Color(0xFF22C55E)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(path, linePaint);

    // Circular point markers (white inner, green border)
    final dotOuterPaint = Paint()
      ..color = const Color(0xFF22C55E)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    final dotInnerPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    for (final p in points) {
      canvas.drawCircle(p, 4.5, dotInnerPaint);
      canvas.drawCircle(p, 4.5, dotOuterPaint);
    }
  }

  void _drawDashedLine(Canvas canvas, Offset p1, Offset p2, Paint paint) {
    const dashWidth = 4.0;
    const dashSpace = 4.0;
    double startX = p1.dx;
    while (startX < p2.dx) {
      canvas.drawLine(
        Offset(startX, p1.dy),
        Offset(startX + dashWidth, p1.dy),
        paint,
      );
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
