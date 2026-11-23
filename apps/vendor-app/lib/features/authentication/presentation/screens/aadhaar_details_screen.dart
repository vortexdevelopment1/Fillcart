import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'aadhaar_verification_screen.dart';

/// Screen 4/5: "Aadhaar Details" (Image 3).
class AadhaarDetailsScreen extends StatefulWidget {
  final String storeName;
  final String ownerName;
  final String address;
  final String city;
  final String pinCode;
  final String category;
  final String subCategory;
  final String panNumber;

  const AadhaarDetailsScreen({
    super.key,
    this.storeName = 'Fresh Mart Supermarket',
    this.ownerName = 'Gopal Yadav',
    this.address = 'Vijay Nagar, Indore',
    this.city = 'Indore',
    this.pinCode = '452010',
    this.category = 'Grocery, Beauty',
    this.subCategory = 'Fruits & Vegetables',
    this.panNumber = 'IBKYM02356',
  });

  @override
  State<AadhaarDetailsScreen> createState() => _AadhaarDetailsScreenState();
}

class _AadhaarDetailsScreenState extends State<AadhaarDetailsScreen> {
  final TextEditingController _aadhaarController = TextEditingController();
  bool _frontUploaded = false;
  bool _backUploaded = false;

  @override
  void dispose() {
    _aadhaarController.dispose();
    super.dispose();
  }

  void _onSendOtp() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => AadhaarVerificationScreen(
          storeName: widget.storeName,
          ownerName: widget.ownerName,
          address: widget.address,
          city: widget.city,
          pinCode: widget.pinCode,
          category: widget.category,
          subCategory: widget.subCategory,
          panNumber: widget.panNumber,
          aadhaarEnding: '4785',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final paddingBottom = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFEDEDED),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16.0),

              // Header: Back Arrow, Title, Step Indicator 4/5
              Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: const Icon(
                      Icons.arrow_back,
                      size: 24.0,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(width: 14.0),
                  Text(
                    'Aadhaar Details',
                    style: GoogleFonts.inter(
                      fontSize: 22.0,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '4/5',
                    style: GoogleFonts.inter(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14.0),

              // 5-segment Progress Bar (4 active)
              Row(
                children: List.generate(5, (index) {
                  final isActive = index < 4;
                  return Expanded(
                    child: Container(
                      height: 5.5,
                      margin: EdgeInsets.only(right: index < 4 ? 6.0 : 0.0),
                      decoration: BoxDecoration(
                        color: isActive
                            ? const Color(0xFFD4F038)
                            : const Color(0xFFE2E8F0),
                        borderRadius: BorderRadius.circular(3.0),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 28.0),

              // Aadhaar* Label
              RichText(
                text: TextSpan(
                  style: GoogleFonts.inter(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF0F172A),
                  ),
                  children: const [
                    TextSpan(text: 'Aadhaar'),
                    TextSpan(
                      text: '*',
                      style: TextStyle(color: Color(0xFFEF4444)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8.0),

              // Input Container
              Container(
                height: 56.0,
                decoration: BoxDecoration(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(14.0),
                  border: Border.all(
                    color: const Color(0xFF71717A),
                    width: 1.0,
                  ),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                alignment: Alignment.centerLeft,
                child: TextField(
                  controller: _aadhaarController,
                  keyboardType: TextInputType.number,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(12),
                  ],
                  style: GoogleFonts.inter(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF0F172A),
                    letterSpacing: 1.0,
                  ),
                  decoration: InputDecoration(
                    hintText: '4785 4785 4785',
                    hintStyle: GoogleFonts.inter(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF64748B),
                    ),
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    disabledBorder: InputBorder.none,
                    errorBorder: InputBorder.none,
                    focusedErrorBorder: InputBorder.none,
                    filled: false,
                    fillColor: Colors.transparent,
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
              ),
              const SizedBox(height: 20.0),

              // Upload Front Image
              GestureDetector(
                onTap: () => setState(() => _frontUploaded = !_frontUploaded),
                child: Container(
                  height: 64.0,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14.0),
                    border: Border.all(
                      color: const Color(0xFF94A3B8),
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.file_upload_outlined,
                        size: 20.0,
                        color: Color(0xFF334155),
                      ),
                      const SizedBox(width: 8.0),
                      Text(
                        _frontUploaded
                            ? 'Front Image Uploaded ✓'
                            : 'Upload  Front Image',
                        style: GoogleFonts.inter(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w600,
                          color: _frontUploaded
                              ? const Color(0xFF16A34A)
                              : const Color(0xFF334155),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16.0),

              // Upload Back Image
              GestureDetector(
                onTap: () => setState(() => _backUploaded = !_backUploaded),
                child: Container(
                  height: 64.0,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14.0),
                    border: Border.all(
                      color: const Color(0xFF94A3B8),
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.file_upload_outlined,
                        size: 20.0,
                        color: Color(0xFF334155),
                      ),
                      const SizedBox(width: 8.0),
                      Text(
                        _backUploaded
                            ? 'Back Image Uploaded ✓'
                            : 'Upload  Back Image',
                        style: GoogleFonts.inter(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w600,
                          color: _backUploaded
                              ? const Color(0xFF16A34A)
                              : const Color(0xFF334155),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20.0),

              // Please Note Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(14.0),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Please Note',
                      style: GoogleFonts.inter(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF78350F),
                      ),
                    ),
                    const SizedBox(height: 4.0),
                    Text(
                      'Upload clear images of both sides of your Aadhaar card. Ensure all details are visible for verification.',
                      style: GoogleFonts.inter(
                        fontSize: 13.0,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF78350F),
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36.0),

              // Send OTP Button
              SizedBox(
                width: double.infinity,
                height: 56.0,
                child: ElevatedButton(
                  onPressed: _onSendOtp,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: const StadiumBorder(),
                  ),
                  child: Text(
                    'Send OTP',
                    style: GoogleFonts.inter(
                      fontSize: 17.0,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 20.0 + paddingBottom),
            ],
          ),
        ),
      ),
    );
  }
}
