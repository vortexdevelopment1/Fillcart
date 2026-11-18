import 'package:flutter/material.dart';

import '../theme/spacing/fc_spacing.dart';
import 'fc_button.dart';

/// Reusable error presentation view with optional retry action.
class FCErrorView extends StatelessWidget {
  const FCErrorView({
    super.key,
    required this.message,
    this.title = 'Something went wrong',
    this.onRetry,
    this.retryButtonText = 'Try Again',
    this.icon = Icons.error_outline_rounded,
  });

  /// The primary explanation or description of the error.
  final String message;

  /// Optional header title. Defaults to 'Something went wrong'.
  final String title;

  /// Optional retry callback. When provided, renders a retry button.
  final VoidCallback? onRetry;

  /// Label for the retry button. Defaults to 'Try Again'.
  final String retryButtonText;

  /// The icon displayed above the error text.
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Center(
      child: Padding(
        padding: FCSpacing.edgeInsetsLg,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(icon, size: 56.0, color: colorScheme.error),
            const SizedBox(height: FCSpacing.md),
            Text(
              title,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: FCSpacing.xs),
            Text(
              message,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: FCSpacing.lg),
              FCButton(
                text: retryButtonText,
                onPressed: onRetry,
                variant: FCButtonVariant.outlined,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
