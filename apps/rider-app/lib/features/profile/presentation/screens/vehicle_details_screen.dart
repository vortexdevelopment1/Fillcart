import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/profile_bloc.dart';
import '../../bloc/profile_event.dart';
import '../widgets/profile_theme_constants.dart';

/// Vehicle Details Screen matching Figma Vehicle Details screen.
class ProfileVehicleDetailsScreen extends StatefulWidget {
  const ProfileVehicleDetailsScreen({super.key});

  @override
  State<ProfileVehicleDetailsScreen> createState() =>
      _ProfileVehicleDetailsScreenState();
}

class _ProfileVehicleDetailsScreenState
    extends State<ProfileVehicleDetailsScreen> {
  late final TextEditingController _rcController;
  String? _errorText;

  @override
  void initState() {
    super.initState();
    final currentRc = context.read<ProfileBloc>().state.documents.formattedVehicleRc;
    _rcController = TextEditingController(text: currentRc);
  }

  @override
  void dispose() {
    _rcController.dispose();
    super.dispose();
  }

  void _submitUpdate() {
    final value = _rcController.text.trim();
    if (value.isEmpty) {
      setState(() {
        _errorText = 'Please enter your vehicle registration number';
      });
      return;
    }

    context.read<ProfileBloc>().add(ProfileVehicleRcUpdated(value));
    try {
      GoRouter.of(context).push('/profile/vehicle-success');
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('vehicle_details_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            const ProfileScreenHeader(title: 'Vehicle Details'),
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Update your vehicle registration number.\nYour updated details may require verification.',
                      style: GoogleFonts.poppins(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF4B5563),
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 18),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x0A000000),
                            blurRadius: 6,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Vehicle Registration Number',
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            key: const Key('vehicle_rc_input'),
                            controller: _rcController,
                            textCapitalization: TextCapitalization.characters,
                            onChanged: (_) {
                              if (_errorText != null) {
                                setState(() => _errorText = null);
                              } else {
                                setState(() {});
                              }
                            },
                            style: GoogleFonts.poppins(
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                              color: Colors.black,
                            ),
                            decoration: InputDecoration(
                              hintText: 'MP 10 BC 1012',
                              errorText: _errorText,
                              filled: true,
                              fillColor: Colors.white,
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 14,
                              ),
                              suffixIcon: _rcController.text.isNotEmpty
                                  ? IconButton(
                                      key: const Key('clear_rc_button'),
                                      onPressed: () {
                                        _rcController.clear();
                                        setState(() {});
                                      },
                                      icon: const Icon(
                                        Icons.cancel,
                                        size: 20,
                                        color: Color(0xFF9CA3AF),
                                      ),
                                    )
                                  : null,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Color(0xFFCBD5E1),
                                ),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: Color(0xFFCBD5E1),
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(
                                  color: RiderColors.primaryYellow,
                                  width: 2,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'Enter the registration number as on your RC',
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: ProfileTokens.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x0A000000),
                            blurRadius: 6,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Instructions',
                            style: GoogleFonts.poppins(
                              fontSize: 14.5,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFFC29B00),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Make sure the number is correct to avoid delays in verification.',
                            style: GoogleFonts.poppins(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF4B5563),
                              height: 1.45,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  key: const Key('update_vehicle_details_button'),
                  onPressed: _submitUpdate,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: RiderColors.primaryYellow,
                    foregroundColor: Colors.black,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Update Details',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Colors.black,
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
