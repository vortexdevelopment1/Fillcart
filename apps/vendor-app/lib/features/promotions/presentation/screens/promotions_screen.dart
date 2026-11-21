import 'package:flutter/material.dart';
import '../widgets/promotion_card_tile.dart';
import '../widgets/promotion_stat_card.dart';
import 'choose_promotion_type_screen.dart';
import 'promotion_performance_screen.dart';

/// Screen 1: Promotions Dashboard Screen.
class PromotionsScreen extends StatefulWidget {
  const PromotionsScreen({super.key});

  @override
  State<PromotionsScreen> createState() => _PromotionsScreenState();
}

class _PromotionsScreenState extends State<PromotionsScreen> {
  int _selectedFilterIndex = 0;
  final List<String> _filters = const [
    'All',
    'Active (2)',
    'Scheduled (1)',
    'Expired (1)',
  ];

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
                    // Top Bar with Back Button & Screen Title
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
                          'Promotions',
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
                    const SizedBox(height: 20),

                    // Section Heading
                    const Text(
                      'Choose Promotion Type',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Hero Banner Card
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [
                            Color(0xFFE2FBEA),
                            Color(0xFFD6F6EE),
                            Color(0xFFC7F8E3),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x06000000),
                            blurRadius: 8,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Stack(
                          children: [
                            // Art on the right
                            Positioned(
                              right: -4,
                              top: 0,
                              bottom: 0,
                              child: Image.asset(
                                'assets/cardsicon/promo_banner_art.png',
                                width: 145,
                                fit: BoxFit.contain,
                              ),
                            ),
                            // Text & Button on the left
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: ConstrainedBox(
                                constraints: const BoxConstraints(maxWidth: 210),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Run Offers &\nGrow Sales',
                                      style: TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 18,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFF111827),
                                        height: 1.25,
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    const Text(
                                      'Create discounts, combos, and\ndeals to get more orders.',
                                      style: TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 11.5,
                                        color: Color(0xFF4B5563),
                                        height: 1.3,
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    ElevatedButton(
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: const Color(0xFF133E2B),
                                        foregroundColor: Colors.white,
                                        elevation: 0,
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 14,
                                          vertical: 9,
                                        ),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                      ),
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute<void>(
                                            builder: (context) =>
                                                const ChoosePromotionTypeScreen(),
                                          ),
                                        );
                                      },
                                      child: const Text(
                                        'Create Promotion +',
                                        style: TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 12.5,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // 3 Stat Cards Row
                    const Row(
                      children: [
                        Expanded(
                          child: PromotionStatCard(
                            label: 'Sales Lift',
                            badgeText: '+24%',
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: PromotionStatCard(
                            label: 'Promo Orders',
                            value: '1,420',
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: PromotionStatCard(
                            label: 'Promo Revenue',
                            value: '₹1.24L',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Section Heading: Your Promotions
                    const Text(
                      'Your Promotions (4)',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Filter Pills
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: List.generate(_filters.length, (index) {
                          final isSelected = _selectedFilterIndex == index;
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  _selectedFilterIndex = index;
                                });
                              },
                              borderRadius: BorderRadius.circular(20),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? const Color(0xFF133E2B)
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  border: isSelected
                                      ? null
                                      : Border.all(
                                          color: const Color(0xFFE5E7EB),
                                        ),
                                ),
                                child: Text(
                                  _filters[index],
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 13,
                                    fontWeight: isSelected
                                        ? FontWeight.w600
                                        : FontWeight.w500,
                                    color: isSelected
                                        ? Colors.white
                                        : const Color(0xFF374151),
                                  ),
                                ),
                              ),
                            ),
                          );
                        }),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Promotion Cards List
                    if (_selectedFilterIndex == 0 || _selectedFilterIndex == 1)
                      PromotionCardTile(
                        title: 'Flat 10% Off',
                        subtitle: 'On all Dairy products',
                        dateRange: '10 Nov – 20 Nov',
                        status: PromotionStatus.active,
                        iconAsset: 'assets/cardsicon/promo_percent.png',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute<void>(
                              builder: (context) =>
                                  const PromotionPerformanceScreen(
                                title: 'Flat 10% Off',
                                subtitle: 'On all Dairy products',
                                dateRange: '10 Nov – 20 Nov',
                              ),
                            ),
                          );
                        },
                      ),
                    if (_selectedFilterIndex == 0 || _selectedFilterIndex == 1)
                      PromotionCardTile(
                        title: 'Buy 2 Get 1 Free',
                        subtitle: "On Britannia & Lay's",
                        dateRange: '08 Nov – 18 Nov',
                        status: PromotionStatus.active,
                        iconAsset: 'assets/cardsicon/promo_gift.png',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute<void>(
                              builder: (context) =>
                                  const PromotionPerformanceScreen(
                                title: 'Buy 2 Get 1 Free',
                                subtitle: "On Britannia & Lay's",
                                dateRange: '08 Nov – 18 Nov',
                              ),
                            ),
                          );
                        },
                      ),
                    if (_selectedFilterIndex == 0 || _selectedFilterIndex == 2)
                      PromotionCardTile(
                        title: 'Weekend Deal',
                        subtitle: 'On selected groceries',
                        dateRange: '15 Nov – 17 Nov',
                        status: PromotionStatus.scheduled,
                        iconAsset: 'assets/cardsicon/promo_calendar.png',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute<void>(
                              builder: (context) =>
                                  const PromotionPerformanceScreen(
                                title: 'Weekend Deal',
                                subtitle: 'On selected groceries',
                                dateRange: '15 Nov – 17 Nov',
                              ),
                            ),
                          );
                        },
                      ),
                    if (_selectedFilterIndex == 0 || _selectedFilterIndex == 3)
                      PromotionCardTile(
                        title: 'Diwali Special',
                        subtitle: 'On Sweets & Snacks',
                        dateRange: '20 Oct – 28 Oct',
                        status: PromotionStatus.expired,
                        iconAsset: 'assets/cardsicon/promo_percent.png',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute<void>(
                              builder: (context) =>
                                  const PromotionPerformanceScreen(
                                title: 'Diwali Special',
                                subtitle: 'On Sweets & Snacks',
                                dateRange: '20 Oct – 28 Oct',
                              ),
                            ),
                          );
                        },
                      ),
                  ],
                ),
              ),
            ),

            // Bottom Sticky Button: Continue
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xffC8F169),
                    foregroundColor: const Color(0xFF111827),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute<void>(
                        builder: (context) => const ChoosePromotionTypeScreen(),
                      ),
                    );
                  },
                  child: const Text(
                    'Create Promotion',
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
}
