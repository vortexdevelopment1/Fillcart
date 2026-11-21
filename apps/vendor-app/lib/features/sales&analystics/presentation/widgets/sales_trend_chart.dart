import 'package:flutter/material.dart';

/// Weekly Sales Trend Bar Chart.
class SalesTrendChart extends StatelessWidget {
  const SalesTrendChart({
    super.key,
    required this.selectedMetric,
    required this.onMetricChanged,
  });

  final String selectedMetric;
  final ValueChanged<String> onMetricChanged;

  @override
  Widget build(BuildContext context) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const barValues = [0.38, 0.45, 0.48, 0.82, 0.70, 0.90, 0.84];
    const highlightedIndex = 3; // Thu

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Sales Trend',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      selectedMetric,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF374151),
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.keyboard_arrow_down_rounded,
                      size: 16,
                      color: Color(0xFF6B7280),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Chart with Y-axis & Bars
          SizedBox(
            height: 180,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Y-Axis labels
                const Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('40K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                    Text('30K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                    Text('20K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                    Text('10K', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                    Text('0', style: TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                  ],
                ),
                const SizedBox(width: 14),

                // Bars area
                Expanded(
                  child: Stack(
                    children: [
                      // Grid lines
                      Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: List.generate(5, (_) {
                          return const Divider(
                            height: 1,
                            thickness: 0.8,
                            color: Color(0xFFF3F4F6),
                          );
                        }),
                      ),

                      // Bars
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: List.generate(days.length, (index) {
                          final isHighlighted = index == highlightedIndex;
                          final fraction = barValues[index];

                          return Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              if (isHighlighted)
                                Column(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 8,
                                        vertical: 4,
                                      ),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0F172A),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: const Text(
                                        '₹18,400',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    const CustomPaint(
                                      size: Size(8, 4),
                                      painter: _TooltipTrianglePainter(),
                                    ),
                                    const SizedBox(height: 4),
                                  ],
                                ),
                              Container(
                                width: 14,
                                height: 130 * fraction,
                                decoration: BoxDecoration(
                                  color: isHighlighted
                                      ? const Color(0xFF00C48C)
                                      : const Color(0xFFD1FAE5),
                                  borderRadius: const BorderRadius.vertical(
                                    top: Radius.circular(6),
                                  ),
                                ),
                              ),
                            ],
                          );
                        }),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Day labels
          Row(
            children: [
              const SizedBox(width: 32),
              Expanded(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: List.generate(days.length, (index) {
                    final isHighlighted = index == highlightedIndex;
                    return Text(
                      days[index],
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: isHighlighted ? FontWeight.bold : FontWeight.w500,
                        color: isHighlighted
                            ? const Color(0xFF111827)
                            : const Color(0xFF6B7280),
                      ),
                    );
                  }),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _TooltipTrianglePainter extends CustomPainter {
  const _TooltipTrianglePainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF0F172A);
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width, 0)
      ..lineTo(size.width / 2, size.height)
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
