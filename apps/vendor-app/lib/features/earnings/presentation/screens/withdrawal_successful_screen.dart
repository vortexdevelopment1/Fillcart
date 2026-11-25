import 'package:flutter/material.dart';

/// Screen 10: Withdrawal Successful Screen with success badge and transaction receipt.
/// Matches Figma Image 11 design.
class WithdrawalSuccessfulScreen extends StatelessWidget {
  const WithdrawalSuccessfulScreen({super.key});

  static const Color brandLime = Color(0xFFD4FA62);
  static const Color textBlack = Color(0xFF111827);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color borderColor = Color(0xFFE5E7EB);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            children: [
              const SizedBox(height: 48),

              // 1. Success Lime Circle with Checkmark
              Container(
                width: 104,
                height: 104,
                decoration: const BoxDecoration(
                  color: brandLime,
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(
                    Icons.check,
                    size: 52,
                    color: textBlack,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // 2. Success Title & Subtitle
              const Text(
                'Withdrawal successful',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: textBlack,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'The amount is successfully credited to\nyour bank account',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14.5,
                  fontWeight: FontWeight.w400,
                  color: textMuted,
                  height: 1.35,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),

              // 3. Receipt Information Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: borderColor),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    _buildRow('Transferred to', 'HDFC Bank •••• 4821'),
                    const SizedBox(height: 14),
                    _buildRow('You receive', '₹24,560', isAmount: true),
                    const SizedBox(height: 14),
                    _buildRow('Reference ID', 'WD2611190042'),
                  ],
                ),
              ),

              const Spacer(),

              // 4. Back to Home Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    // Navigate back to the home/root screen
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: brandLime,
                    foregroundColor: textBlack,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(26),
                    ),
                  ),
                  child: const Text(
                    'Back to Home',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 15.5,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRow(String label, String value, {bool isAmount = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: textMuted,
          ),
        ),
        const SizedBox(width: 8),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.end,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: isAmount ? 16 : 14.5,
              fontWeight: isAmount ? FontWeight.w800 : FontWeight.w600,
              color: textBlack,
            ),
          ),
        ),
      ],
    );
  }
}
