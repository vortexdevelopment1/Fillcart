import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Segmented slider for Order Details: [ Available | Completed ]
/// with olive-gold (#C4B600) active pill.
class OrdersSliderBar extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onTabChanged;

  const OrdersSliderBar({
    super.key,
    required this.selectedIndex,
    required this.onTabChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('orders_slider_bar'),
      width: double.infinity,
      height: 44,
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(100),
      ),
      child: Stack(
        children: [
          AnimatedAlign(
            duration: const Duration(milliseconds: 220),
            curve: Curves.easeInOut,
            alignment: selectedIndex == 0
                ? Alignment.centerLeft
                : Alignment.centerRight,
            child: FractionallySizedBox(
              widthFactor: 0.5,
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
              Expanded(
                child: GestureDetector(
                  key: const Key('orders_slider_active_tab'),
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onTabChanged(0),
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 180),
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: selectedIndex == 0
                            ? Colors.white
                            : const Color(0xFF000000),
                      ),
                      child: const Text(
                        'Available',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ),
              ),
              Expanded(
                child: GestureDetector(
                  key: const Key('orders_slider_completed_tab'),
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onTabChanged(1),
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 180),
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: selectedIndex == 1
                            ? Colors.white
                            : const Color(0xFF000000),
                      ),
                      child: const Text(
                        'Completed',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
