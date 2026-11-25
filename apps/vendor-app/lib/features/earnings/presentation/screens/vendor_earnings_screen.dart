import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/earning_details_screen.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/payout_settlement_screen.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/transactions_screen.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/withdraw_earnings_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/contact_support_screen.dart';

/// Vendor Earnings Main Screen (Bottom Navigation Tab & Standalone Screen).
/// Matches Figma Image 1 design.
class VendorEarningsScreen extends StatelessWidget {
  const VendorEarningsScreen({
    super.key,
    this.onBackToHome,
  });

  final VoidCallback? onBackToHome;

  static const Color brandLime = Color(0xFFD4FA62);
  static const Color darkHeroBg = Color(0xFF0F172A);
  static const Color textBlack = Color(0xFF111827);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color borderColor = Color(0xFFE5E7EB);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
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
                onPressed: () {
                  if (Navigator.of(context).canPop()) {
                    Navigator.of(context).pop();
                  } else if (onBackToHome != null) {
                    onBackToHome!();
                  }
                },
              ),
            ),
          ),
        ),
        title: const Text(
          'Earnings',
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
              // 1. Date Range Filter Pill
              _buildDateFilterPill(context),
              const SizedBox(height: 16),

              // 2. Dark Hero Card: Today's sales
              _buildTodaySalesHeroCard(),
              const SizedBox(height: 16),

              // 3. Available to withdraw & Pending Card
              _buildWithdrawStatusCard(context),
              const SizedBox(height: 24),

              // 4. Section: Manage earnings
              const Text(
                'Manage earnings',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: textBlack,
                ),
              ),
              const SizedBox(height: 12),

              // 5. Manage earnings menu list
              _buildManageEarningsList(context),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDateFilterPill(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          SvgPicture.asset(
            AppAssets.svgEarningCalendar,
            width: 18,
            height: 18,
            colorFilter: const ColorFilter.mode(textBlack, BlendMode.srcIn),
            errorBuilder: (context, error, stackTrace) => const Icon(
              Icons.calendar_today_outlined,
              size: 18,
              color: textBlack,
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'This week (15 – 21 Jan)',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.5,
                fontWeight: FontWeight.w600,
                color: textBlack,
              ),
            ),
          ),
          const Icon(
            Icons.keyboard_arrow_down,
            color: textMuted,
            size: 22,
          ),
        ],
      ),
    );
  }

  Widget _buildTodaySalesHeroCard() {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row 1: Label + Badge
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Today's sales",
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 13.5,
                  fontWeight: FontWeight.w400,
                  color: Colors.white70,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: brandLime,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Text(
                  '+8% vs yesterday',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: textBlack,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Row 2: Sales Amount
          const Text(
            '₹24,560',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 34,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 12),

          // Row 3: Neon Wave Line Chart
          SizedBox(
            height: 48,
            width: double.infinity,
            child: CustomPaint(
              painter: _SalesWaveLinePainter(),
            ),
          ),
          const SizedBox(height: 14),

          // Row 4: 3 Sub-stat Metrics
          Row(
            children: [
              Expanded(
                child: _buildSubStatTile('24', 'Orders'),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSubStatTile('₹520', 'Avg. order'),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSubStatTile('₹9,860', 'Payout due'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSubStatTile(String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 11.5,
              fontWeight: FontWeight.w400,
              color: Colors.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWithdrawStatusCard(BuildContext context) {
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
        children: [
          // Available to withdraw & Pending Row
          const Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Available to withdraw',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w400,
                        color: textMuted,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      '₹8,700',
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
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Pending',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w400,
                        color: textMuted,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      '₹2,400',
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
          const SizedBox(height: 16),

          // Two Action Buttons Row
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 46,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const PayoutSettlementScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: brandLime,
                      foregroundColor: textBlack,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        'View payouts',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 46,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const WithdrawEarningsScreen(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: brandLime,
                      foregroundColor: textBlack,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    child: const FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Withdraw earnings',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(width: 4),
                          Icon(Icons.arrow_forward, size: 16, color: textBlack),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildManageEarningsList(BuildContext context) {
    final items = [
      _ManageItem(
        iconAsset: AppAssets.svgEarningDetails,
        fallbackIcon: Icons.account_balance_wallet_outlined,
        title: 'Earning details',
        subtitle: 'Sales, commissions & deductions',
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const EarningDetailsScreen(),
            ),
          );
        },
      ),
      _ManageItem(
        iconAsset: AppAssets.svgTransaction,
        fallbackIcon: Icons.swap_horiz,
        title: 'Transactions',
        subtitle: 'Order wise earnings',
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const TransactionsScreen(),
            ),
          );
        },
      ),
      _ManageItem(
        iconAsset: AppAssets.svgSettlement,
        fallbackIcon: Icons.account_balance,
        title: 'Payout & settlements',
        subtitle: 'Weekly settlement & history',
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const PayoutSettlementScreen(),
            ),
          );
        },
      ),
      _ManageItem(
        iconAsset: AppAssets.svgStatement,
        fallbackIcon: Icons.description_outlined,
        title: 'Statements',
        subtitle: 'Download weekly/monthly reports',
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Preparing weekly statements for download...'),
              duration: Duration(seconds: 2),
            ),
          );
        },
      ),
      _ManageItem(
        iconAsset: AppAssets.svgContactSupport,
        fallbackIcon: Icons.headset_mic_outlined,
        title: 'Support',
        subtitle: 'Get help with your earnings',
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const ContactSupportScreen(),
            ),
          );
        },
      ),
    ];

    return Container(
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
          for (int i = 0; i < items.length; i++) ...[
            InkWell(
              onTap: items[i].onTap,
              borderRadius: BorderRadius.vertical(
                top: i == 0 ? const Radius.circular(20) : Radius.zero,
                bottom: i == items.length - 1 ? const Radius.circular(20) : Radius.zero,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Row(
                  children: [
                    SvgPicture.asset(
                      items[i].iconAsset,
                      width: 22,
                      height: 22,
                      colorFilter: const ColorFilter.mode(textBlack, BlendMode.srcIn),
                      errorBuilder: (context, error, stackTrace) => Icon(
                        items[i].fallbackIcon,
                        size: 22,
                        color: textBlack,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            items[i].title,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: textBlack,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            items[i].subtitle,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12.5,
                              fontWeight: FontWeight.w400,
                              color: textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(
                      Icons.chevron_right,
                      size: 20,
                      color: Color(0xFF9CA3AF),
                    ),
                  ],
                ),
              ),
            ),
            if (i < items.length - 1)
              const Divider(
                height: 1,
                thickness: 1,
                indent: 52,
                endIndent: 16,
                color: Color(0xFFF3F4F6),
              ),
          ],
        ],
      ),
    );
  }
}

class _ManageItem {
  const _ManageItem({
    required this.iconAsset,
    required this.fallbackIcon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final String iconAsset;
  final IconData fallbackIcon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
}

/// Custom painter for the neon green sales wave line chart in the hero card.
class _SalesWaveLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final strokePaint = Paint()
      ..color = const Color(0xFFD4FA62)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.8
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final dotPaint = Paint()
      ..color = const Color(0xFFD4FA62)
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(0, size.height * 0.85);

    // Smooth wave shape matching Image 1
    path.cubicTo(
      size.width * 0.15,
      size.height * 0.70,
      size.width * 0.20,
      size.height * 0.65,
      size.width * 0.32,
      size.height * 0.75,
    );
    path.cubicTo(
      size.width * 0.45,
      size.height * 0.85,
      size.width * 0.52,
      size.height * 0.65,
      size.width * 0.65,
      size.height * 0.55,
    );
    path.cubicTo(
      size.width * 0.75,
      size.height * 0.48,
      size.width * 0.82,
      size.height * 0.62,
      size.width * 0.98,
      size.height * 0.35,
    );

    canvas.drawPath(path, strokePaint);

    // Glowing endpoint dot
    canvas.drawCircle(Offset(size.width * 0.98, size.height * 0.35), 4.5, dotPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
