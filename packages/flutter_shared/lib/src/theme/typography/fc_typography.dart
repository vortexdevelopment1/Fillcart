import 'package:flutter/material.dart';

/// Baseline typography scale for Fillcart mobile applications.
///
/// Configured using default system fonts (Roboto on Android, San Francisco on iOS)
/// aligned with the Material 3 typographic scale. Custom brand typography can be
/// introduced cleanly without breaking existing components.
abstract final class FCTypography {
  static TextTheme createTextTheme(Color textColor) {
    return TextTheme(
      // Display
      displayLarge: TextStyle(
        fontSize: 57.0,
        fontWeight: FontWeight.w400,
        letterSpacing: -0.25,
        color: textColor,
      ),
      displayMedium: TextStyle(
        fontSize: 45.0,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.0,
        color: textColor,
      ),
      displaySmall: TextStyle(
        fontSize: 36.0,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.0,
        color: textColor,
      ),

      // Headline
      headlineLarge: TextStyle(
        fontSize: 32.0,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.0,
        color: textColor,
      ),
      headlineMedium: TextStyle(
        fontSize: 28.0,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.0,
        color: textColor,
      ),
      headlineSmall: TextStyle(
        fontSize: 24.0,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.0,
        color: textColor,
      ),

      // Title
      titleLarge: TextStyle(
        fontSize: 22.0,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.0,
        color: textColor,
      ),
      titleMedium: TextStyle(
        fontSize: 16.0,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.15,
        color: textColor,
      ),
      titleSmall: TextStyle(
        fontSize: 14.0,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.1,
        color: textColor,
      ),

      // Body
      bodyLarge: TextStyle(
        fontSize: 16.0,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.5,
        color: textColor,
      ),
      bodyMedium: TextStyle(
        fontSize: 14.0,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.25,
        color: textColor,
      ),
      bodySmall: TextStyle(
        fontSize: 12.0,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.4,
        color: textColor,
      ),

      // Label
      labelLarge: TextStyle(
        fontSize: 14.0,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
        color: textColor,
      ),
      labelMedium: TextStyle(
        fontSize: 12.0,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.5,
        color: textColor,
      ),
      labelSmall: TextStyle(
        fontSize: 11.0,
        fontWeight: FontWeight.w500,
        letterSpacing: 0.5,
        color: textColor,
      ),
    );
  }
}
