import 'package:flutter/material.dart';

/// Screen displayed when an order is cancelled or rejected (Image 3).
class OrderCancelledScreen extends StatelessWidget {
  const OrderCancelledScreen({
    super.key,
    this.orderId = '#FC2841',
    this.title = 'Order Ready for Pickup.',
    this.subtitle = 'The customer canceled #FC2841 at 7:50 PM. Stop packing this order.',
    this.customerReason = 'Changed my mind',
    this.orderValue = '₹386',
    this.packedStatus = '4 of 6 items',
    this.packedCount = 4,
    this.isVendorRejection = false,
  });

  final String orderId;
  final String title;
  final String subtitle;
  final String customerReason;
  final String orderValue;
  final String packedStatus;
  final int packedCount;
  final bool isVendorRejection;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const Spacer(flex: 2),

              // Large Red Cancelled Circle with White X
              Container(
                width: 96,
                height: 96,
                decoration: const BoxDecoration(
                  color: Color(0xFFB82318),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.close_rounded,
                  size: 54,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 22),

              // Title
              Text(
                title,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),

              // Subtitle
              Text(
                subtitle,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF6B7280),
                  height: 1.35,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              // Order Details Summary Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    _buildInfoRow('Customer Reason', customerReason),
                    const Divider(
                      height: 24,
                      thickness: 1,
                      color: Color(0xFFF3F4F6),
                    ),
                    _buildInfoRow('Order value', orderValue),
                    const Divider(
                      height: 24,
                      thickness: 1,
                      color: Color(0xFFF3F4F6),
                    ),
                    _buildInfoRow('Packed so far', packedStatus),
                  ],
                ),
              ),
              const SizedBox(height: 14),

              // Warning / Restocking Instruction Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEECEB),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  'Put the $packedCount packed items back on the shelf before your next order.',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF991B1B),
                    height: 1.35,
                  ),
                ),
              ),

              const Spacer(flex: 3),

              // Back to home primary button
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC8F169),
                    foregroundColor: const Color(0xFF111827),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(27),
                    ),
                  ),
                  onPressed: () {
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  child: const Text(
                    'Back to home',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Need help? secondary action
              GestureDetector(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Support is available 24/7 at support@fillcart.com'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
                child: const Text(
                  'Need help?',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: Color(0xFF6B7280),
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827),
          ),
        ),
      ],
    );
  }
}
