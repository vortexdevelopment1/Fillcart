import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Shared top header for Multi-Order screens.
///
/// Supports:
/// - Left-aligned title with back arrow (`showBackButton: true`).
/// - Centered title without back arrow (`showBackButton: false`).
class MultiOrderHeader extends StatelessWidget {
  final String title;
  final bool showBackButton;
  final VoidCallback? onBack;
  final bool? centerTitle;
  final Key? backButtonKey;

  const MultiOrderHeader({
    super.key,
    required this.title,
    this.showBackButton = true,
    this.onBack,
    this.centerTitle,
    this.backButtonKey,
  });

  @override
  Widget build(BuildContext context) {
    final isCentered = centerTitle ?? !showBackButton;

    return SizedBox(
      width: double.infinity,
      height: 30,
      child: Row(
        children: [
          if (showBackButton) ...[
            InkWell(
              key: backButtonKey ?? const Key('multi_order_header_back_button'),
              onTap: onBack,
              borderRadius: BorderRadius.circular(16),
              child: const SizedBox(
                width: 24,
                height: 24,
                child: Center(
                  child: Icon(
                    Icons.arrow_back,
                    size: 24,
                    color: Color(0xFF000000),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Text(
              title,
              key: const Key('multi_order_header_title'),
              textAlign: isCentered ? TextAlign.center : TextAlign.left,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF000000),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
