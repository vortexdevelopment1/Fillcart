import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:flutter/material.dart';

/// Authoritative Fillcart Brand Logo widget displaying official brand asset.
class FCBrandLogo extends StatelessWidget {
  final double? size;
  final double? width;
  final double? height;

  const FCBrandLogo({
    super.key,
    this.size,
    this.width,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveWidth = width ?? size ?? 180.0;
    final effectiveHeight = height ?? size ?? 180.0;

    return Image.asset(
      AppAssets.yellowThemeLogo,
      width: effectiveWidth,
      height: effectiveHeight,
      fit: BoxFit.contain,
    );
  }
}
