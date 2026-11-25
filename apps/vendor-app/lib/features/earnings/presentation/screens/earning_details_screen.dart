import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';

/// Screen 2: Detailed Earnings Breakdown (Gross, deductions, settlement banner, summary tiles).
/// Matches Figma Image 2 design.
class EarningDetailsScreen extends StatelessWidget {
  const EarningDetailsScreen({super.key});

  static const Color brandLime = Color(0xFFC8F169);
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
                color: const Color(0xFFFFFFFF),
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
              // 1. Date Filter Pill
              _buildDateFilterPill(),
              const SizedBox(height: 16),

              // 2. Dark Hero Card: Total earnings + 42 Orders badge
              _buildTotalEarningsHeroCard(),
              const SizedBox(height: 16),

              // 3. Gross Breakdown Card with lime settlement banner
              _buildGrossBreakdownCard(),
              const SizedBox(height: 24),

              // 4. Section: Earnings summary
              const Text(
                'Earnings summary',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: textBlack,
                ),
              ),
              const SizedBox(height: 12),

              // 5. 3 Summary Cards
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: SizedBox(
                      width: 100,
                      height: 111,
                      child: _buildSummaryCard(
                        iconAsset: AppAssets.svgEarningOrder,
                        fallbackIcon: Icons.inbox_outlined,
                        value: '42',
                        label: 'Orders',
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    child: SizedBox(
                      width: 100,
                      height: 111,
                      child: _buildSummaryCard(
                        iconAsset: AppAssets.svgAvgOrder,
                        fallbackIcon: Icons.trending_up,
                        value: '₹585',
                        label: 'Avg. order\nvalue',
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    child: SizedBox(
                      width: 100,
                      height: 111,
                      child: _buildSummaryCard(
                        iconAsset: AppAssets.svgWallet,
                        fallbackIcon: Icons.credit_card,
                        value: '₹24,560',
                        label: 'You will\nreceive',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // 6. Yellow Notice Banner
              _buildNoticeBanner(
                '₹24,560 will be included in your next weekly settlement (Expected on Wed, 22 Jan).',
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDateFilterPill() {
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
            AppAssets.svgCalendar,
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

  Widget _buildTotalEarningsHeroCard() {
    return Container(
      width: double.infinity,
      constraints: const BoxConstraints(minHeight: 67),
      padding: const EdgeInsets.symmetric(
        horizontal: 18,
        vertical: 14,
      ),
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
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total earnings',
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
                  '42 Orders',
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
          const SizedBox(height: 8),
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
        ],
      ),
    );
  }

  Widget _buildGrossBreakdownCard() {
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
          _buildBreakdownRow(
            svgAsset: AppAssets.svgTotalStocks,
            fallbackIcon: Icons.layers_outlined,
            title: 'Total sales (gross)',
            amount: '₹28,900',
            isBold: true,
          ),
          const SizedBox(height: 16),
          _buildBreakdownRow(
            svgAsset: AppAssets.svgPlatformCommission,
            fallbackIcon: Icons.percent,
            title: 'Platform commission (10%)',
            amount: '-₹2,890',
          ),
          const SizedBox(height: 16),
          _buildBreakdownRow(
            svgAsset: AppAssets.svgGst,
            fallbackIcon: Icons.receipt_long_outlined,
            title: 'Taxes (GST)',
            amount: '-₹1,450',
          ),
          const SizedBox(height: 16),
          _buildBreakdownRow(
            svgAsset: AppAssets.svgAdjustment,
            fallbackIcon: Icons.sync,
            title: 'Adjustments',
            amount: '₹0',
          ),
          const SizedBox(height: 18),

          // Total earnings settlement banner
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
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Total earnings',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 15.5,
                        fontWeight: FontWeight.w700,
                        color: textBlack,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      '(settlement amount)',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12.5,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF4B5563),
                      ),
                    ),
                  ],
                ),
                Text(
                  '₹24,560',
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

  Widget _buildBreakdownRow({
    required String svgAsset,
    required IconData fallbackIcon,
    required String title,
    required String amount,
    bool isBold = false,
  }) {
    return Row(
      children: [
        SvgPicture.asset(
          svgAsset,
          width: 20,
          height: 20,
          colorFilter: const ColorFilter.mode(textBlack, BlendMode.srcIn),
          errorBuilder: (context, error, stackTrace) => Icon(
            fallbackIcon,
            size: 20,
            color: textBlack,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 14.5,
              fontWeight: FontWeight.w500,
              color: textBlack,
            ),
          ),
        ),
        Text(
          amount,
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 15,
            fontWeight: isBold ? FontWeight.w700 : FontWeight.w600,
            color: textBlack,
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryCard({
    required String iconAsset,
    required IconData fallbackIcon,
    required String value,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SvgPicture.asset(
            iconAsset,
            width: 20,
            height: 20,
            colorFilter: const ColorFilter.mode(textBlack, BlendMode.srcIn),
            errorBuilder: (context, error, stackTrace) => Icon(
              fallbackIcon,
              size: 20,
              color: textBlack,
            ),
          ),
          const SizedBox(height: 6),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              value,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: textBlack,
              ),
            ),
          ),
          const SizedBox(height: 4),
          Flexible(
            child: Text(
              label,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: textMuted,
                height: 1.2,
              ),
            ),
          ),
        ],
      ),
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
