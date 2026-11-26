import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:flutter/material.dart';

/// Authoritative walkthrough illustration widget rendering official assets.
class WalkthroughIllustration extends StatelessWidget {
  final int step;

  const WalkthroughIllustration({super.key, required this.step});

  @override
  Widget build(BuildContext context) {
    final assetPath = switch (step) {
      0 => AppAssets.storeShoppingIllustration,
      1 => AppAssets.scooterDeliveryIllustration,
      _ => AppAssets.doorstepHandoverIllustration,
    };

    final screenWidth = MediaQuery.sizeOf(context).width;
    // Original asset dimension is 656 x 494 (aspect ratio 1.328)
    final illustrationWidth = (screenWidth * 0.88).clamp(260.0, 420.0);
    final illustrationHeight = illustrationWidth / 1.328;

    return Center(
      child: Image.asset(
        assetPath,
        width: illustrationWidth,
        height: illustrationHeight,
        fit: BoxFit.contain,
      ),
    );
  }
}
