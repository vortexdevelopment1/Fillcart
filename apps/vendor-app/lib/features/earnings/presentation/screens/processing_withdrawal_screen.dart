import 'dart:async';
import 'package:flutter/material.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/withdrawal_successful_screen.dart';

/// Screen 9: Processing Withdrawal Progress Screen with 4-step vertical stepper.
/// Matches Figma Image 10 design.
class ProcessingWithdrawalScreen extends StatefulWidget {
  const ProcessingWithdrawalScreen({super.key});

  @override
  State<ProcessingWithdrawalScreen> createState() =>
      _ProcessingWithdrawalScreenState();
}

class _ProcessingWithdrawalScreenState
    extends State<ProcessingWithdrawalScreen> {
  Timer? _timer;

  static const Color brandLime = Color(0xFFD4FA62);
  static const Color darkHeroBg = Color(0xFF0F172A);
  static const Color textBlack = Color(0xFF111827);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color borderColor = Color(0xFFE5E7EB);
  static const Color stepGreen = Color(0xFF84CC16);

  @override
  void initState() {
    super.initState();
    // Automatically transition to the success screen after a brief delay
    _timer = Timer(const Duration(milliseconds: 2500), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute<void>(
            builder: (_) => const WithdrawalSuccessfulScreen(),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _proceedToSuccess() {
    _timer?.cancel();
    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => const WithdrawalSuccessfulScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF9FAFB),
        elevation: 0,
        automaticallyImplyLeading: false,
        title: const Text(
          'Processing withdrawal',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: textBlack,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Dark Hero Card: Balance + Target Account
              _buildHeroBalanceCard(),
              const SizedBox(height: 16),

              // 2. White Card with 4-Step Stepper
              _buildStepperCard(),
              const SizedBox(height: 16),

              // 3. Yellow Warning Notice Banner
              _buildNoticeBanner(
                'Please wait\nThis takes a few seconds. Don’t close the app or tap back.',
              ),
              const Spacer(),

              // 4. Processing Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _proceedToSuccess,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE5E7EB),
                    foregroundColor: const Color(0xFF6B7280),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(26),
                    ),
                  ),
                  child: const Text(
                    'Processing...',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroBalanceCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: darkHeroBg,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Available Balance',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 13.5,
              fontWeight: FontWeight.w400,
              color: Colors.white70,
            ),
          ),
          SizedBox(height: 8),
          Text(
            '₹24,560',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 34,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'To HDFC Bank •••• 4821',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: Colors.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepperCard() {
    return Container(
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
          _buildStepRow(
            isCompleted: true,
            isActive: false,
            title: 'Request sent',
            subtitle: 'Withdrawal request submitted · 3:41 PM',
            showLineAfter: true,
          ),
          _buildStepRow(
            isCompleted: true,
            isActive: false,
            title: 'Approved',
            subtitle: 'Transfer amount approved · 3:41 PM',
            showLineAfter: true,
          ),
          _buildStepRow(
            isCompleted: false,
            isActive: true,
            title: 'Transferring to bank',
            subtitle: 'Sending to HDFC Bank •••• 4821',
            showLineAfter: true,
          ),
          _buildStepRow(
            isCompleted: false,
            isActive: false,
            title: 'Money credited',
            subtitle: 'Usually within 1–2 business days',
            showLineAfter: false,
          ),
        ],
      ),
    );
  }

  Widget _buildStepRow({
    required bool isCompleted,
    required bool isActive,
    required String title,
    required String subtitle,
    required bool showLineAfter,
  }) {
    Widget circleIcon;
    if (isCompleted) {
      circleIcon = Container(
        width: 22,
        height: 22,
        decoration: const BoxDecoration(
          color: stepGreen,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.check, size: 14, color: Colors.white),
      );
    } else if (isActive) {
      circleIcon = Container(
        width: 22,
        height: 22,
        decoration: const BoxDecoration(
          color: brandLime,
          shape: BoxShape.circle,
        ),
      );
    } else {
      circleIcon = Container(
        width: 22,
        height: 22,
        decoration: const BoxDecoration(
          color: Color(0xFFD1D5DB),
          shape: BoxShape.circle,
        ),
      );
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            circleIcon,
            if (showLineAfter)
              Container(
                width: 2,
                height: 38,
                color: isCompleted ? const Color(0xFFD1D5DB) : const Color(0xFFE5E7EB),
              ),
          ],
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14.5,
                  fontWeight: (isCompleted || isActive)
                      ? FontWeight.w700
                      : FontWeight.w500,
                  color: (isCompleted || isActive)
                      ? textBlack
                      : const Color(0xFF9CA3AF),
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 12.5,
                  fontWeight: FontWeight.w400,
                  color: textMuted,
                ),
              ),
              const SizedBox(height: 14),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNoticeBanner(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF3C7),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFDE68A)),
      ),
      child: Text(
        message,
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 12.5,
          fontWeight: FontWeight.w500,
          color: Color(0xFF92400E),
          height: 1.35,
        ),
      ),
    );
  }
}
