import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Empty-state widget for Notifications matching Figma node `2233:20217`.
///
/// Features:
/// - Exact verified asset: `assets/images/notification_empty.png` (96 x 96 px)
/// - Typography: Poppins SemiBold 16 px heading (#1B1C17), Poppins Regular 13 px supporting copy (#777980)
/// - Spacing & alignment: Centered vertically and horizontally with standard 280 px text width
class NotificationEmptyView extends StatelessWidget {
  const NotificationEmptyView({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            // Empty-state illustration (96 x 96 px)
            Image.asset(
              'assets/images/notification_empty.png',
              width: 96,
              height: 96,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 20),

            // Heading: "No Notifications Yet"
            Text(
              'No Notifications Yet',
              key: const Key('notification_empty_title'),
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1B1C17),
                height: 1.3,
              ),
            ),
            const SizedBox(height: 8),

            // Subtitle: Supporting explanation
            SizedBox(
              width: 280,
              child: Text(
                'Your order updates and important alerts will appear here.',
                key: const Key('notification_empty_subtitle'),
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF777980),
                  height: 1.4,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
