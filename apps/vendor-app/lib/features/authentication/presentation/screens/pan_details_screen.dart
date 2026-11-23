import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'aadhaar_details_screen.dart';

/// Screen 3/5: "PAN Details" (Image 2).
class PanDetailsScreen extends StatefulWidget {
  final String storeName;
  final String ownerName;
  final String address;
  final String city;
  final String pinCode;
  final String category;
  final String subCategory;

  const PanDetailsScreen({
    super.key,
    this.storeName = 'Fresh Mart Supermarket',
    this.ownerName = 'Gopal Yadav',
    this.address = 'Vijay Nagar, Indore',
    this.city = 'Indore',
    this.pinCode = '452010',
    this.category = 'Grocery, Beauty',
    this.subCategory = 'Fruits & Vegetables',
  });

  @override
  State<PanDetailsScreen> createState() => _PanDetailsScreenState();
}

class _PanDetailsScreenState extends State<PanDetailsScreen> {
  final TextEditingController _panController = TextEditingController();

  @override
  void dispose() {
    _panController.dispose();
    super.dispose();
  }

  void _onContinue() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => AadhaarDetailsScreen(
          storeName: widget.storeName,
          ownerName: widget.ownerName,
          address: widget.address,
          city: widget.city,
          pinCode: widget.pinCode,
          category: widget.category,
          subCategory: widget.subCategory,
          panNumber: _panController.text.isNotEmpty
              ? _panController.text
              : 'IBKYM02356',
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
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16.0),

              // Header: Back Arrow, Title, Step Indicator 3/5
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
                    'PAN Details',
                    style: GoogleFonts.inter(
                      fontSize: 22.0,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '3/5',
                    style: GoogleFonts.inter(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14.0),

              // 5-segment Progress Bar (3 active)
              Row(
                children: List.generate(5, (index) {
                  final isActive = index < 3;
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

              // Pan Card*
              RichText(
                text: TextSpan(
                  style: GoogleFonts.inter(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF0F172A),
                  ),
                  children: const [
                    TextSpan(text: 'Pan Card'),
                    TextSpan(
                      text: '*',
                      style: TextStyle(color: Color(0xFFEF4444)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8.0),

              // Input Field with single clean border
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
                  controller: _panController,
                  textCapitalization: TextCapitalization.characters,
                  inputFormatters: [
                    LengthLimitingTextInputFormatter(10),
                  ],
                  style: GoogleFonts.inter(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF0F172A),
                    letterSpacing: 0.5,
                  ),
                  decoration: InputDecoration(
                    hintText: 'IBKYM02356',
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
              const SizedBox(height: 8.0),

              // Helper Text
              Text(
                'Enter your 10-character PAN as mentioned on your PAN card.',
                style: GoogleFonts.inter(
                  fontSize: 13.0,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF64748B),
                ),
              ),

              const Spacer(),

              // Continue Button
              SizedBox(
                width: double.infinity,
                height: 56.0,
                child: ElevatedButton(
                  onPressed: _onContinue,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: const StadiumBorder(),
                  ),
                  child: Text(
                    'Continue',
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
