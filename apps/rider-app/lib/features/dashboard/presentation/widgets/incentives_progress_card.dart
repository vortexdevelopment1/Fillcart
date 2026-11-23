import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Section 4: Incentives Progress matching Figma node 1584:62502 & 1584:62484 (328 x 174 px).
///
/// Figma Specifications:
/// - Heading: "Incentives Progress" (Poppins Medium 14 px, #000000)
/// - Card (1584:62484): 328 x 138 px
///   - Background: #F8FAFF
///   - Border: 1 px #EEF2FF
///   - Radius: 16 px, padding: 12 px
///   - Icon: 40 x 40 px trophy / award icon (dashboard_incentive.png)
///   - Title: "₹100 Bonus" (Poppins Bold 20 px, #4338CA, Rupee in Inter Bold 20 px)
///   - Subtitle: "Complete 2 more orders to earn" (Poppins Medium 12 px, #555555)
///   - Progress Track: 8 px height, #E0E7FF background, 0.5 px #DDD border, 9999 px radius
///   - Progress Fill: #4F46E5 active fill, initial 0%
///   - Counter: "0/5 orders" (Poppins SemiBold 10 px, #000000)
class IncentivesProgressCard extends StatelessWidget {
  const IncentivesProgressCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 24,
          child: Text(
            'Incentives Progress',
            key: const Key('incentives_progress_heading'),
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF000000),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          key: const Key('incentive_progress_card'),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFF8FAFF),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: const Color(0xFFEEF2FF),
              width: 1,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0D000000),
                blurRadius: 4,
                offset: Offset(0, 1),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Row: Icon (40 x 40 px) + Title & Subtitle
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Image.asset(
                    'assets/icons/dashboard_incentive.png',
                    key: const Key('incentive_trophy_icon'),
                    width: 40,
                    height: 40,
                    fit: BoxFit.contain,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text.rich(
                          TextSpan(
                            children: [
                              TextSpan(
                                text: '₹',
                                style: GoogleFonts.inter(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                  color: RiderColors.incentiveIndigo,
                                ),
                              ),
                              TextSpan(
                                text: '100 Bonus',
                                style: GoogleFonts.poppins(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700,
                                  color: RiderColors.incentiveIndigo,
                                ),
                              ),
                            ],
                          ),
                          key: const Key('incentive_bonus_title'),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Complete 2 more orders to earn',
                          key: const Key('incentive_subtitle'),
                          style: GoogleFonts.poppins(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF555555),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Progress Bar Track (Height 8 px, rounded 9999 px)
              Container(
                height: 8,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFE0E7FF),
                  borderRadius: BorderRadius.circular(9999),
                  border: Border.all(
                    color: const Color(0xFFDDDDDD),
                    width: 0.5,
                  ),
                ),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: const Color(0xFF4F46E5),
                      borderRadius: BorderRadius.circular(9999),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 4),

              // Counter text (Right aligned)
              Align(
                alignment: Alignment.centerRight,
                child: Text(
                  '0/5 orders',
                  key: const Key('incentive_orders_counter'),
                  style: GoogleFonts.poppins(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF000000),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
