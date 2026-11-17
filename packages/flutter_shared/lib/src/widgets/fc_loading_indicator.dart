import 'package:flutter/material.dart';

/// Standardized loading activity indicator for Fillcart applications.
class FCLoadingIndicator extends StatelessWidget {
  const FCLoadingIndicator({
    super.key,
    this.size = 24.0,
    this.strokeWidth = 2.5,
    this.color,
  });

  /// The diameter of the circular progress indicator.
  final double size;

  /// The width of the circular progress indicator line.
  final double strokeWidth;

  /// Optional override for the indicator color. Defaults to Theme primary color.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CircularProgressIndicator(
        strokeWidth: strokeWidth,
        valueColor: color != null
            ? AlwaysStoppedAnimation<Color>(color!)
            : null,
      ),
    );
  }
}
