import 'package:flutter/material.dart';
import '../widgets/promotion_step_indicator.dart';
import 'promotion_performance_screen.dart';

/// Screen 5: Review & Publish (Step 3) Screen - Matching Figma Image 4 exactly.
class ReviewPublishScreen extends StatelessWidget {
  const ReviewPublishScreen({
    super.key,
    this.offerName = 'Flat 10% Off',
    this.discountValue = '10%',
    this.applicableCategories = const ['Dairy', 'Snacks'],
    this.dateRange = '10 Nov – 20 Nov',
  });

  final String offerName;
  final String discountValue;
  final List<String> applicableCategories;
  final String dateRange;

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF1EEE6);

    final categoriesText = applicableCategories.isNotEmpty
        ? applicableCategories.join(', ')
        : 'Dairy, Snacks';

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
                    // Top Bar
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
                        const Text(
                          'Review & Publish',
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF111827),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Stepper: 1 Products (Done) -> 2 Details (Done) -> 3 Review (Active)
                    const PromotionStepIndicator(currentStep: 3),
                    const SizedBox(height: 16),

                    // Top Preview Card (Slate-green background as in Figma Image 4)
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: const Color(0xFFA0B7B7),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.all(14),
                      child: Row(
                        children: [
                          // White squircle with % - Fixed 40px width, 42px height
                          Container(
                            width: 40,
                            height: 42,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            alignment: Alignment.center,
                            child: const Text(
                              '%',
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF111827),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  offerName,
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF111827),
                                    height: 1.2,
                                    letterSpacing: -0.2,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'On $categoriesText',
                                  style: const TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 12,
                                    fontWeight: FontWeight.w400,
                                    color: Color(0xFF374151),
                                    height: 1.2,
                                    letterSpacing: -0.1,
                                  ),
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
                              color: const Color(0xFF00FF2A),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              discountValue.contains('%')
                                  ? '$discountValue OFF'
                                  : '10% OFF',
                              style: const TextStyle(
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

                    // OFFER SUMMARY Card (Matching Figma Image 4)
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'OFFER SUMMARY',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 14),
                          _buildSummaryRow('Offer Type', 'Discount Offer'),
                          _buildSummaryRow('Discount Value', discountValue),
                          _buildSummaryRow('Applied On', categoriesText),
                          _buildSummaryRow('Duration', dateRange),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Estimated Impact Card (Matching Figma Image 4)
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(
                                Icons.bar_chart_rounded,
                                size: 18,
                                color: Color(0xFF1A883B),
                              ),
                              SizedBox(width: 8),
                              Text(
                                'Estimated Impact',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF111827),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          _buildSummaryRow(
                            'Estimated Orders',
                            '+280 to 340',
                            isGreen: true,
                          ),
                          _buildSummaryRow(
                            'Estimated Sales Uplift',
                            '+18% to 24%',
                            isGreen: true,
                          ),
                          _buildSummaryRow(
                            'Estimated Discount Cost',
                            '~₹2,480',
                            isGreen: true,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Sticky Button: Publish Offer
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
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Offer "$offerName" Published Successfully!'),
                        backgroundColor: const Color(0xFF133E2B),
                      ),
                    );
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute<void>(
                        builder: (context) => PromotionPerformanceScreen(
                          title: offerName,
                          subtitle: 'On $categoriesText',
                          dateRange: dateRange,
                        ),
                      ),
                    );
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

  Widget _buildSummaryRow(
    String label,
    String value, {
    bool isGreen = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              color: Color(0xFF6B7280),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: isGreen
                  ? const Color(0xFF027A48)
                  : const Color(0xFF111827),
            ),
          ),
        ],
      ),
    );
  }
}
