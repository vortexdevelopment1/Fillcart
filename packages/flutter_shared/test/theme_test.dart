import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('FCTheme and Design Tokens Unit Tests', () {
    test('FCTheme.lightTheme initializes valid Material 3 ThemeData', () {
      final theme = FCTheme.lightTheme;

      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.light);
      expect(theme.colorScheme.primary, FCColors.lightPrimary);
      expect(theme.colorScheme.surface, FCColors.lightSurface);
      expect(theme.colorScheme.error, FCColors.lightError);
      expect(theme.scaffoldBackgroundColor, FCColors.lightSurface);
      expect(theme.textTheme.bodyMedium, isNotNull);
      expect(theme.appBarTheme.elevation, 0);
    });

    test('FCTheme.darkTheme initializes valid Material 3 ThemeData', () {
      final theme = FCTheme.darkTheme;

      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.dark);
      expect(theme.colorScheme.primary, FCColors.darkPrimary);
      expect(theme.colorScheme.surface, FCColors.darkSurface);
      expect(theme.colorScheme.error, FCColors.darkError);
      expect(theme.scaffoldBackgroundColor, FCColors.darkSurface);
      expect(theme.textTheme.bodyMedium, isNotNull);
    });

    test('FCSpacing grid tokens conform to 4px/8px incremental scale', () {
      expect(FCSpacing.xxxs, 2.0);
      expect(FCSpacing.xxs, 4.0);
      expect(FCSpacing.xs, 8.0);
      expect(FCSpacing.sm, 12.0);
      expect(FCSpacing.md, 16.0);
      expect(FCSpacing.lg, 24.0);
      expect(FCSpacing.xl, 32.0);
      expect(FCSpacing.xxl, 48.0);
      expect(FCSpacing.xxxl, 64.0);

      expect(FCSpacing.minTouchTarget, 48.0);
    });

    test(
      'FCSpacing border radius tokens are non-negative and properly scaled',
      () {
        expect(FCSpacing.radiusXs, 4.0);
        expect(FCSpacing.radiusSm, 8.0);
        expect(FCSpacing.radiusMd, 12.0);
        expect(FCSpacing.radiusLg, 16.0);
        expect(FCSpacing.radiusXl, 24.0);
        expect(FCSpacing.radiusFull, 999.0);
      },
    );

    test(
      'FCTypography textTheme generates complete Material 3 typography scale',
      () {
        const sampleColor = Colors.black87;
        final textTheme = FCTypography.createTextTheme(sampleColor);

        expect(textTheme.displayLarge?.fontSize, 57.0);
        expect(textTheme.displayMedium?.fontSize, 45.0);
        expect(textTheme.displaySmall?.fontSize, 36.0);

        expect(textTheme.headlineLarge?.fontSize, 32.0);
        expect(textTheme.headlineMedium?.fontSize, 28.0);
        expect(textTheme.headlineSmall?.fontSize, 24.0);

        expect(textTheme.titleLarge?.fontSize, 22.0);
        expect(textTheme.titleMedium?.fontSize, 16.0);
        expect(textTheme.titleSmall?.fontSize, 14.0);

        expect(textTheme.bodyLarge?.fontSize, 16.0);
        expect(textTheme.bodyMedium?.fontSize, 14.0);
        expect(textTheme.bodySmall?.fontSize, 12.0);

        expect(textTheme.labelLarge?.fontSize, 14.0);
        expect(textTheme.labelMedium?.fontSize, 12.0);
        expect(textTheme.labelSmall?.fontSize, 11.0);

        expect(textTheme.bodyMedium?.color, sampleColor);
      },
    );
  });
}
