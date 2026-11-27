import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/profile_bloc.dart';
import '../../bloc/profile_event.dart';
import '../../bloc/profile_state.dart';
import '../widgets/change_photo_bottom_sheet.dart';
import '../widgets/profile_avatar.dart';
import '../widgets/profile_theme_constants.dart';

/// Edit Profile Screen matching Figma Edit Profile screen.
class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late final TextEditingController _fullNameController;
  late final TextEditingController _mobileController;
  late final TextEditingController _emailController;
  late final TextEditingController _dobController;
  late final TextEditingController _emergencyNameController;
  late final TextEditingController _emergencyPhoneController;

  @override
  void initState() {
    super.initState();
    final profile = context.read<ProfileBloc>().state.profile;
    _fullNameController = TextEditingController(text: profile.fullName);
    _mobileController = TextEditingController(text: profile.editMobileNumber);
    _emailController = TextEditingController(text: profile.email);
    _dobController = TextEditingController(text: profile.dateOfBirth);
    _emergencyNameController = TextEditingController(
      text: profile.emergencyContactName,
    );
    _emergencyPhoneController = TextEditingController(
      text: profile.emergencyContactPhone,
    );
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _mobileController.dispose();
    _emailController.dispose();
    _dobController.dispose();
    _emergencyNameController.dispose();
    _emergencyPhoneController.dispose();
    super.dispose();
  }

  Future<void> _openPhotoSheet() async {
    final result = await showChangePhotoBottomSheet(context);
    if (result != null && mounted) {
      context.read<ProfileBloc>().add(ProfilePhotoUpdated(result));
    }
  }

  Future<void> _pickDob() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2003, 4, 1),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );
    if (picked != null && mounted) {
      final day = picked.day.toString().padLeft(2, '0');
      final month = picked.month.toString().padLeft(2, '0');
      _dobController.text = '$day/$month/${picked.year}';
    }
  }

  void _saveProfile() {
    if (_fullNameController.text.trim().isEmpty ||
        _mobileController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Full Name and Mobile Number are required.',
            style: GoogleFonts.poppins(fontSize: 13),
          ),
          backgroundColor: RiderColors.errorRed,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    context.read<ProfileBloc>().add(
      ProfileDetailsUpdated(
        fullName: _fullNameController.text,
        mobileNumber: _mobileController.text,
        email: _emailController.text,
        dateOfBirth: _dobController.text,
        emergencyContactName: _emergencyNameController.text,
        emergencyContactPhone: _emergencyPhoneController.text,
      ),
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Profile updated successfully',
          style: GoogleFonts.poppins(fontSize: 13),
        ),
        backgroundColor: ProfileTokens.verifiedGreen,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );

    if (context.canPop()) {
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('edit_profile_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            const ProfileScreenHeader(title: 'Edit Profile'),
            Expanded(
              child: SingleChildScrollView(
                key: const Key('edit_profile_scroll_view'),
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: BlocBuilder<ProfileBloc, ProfileState>(
                        builder: (context, state) {
                          return ProfileAvatar(
                            profile: state.profile,
                            size: 96,
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 12),
                    Center(
                      child: Material(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        elevation: 2,
                        shadowColor: const Color(0x14000000),
                        child: InkWell(
                          key: const Key('edit_photo_button'),
                          onTap: _openPhotoSheet,
                          borderRadius: BorderRadius.circular(14),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 18,
                              vertical: 10,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                SvgPicture.asset(
                                  'assets/svg/camera.svg',
                                  width: 18,
                                  height: 18,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Edit Photo',
                                  style: GoogleFonts.poppins(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.black,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    _LabeledInputField(
                      fieldKey: const Key('edit_full_name_field'),
                      label: 'Full Name',
                      controller: _fullNameController,
                      keyboardType: TextInputType.name,
                    ),
                    const SizedBox(height: 14),
                    _LabeledInputField(
                      fieldKey: const Key('edit_mobile_field'),
                      label: 'Mobile Number',
                      controller: _mobileController,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 14),
                    _LabeledInputField(
                      fieldKey: const Key('edit_email_field'),
                      label: 'E-Mail',
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 14),
                    _LabeledInputField(
                      fieldKey: const Key('edit_dob_field'),
                      label: 'Date of Birth',
                      controller: _dobController,
                      onTapSuffix: _pickDob,
                    ),
                    const SizedBox(height: 18),
                    Text(
                      'Emergency Contact',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _LabeledInputField(
                      fieldKey: const Key('edit_emergency_name_field'),
                      label: 'Full Name',
                      controller: _emergencyNameController,
                      keyboardType: TextInputType.name,
                    ),
                    const SizedBox(height: 14),
                    _LabeledInputField(
                      fieldKey: const Key('edit_emergency_phone_field'),
                      label: 'Mobile Number',
                      controller: _emergencyPhoneController,
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        key: const Key('save_profile_button'),
                        onPressed: _saveProfile,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: RiderColors.primaryYellow,
                          foregroundColor: RiderColors.onSurfaceDark,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Save Changes',
                          style: GoogleFonts.poppins(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LabeledInputField extends StatelessWidget {
  final Key fieldKey;
  final String label;
  final TextEditingController controller;
  final TextInputType? keyboardType;
  final VoidCallback? onTapSuffix;

  const _LabeledInputField({
    required this.fieldKey,
    required this.label,
    required this.controller,
    this.keyboardType,
    this.onTapSuffix,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 13.5,
            fontWeight: FontWeight.w400,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          key: fieldKey,
          controller: controller,
          keyboardType: keyboardType,
          style: GoogleFonts.poppins(
            fontSize: 14.5,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF4B5563),
          ),
          decoration: InputDecoration(
            filled: true,
            fillColor: ProfileTokens.background,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 14,
              vertical: 14,
            ),
            suffixIcon: onTapSuffix == null
                ? null
                : IconButton(
                    onPressed: onTapSuffix,
                    icon: const Icon(
                      Icons.calendar_today_outlined,
                      size: 18,
                      color: Color(0xFF6B7280),
                    ),
                  ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: ProfileTokens.fieldBorder),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: ProfileTokens.fieldBorder),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: RiderColors.onSurfaceDark,
                width: 1.5,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
