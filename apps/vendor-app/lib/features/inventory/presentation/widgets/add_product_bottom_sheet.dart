import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import '../screens/product_details_screen.dart';
import '../screens/scan_barcode_screen.dart';
import '../screens/upload_photos_screen.dart';

/// Modal Bottom Sheet for "Add Product" (Image 1)
class AddProductBottomSheet extends StatelessWidget {
  const AddProductBottomSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const AddProductBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(24),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Title
          Text(
            'Add Product',
            style: GoogleFonts.inter(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 8),

          // Subtitle
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Upload a photo or scan the barcode to fetch product details automatically.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF64748B),
                height: 1.4,
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Option 1: Upload Photos
          _buildOptionTile(
            context: context,
            svgPrimary: 'assets/svg/upload_photos.svg',
            svgFallback: 'assets/svg/upload photos.svg',
            title: 'Upload Photos',
            subtitle: 'Front & back of the product',
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const UploadPhotosScreen(),
                ),
              );
            },
          ),
          const SizedBox(height: 12),

          // Option 2: Scan Barcode
          _buildOptionTile(
            context: context,
            svgPrimary: 'assets/svg/scan_barcode.svg',
            svgFallback: 'assets/svg/scan barcode.svg',
            title: 'Scan Barcode',
            subtitle: 'Use product barcode / QR',
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const ScanBarcodeScreen(),
                ),
              );
            },
          ),
          const SizedBox(height: 12),

          // Option 3: Add Manually
          _buildOptionTile(
            context: context,
            svgPrimary: 'assets/svg/add_manually.svg',
            svgFallback: 'assets/svg/add manually.svg',
            title: 'Add Manually',
            subtitle: 'Enter details yourself',
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const ProductDetailsScreen(),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildOptionTile({
    required BuildContext context,
    required String svgPrimary,
    required String svgFallback,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                // Icon
                SizedBox(
                  width: 48,
                  height: 48,
                  child: SvgPicture.asset(
                    svgPrimary,
                    width: 48,
                    height: 48,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) =>
                        SvgPicture.asset(
                      svgFallback,
                      width: 48,
                      height: 48,
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
                const SizedBox(width: 14),

                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),

                // Right Arrow
                const Icon(
                  Icons.chevron_right,
                  color: Color(0xFF94A3B8),
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
