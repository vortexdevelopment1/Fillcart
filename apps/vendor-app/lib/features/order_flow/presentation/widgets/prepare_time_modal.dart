import 'package:flutter/material.dart';
import '../screens/order_packing_status_screen.dart';

/// "How long to prepare?" bottom sheet modal when accepting an order.
class PrepareTimeModal extends StatefulWidget {
  const PrepareTimeModal({
    super.key,
    this.orderId = '#FC2841',
    this.itemCount = 6,
    this.acceptedTime = '7:43 PM',
  });

  final String orderId;
  final int itemCount;
  final String acceptedTime;

  @override
  State<PrepareTimeModal> createState() => _PrepareTimeModalState();
}

class _PrepareTimeModalState extends State<PrepareTimeModal> {
  int _selectedMinutes = 15;

  final List<Map<String, dynamic>> _presets = const [
    {'minutes': 10, 'time': '7:53 PM'},
    {'minutes': 15, 'time': '7:58 PM'},
    {'minutes': 20, 'time': '8:03 PM'},
    {'minutes': 30, 'time': '8:13 PM'},
  ];

  String get _calculatedReadyByTime {
    switch (_selectedMinutes) {
      case 10:
        return '7:53 PM';
      case 15:
        return '7:58 PM';
      case 20:
        return '8:03 PM';
      case 30:
        return '8:13 PM';
      default:
        final totalMinutes = 43 + _selectedMinutes;
        final hour = 7 + (totalMinutes ~/ 60);
        final min = totalMinutes % 60;
        final minStr = min < 10 ? '0$min' : '$min';
        return '$hour:$minStr PM';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFFF4F5F7),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag Handle
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Heading & Subtitle
            const Text(
              'How long to prepare?',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Color(0xFF111827),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Order ${widget.orderId} · ${widget.itemCount} items · accepted at ${widget.acceptedTime}',
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 16),

            // Ready by Banner Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF111827),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Ready by',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _calculatedReadyByTime,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 32,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFD4FA62),
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '$_selectedMinutes min from now',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFFD1D5DB),
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Rider arrives after this',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 11,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Time Presets Row (10 min, 15 min, 20 min, 30 min)
            Row(
              children: _presets.map((preset) {
                final minutes = preset['minutes'] as int;
                final time = preset['time'] as String;
                final isSelected = _selectedMinutes == minutes;

                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: InkWell(
                      onTap: () {
                        setState(() {
                          _selectedMinutes = minutes;
                        });
                      },
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFF111827)
                              : Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFF111827)
                                : const Color(0xFFE5E7EB),
                          ),
                        ),
                        child: Column(
                          children: [
                            Text(
                              '$minutes min',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: isSelected
                                    ? const Color(0xFFD4FA62)
                                    : const Color(0xFF111827),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              time,
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                                color: isSelected
                                    ? const Color(0xFFE5E7EB)
                                    : const Color(0xFF6B7280),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 14),

            // Custom Time Row
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Custom time',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF000000),
                    ),
                  ),
                  Row(
                    children: [
                      // Minus Button
                      InkWell(
                        onTap: () {
                          if (_selectedMinutes > 5) {
                            setState(() {
                              _selectedMinutes -= 5;
                            });
                          }
                        },
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: const BoxDecoration(
                            color: Color(0xFFF1EFEA),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.remove,
                            size: 18,
                            color: Color(0xFF111827),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Text(
                        '$_selectedMinutes min',
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                      ),
                      const SizedBox(width: 14),
                      // Plus Button
                      InkWell(
                        onTap: () {
                          setState(() {
                            _selectedMinutes += 5;
                          });
                        },
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: const BoxDecoration(
                            color: Color(0xFF111827),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.add,
                            size: 18,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // CTA Button: "Accept . ready by 7:58 Pm"
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF000000),
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(26),
                  ),
                ),
                onPressed: () {
                  Navigator.pop(context); // close bottom sheet
                  Navigator.push<void>(
                    context,
                    MaterialPageRoute<void>(
                      builder: (_) => OrderPackingStatusScreen(
                        orderId: widget.orderId,
                        readyByTime: _calculatedReadyByTime,
                      ),
                    ),
                  );
                },
                child: Text(
                  'Accept . ready by $_calculatedReadyByTime',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
