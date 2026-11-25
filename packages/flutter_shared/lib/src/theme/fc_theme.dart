import 'package:flutter/material.dart';

import 'colors/fc_colors.dart';
import 'spacing/fc_spacing.dart';
import 'typography/fc_typography.dart';

/// Central Material 3 Theme definition for Fillcart mobile applications.
abstract final class FCTheme {
  /// Light Theme Configuration
  static ThemeData get lightTheme {
    const colorScheme = ColorScheme(
      brightness: Brightness.light,
      primary: FCColors.lightPrimary,
      onPrimary: FCColors.lightOnPrimary,
      primaryContainer: FCColors.lightPrimaryContainer,
      onPrimaryContainer: FCColors.lightOnPrimaryContainer,
      secondary: FCColors.lightSecondary,
      onSecondary: FCColors.lightOnSecondary,
      secondaryContainer: FCColors.lightSecondaryContainer,
      onSecondaryContainer: FCColors.lightOnSecondaryContainer,
      surface: FCColors.lightSurface,
      onSurface: FCColors.lightOnSurface,
      surfaceContainerHighest: FCColors.lightSurfaceVariant,
      onSurfaceVariant: FCColors.lightOnSurfaceVariant,
      error: FCColors.lightError,
      onError: FCColors.lightOnError,
      errorContainer: FCColors.lightErrorContainer,
      onErrorContainer: FCColors.lightOnErrorContainer,
      outline: FCColors.lightOutline,
      outlineVariant: FCColors.lightOutlineVariant,
    );

    return _buildTheme(colorScheme, FCColors.lightOnSurface);
  }

  /// Dark Theme Configuration
  static ThemeData get darkTheme {
    const colorScheme = ColorScheme(
      brightness: Brightness.dark,
      primary: FCColors.darkPrimary,
      onPrimary: FCColors.darkOnPrimary,
      primaryContainer: FCColors.darkPrimaryContainer,
      onPrimaryContainer: FCColors.darkOnPrimaryContainer,
      secondary: FCColors.darkSecondary,
      onSecondary: FCColors.darkOnSecondary,
      secondaryContainer: FCColors.darkSecondaryContainer,
      onSecondaryContainer: FCColors.darkOnSecondaryContainer,
      surface: FCColors.darkSurface,
      onSurface: FCColors.darkOnSurface,
      surfaceContainerHighest: FCColors.darkSurfaceVariant,
      onSurfaceVariant: FCColors.darkOnSurfaceVariant,
      error: FCColors.darkError,
      onError: FCColors.darkOnError,
      errorContainer: FCColors.darkErrorContainer,
      onErrorContainer: FCColors.darkOnErrorContainer,
      outline: FCColors.darkOutline,
      outlineVariant: FCColors.darkOutlineVariant,
    );

    return _buildTheme(colorScheme, FCColors.darkOnSurface);
  }

  static ThemeData _buildTheme(ColorScheme colorScheme, Color textColor) {
    final textTheme = FCTypography.createTextTheme(textColor);

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      textTheme: textTheme,

      // App Bar Theme
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.surface,
        foregroundColor: colorScheme.onSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: textTheme.titleLarge?.copyWith(
          color: colorScheme.onSurface,
          fontWeight: FontWeight.w600,
        ),
      ),

      // Elevated Button Theme (Primary Action)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          minimumSize: const Size(
            FCSpacing.minTouchTarget,
            FCSpacing.minTouchTarget,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: FCSpacing.lg,
            vertical: FCSpacing.sm,
          ),
          shape: const RoundedRectangleBorder(borderRadius: FCSpacing.borderRadiusMd),
          textStyle: textTheme.labelLarge?.copyWith(
            fontWeight: FontWeight.w600,
          ),
          elevation: 0,
        ),
      ),

      // Outlined Button Theme (Secondary Action)
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: colorScheme.primary,
          minimumSize: const Size(
            FCSpacing.minTouchTarget,
            FCSpacing.minTouchTarget,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: FCSpacing.lg,
            vertical: FCSpacing.sm,
          ),
          side: BorderSide(color: colorScheme.outline, width: 1.5),
          shape: const RoundedRectangleBorder(borderRadius: FCSpacing.borderRadiusMd),
          textStyle: textTheme.labelLarge?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Input Decoration Theme (Text Fields)
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: FCSpacing.md,
          vertical: FCSpacing.md,
        ),
        border: OutlineInputBorder(
          borderRadius: FCSpacing.borderRadiusMd,
          borderSide: BorderSide(color: colorScheme.outlineVariant),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: FCSpacing.borderRadiusMd,
          borderSide: BorderSide(color: colorScheme.outlineVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: FCSpacing.borderRadiusMd,
          borderSide: BorderSide(color: colorScheme.primary, width: 2.0),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: FCSpacing.borderRadiusMd,
          borderSide: BorderSide(color: colorScheme.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: FCSpacing.borderRadiusMd,
          borderSide: BorderSide(color: colorScheme.error, width: 2.0),
        ),
        labelStyle: textTheme.bodyMedium?.copyWith(
          color: colorScheme.onSurfaceVariant,
        ),
        hintStyle: textTheme.bodyMedium?.copyWith(
          color: colorScheme.onSurfaceVariant.withValues(alpha: 0.7),
        ),
        errorStyle: textTheme.bodySmall?.copyWith(color: colorScheme.error),
      ),

      // Card Theme
      cardTheme: CardThemeData(
        color: colorScheme.surface,
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: FCSpacing.borderRadiusMd,
          side: BorderSide(
            color: colorScheme.outlineVariant.withValues(alpha: 0.5),
          ),
        ),
        margin: FCSpacing.edgeInsetsSm,
      ),

      // Progress Indicator Theme
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: colorScheme.primary,
        linearTrackColor: colorScheme.primaryContainer,
      ),
    );
  }
}
