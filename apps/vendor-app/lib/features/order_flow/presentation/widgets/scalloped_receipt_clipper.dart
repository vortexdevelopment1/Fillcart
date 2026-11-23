import 'package:flutter/material.dart';

/// Custom clipper that creates a scalloped (wavy saw-tooth) bottom edge
/// for receipt ticket cards.
class ScallopedTicketClipper extends CustomClipper<Path> {
  const ScallopedTicketClipper({
    this.waveRadius = 12.0,
    this.topRadius = 16.0,
  });

  final double waveRadius;
  final double topRadius;

  @override
  Path getClip(Size size) {
    final path = Path();
    // Top-left rounded corner
    path.moveTo(0, topRadius);
    path.quadraticBezierTo(0, 0, topRadius, 0);

    // Top edge
    path.lineTo(size.width - topRadius, 0);

    // Top-right rounded corner
    path.quadraticBezierTo(size.width, 0, size.width, topRadius);

    // Right edge down to scalloped bottom
    path.lineTo(size.width, size.height - waveRadius);

    // Bottom scalloped waves
    final diameter = waveRadius * 2;
    final waveCount = (size.width / diameter).floor();
    final remainingWidth = size.width - (waveCount * diameter);
    final adjustedDiameter = diameter + (remainingWidth / waveCount);
    final adjustedRadius = adjustedDiameter / 2;

    double currentX = size.width;
    for (int i = 0; i < waveCount; i++) {
      path.arcToPoint(
        Offset(currentX - adjustedDiameter, size.height - waveRadius),
        radius: Radius.circular(adjustedRadius),
        clockwise: false,
      );
      currentX -= adjustedDiameter;
    }

    path.lineTo(0, size.height - waveRadius);

    // Left edge back to top
    path.lineTo(0, topRadius);
    path.close();

    return path;
  }

  @override
  bool shouldReclip(covariant ScallopedTicketClipper oldClipper) {
    return oldClipper.waveRadius != waveRadius ||
        oldClipper.topRadius != topRadius;
  }
}
