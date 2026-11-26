import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Segmented slider component matching Figma `Orders Slider` (Node 1589:62838).
///
/// Figma Specifications:
/// - Dimensions: 328 x 40 px
/// - Track background: #F9FAFB
/// - Selected pill background: #FFE700 (Fillcart Primary Yellow)
/// - Selected text color: #1B1C17
/// - Unselected text color: #777980
/// - Font: Poppins Medium (w500), 14 px, line height 20 px (1.43)
/// - Two options: "Active Orders" and "Completed Orders"
/// - Animated pill transition (matching Smart Animate)
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
          // Animated sliding pill background
          AnimatedAlign(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeInOut,
            alignment: selectedIndex == 0
                ? Alignment.centerLeft
                : Alignment.centerRight,
            child: Container(
              width: 160,
              height: 32,
              decoration: BoxDecoration(
                color: const Color(0xFFFFE700),
                borderRadius: BorderRadius.circular(100),
              ),
            ),
          ),

          // Foreground clickable tab labels
          Row(
            children: [
              // Active Orders Tab
              Expanded(
                child: GestureDetector(
                  key: const Key('orders_slider_active_tab'),
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onTabChanged(0),
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        height: 20 / 14,
                        color: selectedIndex == 0
                            ? const Color(0xFF1B1C17)
                            : const Color(0xFF777980),
                      ),
                      child: const Text(
                        'Active Orders',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ),
              ),

              // Completed Orders Tab
              Expanded(
                child: GestureDetector(
                  key: const Key('orders_slider_completed_tab'),
                  behavior: HitTestBehavior.opaque,
                  onTap: () => onTabChanged(1),
                  child: Center(
                    child: AnimatedDefaultTextStyle(
                      duration: const Duration(milliseconds: 200),
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        height: 20 / 14,
                        color: selectedIndex == 1
                            ? const Color(0xFF1B1C17)
                            : const Color(0xFF777980),
                      ),
                      child: const Text(
                        'Completed Orders',
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
