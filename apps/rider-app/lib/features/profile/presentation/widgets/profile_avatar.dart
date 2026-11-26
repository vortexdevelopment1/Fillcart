import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/rider_profile_model.dart';

/// Circular Rider avatar with white ring, soft elevation, and photo-source support.
class ProfileAvatar extends StatelessWidget {
  final RiderProfileModel profile;
  final double size;

  const ProfileAvatar({
    super.key,
    required this.profile,
    this.size = 98,
  });

  @override
  Widget build(BuildContext context) {
    final hasPhoto = profile.hasPhoto;

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2.5),
        boxShadow: const [
          BoxShadow(
            color: Color(0x18000000),
            blurRadius: 8,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: ClipOval(
        child: hasPhoto ? _buildPhotoContent() : _buildRemovedInitials(),
      ),
    );
  }

  Widget _buildPhotoContent() {
    final gradientColors = switch (profile.photoSource) {
      ProfilePhotoSource.gallery => const [
        Color(0xFF26A69A),
        Color(0xFF80CBC4),
      ],
      ProfilePhotoSource.camera => const [
        Color(0xFF1976D2),
        Color(0xFF64B5F6),
      ],
      _ => const [Color(0xFF00838F), Color(0xFF7FD1D8)],
    };

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: gradientColors,
        ),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Positioned(
            bottom: -size * 0.08,
            child: Container(
              width: size * 0.68,
              height: size * 0.44,
              decoration: BoxDecoration(
                color: const Color(0xFFFFD60A),
                borderRadius: BorderRadius.vertical(
                  top: Radius.circular(size * 0.34),
                ),
              ),
            ),
          ),
          Positioned(
            top: size * 0.14,
            child: Container(
              width: size * 0.36,
              height: size * 0.36,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0xFFF1C29B),
              ),
              child: Align(
                alignment: Alignment.topCenter,
                child: Container(
                  height: size * 0.14,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F2421),
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(size * 0.2),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRemovedInitials() {
    return Container(
      color: const Color(0xFFE5E7EB),
      alignment: Alignment.center,
      child: Text(
        profile.initials,
        style: GoogleFonts.poppins(
          fontSize: size * 0.32,
          fontWeight: FontWeight.w600,
          color: const Color(0xFF374151),
        ),
      ),
    );
  }
}
