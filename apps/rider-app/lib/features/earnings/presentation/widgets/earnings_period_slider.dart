import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// 3-Segment Period Slider for the Rider Earnings screen:
/// [ Today's | Weekly | Monthly ] with olive-gold (#C4B600) active pill.
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
    final Alignment pillAlignment = selectedIndex == 0
        ? Alignment.centerLeft
        : (selectedIndex == 1 ? Alignment.center : Alignment.centerRight);

    return Container(
      key: const Key('earnings_period_slider'),
      width: double.infinity,
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(100),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Stack(
        children: [
          AnimatedAlign(
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeInOut,
            alignment: pillAlignment,
            child: FractionallySizedBox(
              widthFactor: 1 / 3,
              child: Container(
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFCCB900),
                  borderRadius: BorderRadius.circular(100),
                ),
              ),
            ),
          ),
          Row(
            children: [
              _buildTabItem(
                index: 0,
                label: "Today's",
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
            duration: const Duration(milliseconds: 180),
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isSelected ? Colors.white : const Color(0xFF000000),
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
