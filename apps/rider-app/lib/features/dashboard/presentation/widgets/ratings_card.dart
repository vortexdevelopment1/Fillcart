import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Section 5: Ratings Breakdown matching Figma node 1584:62632 & 1584:62507 (328 x 176 px).
///
/// Figma Specifications:
/// - Heading: "Ratings" (Poppins Medium 14 px, #000000)
/// - Card (1584:62507): 328 x 140 px
///   - Background: #FFFFFF
///   - Radius: 12 px, padding: 12 px
///   - Left Column (approx 192 px):
///     - 5 rows: 5, 4, 3, 2, 1 with progress tracks (178 x 6.7 px, #DDDDDD, 0% initial)
///   - Right Column (86 x 102 px):
///     - Background: #FFFCE2
///     - Radius: 12 px
///     - Score: "0" (Poppins Regular 24 px) + Yellow star (25 x 25 px, dashboard_rider_rating.png)
///     - Label: "Rating" (Poppins Regular 12 px, #555555)
class RatingsCard extends StatelessWidget {
  const RatingsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: 24,
          child: Text(
            'Ratings',
            key: const Key('ratings_heading'),
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF000000),
            ),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          key: const Key('ratings_breakdown_card'),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFFDDDDDD),
              width: 1,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0D000000),
                blurRadius: 2,
                offset: Offset(0, 1),
              ),
            ],
          ),
          child: Row(
            children: [
              // Left: 5 score rows
              Expanded(
                child: Column(
                  children: [
                    _buildRatingRow('5', const Key('rating_row_5')),
                    const SizedBox(height: 6),
                    _buildRatingRow('4', const Key('rating_row_4')),
                    const SizedBox(height: 6),
                    _buildRatingRow('3', const Key('rating_row_3')),
                    const SizedBox(height: 6),
                    _buildRatingRow('2', const Key('rating_row_2')),
                    const SizedBox(height: 6),
                    _buildRatingRow('1', const Key('rating_row_1')),
                  ],
                ),
              ),

              const SizedBox(width: 16),

              // Right: Rating score badge (86 x 102 px)
              Container(
                key: const Key('rating_badge_container'),
                width: 86,
                height: 102,
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFCE2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '0',
                          key: const Key('rating_score_value'),
                          style: GoogleFonts.poppins(
                            fontSize: 24,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF000000),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Image.asset(
                          'assets/icons/dashboard_rider_rating.png',
                          key: const Key('rating_star_icon'),
                          width: 25,
                          height: 25,
                          fit: BoxFit.contain,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Rating',
                      key: const Key('rating_score_label'),
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF555555),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRatingRow(String score, Key key) {
    return Row(
      key: key,
      children: [
        SizedBox(
          width: 12,
          child: Text(
            score,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF555555),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Container(
            height: 6.7,
            decoration: BoxDecoration(
              color: const Color(0xFFDDDDDD),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: const Color(0xFF555555),
                width: 0.1,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
