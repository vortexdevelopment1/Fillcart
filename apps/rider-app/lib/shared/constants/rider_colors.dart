import 'package:flutter/material.dart';

/// Centralized color palette for the Fillcart Rider Application.
///
/// Grounded strictly in Figma canvas 900:10586 (Main screen Rider).
abstract final class RiderColors {
  // Brand Primary & Accents
  static const Color primaryYellow = Color(0xFFFFE700);
  static const Color primaryPressed = Color(0xFFE5CF00);
  static const Color earningNeon = Color(0xFFC1FE03);
  static const Color incentiveIndigo = Color(0xFF4338CA);

  // Status & Telemetry
  static const Color onlineGreen = Color(0xFF00D850);
  static const Color offlineGrey = Color(0xFFDBDBDB);
  static const Color warningOrange = Color(0xFFF59E0B);
  static const Color errorRed = Color(0xFFDC2626);

  // Surface & Text
  static const Color background = Color(0xFFFFFFFF);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceSubtle = Color(0xFFF9FAFB);
  static const Color onSurfaceDark = Color(0xFF1B1C17);
  static const Color textSecondary = Color(0xFF777980);
  static const Color textTertiary = Color(0xFFA0A3BD);

  // Inputs & Borders
  static const Color inputBorder = Color(0xFFE5E7EB);
  static const Color inputFocusedBorder = Color(0xFFFFE700);
  static const Color inputBackground = Color(0xFFF9FAFB);
  static const Color divider = Color(0xFFEEEEEE);
}
