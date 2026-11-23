import 'package:flutter/material.dart';

/// Screen 5: About Earnings Educational Screen (Formula, definitions, quick example).
/// Matches Figma Image 6 design.
class AboutEarningsScreen extends StatefulWidget {
  const AboutEarningsScreen({super.key});

  @override
  State<AboutEarningsScreen> createState() => _AboutEarningsScreenState();
}

class _AboutEarningsScreenState extends State<AboutEarningsScreen> {
  bool _isDeductionsExpanded = false;

  static const Color brandLime = Color(0xFFD4FA62);
  static const Color darkHeroBg = Color(0xFF0F172A);
  static const Color textBlack = Color(0xFF111827);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color borderColor = Color(0xFFE5E7EB);
  static const Color iconBgLime = Color(0xFFEFFCD7);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF9FAFB),
        elevation: 0,
        centerTitle: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: textBlack),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'About Earnings',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textBlack,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Dark Card with Calculator Art
              _buildHeroIntroCard(),
              const SizedBox(height: 20),

              // 2. Section: Earnings formula
              const Text(
                'Earnings formula',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: textBlack,
                ),
              ),
              const SizedBox(height: 10),

              // 3. Pale Lime Formula Container
              _buildFormulaContainer(),
              const SizedBox(height: 24),

              // 4. Section: What each item means
              const Text(
                'What each item means',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: textBlack,
                ),
              ),
              const SizedBox(height: 12),

              // 5. Explanations List Card
              _buildMeaningsCard(),
              const SizedBox(height: 16),

              // 6. Yellow Notice Banner
              _buildNoticeBanner(
                'Your earnings from orders are added to your weekly settlement and will be credited to your verified bank account as per the settlement Schedule.',
              ),
              const SizedBox(height: 24),

              // 7. Section: Quick example
              const Text(
                'Quick example',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: textBlack,
                ),
              ),
              const SizedBox(height: 12),

              // 8. Example Bill Card
              _buildQuickExampleCard(),
              const SizedBox(height: 28),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroIntroCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
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
      child: Row(
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'How your earnings\nare calculated',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    height: 1.25,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  'A simple breakdown of what you receive from each order.',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 12.5,
                    fontWeight: FontWeight.w400,
                    color: Colors.white70,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Calculator art illustration
          _buildCalculatorArt(),
        ],
      ),
    );
  }

  Widget _buildCalculatorArt() {
    return Container(
      width: 72,
      height: 72,
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Center(
        child: Container(
          width: 54,
          height: 54,
          decoration: BoxDecoration(
            color: brandLime,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 36,
                height: 12,
                decoration: BoxDecoration(
                  color: textBlack,
                  borderRadius: BorderRadius.circular(4),
                ),
                alignment: Alignment.centerRight,
                padding: const EdgeInsets.only(right: 3),
                child: const Text(
                  '₹',
                  style: TextStyle(
                    color: brandLime,
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _calcDot(),
                  const SizedBox(width: 3),
                  _calcDot(),
                  const SizedBox(width: 3),
                  _calcDot(),
                ],
              ),
              const SizedBox(height: 3),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _calcDot(),
                  const SizedBox(width: 3),
                  _calcDot(),
                  const SizedBox(width: 3),
                  _calcDot(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _calcDot() {
    return Container(
      width: 8,
      height: 6,
      decoration: BoxDecoration(
        color: textBlack,
        borderRadius: BorderRadius.circular(2),
      ),
    );
  }

  Widget _buildFormulaContainer() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: iconBgLime,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFD4FA62)),
      ),
      child: const Text(
        'Your earnings = Item total – Platform commission\n-GST on commission\n± Adjustments',
        textAlign: TextAlign.center,
        style: TextStyle(
          fontFamily: 'Inter',
          fontSize: 13.5,
          fontWeight: FontWeight.w700,
          color: textBlack,
          height: 1.45,
        ),
      ),
    );
  }

  Widget _buildMeaningsCard() {
    const items = [
      _MeaningItem(
        icon: Icons.shopping_bag_outlined,
        title: 'Item total',
        description: 'Total value of items in the order (before commission).',
      ),
      _MeaningItem(
        icon: Icons.inventory_2_outlined,
        title: 'Packing charge',
        description:
            'Packing fee paid by the customer, passed on to you (if applicable).',
      ),
      _MeaningItem(
        icon: Icons.percent,
        title: 'Platform commission',
        description:
            "FillCarts' service fee on the item total (e.g., 10%).",
      ),
      _MeaningItem(
        icon: Icons.description_outlined,
        title: 'GST on commission',
        description:
            'Goods and Services Tax on the platform commission (e.g., 18%).',
      ),
      _MeaningItem(
        icon: Icons.sync,
        title: 'Adjustments',
        description:
            'Any additional amounts such as refunds, cancellations, or manual corrections (positive or negative).',
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
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: iconBgLime,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      items[i].icon,
                      size: 20,
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
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                            color: textBlack,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          items[i].description,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 12.5,
                            fontWeight: FontWeight.w400,
                            color: textMuted,
                            height: 1.35,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            if (i < items.length - 1)
              const Divider(
                height: 1,
                thickness: 1,
                indent: 70,
                endIndent: 16,
                color: Color(0xFFF3F4F6),
              ),
          ],
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

  Widget _buildQuickExampleCard() {
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
            'Bill Summary',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: textBlack,
            ),
          ),
          const SizedBox(height: 14),

          _buildRow('Item total (5 items)', '₹336'),
          const SizedBox(height: 10),
          _buildRow('Packing charge', '₹10'),
          const SizedBox(height: 10),
          _buildRow('Taxes (GST)', '₹10'),
          const SizedBox(height: 14),

          // Deductions row with expandable toggle
          InkWell(
            onTap: () {
              setState(() {
                _isDeductionsExpanded = !_isDeductionsExpanded;
              });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Deductions',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14.5,
                    fontWeight: FontWeight.w700,
                    color: textBlack,
                  ),
                ),
                Icon(
                  _isDeductionsExpanded
                      ? Icons.keyboard_arrow_up
                      : Icons.keyboard_arrow_down,
                  color: textMuted,
                  size: 20,
                ),
              ],
            ),
          ),
          if (_isDeductionsExpanded) ...[
            const SizedBox(height: 10),
            _buildRow('Platform commission (10%)', '-₹40',
                valueColor: const Color(0xFFDC2626)),
            const SizedBox(height: 8),
            _buildRow('GST on commission (18%)', '-₹10',
                valueColor: const Color(0xFFDC2626)),
          ],
          const SizedBox(height: 16),

          // Lime banner: You earned
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
                  'You earned',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: textBlack,
                  ),
                ),
                Text(
                  '₹306',
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

  Widget _buildRow(String label, String value, {Color? valueColor}) {
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
        Text(
          value,
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 14.5,
            fontWeight: FontWeight.w600,
            color: valueColor ?? textBlack,
          ),
        ),
      ],
    );
  }
}

class _MeaningItem {
  const _MeaningItem({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;
}
