import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:flutter/material.dart';

/// Reusable map widget displaying the Mahalaxmi Nagar Indore map
/// with pixel-accurate location pin and accuracy indicators.
class LocationMapView extends StatelessWidget {
  /// When true, renders the larger semi-transparent accuracy radius circle.
  final bool isAccuracyMode;

  const LocationMapView({
    super.key,
    this.isAccuracyMode = false,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Dot coordinates matching Figma reference (44.35% x, 45.41% y)
        final dotX = constraints.maxWidth * 0.4435;
        final dotY = constraints.maxHeight * 0.4541;

        return Stack(
          children: [
            // Full-bleed map background
            Positioned.fill(
              child: Image.asset(
                AppAssets.mapBg,
                fit: BoxFit.cover,
                alignment: Alignment.topCenter,
              ),
            ),

            // Location Pin with Halo or Accuracy Radius
            Positioned(
              left: dotX - (isAccuracyMode ? 48 : 17),
              top: dotY - (isAccuracyMode ? 48 : 17),
              child: isAccuracyMode
                  ? _buildAccuracyIndicator()
                  : _buildStandardIndicator(),
            ),
          ],
        );
      },
    );
  }

  Widget _buildStandardIndicator() {
    return SizedBox(
      width: 34,
      height: 34,
      child: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Outer subtle halo
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: const Color(0xFF2979FF).withValues(alpha: 0.22),
                shape: BoxShape.circle,
              ),
            ),
            // Inner solid blue dot with white border
            Container(
              width: 14,
              height: 14,
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF2563EB).withValues(alpha: 0.4),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccuracyIndicator() {
    return SizedBox(
      width: 96,
      height: 96,
      child: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Large semi-transparent accuracy circle with subtle border
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                color: const Color(0xFF2979FF).withValues(alpha: 0.16),
                shape: BoxShape.circle,
                border: Border.all(
                  color: const Color(0xFF2979FF).withValues(alpha: 0.35),
                  width: 1.2,
                ),
              ),
            ),
            // Inner solid blue dot with white border
            Container(
              width: 14,
              height: 14,
              decoration: BoxDecoration(
                color: const Color(0xFF2563EB),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF2563EB).withValues(alpha: 0.4),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
