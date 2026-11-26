import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/rider_colors.dart';

/// Rider App theme combining shared design tokens with Rider brand colors
/// and Poppins font typography.
///
/// TextTheme note: google_fonts ≥ 9.0.0 brings in material_ui as a transitive
/// dependency whose TextTheme class conflicts with Flutter's native TextTheme
/// at the static type level. Using [TextTheme.apply] with the Poppins font
/// family string keeps everything within Flutter's own type system and avoids
/// the cross-library incompatibility entirely.
abstract final class RiderTheme {
  /// Poppins font family name, resolved once from google_fonts at declaration
  /// time so it is available as a plain [String] with no cross-library types.
  static final String _poppinsFontFamily = GoogleFonts.poppins().fontFamily!;

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

    // TextTheme.apply() is a pure Flutter API: it clones the existing TextTheme
    // and overrides the font family on every TextStyle without crossing into the
    // google_fonts / material_ui type boundary.
    final poppinsTextTheme = base.textTheme.apply(
      fontFamily: _poppinsFontFamily,
    );
    final poppinsPrimaryTextTheme = base.primaryTextTheme.apply(
      fontFamily: _poppinsFontFamily,
    );

    return base.copyWith(
      colorScheme: riderColorScheme,
      scaffoldBackgroundColor: RiderColors.background,
      textTheme: poppinsTextTheme,
      primaryTextTheme: poppinsPrimaryTextTheme,
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
      textTheme: base.textTheme.apply(fontFamily: _poppinsFontFamily),
      primaryTextTheme: base.primaryTextTheme.apply(
        fontFamily: _poppinsFontFamily,
      ),
    );
  }
}

