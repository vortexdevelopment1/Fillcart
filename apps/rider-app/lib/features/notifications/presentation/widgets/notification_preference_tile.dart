import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Reusable preference row/tile widget for Notification Settings.
///
/// Features:
/// - Light-grey rounded icon background (40 x 40 px, #F2F4F7, radius 10)
/// - Left-aligned icon widget
/// - Title (Poppins SemiBold 14 px, #1B1C17)
/// - Subtitle/description (Poppins Regular 12 px, #777980, line-height 1.35)
/// - Switch toggle aligned to the right (bright green #34C759 when ON, grey #E5E7EB when OFF)
class NotificationPreferenceTile extends StatelessWidget {
  final Key? tileKey;
  final Key? titleKey;
  final Key? descriptionKey;
  final Key? switchKey;
  final Widget iconWidget;
  final String title;
  final String description;
  final bool isEnabled;
  final ValueChanged<bool> onChanged;

  const NotificationPreferenceTile({
    super.key,
    this.tileKey,
    this.titleKey,
    this.descriptionKey,
    this.switchKey,
    required this.iconWidget,
    required this.title,
    required this.description,
    required this.isEnabled,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: tileKey,
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // 1. Small light-grey rounded-square icon background (36 x 36 px)
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: const Color(0xFFF2F4F7),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: SizedBox(
              width: 20,
              height: 20,
              child: Center(
                child: iconWidget,
              ),
            ),
          ),
          const SizedBox(width: 12),

          // 2. Title & Description
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  key: titleKey,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF1B1C17),
                    height: 1.25,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  description,
                  key: descriptionKey,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF777980),
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // 3. Trailing Toggle Switch (Green #34C759 ON, Grey #E5E7EB OFF)
          Switch(
            key: switchKey,
            value: isEnabled,
            onChanged: onChanged,
            activeColor: const Color(0xFFFFFFFF),
            activeTrackColor: const Color(0xFF34C759),
            inactiveThumbColor: const Color(0xFFFFFFFF),
            inactiveTrackColor: const Color(0xFFE5E7EB),
            trackOutlineColor: WidgetStateProperty.resolveWith<Color?>((states) {
              if (states.contains(WidgetState.selected)) {
                return const Color(0xFF34C759);
              }
              return const Color(0xFFE5E7EB);
            }),
            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
          ),
        ],
      ),
    );
  }
}
