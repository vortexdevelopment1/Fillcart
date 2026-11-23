import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'business_documents_screen.dart';

/// Screen: "Aadhaar Verify Success!" (Image 5).
class AadhaarSuccessScreen extends StatefulWidget {
  final String storeName;
  final String ownerName;
  final String address;
  final String city;
  final String pinCode;
  final String category;
  final String subCategory;
  final String panNumber;

  const AadhaarSuccessScreen({
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
  State<AadhaarSuccessScreen> createState() => _AadhaarSuccessScreenState();
}

class _AadhaarSuccessScreenState extends State<AadhaarSuccessScreen> {
  Timer? _autoNavTimer;

  @override
  void initState() {
    super.initState();
    // Auto-advance after 2 seconds or allow tapping anywhere
    _autoNavTimer = Timer(const Duration(milliseconds: 2200), _proceed);
  }

  @override
  void dispose() {
    _autoNavTimer?.cancel();
    super.dispose();
  }

  void _proceed() {
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => BusinessDocumentsScreen(
          storeName: widget.storeName,
          ownerName: widget.ownerName,
          address: widget.address,
          city: widget.city,
          pinCode: widget.pinCode,
          category: widget.category,
          subCategory: widget.subCategory,
          panNumber: widget.panNumber,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEDEDED),
      body: SafeArea(
        child: GestureDetector(
          onTap: _proceed,
          behavior: HitTestBehavior.opaque,
          child: Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Green Success Circle SVG Icon
                  SizedBox(
                    width: 110.0,
                    height: 110.0,
                    child: SvgPicture.asset(
                      'assets/svg/aadhar_verify_success.svg',
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) => Container(
                        width: 100.0,
                        height: 100.0,
                        decoration: const BoxDecoration(
                          color: Color(0xFFC8F169),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.check,
                          size: 48.0,
                          color: Color(0xFF0E1512),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 28.0),

                  // Title
                  Text(
                    'Aadhaar Verify Success!',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 22.0,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 12.0),

                  // Subtitle
                  Text(
                    'Your aadhaar verification is successfully verifed.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 15.0,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF64748B),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
