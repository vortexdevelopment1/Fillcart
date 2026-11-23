import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// 3-Segment Period Slider matching Figma `Earning Slider` (Node 1584:62778).
///
/// Figma Specifications:
/// - Overall dimensions: 328 x 40 px
/// - Track background: #F9FAFB
/// - Track border: 1 px #EEEEEE
/// - Border radius: 100 px (pill)
/// - Track padding: 4 px
/// - Selected pill background: #1B1C17
/// - Selected pill height: 32 px
/// - Selected pill radius: 100 px
/// - Selected text color: #FFFFFF
/// - Unselected text color: #777980
/// - Font: Poppins Medium (w500), 14 px, line height 20 px (1.43)
/// - Three options: Today (0), Weekly (1), Monthly (2)
/// - Animated pill transition (matching Smart Animate)
class EarningsPeriodSlider extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onPeriodChanged;

  const EarningsPeriodSlider({
    super.key,
    required this.selectedIndex,
    required this.onPeriodChanged,
  });

  @override
  Widget build(BuildContext context) {
    // Alignment mapping for the 3 segments: 0 -> -1.0 (left), 1 -> 0.0 (center), 2 -> 1.0 (right)
    final Alignment pillAlignment = selectedIndex == 0
        ? Alignment.centerLeft
        : (selectedIndex == 1 ? Alignment.center : Alignment.centerRight);

    return Container(
      key: const Key('earnings_period_slider'),
      width: 328,
      height: 40,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(100),
        border: Border.all(
          color: const Color(0xFFEEEEEE),
          width: 1,
        ),
      ),
      child: Stack(
        children: [
          // Animated sliding pill background (1/3 of the inner width = 320 / 3 px)
          AnimatedAlign(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeInOut,
            alignment: pillAlignment,
            child: FractionallySizedBox(
              widthFactor: 1 / 3,
              child: Container(
                height: 32,
                decoration: BoxDecoration(
                  color: const Color(0xFF1B1C17),
                  borderRadius: BorderRadius.circular(100),
                ),
              ),
            ),
          ),

          // Foreground clickable tab labels
          Row(
            children: [
              _buildTabItem(
                index: 0,
                label: 'Today',
                key: const Key('earnings_slider_today_tab'),
              ),
              _buildTabItem(
                index: 1,
                label: 'Weekly',
                key: const Key('earnings_slider_weekly_tab'),
              ),
              _buildTabItem(
                index: 2,
                label: 'Monthly',
                key: const Key('earnings_slider_monthly_tab'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTabItem({
    required int index,
    required String label,
    required Key key,
  }) {
    final isSelected = selectedIndex == index;

    return Expanded(
      child: GestureDetector(
        key: key,
        behavior: HitTestBehavior.opaque,
        onTap: () => onPeriodChanged(index),
        child: Center(
          child: AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              height: 20 / 14,
              color: isSelected ? Colors.white : const Color(0xFF777980),
            ),
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ),
      ),
    );
  }
}
