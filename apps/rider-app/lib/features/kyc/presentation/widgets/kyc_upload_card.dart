import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dashed_border_painter.dart';

/// Reusable upload card component for KYC documents (Figma 1848:51857 & 1848:51861).
///
/// Visual Specifications:
/// - Dimensions: 328 x 116 px
/// - Corner radius: 14 px (13.36 in Figma)
/// - Background: #F8FAFC
/// - Dashed border: 1.5 px #CBD5E1
/// - Icon: Cloud upload 32 px #64748B
/// - Helper text: Montserrat Regular 11.7 px #475569
class KycUploadCard extends StatelessWidget {
  final String helperText;
  final String? attachedFileName;
  final String? attachedFileSize;
  final VoidCallback onUpload;
  final VoidCallback? onRemove;
  final Key? cardKey;
  final String? errorText;

  const KycUploadCard({
    super.key,
    required this.helperText,
    this.attachedFileName,
    this.attachedFileSize,
    required this.onUpload,
    this.onRemove,
    this.cardKey,
    this.errorText,
  });

  bool get isAttached =>
      attachedFileName != null && attachedFileName!.isNotEmpty;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          key: cardKey,
          onTap: onUpload,
          child: CustomPaint(
            painter: DashedBorderPainter(
              color: errorText != null
                  ? const Color(0xFFEF4444)
                  : (isAttached
                        ? const Color(0xFF10B981)
                        : const Color(0xFFCBD5E1)),
              strokeWidth: 1.5,
              radius: 14.0,
            ),
            child: Container(
              width: double.infinity,
              height: 116,
              decoration: BoxDecoration(
                color: isAttached
                    ? const Color(0xFFF0FDF4)
                    : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(14),
              ),
              child: isAttached ? _buildAttachedState() : _buildEmptyState(),
            ),
          ),
        ),
        if (errorText != null) ...[
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.only(left: 4.0),
            child: Text(
              errorText!,
              style: GoogleFonts.poppins(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: const Color(0xFFEF4444),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildEmptyState() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.cloud_upload_outlined,
          size: 32,
          color: Color(0xFF64748B),
        ),
        const SizedBox(height: 8),
        Text(
          helperText,
          style: GoogleFonts.montserrat(
            fontSize: 11.7,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF475569),
          ),
        ),
      ],
    );
  }

  Widget _buildAttachedState() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              color: Color(0xFFDCFCE7),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle_rounded,
              color: Color(0xFF16A34A),
              size: 26,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  attachedFileName!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  attachedFileSize ?? 'Document Attached',
                  style: GoogleFonts.montserrat(
                    fontSize: 11,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          if (onRemove != null)
            IconButton(
              icon: const Icon(
                Icons.delete_outline_rounded,
                size: 20,
                color: Color(0xFF94A3B8),
              ),
              onPressed: onRemove,
              tooltip: 'Remove document',
            ),
        ],
      ),
    );
  }
}
