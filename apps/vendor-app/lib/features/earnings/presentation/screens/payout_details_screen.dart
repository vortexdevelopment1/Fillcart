import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/earnings/models/earnings_model.dart';

/// Screen 7: Payout Details Screen (Transfer info, Settlement info, Breakdown, Download statement).
/// Matches Figma Image 8 design.
class PayoutDetailsScreen extends StatelessWidget {
  const PayoutDetailsScreen({
    super.key,
    required this.settlement,
  });

  final SettlementRecord settlement;

  static const Color brandLime = Color(0xFFD4FA62);
  static const Color textBlack = Color(0xFF111827);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color borderColor = Color(0xFFE5E7EB);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        toolbarHeight: 52,
        leadingWidth: 52,
        centerTitle: true,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: Center(
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: const Color.fromRGBO(255, 255, 255, 0.36),
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [
                  BoxShadow(
                    offset: Offset(0, 1),
                    blurRadius: 2,
                    color: Color(0x1A000000),
                  ),
                ],
              ),
              child: IconButton(
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                icon: SvgPicture.asset(
                  AppAssets.svgBackArrow,
                  width: 20,
                  height: 20,
                  colorFilter: const ColorFilter.mode(
                    Color(0xFF111827),
                    BlendMode.srcIn,
                  ),
                ),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ),
        title: const Text(
          'Payout details',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: textBlack,
            height: 28 / 20,
            letterSpacing: 0,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Success Mint Green Card
              _buildSuccessCard(),
              const SizedBox(height: 16),

              // 2. Transfer Information Card
              _buildTransferInfoCard(context),
              const SizedBox(height: 16),

              // 3. Settlement Information Card
              _buildSettlementInfoCard(context),
              const SizedBox(height: 16),

              // 4. Earning Breakdown Card
              _buildEarningBreakdownCard(),
              const SizedBox(height: 24),

              // 5. Download Payout Statement Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Downloading payout statement PDF...'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: textBlack,
                    side: const BorderSide(color: textBlack, width: 1.5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SvgPicture.asset(
                        AppAssets.svgDownload,
                        width: 18,
                        height: 18,
                        colorFilter: const ColorFilter.mode(textBlack, BlendMode.srcIn),
                        errorBuilder: (context, error, stackTrace) => const Icon(
                          Icons.download_outlined,
                          size: 18,
                          color: textBlack,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Download payout statement',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: textBlack,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSuccessCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFBBF7D0)),
      ),
      child: Column(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              color: Color(0xFF22C55E),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check,
              color: Colors.white,
              size: 26,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Settled successfully',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Color(0xFF15803D),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            '₹14,250',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: textBlack,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Transferred on Wed, 19 Feb, 2025',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: textMuted,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransferInfoCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Transfer information',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: textBlack,
            ),
          ),
          const SizedBox(height: 14),

          const Row(
            children: [
              Icon(Icons.account_balance, size: 20, color: textBlack),
              SizedBox(width: 8),
              Text(
                'HDFC Bank',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: textBlack,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          _buildRow('Account number', '•••• 8231'),
          const SizedBox(height: 12),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  'Transaction reference\n(UTR)',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13.5,
                    fontWeight: FontWeight.w400,
                    color: textMuted,
                    height: 1.25,
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  Clipboard.setData(const ClipboardData(text: 'UTR987654321'));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('UTR copied to clipboard'),
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
                child: const Row(
                  children: [
                    Icon(Icons.copy, size: 16, color: textBlack),
                    SizedBox(width: 6),
                    Text(
                      'UTR987654321',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14.5,
                        fontWeight: FontWeight.w600,
                        color: textBlack,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSettlementInfoCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Settlement information',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: textBlack,
            ),
          ),
          const SizedBox(height: 14),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Settlement ID',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: textMuted,
                ),
              ),
              InkWell(
                onTap: () {
                  Clipboard.setData(ClipboardData(text: settlement.id));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Settlement ID copied'),
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
                child: Row(
                  children: [
                    Text(
                      settlement.id,
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14.5,
                        fontWeight: FontWeight.w600,
                        color: textBlack,
                      ),
                    ),
                    const SizedBox(width: 6),
                    const Icon(Icons.copy, size: 16, color: textMuted),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildRow('Settlement period', '10 – 16 Feb, 2025'),
          const SizedBox(height: 12),
          _buildRow('Orders completed', '42'),
        ],
      ),
    );
  }

  Widget _buildEarningBreakdownCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Earning breakdown',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: textBlack,
            ),
          ),
          const SizedBox(height: 14),

          _buildRow('Total sales', '₹15,600'),
          const SizedBox(height: 12),
          _buildRow('Platform commission (7.5%)', '-₹1,170'),
          const SizedBox(height: 12),
          _buildRow('Other adjustments', '-₹180'),
          const SizedBox(height: 16),

          // Net payout banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: brandLime,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Net payout',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: textBlack,
                  ),
                ),
                Text(
                  '₹14,250',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: textBlack,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: textMuted,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          textAlign: TextAlign.end,
          style: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 14.5,
            fontWeight: FontWeight.w600,
            color: textBlack,
          ),
        ),
      ],
    );
  }
}
