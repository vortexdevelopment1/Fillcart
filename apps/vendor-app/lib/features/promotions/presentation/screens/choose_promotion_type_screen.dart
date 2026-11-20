import 'package:flutter/material.dart';
import '../widgets/promotion_type_card.dart';
import 'select_products_screen.dart';

/// Screen 2: Choose Promotion Type Screen.
class ChoosePromotionTypeScreen extends StatefulWidget {
  const ChoosePromotionTypeScreen({super.key});

  @override
  State<ChoosePromotionTypeScreen> createState() =>
      _ChoosePromotionTypeScreenState();
}

class _ChoosePromotionTypeScreenState extends State<ChoosePromotionTypeScreen> {
  int _selectedTypeIndex = 0;

  final List<Map<String, dynamic>> _promoTypes = const [
    {
      'title': 'Percentage / Flat Discount',
      'subtitle': 'Give a % or flat discount on products or categories',
      'icon': 'assets/cardsicon/percentage.png',
    },
    {
      'title': 'Buy X Get Y Free',
      'subtitle': 'Offer a free product on purchase of a quantity',
      'icon': 'assets/cardsicon/Buy2get1.png',
    },
    {
      'title': 'Combo Offer',
      'subtitle': 'Create a bundle of multiple products at a special price',
      'icon': 'assets/cardsicon/combo_offer.png',
    },
    {
      'title': 'Order Value Offer',
      'subtitle': 'Give discount on a minimum order value',
      'icon': 'assets/cardsicon/offer.png',
    },
    {
      'title': 'Flash Deal',
      'subtitle': 'Limited-time offer to create urgency',
      'icon': 'assets/cardsicon/Flash.png',
    },
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
                          'Create Promotion',
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
                    const SizedBox(height: 16),

                    // Options List
                    ...List.generate(_promoTypes.length, (index) {
                      final item = _promoTypes[index];
                      final isSelected = _selectedTypeIndex == index;
                      return PromotionTypeCard(
                        title: item['title'] as String,
                        subtitle: item['subtitle'] as String,
                        iconAsset: item['icon'] as String,
                        isSelected: isSelected,
                        onTap: () {
                          setState(() {
                            _selectedTypeIndex = index;
                          });
                        },
                      );
                    }),
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
                    backgroundColor: const Color(0xFFC8F169),
                    foregroundColor: const Color(0xFF111827),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  onPressed: () {
                    final selectedType =
                        _promoTypes[_selectedTypeIndex]['title'] as String;
                    Navigator.push(
                      context,
                      MaterialPageRoute<void>(
                        builder: (context) => SelectProductsScreen(
                          promotionType: selectedType,
                        ),
                      ),
                    );
                  },
                  child: const Text(
                    'Continue',
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
