import 'package:flutter/material.dart';

import '../theme/spacing/fc_spacing.dart';
import 'fc_loading_indicator.dart';

/// Available visual variants for [FCButton].
enum FCButtonVariant {
  /// Filled prominent button for main actions.
  primary,

  /// Soft filled button for secondary actions.
  secondary,

  /// Outlined border button for tertiary or alternative actions.
  outlined,
}

/// A standardized, accessible action button adhering to Fillcart design specifications.
///
/// Supports [FCButtonVariant.primary], [FCButtonVariant.secondary], and
/// [FCButtonVariant.outlined] styles, with explicit loading and disabled states.
/// Guarantees a minimum touch target of 48x48dp for accessibility.
class FCButton extends StatelessWidget {
  const FCButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = FCButtonVariant.primary,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
  });

  /// The button text label.
  final String text;

  /// Callback when the button is clicked. If null, the button is disabled.
  final VoidCallback? onPressed;

  /// Visual style variant.
  final FCButtonVariant variant;

  /// When true, renders an embedded loading spinner and disables user interaction.
  final bool isLoading;

  /// When true, expands the button to take the maximum available horizontal width.
  final bool isFullWidth;

  /// Optional leading icon.
  final IconData? icon;

  bool get _isEnabled => onPressed != null && !isLoading;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    Widget content;
    if (isLoading) {
      final spinnerColor = switch (variant) {
        FCButtonVariant.primary => colorScheme.onPrimary,
        FCButtonVariant.secondary => colorScheme.onSecondaryContainer,
        FCButtonVariant.outlined => colorScheme.primary,
      };

      content = Center(
        child: FCLoadingIndicator(
          size: 20.0,
          strokeWidth: 2.0,
          color: spinnerColor,
        ),
      );
    } else if (icon != null) {
      content = Row(
        mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 18.0),
          const SizedBox(width: FCSpacing.xs),
          Text(text),
        ],
      );
    } else {
      content = Text(
        text,
        textAlign: TextAlign.center,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      );
    }

    Widget button;
    switch (variant) {
      case FCButtonVariant.primary:
        button = ElevatedButton(
          onPressed: _isEnabled ? onPressed : null,
          child: content,
        );
      case FCButtonVariant.secondary:
        button = FilledButton.tonal(
          onPressed: _isEnabled ? onPressed : null,
          style: FilledButton.styleFrom(
            backgroundColor: colorScheme.secondaryContainer,
            foregroundColor: colorScheme.onSecondaryContainer,
            minimumSize: const Size(
              FCSpacing.minTouchTarget,
              FCSpacing.minTouchTarget,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: FCSpacing.borderRadiusMd,
            ),
            textStyle: theme.textTheme.labelLarge?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          child: content,
        );
      case FCButtonVariant.outlined:
        button = OutlinedButton(
          onPressed: _isEnabled ? onPressed : null,
          child: content,
        );
    }

    if (isFullWidth) {
      button = SizedBox(width: double.infinity, child: button);
    }

    return Semantics(
      button: true,
      enabled: _isEnabled,
      label: text,
      child: ConstrainedBox(
        constraints: const BoxConstraints(
          minHeight: FCSpacing.minTouchTarget,
          minWidth: FCSpacing.minTouchTarget,
        ),
        child: button,
      ),
    );
  }
}
