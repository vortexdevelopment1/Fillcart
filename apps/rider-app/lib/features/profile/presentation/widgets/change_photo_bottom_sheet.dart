import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/rider_profile_model.dart';

/// Modal bottom sheet matching Figma "Change Profile Photo" design.
Future<ProfilePhotoSource?> showChangePhotoBottomSheet(BuildContext context) {
  return showModalBottomSheet<ProfilePhotoSource>(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (sheetContext) => const _ChangePhotoBottomSheet(),
  );
}

class _ChangePhotoBottomSheet extends StatelessWidget {
  const _ChangePhotoBottomSheet();

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('change_photo_bottom_sheet'),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFD1D5DB),
                borderRadius: BorderRadius.circular(999),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              'Change Profile Photo',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Choose an option to update your photo',
              style: GoogleFonts.poppins(
                fontSize: 13,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 18),
            _PhotoOptionTile(
              key: const Key('photo_option_gallery'),
              svgAsset: 'assets/svg/Gallery.svg',
              label: 'Upload From Gallery',
              onTap: () =>
                  Navigator.of(context).pop(ProfilePhotoSource.gallery),
            ),
            const SizedBox(height: 12),
            _PhotoOptionTile(
              key: const Key('photo_option_camera'),
              svgAsset: 'assets/svg/camera.svg',
              label: 'Take Photo',
              onTap: () => Navigator.of(context).pop(ProfilePhotoSource.camera),
            ),
            const SizedBox(height: 12),
            _PhotoOptionTile(
              key: const Key('photo_option_remove'),
              svgAsset: 'assets/svg/Delete.svg',
              label: 'Remove Photo',
              onTap: () =>
                  Navigator.of(context).pop(ProfilePhotoSource.removed),
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton(
                key: const Key('photo_option_cancel'),
                onPressed: () => Navigator.of(context).pop(),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.black,
                  side: const BorderSide(color: Colors.black, width: 1.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: Text(
                  'Cancel',
                  style: GoogleFonts.poppins(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: Colors.black,
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

class _PhotoOptionTile extends StatelessWidget {
  final String svgAsset;
  final String label;
  final VoidCallback onTap;

  const _PhotoOptionTile({
    super.key,
    required this.svgAsset,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          height: 52,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            children: [
              SvgPicture.asset(svgAsset, width: 20, height: 20),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
