import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../orders/domain/models/multi_order_batch.dart';
import '../../../orders/presentation/widgets/multi_order_swipe_button.dart';

/// Home screen pending Multi-Order assignment card matching Figma node
/// `1523:40712` / `2277:44209` (`328 x 487` px).
class MultiOrderAssignmentCard extends StatelessWidget {
  final MultiOrderBatch batch;
  final int remainingSeconds;
  final VoidCallback onAcceptSwipe;
  final VoidCallback onReject;

  const MultiOrderAssignmentCard({
    super.key,
    required this.batch,
    required this.remainingSeconds,
    required this.onAcceptSwipe,
    required this.onReject,
  });

  static const List<String> _figmaPickupDistances = <String>[
    '1.2 Km',
    '3.6 Km',
    '6.1 Km',
  ];
  static const String _figmaDropDistance = '8.4 Km';

  @override
  Widget build(BuildContext context) {
    final safeRemaining = remainingSeconds.clamp(0, 7);

    return Container(
      key: const Key('multi_order_assignment_card'),
      width: double.infinity,
      constraints: const BoxConstraints(maxWidth: 328),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Upper white section
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header row: MULTI ORDER pill + timestamp & stops/distance
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF3366FF),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'MULTI ORDER',
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '10:05Am',
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF555555),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${batch.totalOrders} Stops . ${batch.totalDistanceKm} Km',
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF555555),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // 3 Pickup Stops
                ...List.generate(batch.subOrders.length, (index) {
                  final subOrder = batch.subOrders[index];
                  final distanceText = index < _figmaPickupDistances.length
                      ? _figmaPickupDistances[index]
                      : '';
                  return _AssignmentTimelineRow(
                    tag: 'PICKUP ${subOrder.sequenceNumber}',
                    title: subOrder.merchantName,
                    subtitle: subOrder.merchantAddress,
                    distanceText: distanceText,
                    isDropOff: false,
                    showConnector: true,
                  );
                }),

                // Final Drop Stop
                _AssignmentTimelineRow(
                  tag: 'Drop',
                  title: batch.customerName,
                  subtitle: batch.deliveryAddress,
                  distanceText: _figmaDropDistance,
                  isDropOff: true,
                  showConnector: false,
                ),
              ],
            ),
          ),

          // Lower pale-yellow footer
          Container(
            width: double.infinity,
            color: const Color(0xFFF7F3B5),
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                MultiOrderSwipeButton(
                  buttonKey: const Key('multi_order_accept_swipe_button'),
                  label: 'Accept',
                  height: 48,
                  onSwipeComplete: safeRemaining > 0 ? onAcceptSwipe : null,
                  enabled: safeRemaining > 0,
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF555555),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      InkWell(
                        key: const Key('multi_order_reject_button'),
                        onTap: onReject,
                        borderRadius: BorderRadius.circular(18),
                        child: Container(
                          width: 34,
                          height: 34,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFF777980),
                              width: 1,
                            ),
                          ),
                          child: const Icon(
                            Icons.close,
                            size: 18,
                            color: Color(0xFF444444),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          'Accept within ${safeRemaining}s',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF444444),
                          ),
                        ),
                      ),
                      Container(
                        width: 34,
                        height: 34,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: const Color(0xFFD92D20),
                            width: 2,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '${safeRemaining}s',
                          key: const Key('multi_order_countdown_text'),
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFFD92D20),
                          ),
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
    );
  }
}

class _AssignmentTimelineRow extends StatelessWidget {
  final String tag;
  final String title;
  final String subtitle;
  final String distanceText;
  final bool isDropOff;
  final bool showConnector;

  const _AssignmentTimelineRow({
    required this.tag,
    required this.title,
    required this.subtitle,
    required this.distanceText,
    required this.isDropOff,
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
                const SizedBox(height: 2),
                if (isDropOff)
                  const Icon(
                    Icons.location_on,
                    size: 18,
                    color: Color(0xFFB91C1C),
                  )
                else
                  Container(
                    width: 14,
                    height: 14,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(0xFF228B4E),
                        width: 4,
                      ),
                    ),
                  ),
                if (showConnector)
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2),
                      child: CustomPaint(
                        size: const Size(2, double.infinity),
                        painter: _AssignmentDashedLinePainter(),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: showConnector ? 10 : 0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          tag,
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF666666),
                          ),
                        ),
                        const SizedBox(height: 1),
                        Text(
                          title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF080808),
                          ),
                        ),
                        Text(
                          subtitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF555555),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (distanceText.isNotEmpty) ...[
                    const SizedBox(width: 8),
                    Text(
                      distanceText,
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF444444),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AssignmentDashedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF555555)
      ..strokeWidth = 1.5;

    const dashHeight = 3.5;
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
