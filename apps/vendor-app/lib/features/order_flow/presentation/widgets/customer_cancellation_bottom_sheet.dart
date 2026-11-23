import 'package:flutter/material.dart';
import '../screens/order_cancelled_screen.dart';
import '../screens/order_details_screen.dart';

/// Modal bottom sheet showing customer cancellation alert (Image 2).
class CustomerCancellationBottomSheet extends StatelessWidget {
  const CustomerCancellationBottomSheet({
    super.key,
    this.orderId = '#FC2841',
    this.cancelTime = '8:04 PM',
    this.packedCount = 4,
    this.totalCount = 6,
    this.orderValue = '₹386',
  });

  final String orderId;
  final String cancelTime;
  final int packedCount;
  final int totalCount;
  final String orderValue;

  /// Helper static method to show this bottom sheet anywhere.
  static Future<void> show(
    BuildContext context, {
    String orderId = '#FC2841',
    String cancelTime = '8:04 PM',
    int packedCount = 4,
    int totalCount = 6,
    String orderValue = '₹386',
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => CustomerCancellationBottomSheet(
        orderId: orderId,
        cancelTime: cancelTime,
        packedCount: packedCount,
        totalCount: totalCount,
        orderValue: orderValue,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFFF4F5F7),
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Drag Handle Bar
            Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),

            // Modal Header Title & Subtitle
            const Text(
              'Order cancel by customer',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Color(0xFF111827),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              '$orderId order cancel on $cancelTime',
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: Color(0xFF6B7280),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),

            // Red Warning Card: Stop Packing
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFB82318),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Stop Packing',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Put the bag down. items already packed must go back on the  shelf',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: Colors.white,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Primary Button: Got it, Stop packing
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
                  Navigator.pop(context); // Close bottom sheet
                  Navigator.pushReplacement<void, void>(
                    context,
                    MaterialPageRoute<void>(
                      builder: (_) => OrderCancelledScreen(
                        orderId: orderId,
                        packedCount: packedCount,
                        packedStatus: '$packedCount of $totalCount items',
                        orderValue: orderValue,
                      ),
                    ),
                  );
                },
                child: const Text(
                  'Got it, Stop packing',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Tertiary Link: View order details
            GestureDetector(
              onTap: () {
                Navigator.pop(context);
                Navigator.push<void>(
                  context,
                  MaterialPageRoute<void>(
                    builder: (_) => const OrderDetailsScreen(),
                  ),
                );
              },
              child: const Text(
                'View order details',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF6B7280),
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 4),
          ],
        ),
      ),
    );
  }
}
