import 'package:flutter/material.dart';
import '../widgets/promotion_daily_chart.dart';

/// Screen 6: Promotion Performance Analytics Screen - Matching Figma Image 4 exactly.
class PromotionPerformanceScreen extends StatelessWidget {
  const PromotionPerformanceScreen({
    super.key,
    this.title = 'Flat 10% Off',
    this.subtitle = 'On Dairy & Snacks',
    this.dateRange = '10 Nov – 20 Nov',
    this.iconAsset = 'assets/cardsicon/promo_percent.png',
  });

  final String title;
  final String subtitle;
  final String dateRange;
  final String iconAsset;

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF1EEE6);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Bar with Back Button, Title, and 3-dots Menu
                    Row(
                      children: [
                        InkWell(
                          onTap: () => Navigator.maybePop(context),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFE5E7EB)),
                            ),
                            child: const Icon(
                              Icons.arrow_back_rounded,
                              color: Color(0xFF111827),
                              size: 20,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Promotion Performance',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF111827),
                              height: 1.4,
                            ),
                          ),
                        ),
                        PopupMenuButton<String>(
                          borderRadius: BorderRadius.circular(12),
                          itemBuilder: (context) => [
                            const PopupMenuItem(
                              value: 'edit',
                              child: Text('Edit Promotion'),
                            ),
                            const PopupMenuItem(
                              value: 'pause',
                              child: Text('Pause Promotion'),
                            ),
                            const PopupMenuItem(
                              value: 'end',
                              child: Text('End Promotion'),
                            ),
                          ],
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFFE5E7EB)),
                            ),
                            child: const Icon(
                              Icons.more_vert,
                              color: Color(0xFF111827),
                              size: 20,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Top Banner Card (Slate-green as in Figma Image 4)
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFFA0B7B7),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        children: [
                          // Cards Icon - 48x48 with no background color
                          SizedBox(
                            width: 48,
                            height: 48,
                            child: Image.asset(
                              iconAsset,
                              width: 48,
                              height: 48,
                              fit: BoxFit.contain,
                              filterQuality: FilterQuality.high,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  title,
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF111827),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  subtitle,
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 12,
                                    fontWeight: FontWeight.w400,
                                    color: Color(0xFF374151),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.calendar_today_outlined,
                                      size: 11,
                                      color: Color(0xFF4B5563),
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      dateRange,
                                      style: const TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 11,
                                        color: Color(0xFF4B5563),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF00E676),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text(
                              'Active',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF111827),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // 2x2 Metrics Grid (Cardsicon 48x48 with no bg color)
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            cardBgColor: const Color(0xFFF4FBE8),
                            iconAsset: 'assets/cardsicon/total-orders.png',
                            value: '286',
                            label: 'Orders',
                            subtext: '↑ +18%',
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildMetricCard(
                            cardBgColor: const Color(0xFFFFFDF5),
                            iconAsset: 'assets/cardsicon/net_revenue.png',
                            value: '₹24,680',
                            label: 'Revenue',
                            subtext: '↑ +22%',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricCard(
                            cardBgColor: const Color(0xFFFFF5F5),
                            iconAsset: 'assets/cardsicon/discount.png',
                            value: '₹2,468',
                            label: 'Discount Given',
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildMetricCard(
                            cardBgColor: const Color(0xFFFAF7FF),
                            iconAsset: 'assets/cardsicon/custom_demand.png',
                            value: '214',
                            label: 'Unique Customers',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Daily Performance Chart
                    const PromotionDailyChart(),
                  ],
                ),
              ),
            ),

            // Bottom Sticky Button: Publish Offer (as in Figma Image 4)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC8F169),
                    foregroundColor: const Color(0xFF111827),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  onPressed: () {
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  child: const Text(
                    'Publish Offer',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard({
    required Color cardBgColor,
    required String iconAsset,
    required String value,
    required String label,
    String? subtext,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBgColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Cards Icon - 48x48 with no background color
          SizedBox(
            width: 48,
            height: 48,
            child: Image.asset(
              iconAsset,
              width: 48,
              height: 48,
              fit: BoxFit.contain,
              filterQuality: FilterQuality.high,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 22,
              fontWeight: FontWeight.w600,
              color: Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Color(0xFF6B7280),
            ),
          ),
          if (subtext != null) ...[
            const SizedBox(height: 4),
            Text(
              subtext,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Color(0xFF027A48),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
