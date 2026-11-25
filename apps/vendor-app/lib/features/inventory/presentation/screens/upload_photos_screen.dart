import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'product_details_screen.dart';

/// Screen 4: Upload Photos (matching Image 4)
class UploadPhotosScreen extends StatefulWidget {
  const UploadPhotosScreen({super.key});

  @override
  State<UploadPhotosScreen> createState() => _UploadPhotosScreenState();
}

class _UploadPhotosScreenState extends State<UploadPhotosScreen> {
  bool _hasFrontPhoto = false;
  bool _hasBackPhoto = false;

  void _onAddFrontPhoto() {
    setState(() {
      _hasFrontPhoto = !_hasFrontPhoto;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _hasFrontPhoto ? 'Front photo captured' : 'Front photo cleared',
          style: const TextStyle(
            fontFamily: 'Inter',
            color: Colors.white,
          ),
        ),
        duration: const Duration(seconds: 1),
        backgroundColor: const Color(0xFF111827),
      ),
    );
  }

  void _onAddBackPhoto() {
    setState(() {
      _hasBackPhoto = !_hasBackPhoto;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _hasBackPhoto ? 'Back photo captured' : 'Back photo cleared',
          style: const TextStyle(
            fontFamily: 'Inter',
            color: Colors.white,
          ),
        ),
        duration: const Duration(seconds: 1),
        backgroundColor: const Color(0xFF111827),
      ),
    );
  }

  void _onContinue() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const ProductDetailsScreen(),
      ),
    );
  }

  Widget _buildSvg({
    required String primaryPath,
    required String fallbackPath,
    required double width,
    required double height,
    Color? color,
  }) {
    return SvgPicture.asset(
      primaryPath,
      width: width,
      height: height,
      colorFilter: color != null
          ? ColorFilter.mode(color, BlendMode.srcIn)
          : null,
      placeholderBuilder: (_) => SvgPicture.asset(
        fallbackPath,
        width: width,
        height: height,
        colorFilter: color != null
            ? ColorFilter.mode(color, BlendMode.srcIn)
            : null,
        placeholderBuilder: (_) => Icon(
          Icons.camera_alt_outlined,
          size: width,
          color: color ?? const Color(0xFF111827),
        ),
      ),
    );
  }

  Widget _buildPhotoCard({
    required String title,
    required String subtitle,
    required bool isCaptured,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: CustomPaint(
        painter: DashedBorderPainter(
          color: isCaptured ? const Color(0xFF16A34A) : const Color(0xFF374151),
          strokeWidth: 1.2,
          radius: 16.0,
          dashLength: 5.0,
          dashGap: 4.0,
        ),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 20),
          decoration: BoxDecoration(
            color: isCaptured ? const Color(0xFFF0FDF4) : Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Center(
                  child: isCaptured
                      ? const Icon(
                          Icons.check_circle,
                          color: Color(0xFF16A34A),
                          size: 32,
                        )
                      : _buildSvg(
                          primaryPath: 'assets/svg/add_front_photo.svg',
                          fallbackPath: 'assets/svg/add front photo.svg',
                          width: 26,
                          height: 26,
                          color: const Color(0xFF047857),
                        ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 13,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        toolbarHeight: 52,
        leadingWidth: 52,
        centerTitle: false,
        titleSpacing: 12,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: Center(
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: const Color.fromRGBO(255, 255, 255, 0.36),
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [
                  BoxShadow(
                    offset: Offset(0, 1),
                    blurRadius: 2,
                    spreadRadius: 0,
                    color: Color(0x1A000000),
                  ),
                ],
              ),
              child: IconButton(
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                icon: SvgPicture.asset(
                  AppAssets.svgBackArrow,
                  width: 20,
                  height: 20,
                  colorFilter: const ColorFilter.mode(
                    Color(0xFF111827),
                    BlendMode.srcIn,
                  ),
                ),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
          ),
        ),
        title: const Text(
          'Upload Photos',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827),
            height: 28 / 20,
            letterSpacing: -0.2,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                child: Column(
                  children: [
                    _buildPhotoCard(
                      title: 'Add Front Photo',
                      subtitle: 'Tap to capture barcode, brand logo, and item title',
                      isCaptured: _hasFrontPhoto,
                      onTap: _onAddFrontPhoto,
                    ),
                    const SizedBox(height: 16),
                    _buildPhotoCard(
                      title: 'Add Back Photo',
                      subtitle: 'Nutritional info, MRP & Expiry date',
                      isCaptured: _hasBackPhoto,
                      onTap: _onAddBackPhoto,
                    ),
                  ],
                ),
              ),
            ),
            // Bottom Continue Button
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _onContinue,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC8F169),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Continue',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF111827),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Custom painter for rounded rect dashed borders
class DashedBorderPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double radius;
  final double dashLength;
  final double dashGap;

  const DashedBorderPainter({
    this.color = const Color(0xFF9CA3AF),
    this.strokeWidth = 1.2,
    this.radius = 16.0,
    this.dashLength = 5.0,
    this.dashGap = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    final rrect = RRect.fromRectAndRadius(
      Rect.fromLTWH(
        strokeWidth / 2,
        strokeWidth / 2,
        size.width - strokeWidth,
        size.height - strokeWidth,
      ),
      Radius.circular(radius),
    );

    final path = Path()..addRRect(rrect);
    final metrics = path.computeMetrics();

    for (final metric in metrics) {
      double distance = 0.0;
      while (distance < metric.length) {
        final next = distance + dashLength;
        final extractPath = metric.extractPath(
          distance,
          next > metric.length ? metric.length : next,
        );
        canvas.drawPath(extractPath, paint);
        distance += dashLength + dashGap;
      }
    }
  }

  @override
  bool shouldRepaint(covariant DashedBorderPainter oldDelegate) {
    return oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth ||
        oldDelegate.radius != radius ||
        oldDelegate.dashLength != dashLength ||
        oldDelegate.dashGap != dashGap;
  }
}
