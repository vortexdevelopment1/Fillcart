import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Immutable display model for a single stop node in [MultiOrderStopTimelineCard].
@immutable
class MultiOrderStopNode {
  final String tag;
  final String title;
  final String subtitle;
  final bool isDropOff;

  const MultiOrderStopNode({
    required this.tag,
    required this.title,
    required this.subtitle,
    this.isDropOff = false,
  });
}

/// Shared route/stop summary card showing Order ID, optional status badge,
/// optional expected earning, vertical pickup/drop-off timeline, and optional
/// ETA / payment-mode footer.
class MultiOrderStopTimelineCard extends StatelessWidget {
  final String orderId;
  final String? statusBadge;
  final String? expectedEarningText;
  final List<MultiOrderStopNode> stops;
  final String? etaText;
  final String? paymentLabel;

  const MultiOrderStopTimelineCard({
    super.key,
    required this.orderId,
    this.statusBadge,
    this.expectedEarningText,
    required this.stops,
    this.etaText,
    this.paymentLabel,
  });

  @override
  Widget build(BuildContext context) {
    final hasFooter = (etaText != null && etaText!.isNotEmpty) ||
        (paymentLabel != null && paymentLabel!.isNotEmpty);

    return Container(
      key: const Key('multi_order_stop_timeline_card'),
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: RiderColors.surface,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'ORDER ID',
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF555555),
                    ),
                  ),
                  Text(
                    orderId,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF080808),
                    ),
                  ),
                ],
              ),
              if (statusBadge != null && statusBadge!.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFACFCD3),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    statusBadge!,
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF065F46),
                    ),
                  ),
                ),
            ],
          ),
          if (expectedEarningText != null &&
              expectedEarningText!.isNotEmpty) ...[
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Expected earning',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF555555),
                  ),
                ),
                Text(
                  expectedEarningText!,
                  style: GoogleFonts.poppins(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF080808),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Divider(height: 1, color: RiderColors.divider),
          ],
          if (stops.isNotEmpty) ...[
            const SizedBox(height: 12),
            ...List.generate(stops.length, (index) {
              final stop = stops[index];
              final isLast = index == stops.length - 1;
              return _TimelineStopRow(stop: stop, showConnector: !isLast);
            }),
          ],
          if (hasFooter) ...[
            const SizedBox(height: 12),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF6F6F6),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (etaText != null && etaText!.isNotEmpty)
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.access_time,
                          size: 16,
                          color: Color(0xFF555555),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          etaText!,
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF555555),
                          ),
                        ),
                      ],
                    ),
                  if (paymentLabel != null && paymentLabel!.isNotEmpty)
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.payments_outlined,
                          size: 16,
                          color: Color(0xFF2563EB),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          paymentLabel!,
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF2563EB),
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _TimelineStopRow extends StatelessWidget {
  final MultiOrderStopNode stop;
  final bool showConnector;

  const _TimelineStopRow({
    required this.stop,
    required this.showConnector,
  });

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 18,
            child: Column(
              children: [
                const SizedBox(height: 3),
                if (stop.isDropOff)
                  const Icon(
                    Icons.location_on,
                    key: Key('timeline_dropoff_marker'),
                    size: 16,
                    color: Color(0xFFB91C1C),
                  )
                else
                  Container(
                    key: const Key('timeline_pickup_marker'),
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: Color(0xFF15803D),
                      shape: BoxShape.circle,
                    ),
                  ),
                if (showConnector)
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 3),
                      child: CustomPaint(
                        size: const Size(2, double.infinity),
                        painter: _DashedLinePainter(),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: showConnector ? 12 : 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    stop.tag,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF555555),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    stop.title,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF080808),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    stop.subtitle,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF555555),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DashedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF1B1C17)
      ..strokeWidth = 1.5;

    const dashHeight = 4.0;
    const dashSpace = 3.0;
    double startY = 0;
    final x = size.width / 2;

    while (startY < size.height) {
      final endY = (startY + dashHeight).clamp(0.0, size.height);
      canvas.drawLine(Offset(x, startY), Offset(x, endY), paint);
      startY += dashHeight + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
