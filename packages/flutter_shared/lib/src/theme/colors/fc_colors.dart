import 'package:flutter/material.dart';

/// Semantic design colors for the Fillcart mobile ecosystem.
///
/// NOTE: This provides a neutral, temporary Material 3 palette for scaffolding
/// and development. Official Fillcart brand colors, tokens, and asset values
/// will be dropped in here once formally approved by the project owner.
abstract final class FCColors {
  // Neutral Material 3 Seed
  static const Color seedColor = Color(0xFF455A64); // Blue Grey neutral seed

  // Light Theme Semantic Palette
  static const Color lightPrimary = Color(0xFFC8F169);
  static const Color lightOnPrimary = Color(0xFF111827);
  static const Color lightPrimaryContainer = Color(0xFFECEFF1);
  static const Color lightOnPrimaryContainer = Color(0xFF102027);

  static const Color lightSecondary = Color(0xFF546E7A);
  static const Color lightOnSecondary = Color(0xFFFFFFFF);
  static const Color lightSecondaryContainer = Color(0xFFCFD8DC);
  static const Color lightOnSecondaryContainer = Color(0xFF263238);

  static const Color lightSurface = Color(0xFFFAFAFA);
  static const Color lightOnSurface = Color(0xFF212121);
  static const Color lightSurfaceVariant = Color(0xFFECEFF1);
  static const Color lightOnSurfaceVariant = Color(0xFF455A64);

  static const Color lightBackground = Color(0xFFFFFFFF);
  static const Color lightOnBackground = Color(0xFF212121);

  static const Color lightError = Color(0xFFD32F2F);
  static const Color lightOnError = Color(0xFFFFFFFF);
  static const Color lightErrorContainer = Color(0xFFFFCDD2);
  static const Color lightOnErrorContainer = Color(0xFFB71C1C);

  static const Color lightOutline = Color(0xFFB0BEC5);
  static const Color lightOutlineVariant = Color(0xFFCFD8DC);

  // Dark Theme Semantic Palette
  static const Color darkPrimary = Color(0xFFCFD8DC);
  static const Color darkOnPrimary = Color(0xFF263238);
  static const Color darkPrimaryContainer = Color(0xFF37474F);
  static const Color darkOnPrimaryContainer = Color(0xFFECEFF1);

  static const Color darkSecondary = Color(0xFFB0BEC5);
  static const Color darkOnSecondary = Color(0xFF263238);
  static const Color darkSecondaryContainer = Color(0xFF455A64);
  static const Color darkOnSecondaryContainer = Color(0xFFECEFF1);

  static const Color darkSurface = Color(0xFF121212);
  static const Color darkOnSurface = Color(0xFFE0E0E0);
  static const Color darkSurfaceVariant = Color(0xFF263238);
  static const Color darkOnSurfaceVariant = Color(0xFFB0BEC5);

  static const Color darkBackground = Color(0xFF121212);
  static const Color darkOnBackground = Color(0xFFE0E0E0);

  static const Color darkError = Color(0xFFEF5350);
  static const Color darkOnError = Color(0xFF000000);
  static const Color darkErrorContainer = Color(0xFFB71C1C);
  static const Color darkOnErrorContainer = Color(0xFFFFCDD2);

  static const Color darkOutline = Color(0xFF78909C);
  static const Color darkOutlineVariant = Color(0xFF455A64);

  // Common Semantic Status Colors
  static const Color success = Color(0xFF2E7D32);
  static const Color warning = Color(0xFFED6C02);
  static const Color info = Color(0xFF0288D1);
}
