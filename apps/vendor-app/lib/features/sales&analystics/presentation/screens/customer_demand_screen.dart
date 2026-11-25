import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';

/// Screen displaying customer demand, demand trend, segment breakdown, and buying time distribution (Image 2).
class CustomerDemandScreen extends StatefulWidget {
  const CustomerDemandScreen({
    super.key,
    this.productName = 'Amul Taaza Milk (1 L)',
    this.sku = 'SKU: AMU-MLK-1L',
    this.price = '₹68',
    this.imagePath = 'assets/cardsicon/amul_milk.png',
  });

  final String productName;
  final String sku;
  final String price;
  final String imagePath;

  @override
  State<CustomerDemandScreen> createState() => _CustomerDemandScreenState();
}

class _CustomerDemandScreenState extends State<CustomerDemandScreen> {
  String _selectedDateRange = 'Last 7 Days';

  final List<String> _dateRangeOptions = const [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'Last 30 Days',
    'This Month',
  ];

  void _showDateRangePicker() {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                margin: const EdgeInsets.only(top: 10, bottom: 8),
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Select Date Range',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF111827),
                    ),
                  ),
                ),
              ),
              ..._dateRangeOptions.map((range) {
                final isSelected = range == _selectedDateRange;
                return ListTile(
                  title: Text(
                    range,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14.5,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                      color: isSelected ? const Color(0xFF111827) : const Color(0xFF4B5563),
                    ),
                  ),
                  trailing: isSelected
                      ? const Icon(Icons.check_rounded, color: Color(0xFF10B981), size: 20)
                      : null,
                  onTap: () {
                    setState(() => _selectedDateRange = range);
                    Navigator.pop(context);
                  },
                );
              }),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF0F0F0);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar with Back Button & Screen Title
              Row(
                children: [
                  InkWell(
                    onTap: () => Navigator.maybePop(context),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Center(
                        child: SvgPicture.asset(
                          AppAssets.svgBackArrow,
                          width: 20,
                          height: 20,
                          colorFilter: const ColorFilter.mode(
                            Color(0xFF111827),
                            BlendMode.srcIn,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Customer Demand',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF111827),
                      height: 1.4,
                      letterSpacing: 0,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Date Filter Dropdown
              InkWell(
                onTap: _showDateRangePicker,
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  height: 44,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          SvgPicture.asset(
                            AppAssets.svgCalendar,
                            width: 16,
                            height: 16,
                            colorFilter: const ColorFilter.mode(
                              Color(0xFF4B5563),
                              BlendMode.srcIn,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _selectedDateRange,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ],
                      ),
                      const Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: Color(0xFF9CA3AF),
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Product Info Header Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Image.asset(
                        widget.imagePath,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(
                          Icons.local_drink_rounded,
                          color: Color(0xFF3B82F6),
                          size: 30,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.productName,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 15.5,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            widget.sku,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              color: Color(0xFF9CA3AF),
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            widget.price,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Order Summary Section
              const Text(
                'Order Summary',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),

              // 4-Column Metric Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Row(
                  children: [
                    Expanded(
                      child: _DemandSummaryColumn(
                        icon: Icons.trending_up_rounded,
                        iconColor: Color(0xFF10B981),
                        iconBgColor: Color(0xFFECFDF5),
                        value: 'High',
                        label: 'Demand Level',
                      ),
                    ),
                    _VerticalDivider(),
                    Expanded(
                      child: _DemandSummaryColumn(
                        icon: Icons.people_outline_rounded,
                        iconColor: Color(0xFF8B5CF6),
                        iconBgColor: Color(0xFFFAF5FF),
                        value: '236',
                        label: 'Total Views',
                      ),
                    ),
                    _VerticalDivider(),
                    Expanded(
                      child: _DemandSummaryColumn(
                        icon: Icons.shopping_cart_outlined,
                        iconColor: Color(0xFF14B8A6),
                        iconBgColor: Color(0xFFF0FDFA),
                        value: '126',
                        label: 'Add to Cart',
                      ),
                    ),
                    _VerticalDivider(),
                    Expanded(
                      child: _DemandSummaryColumn(
                        icon: Icons.shopping_bag_outlined,
                        iconColor: Color(0xFFF59E0B),
                        iconBgColor: Color(0xFFFFFBEB),
                        value: '48',
                        label: 'Orders',
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // Demand Trend Section
              const Text(
                'Demand Trend',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),

              // Line Chart Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  children: [
                    SizedBox(
                      height: 180,
                      child: Row(
                        children: [
                          // Y-Axis Labels
                          const SizedBox(
                            width: 28,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('250', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('200', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('150', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('100', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('50', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('0', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                              ],
                            ),
                          ),
                          const SizedBox(width: 6),

                          // Chart Area
                          Expanded(
                            child: CustomPaint(
                              painter: _DemandTrendChartPainter(),
                              size: Size.infinite,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // X-Axis Day Labels
                    const Padding(
                      padding: EdgeInsets.only(left: 34),
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
              const SizedBox(height: 22),

              // Demand by Segment Section
              const Text(
                'Demand by Segment',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),

              // Donut Chart Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Column(
                  children: [
                    // Donut with center text
                    SizedBox(
                      width: 140,
                      height: 140,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          CustomPaint(
                            size: Size(140, 140),
                            painter: _SegmentDonutPainter(),
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                '126',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF111827),
                                ),
                              ),
                              Text(
                                'Units',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 12,
                                  color: Color(0xFF6B7280),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    SizedBox(height: 20),

                    // Segment Breakdown Legend
                    _SegmentLegendRow(
                      color: Color(0xFF10B981),
                      label: 'Regular Buyer',
                      percentage: '48% (60)',
                    ),
                    SizedBox(height: 8),
                    _SegmentLegendRow(
                      color: Color(0xFF3B82F6),
                      label: 'New Customer',
                      percentage: '26% (33)',
                    ),
                    SizedBox(height: 8),
                    _SegmentLegendRow(
                      color: Color(0xFFF59E0B),
                      label: 'Subscription Users',
                      percentage: '16% (20)',
                    ),
                    SizedBox(height: 8),
                    _SegmentLegendRow(
                      color: Color(0xFFA855F7),
                      label: 'Other Customers',
                      percentage: '10% (13)',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // Top Buying Time Section
              const Text(
                'Top Buying Time',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),

              // Bar Chart Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Column(
                  children: [
                    SizedBox(
                      height: 180,
                      child: Row(
                        children: [
                          // Y-Axis Labels
                          SizedBox(
                            width: 24,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('40', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('30', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('20', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('10', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                                Text('0', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                              ],
                            ),
                          ),
                          SizedBox(width: 8),

                          // Bars Area
                          Expanded(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                _TimeBar(label: '8–11 AM', value: 12, maxVal: 40, isPeak: false),
                                _TimeBar(label: '11–2 PM', value: 18, maxVal: 40, isPeak: false),
                                _TimeBar(label: '2–5 PM', value: 24, maxVal: 40, isPeak: false),
                                _TimeBar(label: '5–8 PM', value: 36, maxVal: 40, isPeak: true),
                                _TimeBar(label: '8–11 PM', value: 20, maxVal: 40, isPeak: false),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DemandSummaryColumn extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color iconBgColor;
  final String value;
  final String label;

  const _DemandSummaryColumn({
    required this.icon,
    required this.iconColor,
    required this.iconBgColor,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: iconBgColor,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Icon(icon, color: iconColor, size: 17),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 11,
            color: Color(0xFF6B7280),
          ),
        ),
      ],
    );
  }
}

class _VerticalDivider extends StatelessWidget {
  const _VerticalDivider();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 48,
      color: const Color(0xFFF3F4F6),
    );
  }
}

class _DemandTrendChartPainter extends CustomPainter {
  // Normalized points for [Mon, Tue, Wed, Thu, Fri, Sat, Sun] relative to 250 max
  final List<double> normalizedPoints = const [
    0.26, // Mon ~65
    0.48, // Tue ~120
    0.38, // Wed ~95
    0.58, // Thu ~145
    0.74, // Fri ~185
    0.70, // Sat ~175
    0.94, // Sun ~236 (Peak)
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
    final path = Path();
    final fillPath = Path();

    final List<Offset> points = [];
    for (int i = 0; i < normalizedPoints.length; i++) {
      final x = i * stepX;
      final y = size.height - (normalizedPoints[i] * size.height);
      points.add(Offset(x, y));
    }

    path.moveTo(points[0].dx, points[0].dy);
    fillPath.moveTo(points[0].dx, size.height);
    fillPath.lineTo(points[0].dx, points[0].dy);

    for (int i = 0; i < points.length - 1; i++) {
      final p0 = points[i];
      final p1 = points[i + 1];
      final controlX = (p0.dx + p1.dx) / 2;

      path.cubicTo(controlX, p0.dy, controlX, p1.dy, p1.dx, p1.dy);
      fillPath.cubicTo(controlX, p0.dy, controlX, p1.dy, p1.dx, p1.dy);
    }

    fillPath.lineTo(points.last.dx, size.height);
    fillPath.close();

    // Gradient fill under curve
    final gradient = LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        const Color(0xFF10B981).withValues(alpha: 0.22),
        const Color(0xFF10B981).withValues(alpha: 0.0),
      ],
    );

    final fillPaint = Paint()
      ..shader = gradient.createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.fill;
    canvas.drawPath(fillPath, fillPaint);

    // Stroke line
    final linePaint = Paint()
      ..color = const Color(0xFF10B981)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(path, linePaint);

    // Draw data point circles
    final dotFillPaint = Paint()..color = Colors.white;
    final dotStrokePaint = Paint()
      ..color = const Color(0xFF10B981)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < points.length; i++) {
      canvas.drawCircle(points[i], 3.5, dotFillPaint);
      canvas.drawCircle(points[i], 3.5, dotStrokePaint);
    }

    // Draw peak tooltip on Sun point
    final peakPoint = points.last;
    _drawTooltip(canvas, peakPoint, '236 Views', const Color(0xFF10B981));
  }

  void _drawTooltip(Canvas canvas, Offset target, String text, Color color) {
    const double tipW = 68;
    const double tipH = 22;
    final double left = target.dx - tipW + 6;
    final double top = target.dy - tipH - 8;

    final rrect = RRect.fromRectAndRadius(
      Rect.fromLTWH(left, top, tipW, tipH),
      const Radius.circular(6),
    );

    final bgPaint = Paint()..color = color;
    canvas.drawRRect(rrect, bgPaint);

    // Small downward triangle
    final arrowPath = Path()
      ..moveTo(target.dx - 4, top + tipH)
      ..lineTo(target.dx + 4, top + tipH)
      ..lineTo(target.dx, top + tipH + 4)
      ..close();
    canvas.drawPath(arrowPath, bgPaint);

    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 10.5,
          fontWeight: FontWeight.bold,
          fontFamily: 'Inter',
        ),
      ),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(
      canvas,
      Offset(left + (tipW - textPainter.width) / 2, top + (tipH - textPainter.height) / 2),
    );
  }

  void _drawDashedLine(Canvas canvas, Offset p1, Offset p2, Paint paint) {
    const double dashWidth = 4;
    const double dashSpace = 4;
    double startX = p1.dx;
    while (startX < p2.dx) {
      canvas.drawLine(Offset(startX, p1.dy), Offset(startX + dashWidth, p1.dy), paint);
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _SegmentDonutPainter extends CustomPainter {
  const _SegmentDonutPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    const strokeWidth = 16.0;

    final segments = [
      (0.48, const Color(0xFF10B981)), // Regular Buyer 48%
      (0.26, const Color(0xFF3B82F6)), // New Customer 26%
      (0.16, const Color(0xFFF59E0B)), // Subscription 16%
      (0.10, const Color(0xFFA855F7)), // Other 10%
    ];

    double startAngle = -math.pi / 2;

    for (final seg in segments) {
      final sweepAngle = seg.$1 * 2 * math.pi;
      final paint = Paint()
        ..color = seg.$2
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.butt;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius - strokeWidth / 2),
        startAngle,
        sweepAngle,
        false,
        paint,
      );
      startAngle += sweepAngle;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _SegmentLegendRow extends StatelessWidget {
  final Color color;
  final String label;
  final String percentage;

  const _SegmentLegendRow({
    required this.color,
    required this.label,
    required this.percentage,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: Color(0xFF4B5563),
              ),
            ),
          ],
        ),
        Text(
          percentage,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: Color(0xFF111827),
          ),
        ),
      ],
    );
  }
}

class _TimeBar extends StatelessWidget {
  final String label;
  final int value;
  final int maxVal;
  final bool isPeak;

  const _TimeBar({
    required this.label,
    required this.value,
    required this.maxVal,
    required this.isPeak,
  });

  @override
  Widget build(BuildContext context) {
    final double heightFactor = (value / maxVal).clamp(0.0, 1.0);
    const double maxHeight = 130;

    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text(
          '$value',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 11,
            fontWeight: isPeak ? FontWeight.bold : FontWeight.w600,
            color: const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 4),
        Container(
          width: 18,
          height: maxHeight * heightFactor,
          decoration: BoxDecoration(
            color: isPeak ? const Color(0xFF10B981) : const Color(0xFF86EFAC),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(5)),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 10,
            color: Color(0xFF6B7280),
          ),
        ),
      ],
    );
  }
}
