import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/rider_colors.dart';

/// Rider App theme combining shared design tokens with Rider brand colors
/// and Poppins font typography.
abstract final class RiderTheme {
  /// Rider Light Theme Configuration
  static ThemeData get lightTheme {
    final base = FCTheme.lightTheme;

    final riderColorScheme = base.colorScheme.copyWith(
      primary: RiderColors.primaryYellow,
      onPrimary: RiderColors.onSurfaceDark,
      primaryContainer: RiderColors.primaryYellow.withValues(alpha: 0.2),
      onPrimaryContainer: RiderColors.onSurfaceDark,
      secondary: RiderColors.earningNeon,
      onSecondary: RiderColors.onSurfaceDark,
      surface: RiderColors.surface,
      onSurface: RiderColors.onSurfaceDark,
      surfaceContainerHighest: RiderColors.inputBackground,
      onSurfaceVariant: RiderColors.textSecondary,
      error: RiderColors.errorRed,
      outline: RiderColors.inputBorder,
    );

    final poppinsTextTheme = GoogleFonts.poppinsTextTheme(base.textTheme);

    return base.copyWith(
      colorScheme: riderColorScheme,
      scaffoldBackgroundColor: RiderColors.background,
      textTheme: poppinsTextTheme,
      primaryTextTheme: GoogleFonts.poppinsTextTheme(base.primaryTextTheme),
      appBarTheme: base.appBarTheme.copyWith(
        backgroundColor: RiderColors.background,
        foregroundColor: RiderColors.onSurfaceDark,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.poppins(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: RiderColors.onSurfaceDark,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: RiderColors.primaryYellow,
          foregroundColor: RiderColors.onSurfaceDark,
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
          textStyle: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: RiderColors.onSurfaceDark,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: RiderColors.inputBackground,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RiderColors.inputBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RiderColors.inputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: RiderColors.primaryYellow,
            width: 2.0,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RiderColors.errorRed),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RiderColors.errorRed, width: 2.0),
        ),
        hintStyle: GoogleFonts.poppins(
          color: RiderColors.textSecondary,
          fontSize: 14,
        ),
        errorStyle: GoogleFonts.poppins(
          color: RiderColors.errorRed,
          fontSize: 12,
        ),
      ),
    );
  }

  /// Rider Dark Theme Configuration
  static ThemeData get darkTheme {
    final base = FCTheme.darkTheme;
    return base.copyWith(
      textTheme: GoogleFonts.poppinsTextTheme(base.textTheme),
      primaryTextTheme: GoogleFonts.poppinsTextTheme(base.primaryTextTheme),
    );
  }
}
