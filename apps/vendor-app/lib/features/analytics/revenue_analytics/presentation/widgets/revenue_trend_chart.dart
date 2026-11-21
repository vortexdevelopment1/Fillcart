import 'package:flutter/material.dart';

/// Interactive chart for Revenue Trend with toggle between Revenue and Orders.
class RevenueTrendChart extends StatefulWidget {
  const RevenueTrendChart({super.key});

  @override
  State<RevenueTrendChart> createState() => _RevenueTrendChartState();
}

class _RevenueTrendChartState extends State<RevenueTrendChart> {
  int _selectedToggle = 0; // 0 = Revenue, 1 = Orders

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Revenue Trend',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF111827),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                color: const Color(0xFFF3F4F6),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  _buildToggleOption(label: 'Revenue', index: 0),
                  _buildToggleOption(label: 'Orders', index: 1),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Container(
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
                          Text('20K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                          Text('15K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                          Text('10K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                          Text('5K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                          Text('0', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Chart Canvas
                    Expanded(
                      child: CustomPaint(
                        painter: _RevenueTrendPainter(isOrders: _selectedToggle == 1),
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
        ),
      ],
    );
  }

  Widget _buildToggleOption({required String label, required int index}) {
    final isSelected = _selectedToggle == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedToggle = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF132A17) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : const Color(0xFF4B5563),
          ),
        ),
      ),
    );
  }
}

class _RevenueTrendPainter extends CustomPainter {
  _RevenueTrendPainter({required this.isOrders});

  final bool isOrders;

  // Normalized values (0 to 1 relative to 20K)
  // Mon: ~6.5K, Tue: ~9.8K, Wed: ~8.8K, Thu: ~13K, Fri: ~11K, Sat: ~13.5K, Sun: ~19K
  final List<double> revenuePoints = const [
    0.325, // Mon
    0.490, // Tue
    0.440, // Wed
    0.650, // Thu
    0.550, // Fri
    0.675, // Sat
    0.950, // Sun
  ];

  final List<double> ordersPoints = const [
    0.280,
    0.420,
    0.390,
    0.580,
    0.480,
    0.610,
    0.850,
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final pointsData = isOrders ? ordersPoints : revenuePoints;
    final double stepX = size.width / (pointsData.length - 1);

    // Draw horizontal dashed grid lines (5 levels)
    final gridPaint = Paint()
      ..color = const Color(0xFFF3F4F6)
      ..strokeWidth = 1;

    for (int i = 0; i < 5; i++) {
      final y = size.height * (i / 4);
      _drawDashedLine(canvas, Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Build curve path
    final points = <Offset>[];
    for (int i = 0; i < pointsData.length; i++) {
      final x = i * stepX;
      final y = size.height - (pointsData[i] * size.height);
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

    // Gradient area under curve
    final fillPath = Path.from(path)
      ..lineTo(points.last.dx, size.height)
      ..lineTo(points.first.dx, size.height)
      ..close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF22C55E).withValues(alpha: 0.22),
          const Color(0xFF22C55E).withValues(alpha: 0.0),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawPath(fillPath, fillPaint);

    // Curve line stroke
    final linePaint = Paint()
      ..color = const Color(0xFF22C55E)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(path, linePaint);

    // Point Markers (white center, green stroke)
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
  bool shouldRepaint(covariant _RevenueTrendPainter oldDelegate) =>
      oldDelegate.isOrders != isOrders;
}
