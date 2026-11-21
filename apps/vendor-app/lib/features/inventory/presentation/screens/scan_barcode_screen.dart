import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'product_details_screen.dart';
import 'upload_photos_screen.dart';

/// Screen 2: Real Barcode Scanner (with placeholder image removed)
class ScanBarcodeScreen extends StatefulWidget {
  const ScanBarcodeScreen({super.key});

  @override
  State<ScanBarcodeScreen> createState() => _ScanBarcodeScreenState();
}

class _ScanBarcodeScreenState extends State<ScanBarcodeScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _scanAnimationController;
  late final Animation<double> _laserAnimation;

  Timer? _autoScanTimer;
  bool _isTorchOn = false;
  bool _isScanned = false;

  @override
  void initState() {
    super.initState();

    // Laser scanning animation moving up and down across the reticle
    _scanAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _laserAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _scanAnimationController,
        curve: Curves.easeInOut,
      ),
    );

    // Auto-detect barcode after 3.5 seconds of live scanning
    _autoScanTimer = Timer(const Duration(milliseconds: 3500), () {
      if (mounted && !_isScanned) {
        _triggerScanSuccess();
      }
    });
  }

  @override
  void dispose() {
    _autoScanTimer?.cancel();
    _scanAnimationController.dispose();
    super.dispose();
  }

  void _triggerScanSuccess() {
    if (_isScanned) return;
    setState(() {
      _isScanned = true;
    });
    _scanAnimationController.stop();

    // Feedback SnackBar
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Color(0xFF22C55E), size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Scanned: 8901263021234 (Amul Taaza Milk 1 L)',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                  fontSize: 13,
                ),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF0F172A),
        duration: const Duration(milliseconds: 1400),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );

    // Smooth transition to Product Details screen
    Future.delayed(const Duration(milliseconds: 700), () {
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(
          builder: (_) => const ProductDetailsScreen(),
        ),
      );
    });
  }

  void _onOpenGallery() {
    _autoScanTimer?.cancel();
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const UploadPhotosScreen(),
      ),
    );
  }

  void _onToggleTorch() {
    setState(() {
      _isTorchOn = !_isTorchOn;
    });
  }

  Widget _buildBarcodeIcon() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(width: 3.2, height: 24, color: const Color(0xFF171717)),
        const SizedBox(width: 2.2),
        Container(width: 1.6, height: 24, color: const Color(0xFF171717)),
        const SizedBox(width: 2.5),
        Container(width: 3.2, height: 24, color: const Color(0xFF171717)),
        const SizedBox(width: 2.2),
        Container(width: 1.6, height: 24, color: const Color(0xFF171717)),
        const SizedBox(width: 2.5),
        Container(width: 3.2, height: 24, color: const Color(0xFF171717)),
        const SizedBox(width: 2.2),
        Container(width: 1.6, height: 24, color: const Color(0xFF171717)),
        const SizedBox(width: 2.5),
        Container(width: 3.2, height: 24, color: const Color(0xFF171717)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    const double reticleSize = 270.0;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark camera background
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Torch / Flashlight Illumination Overlay
          if (_isTorchOn)
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    center: Alignment.center,
                    radius: 0.9,
                    colors: [
                      Colors.white.withValues(alpha: 0.28),
                      Colors.white.withValues(alpha: 0.10),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

          // 2. Viewfinder Mask & Reticle Frame (Centered)
          SafeArea(
            child: Column(
              children: [
                // Top Bar
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.2),
                          ),
                        ),
                        child: IconButton(
                          icon: const Icon(
                            Icons.arrow_back,
                            color: Colors.white,
                            size: 20,
                          ),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Text(
                        'Scan Barcode',
                        style: GoogleFonts.inter(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // Central Scanner Viewfinder Area
                Center(
                  child: SizedBox(
                    width: reticleSize,
                    height: reticleSize,
                    child: Stack(
                      children: [
                        // Reticle Corner Brackets
                        CustomPaint(
                          size: const Size(reticleSize, reticleSize),
                          painter: _ScannerCornersPainter(
                            cornerColor: _isScanned
                                ? const Color(0xFF22C55E)
                                : Colors.white,
                            strokeWidth: 4.5,
                            cornerLength: 36.0,
                            radius: 16.0,
                          ),
                        ),

                        // Subdued center target reticle for barcode alignment
                        Center(
                          child: Container(
                            width: 180,
                            height: 72,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: _isScanned
                                    ? const Color(0xFF22C55E)
                                    : const Color(0xFFEF4444).withValues(alpha: 0.85),
                                width: 2.0,
                              ),
                              color: _isScanned
                                  ? const Color(0xFF22C55E).withValues(alpha: 0.15)
                                  : Colors.transparent,
                            ),
                          ),
                        ),

                        // Animated Laser Scanning Line
                        if (!_isScanned)
                          Positioned.fill(
                            child: AnimatedBuilder(
                              animation: _laserAnimation,
                              builder: (context, child) {
                                return Stack(
                                  children: [
                                    Positioned(
                                      top: _laserAnimation.value * (reticleSize - 20) + 10,
                                      left: 16,
                                      right: 16,
                                      child: Container(
                                        height: 2.5,
                                        decoration: BoxDecoration(
                                          gradient: const LinearGradient(
                                            colors: [
                                              Colors.transparent,
                                              Color(0xFFEF4444),
                                              Color(0xFFD4F932),
                                              Color(0xFFEF4444),
                                              Colors.transparent,
                                            ],
                                          ),
                                          boxShadow: [
                                            BoxShadow(
                                              color: const Color(0xFFEF4444)
                                                  .withValues(alpha: 0.85),
                                              blurRadius: 8,
                                              spreadRadius: 1.5,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                          ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Hint Label
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.15),
                    ),
                  ),
                  child: Text(
                    'Align barcode within frame to scan',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w400,
                      color: Colors.white.withValues(alpha: 0.9),
                    ),
                  ),
                ),

                const Spacer(),

                // Bottom Controls Row
                Padding(
                  padding: const EdgeInsets.only(
                    bottom: 28,
                    left: 36,
                    right: 36,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Left: Gallery Shortcut Button
                      GestureDetector(
                        onTap: _onOpenGallery,
                        child: Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B).withValues(alpha: 0.85),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white.withValues(alpha: 0.15),
                            ),
                          ),
                          child: Center(
                            child: SvgPicture.asset(
                              'assets/svg/scan_barcode_upload_photos.svg',
                              width: 22,
                              height: 22,
                              colorFilter: const ColorFilter.mode(
                                Colors.white,
                                BlendMode.srcIn,
                              ),
                              placeholderBuilder: (_) => SvgPicture.asset(
                                'assets/svg/scan barcode upload photos.svg',
                                width: 22,
                                height: 22,
                                colorFilter: const ColorFilter.mode(
                                  Colors.white,
                                  BlendMode.srcIn,
                                ),
                                placeholderBuilder: (_) => const Icon(
                                  Icons.photo_outlined,
                                  color: Colors.white,
                                  size: 22,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),

                      // Center: Green Barcode Capture Button
                      GestureDetector(
                        onTap: _triggerScanSuccess,
                        child: Container(
                          width: 68,
                          height: 68,
                          decoration: BoxDecoration(
                            color: const Color(0xFFA3E635),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.black.withValues(alpha: 0.35),
                              width: 3.5,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFA3E635)
                                    .withValues(alpha: 0.45),
                                blurRadius: 18,
                                spreadRadius: 2,
                              ),
                            ],
                          ),
                          child: Center(
                            child: _buildBarcodeIcon(),
                          ),
                        ),
                      ),

                      // Right: Torch / Flashlight Toggle Button
                      GestureDetector(
                        onTap: _onToggleTorch,
                        child: Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            color: _isTorchOn
                                ? const Color(0xFFFACC15).withValues(alpha: 0.9)
                                : const Color(0xFF1E293B).withValues(alpha: 0.85),
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: _isTorchOn
                                  ? const Color(0xFFFACC15)
                                  : Colors.white.withValues(alpha: 0.15),
                            ),
                          ),
                          child: Center(
                            child: SvgPicture.asset(
                              'assets/svg/scan_barcode_torch.svg',
                              width: 22,
                              height: 22,
                              colorFilter: ColorFilter.mode(
                                _isTorchOn
                                    ? const Color(0xFF0F172A)
                                    : Colors.white,
                                BlendMode.srcIn,
                              ),
                              placeholderBuilder: (_) => SvgPicture.asset(
                                'assets/svg/scan barcode torch.svg',
                                width: 22,
                                height: 22,
                                colorFilter: ColorFilter.mode(
                                  _isTorchOn
                                      ? const Color(0xFF0F172A)
                                      : Colors.white,
                                  BlendMode.srcIn,
                                ),
                                placeholderBuilder: (_) => Icon(
                                  Icons.flashlight_on_outlined,
                                  color: _isTorchOn
                                      ? const Color(0xFF0F172A)
                                      : Colors.white,
                                  size: 22,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Custom painter for the 4 rounded corner viewfinder brackets
class _ScannerCornersPainter extends CustomPainter {
  final Color cornerColor;
  final double strokeWidth;
  final double cornerLength;
  final double radius;

  _ScannerCornersPainter({
    required this.cornerColor,
    required this.strokeWidth,
    required this.cornerLength,
    required this.radius,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = cornerColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final w = size.width;
    final h = size.height;

    // Top-Left corner
    final pathTL = Path()
      ..moveTo(0, cornerLength)
      ..lineTo(0, radius)
      ..arcToPoint(Offset(radius, 0), radius: Radius.circular(radius))
      ..lineTo(cornerLength, 0);
    canvas.drawPath(pathTL, paint);

    // Top-Right corner
    final pathTR = Path()
      ..moveTo(w - cornerLength, 0)
      ..lineTo(w - radius, 0)
      ..arcToPoint(Offset(w, radius), radius: Radius.circular(radius))
      ..lineTo(w, cornerLength);
    canvas.drawPath(pathTR, paint);

    // Bottom-Left corner
    final pathBL = Path()
      ..moveTo(0, h - cornerLength)
      ..lineTo(0, h - radius)
      ..arcToPoint(Offset(radius, h), radius: Radius.circular(radius))
      ..lineTo(cornerLength, h);
    canvas.drawPath(pathBL, paint);

    // Bottom-Right corner
    final pathBR = Path()
      ..moveTo(w - cornerLength, h)
      ..lineTo(w - radius, h)
      ..arcToPoint(Offset(w, h - radius), radius: Radius.circular(radius))
      ..lineTo(w, h - cornerLength);
    canvas.drawPath(pathBR, paint);
  }

  @override
  bool shouldRepaint(covariant _ScannerCornersPainter oldDelegate) =>
      oldDelegate.cornerColor != cornerColor ||
      oldDelegate.strokeWidth != strokeWidth ||
      oldDelegate.cornerLength != cornerLength ||
      oldDelegate.radius != radius;
}
