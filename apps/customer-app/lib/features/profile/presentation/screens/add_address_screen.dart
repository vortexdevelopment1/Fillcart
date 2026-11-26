import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Add Address Screen matching Figma references:
/// - media_1795674071117_7d454f7d.png (Form with Mini Map)
/// - media_1795674085192_4e49fe70.png (Map Picker & Location Confirmation)
class AddAddressScreen extends StatefulWidget {
  final String existingName;
  final String existingPhone;
  final String existingHouse;
  final String existingStreet;
  final String existingPin;
  final String existingCity;
  final String initialType;
  final bool initialIsDefault;
  final bool initialFullMapMode;

  const AddAddressScreen({
    super.key,
    this.existingName = 'Jamie Donovan',
    this.existingPhone = '98765 43210',
    this.existingHouse = '',
    this.existingStreet = '',
    this.existingPin = '560034',
    this.existingCity = 'Bengaluru',
    this.initialType = 'Home',
    this.initialIsDefault = true,
    this.initialFullMapMode = false,
  });

  @override
  State<AddAddressScreen> createState() => _AddAddressScreenState();
}

class _AddAddressScreenState extends State<AddAddressScreen> {
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;
  late final TextEditingController _houseController;
  late final TextEditingController _streetController;
  late final TextEditingController _pinController;
  late final TextEditingController _cityController;

  late String _selectedType;
  late bool _isDefault;
  late bool _isFullMapMode;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.existingName);
    _phoneController = TextEditingController(text: widget.existingPhone);
    _houseController = TextEditingController(text: widget.existingHouse);
    _streetController = TextEditingController(text: widget.existingStreet);
    _pinController = TextEditingController(text: widget.existingPin);
    _cityController = TextEditingController(text: widget.existingCity);

    _selectedType = widget.initialType;
    _isDefault = widget.initialIsDefault;
    _isFullMapMode = widget.initialFullMapMode;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _houseController.dispose();
    _streetController.dispose();
    _pinController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  void _onSaveAddress() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Address saved successfully!'),
        backgroundColor: Color(0xFF10B981),
        duration: Duration(milliseconds: 1200),
      ),
    );
    Navigator.of(context).maybePop();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        systemNavigationBarColor: Color(0xFFFFFCF3),
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFCF3),
        body: SafeArea(
          child: _isFullMapMode ? _buildFullMapMode() : _buildFormMode(),
        ),
      ),
    );
  }

  Widget _buildFormMode() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 10),

          // Top Header
          Row(
            children: [
              GestureDetector(
                onTap: () => Navigator.of(context).maybePop(),
                behavior: HitTestBehavior.opaque,
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: const Icon(Icons.arrow_back, color: Color(0xFF1E1E1E), size: 20),
                ),
              ),
              const SizedBox(width: 14),
              const Text(
                'Add Address',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E1E1E),
                ),
              ),
              const Spacer(),
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.search, color: Color(0xFF1E1E1E), size: 20),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Mini Map Preview with "Use my location" button
          GestureDetector(
            onTap: () => setState(() => _isFullMapMode = true),
            child: Container(
              height: 155,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 10,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Image.asset(
                      'assets/images/mini_map_preview.png',
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => Image.asset(
                        'assets/images/map_bg.jpg',
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    right: 12,
                    bottom: 12,
                    child: GestureDetector(
                      onTap: () => setState(() => _isFullMapMode = true),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.1),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.near_me_rounded, size: 15, color: Color(0xFFF5A623)),
                            SizedBox(width: 6),
                            Text(
                              'Use my location',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF1E1E1E),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 18),

          // Address Type Selection (Home, Work, Other)
          Row(
            children: [
              Expanded(child: _buildTypeButton('Home', Icons.home_outlined)),
              const SizedBox(width: 10),
              Expanded(child: _buildTypeButton('Work', Icons.business_center_outlined)),
              const SizedBox(width: 10),
              Expanded(child: _buildTypeButton('Other', Icons.location_on_outlined)),
            ],
          ),
          const SizedBox(height: 20),

          // FULL NAME*
          _buildFieldLabel('FULL NAME*'),
          const SizedBox(height: 6),
          _buildInputField(controller: _nameController, hintText: 'Full Name'),
          const SizedBox(height: 16),

          // PHONE NUMBER*
          _buildFieldLabel('PHONE NUMBER*'),
          const SizedBox(height: 6),
          Container(
            height: 50,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFF1EEE6), width: 1.2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.02),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            clipBehavior: Clip.antiAlias,
            child: Row(
              children: [
                Container(
                  width: 86,
                  height: 50,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF8F9FA),
                    border: Border(
                      right: BorderSide(color: Color(0xFFF1EEE6), width: 1.2),
                    ),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.phone_outlined, size: 16, color: Color(0xFF6B7280)),
                      SizedBox(width: 4),
                      Text(
                        '+91',
                        style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w600, color: Color(0xFF1E1E1E)),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: TextField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF1E1E1E),
                      ),
                      decoration: const InputDecoration(
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                        border: InputBorder.none,
                        hintText: 'Phone number',
                        hintStyle: TextStyle(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // HOUSE/APARTMENT*
          _buildFieldLabel('HOUSE/APARTMENT*'),
          const SizedBox(height: 6),
          _buildInputField(controller: _houseController, hintText: 'e.g. Apt 4B'),
          const SizedBox(height: 16),

          // STREET ADDRESS
          _buildFieldLabel('STREET ADDRESS'),
          const SizedBox(height: 6),
          _buildInputField(
            controller: _streetController,
            hintText: 'e.g. Sayaji Hotel',
            trailing: const Icon(Icons.my_location_rounded, size: 20, color: Color(0xFFF5A623)),
          ),
          const SizedBox(height: 16),

          // PIN Code & City
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildFieldLabel('PIN Code'),
                    const SizedBox(height: 6),
                    _buildInputField(
                      controller: _pinController,
                      hintText: 'PIN Code',
                      keyboardType: TextInputType.number,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildFieldLabel('City'),
                    const SizedBox(height: 6),
                    _buildInputField(
                      controller: _cityController,
                      hintText: 'City',
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Set as default address switch card
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFF1EEE6)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.025),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Set as default address',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF1E1E1E),
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Use this as primary for future orders',
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                    ],
                  ),
                ),
                Switch(
                  value: _isDefault,
                  onChanged: (val) => setState(() => _isDefault = val),
                  activeTrackColor: const Color(0xFFF5A623),
                  activeThumbColor: Colors.white,
                  inactiveTrackColor: const Color(0xFFE5E7EB),
                  inactiveThumbColor: Colors.white,
                ),
              ],
            ),
          ),
          const SizedBox(height: 26),

          // Save Address Button
          ElevatedButton(
            onPressed: _onSaveAddress,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF5A623),
              foregroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 52),
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              textStyle: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            child: const Text('Save Address'),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildFullMapMode() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final pinX = constraints.maxWidth * 0.44;
        final pinY = constraints.maxHeight * 0.385;

        return Stack(
          children: [
            // Map Background matching Figma vector map
            Positioned.fill(
              child: Image.asset(
                'assets/images/map_bg.jpg',
                fit: BoxFit.cover,
                alignment: Alignment.topCenter,
              ),
            ),

            // Top Navigation Header
            Positioned(
              top: 10,
              left: 16,
              right: 16,
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => setState(() => _isFullMapMode = false),
                    behavior: HitTestBehavior.opaque,
                    child: const Padding(
                      padding: EdgeInsets.all(4),
                      child: Icon(Icons.arrow_back, color: Color(0xFF1E1E1E), size: 22),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Add Address',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1E1E1E),
                    ),
                  ),
                ],
              ),
            ),

            // Center Pin with translucent blue halo and red teardrop with white dot
            Positioned(
              left: pinX - 25,
              top: pinY - 25,
              child: SizedBox(
                width: 50,
                height: 50,
                child: Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: const Color(0xFF4285F4).withValues(alpha: 0.28),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const Icon(
                        Icons.location_on_rounded,
                        size: 34,
                        color: Color(0xFFEF4444),
                      ),
                      Positioned(
                        top: 14,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Locate FAB Button floating above the card
            Positioned(
              right: 16,
              bottom: 375,
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.12),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.my_location_rounded, color: Color(0xFFF5A623), size: 22),
              ),
            ),

            // Floating Address Confirmation Card
            Positioned(
              left: 16,
              right: 16,
              bottom: 84,
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: 18,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Current Location',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1E1E1E),
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Vijay Nagar Mg road Near Medanta Hospital,\nIndore, Madhya Pradesh-452020',
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF4B5563),
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildFieldLabel('HOUSE/APARTMENT*'),
                    const SizedBox(height: 6),
                    _buildInputField(controller: _houseController, hintText: 'e.g. Apt 4B'),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(child: _buildTypeButton('Home', Icons.home_outlined)),
                        const SizedBox(width: 10),
                        Expanded(child: _buildTypeButton('Work', Icons.business_center_outlined)),
                        const SizedBox(width: 10),
                        Expanded(child: _buildTypeButton('Other', Icons.location_on_outlined)),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Standalone Floating Confirm Location Button
            Positioned(
              left: 16,
              right: 16,
              bottom: 18,
              child: ElevatedButton(
                onPressed: () {
                  setState(() {
                    _streetController.text = 'Vijay Nagar Mg road Near Medanta Hospital';
                    _cityController.text = 'Indore';
                    _pinController.text = '452020';
                    _isFullMapMode = false;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF5A623),
                  foregroundColor: const Color(0xFF1E1E1E),
                  minimumSize: const Size(double.infinity, 52),
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  textStyle: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                child: const Text('Confirm Location'),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildFieldLabel(String label) {
    return Text(
      label,
      style: const TextStyle(
        fontSize: 11.5,
        fontWeight: FontWeight.w700,
        color: Color(0xFF8C93A3),
        letterSpacing: 0.3,
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hintText,
    TextInputType keyboardType = TextInputType.text,
    Widget? trailing,
  }) {
    return Container(
      height: 50,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFF1EEE6), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              keyboardType: keyboardType,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: Color(0xFF1E1E1E),
              ),
              decoration: InputDecoration(
                isDense: true,
                border: InputBorder.none,
                hintText: hintText,
                hintStyle: const TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF9CA3AF),
                ),
              ),
            ),
          ),
          ?trailing,
        ],
      ),
    );
  }

  Widget _buildTypeButton(String type, IconData icon) {
    final isSelected = _selectedType == type;
    return GestureDetector(
      onTap: () => setState(() => _selectedType = type),
      behavior: HitTestBehavior.opaque,
      child: Container(
        height: 48,
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFFFFDF5) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? const Color(0xFFF5A623) : const Color(0xFFE5E7EB),
            width: isSelected ? 1.4 : 1.0,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? const Color(0xFFF5A623) : const Color(0xFF1E1E1E),
            ),
            const SizedBox(width: 6),
            Text(
              type,
              style: TextStyle(
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? const Color(0xFFF5A623) : const Color(0xFF1E1E1E),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
