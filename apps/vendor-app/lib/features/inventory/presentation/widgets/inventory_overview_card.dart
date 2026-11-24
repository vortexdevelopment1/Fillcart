import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

/// Single metric overview card for the 2x2 inventory summary dashboard (Image 2).
class InventoryOverviewCard extends StatelessWidget {
  final String svgPath;
  final String? title;
  final String count;
  final Color backgroundColor;
  final Color countColor;
  final Color? titleColor;
  final VoidCallback? onTap;

  const InventoryOverviewCard({
    super.key,
    required this.svgPath,
    this.title,
    required this.count,
    required this.backgroundColor,
    required this.countColor,
    this.titleColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 104,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                SizedBox(
                  width: 22,
                  height: 22,
                  child: SvgPicture.asset(
                    svgPath,
                    fit: BoxFit.contain,
                    errorBuilder: (context, error, stackTrace) {
                      final fallback = svgPath.replaceAll(' ', '_').toLowerCase();
                      if (fallback != svgPath) {
                        return SvgPicture.asset(fallback, fit: BoxFit.contain);
                      }
                      return const SizedBox();
                    },
                  ),
                ),
                if (title != null) ...[
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      title!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: titleColor ?? const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                ],
              ],
            ),
            Text(
              count,
              style: GoogleFonts.inter(
                fontSize: 26,
                fontWeight: FontWeight.w600,
                color: countColor,
                height: 1.0,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
