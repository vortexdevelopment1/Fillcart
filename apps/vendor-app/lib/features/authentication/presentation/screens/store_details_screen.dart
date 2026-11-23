import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'pan_details_screen.dart';

/// Screen 2/5: "Store details" (Image 1).
class StoreDetailsScreen extends StatefulWidget {
  final String storeName;
  final String ownerName;
  final String category;
  final String subCategory;
  final bool isEditing;
  final String? initialAddress;
  final String? initialCity;
  final String? initialPinCode;
  final bool initialStoreIsOnline;

  const StoreDetailsScreen({
    super.key,
    this.storeName = 'Fresh Mart Supermarket',
    this.ownerName = 'Gopal Yadav',
    this.category = 'Grocery, Beauty',
    this.subCategory = 'Fruits & Vegetables',
    this.isEditing = false,
    this.initialAddress,
    this.initialCity,
    this.initialPinCode,
    this.initialStoreIsOnline = true,
  });

  @override
  State<StoreDetailsScreen> createState() => _StoreDetailsScreenState();
}

class _StoreDetailsScreenState extends State<StoreDetailsScreen> {
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _pinCodeController = TextEditingController();

  bool _isMapExpanded = false;
  late bool _storeIsOnline;
  bool _imageUploaded = false;

  @override
  void initState() {
    super.initState();
    if (widget.initialAddress != null) {
      _addressController.text = widget.initialAddress!;
    }
    if (widget.initialCity != null) {
      _cityController.text = widget.initialCity!;
    }
    if (widget.initialPinCode != null) {
      _pinCodeController.text = widget.initialPinCode!;
    }
    _storeIsOnline = widget.initialStoreIsOnline;
  }

  @override
  void dispose() {
    _addressController.dispose();
    _cityController.dispose();
    _pinCodeController.dispose();
    super.dispose();
  }

  void _useCurrentLocation() {
    setState(() {
      _addressController.text =
          'Plot 42, Chinnakalu Avenue, Near Purnima School';
      _cityController.text = 'Indore';
      _pinCodeController.text = '452010';
    });
  }

  void _onContinue() {
    if (widget.isEditing) {
      Navigator.of(context).pop<Map<String, dynamic>>({
        'address': _addressController.text.isNotEmpty
            ? _addressController.text
            : (widget.initialAddress ?? 'Vijay Nagar, Indore'),
        'city': _cityController.text.isNotEmpty
            ? _cityController.text
            : (widget.initialCity ?? 'Indore'),
        'pinCode': _pinCodeController.text.isNotEmpty
            ? _pinCodeController.text
            : (widget.initialPinCode ?? '452010'),
        'hours': _storeIsOnline ? 'Open 24×7' : 'Closed',
      });
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => PanDetailsScreen(
          storeName: widget.storeName,
          ownerName: widget.ownerName,
          address: _addressController.text.isNotEmpty
              ? _addressController.text
              : 'Vijay Nagar, Indore',
          city: _cityController.text.isNotEmpty ? _cityController.text : 'Indore',
          pinCode: _pinCodeController.text.isNotEmpty
              ? _pinCodeController.text
              : '452010',
          category: widget.category,
          subCategory: widget.subCategory,
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

              // Header: Back Arrow, Title, Step Indicator 2/5
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
                    'Store details',
                    style: GoogleFonts.inter(
                      fontSize: 22.0,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '2/5',
                    style: GoogleFonts.inter(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14.0),

              // 5-segment Progress Bar (2 active)
              Row(
                children: List.generate(5, (index) {
                  final isActive = index < 2;
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

              // Store Location Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Store location',
                    style: GoogleFonts.inter(
                      fontSize: 15.0,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  GestureDetector(
                    onTap: _useCurrentLocation,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 16.0,
                          height: 16.0,
                          child: SvgPicture.asset(
                            'assets/svg/basil_current-location-outline.svg',
                            fit: BoxFit.contain,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(
                              Icons.my_location,
                              size: 15.0,
                              color: Color(0xFF5B5B5B),
                            ),
                          ),
                        ),
                        const SizedBox(width: 6.0),
                        Text(
                          'Use current location',
                          style: GoogleFonts.inter(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF5B5B5B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12.0),

              // Real Interactive Expandable Map Container
              GestureDetector(
                onTap: () {
                  setState(() {
                    _isMapExpanded = !_isMapExpanded;
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                  height: _isMapExpanded ? 200.0 : 100.0,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE9ECEF),
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(
                      color: const Color(0xFFCBD5E1),
                      width: 1.0,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16.0),
                    child: Stack(
                      children: [
                        // Map Canvas Graphics
                        Positioned.fill(
                          child: CustomPaint(
                            painter: _RealMapPainter(),
                          ),
                        ),

                        // "Select on map" lime badge
                        Positioned(
                          top: 10.0,
                          left: 12.0,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10.0,
                              vertical: 4.0,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD4F038),
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            child: Text(
                              'Select on map',
                              style: GoogleFonts.inter(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF0F172A),
                              ),
                            ),
                          ),
                        ),

                        // Expand indicator hint
                        Positioned(
                          bottom: 8.0,
                          right: 10.0,
                          child: Container(
                            padding: const EdgeInsets.all(4.0),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.8),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              _isMapExpanded
                                  ? Icons.fullscreen_exit
                                  : Icons.fullscreen,
                              size: 16.0,
                              color: const Color(0xFF0F172A),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20.0),

              // Shop Address*
              _buildFieldLabel('Shop Address*'),
              const SizedBox(height: 8.0),
              _buildTextInputContainer(
                controller: _addressController,
                hintText: 'Enter address',
              ),
              const SizedBox(height: 18.0),

              // City* & Pin Code* Row
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFieldLabel('City*'),
                        const SizedBox(height: 8.0),
                        _buildTextInputContainer(
                          controller: _cityController,
                          hintText: 'Enter City',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 14.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFieldLabel('Pin Code*'),
                        const SizedBox(height: 8.0),
                        _buildTextInputContainer(
                          controller: _pinCodeController,
                          hintText: 'Enter pin code',
                          keyboardType: TextInputType.number,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18.0),

              // Shop Photo*
              _buildFieldLabel('Shop Photo*'),
              const SizedBox(height: 8.0),
              GestureDetector(
                onTap: () {
                  setState(() => _imageUploaded = !_imageUploaded);
                },
                child: Container(
                  height: 64.0,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14.0),
                    border: Border.all(
                      color: const Color(0xFF94A3B8),
                      width: 1.2,
                      style: BorderStyle.solid,
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
                        _imageUploaded
                            ? 'Front Image Uploaded ✓'
                            : 'Upload  Front Image',
                        style: GoogleFonts.inter(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w600,
                          color: _imageUploaded
                              ? const Color(0xFF16A34A)
                              : const Color(0xFF334155),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18.0),

              // Store is Online Card
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 14.0,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16.0),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Store is Online',
                            style: GoogleFonts.inter(
                              fontSize: 15.0,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 3.0),
                          Text(
                            'Open 24×7 · Accepting orders',
                            style: GoogleFonts.inter(
                              fontSize: 13.0,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Switch(
                      value: _storeIsOnline,
                      onChanged: (val) => setState(() => _storeIsOnline = val),
                      activeThumbColor: Colors.black,
                      activeTrackColor: const Color(0xFFD4F038),
                      inactiveThumbColor: Colors.white,
                      inactiveTrackColor: const Color(0xFFCBD5E1),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16.0),

              // Warning / Info Note Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14.0),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(14.0),
                ),
                child: Text(
                  'No opening hours to set right now. You can easily switch this on off at any time directly from the home Screen.',
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

  Widget _buildFieldLabel(String text) {
    final hasAsterisk = text.endsWith('*');
    final cleanText = hasAsterisk ? text.substring(0, text.length - 1) : text;

    return RichText(
      text: TextSpan(
        style: GoogleFonts.inter(
          fontSize: 14.5,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF0F172A),
        ),
        children: [
          TextSpan(text: cleanText),
          if (hasAsterisk)
            const TextSpan(
              text: '*',
              style: TextStyle(color: Color(0xFFEF4444)),
            ),
        ],
      ),
    );
  }

  Widget _buildTextInputContainer({
    required TextEditingController controller,
    required String hintText,
    TextInputType? keyboardType,
  }) {
    return Container(
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
        controller: controller,
        keyboardType: keyboardType,
        style: GoogleFonts.inter(
          fontSize: 15.5,
          fontWeight: FontWeight.w400,
          color: const Color(0xFF0F172A),
        ),
        decoration: InputDecoration(
          hintText: hintText,
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
    );
  }
}

/// Custom painter rendering the real street map grid matching Image 1.
class _RealMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final bgPaint = Paint()..color = const Color(0xFFF1F5F9);
    canvas.drawRect(Offset.zero & size, bgPaint);

    // Streets paint
    final roadPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 14.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square;

    // Horizontal roads
    canvas.drawLine(
      Offset(0, size.height * 0.35),
      Offset(size.width, size.height * 0.35),
      roadPaint,
    );
    canvas.drawLine(
      Offset(0, size.height * 0.75),
      Offset(size.width, size.height * 0.75),
      roadPaint,
    );

    // Vertical roads
    canvas.drawLine(
      Offset(size.width * 0.25, 0),
      Offset(size.width * 0.25, size.height),
      roadPaint,
    );
    canvas.drawLine(
      Offset(size.width * 0.5, 0),
      Offset(size.width * 0.5, size.height),
      roadPaint,
    );
    canvas.drawLine(
      Offset(size.width * 0.75, 0),
      Offset(size.width * 0.75, size.height),
      roadPaint,
    );

    // Blue route path
    final routePaint = Paint()
      ..color = const Color(0xFF0284C7)
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final routePath = Path()
      ..moveTo(size.width * 0.38, size.height * 0.8)
      ..lineTo(size.width * 0.5, size.height * 0.8)
      ..lineTo(size.width * 0.5, size.height * 0.35);
    canvas.drawPath(routePath, routePaint);

    // Red Store Pin
    final pinCenter = Offset(size.width * 0.5, size.height * 0.35);
    final pinPaint = Paint()..color = const Color(0xFFDC2626);
    canvas.drawCircle(pinCenter, 6.0, pinPaint);
    canvas.drawCircle(pinCenter, 2.0, Paint()..color = Colors.white);

    // Text labels
    final tp1 = TextPainter(
      text: const TextSpan(
        text: 'PURNIMA EDUCATION\nPRIMARY SCHOOL',
        style: TextStyle(
          color: Color(0xFF334155),
          fontSize: 7.5,
          fontWeight: FontWeight.bold,
          height: 1.1,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    tp1.paint(canvas, Offset(size.width * 0.25, size.height * 0.18));

    final tp2 = TextPainter(
      text: const TextSpan(
        text: 'Chinnakalu Avenue',
        style: TextStyle(
          color: Color(0xFF64748B),
          fontSize: 7.0,
          fontWeight: FontWeight.w500,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    tp2.paint(canvas, Offset(size.width * 0.52, size.height * 0.3));
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
