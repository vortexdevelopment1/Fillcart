import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'bank_details_screen.dart';

/// Screen 4/5: "Business Documents" (Image 6).
class BusinessDocumentsScreen extends StatefulWidget {
  final String storeName;
  final String ownerName;
  final String address;
  final String city;
  final String pinCode;
  final String category;
  final String subCategory;
  final String panNumber;

  final bool isEditing;

  const BusinessDocumentsScreen({
    super.key,
    this.storeName = 'Fresh Mart Supermarket',
    this.ownerName = 'Gopal Yadav',
    this.address = 'Vijay Nagar, Indore',
    this.city = 'Indore',
    this.pinCode = '452010',
    this.category = 'Grocery, Beauty',
    this.subCategory = 'Fruits & Vegetables',
    this.panNumber = 'IBKYM02356',
    this.isEditing = false,
  });

  @override
  State<BusinessDocumentsScreen> createState() =>
      _BusinessDocumentsScreenState();
}

class _BusinessDocumentsScreenState extends State<BusinessDocumentsScreen> {
  String _selectedDocType = 'gumasta';
  bool _electricityIsOwner = true;
  bool _gumastaUploaded = false;
  bool _electricityUploaded = false;

  void _onContinue() {
    if (widget.isEditing) {
      Navigator.of(context).pop();
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => BankDetailsScreen(
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
                    'Business Documents',
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
              const SizedBox(height: 24.0),

              // Document 1: Gumasta Certificate
              _buildDocumentCard(
                typeId: 'gumasta',
                title: 'Gumasta Certificate',
                subtitle: 'Shop & Establishment Certificate',
                isSelected: _selectedDocType == 'gumasta',
                child: _buildUploadButton(
                  isUploaded: _gumastaUploaded,
                  onTap: () =>
                      setState(() => _gumastaUploaded = !_gumastaUploaded),
                ),
              ),
              const SizedBox(height: 14.0),

              // Document 2: FSSAI Certificate
              _buildDocumentCard(
                typeId: 'fssai',
                title: 'FSSAI Certificate',
                subtitle: 'Food Safety License',
                isSelected: _selectedDocType == 'fssai',
              ),
              const SizedBox(height: 14.0),

              // Document 3: GST Certificate
              _buildDocumentCard(
                typeId: 'gst',
                title: 'GST Certificate',
                subtitle: 'Good and Services Tax Certificate',
                isSelected: _selectedDocType == 'gst',
              ),
              const SizedBox(height: 14.0),

              // Document 4: Electricity Bill
              _buildDocumentCard(
                typeId: 'electricity',
                title: 'Electricity Bill',
                subtitle: 'Choose one option',
                isSelected: _selectedDocType == 'electricity',
                child: Column(
                  children: [
                    // Segmented Selector: [Shop Owner] vs [On Rent]
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () =>
                                setState(() => _electricityIsOwner = true),
                            child: Container(
                              height: 44.0,
                              decoration: BoxDecoration(
                                color: _electricityIsOwner
                                    ? const Color(0xFF0F172A)
                                    : const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'Shop Owner',
                                style: GoogleFonts.inter(
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.w600,
                                  color: _electricityIsOwner
                                      ? Colors.white
                                      : const Color(0xFF0F172A),
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10.0),
                        Expanded(
                          child: GestureDetector(
                            onTap: () =>
                                setState(() => _electricityIsOwner = false),
                            child: Container(
                              height: 44.0,
                              decoration: BoxDecoration(
                                color: !_electricityIsOwner
                                    ? const Color(0xFF0F172A)
                                    : const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(12.0),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'On Rent',
                                style: GoogleFonts.inter(
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.w600,
                                  color: !_electricityIsOwner
                                      ? Colors.white
                                      : const Color(0xFF0F172A),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12.0),
                    _buildUploadButton(
                      isUploaded: _electricityUploaded,
                      onTap: () => setState(
                          () => _electricityUploaded = !_electricityUploaded),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20.0),

              // Instruction Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14.0),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(14.0),
                ),
                child: Text(
                  'Select and upload any one applicable business document for verification.',
                  style: GoogleFonts.inter(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF78350F),
                    height: 1.4,
                  ),
                ),
              ),
              const SizedBox(height: 32.0),

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

  Widget _buildDocumentCard({
    required String typeId,
    required String title,
    required String subtitle,
    required bool isSelected,
    Widget? child,
  }) {
    return GestureDetector(
      onTap: () => setState(() => _selectedDocType = typeId),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16.0),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(
            color: isSelected
                ? const Color(0xFFD4F038)
                : Colors.transparent,
            width: isSelected ? 1.5 : 0.0,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.inter(
                          fontSize: 15.0,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 3.0),
                      Text(
                        subtitle,
                        style: GoogleFonts.inter(
                          fontSize: 13.0,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
                // Circular Radio Indicator
                Container(
                  width: 22.0,
                  height: 22.0,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFFD4F038)
                        : Colors.transparent,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? const Color(0xFF0F172A)
                          : const Color(0xFFCBD5E1),
                      width: isSelected ? 2.0 : 1.5,
                    ),
                  ),
                ),
              ],
            ),
            if (child != null) ...[
              const SizedBox(height: 14.0),
              child,
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildUploadButton({
    required bool isUploaded,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 52.0,
        width: double.infinity,
        decoration: BoxDecoration(
          color: const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(12.0),
        ),
        alignment: Alignment.center,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              isUploaded ? 'File Uploaded ✓' : 'Upload File',
              style: GoogleFonts.inter(
                fontSize: 13.5,
                fontWeight: FontWeight.w700,
                color: isUploaded
                    ? const Color(0xFF16A34A)
                    : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 2.0),
            Text(
              'PDF, JPG or PNG',
              style: GoogleFonts.inter(
                fontSize: 11.5,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
