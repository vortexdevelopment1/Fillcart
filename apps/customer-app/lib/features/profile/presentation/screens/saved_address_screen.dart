import 'package:fillcart_customer/features/profile/presentation/screens/add_address_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Saved Address Screen matching Figma reference media_1795674058417_5314a760.png.
class SavedAddressScreen extends StatefulWidget {
  const SavedAddressScreen({super.key});

  @override
  State<SavedAddressScreen> createState() => _SavedAddressScreenState();
}

class _SavedAddressScreenState extends State<SavedAddressScreen> {
  late List<_AddressItem> _addresses;

  @override
  void initState() {
    super.initState();
    _addresses = [
      _AddressItem(
        id: 'addr_1',
        title: 'Home',
        address: '12, Maple Street, Koramangala, Bengaluru — 560034',
        isDefault: true,
        type: _AddressType.home,
      ),
      _AddressItem(
        id: 'addr_2',
        title: 'Work',
        address: 'WeWork Galaxy, 43, Residency Rd, Bengaluru — 560025',
        isDefault: false,
        type: _AddressType.work,
      ),
      _AddressItem(
        id: 'addr_3',
        title: "Mom's Place",
        address: '7B, Shivaji Nagar, Pune — 411005',
        isDefault: false,
        type: _AddressType.other,
      ),
    ];
  }

  void _onSetDefault(String id) {
    setState(() {
      for (var a in _addresses) {
        a.isDefault = a.id == id;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Default delivery address updated!'),
        duration: Duration(milliseconds: 900),
      ),
    );
  }

  void _onDelete(String id) {
    setState(() {
      _addresses.removeWhere((a) => a.id == id);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Address deleted'),
        duration: Duration(milliseconds: 900),
      ),
    );
  }

  void _onEdit(_AddressItem address) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => AddAddressScreen(
          existingName: 'Jamie Donovan',
          existingPhone: '98765 43210',
          existingHouse: address.title,
          existingStreet: address.address,
        ),
      ),
    );
  }

  void _onAddNew() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const AddAddressScreen(),
      ),
    );
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 10),

                      // Top Navigation Header
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
                            'Saved Address',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1E1E1E),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // Addresses List
                      ..._addresses.map((addr) => _buildAddressCard(addr)),
                      const SizedBox(height: 8),

                      // Add New Address Button directly beneath cards
                      ElevatedButton.icon(
                        onPressed: _onAddNew,
                        icon: const Icon(Icons.add, size: 20),
                        label: const Text('Add New Address'),
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
                      ),
                      const SizedBox(height: 36),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddressCard(_AddressItem item) {
    IconData icon;
    Color iconBg;
    Color iconColor;

    switch (item.type) {
      case _AddressType.home:
        icon = Icons.home_outlined;
        iconBg = const Color(0xFFFEF3C7);
        iconColor = const Color(0xFFD97706);
        break;
      case _AddressType.work:
        icon = Icons.business_center_outlined;
        iconBg = const Color(0xFFE0F2FE);
        iconColor = const Color(0xFF0284C7);
        break;
      case _AddressType.other:
        icon = Icons.favorite_border_rounded;
        iconBg = const Color(0xFFFEE2E2);
        iconColor = const Color(0xFFEF4444);
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF1EEE6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.035),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(14),
                ),
                alignment: Alignment.center,
                child: Icon(icon, size: 22, color: iconColor),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          item.title,
                          style: const TextStyle(
                            fontSize: 15.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1E1E1E),
                          ),
                        ),
                        if (item.isDefault) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.check_circle, size: 12, color: Color(0xFFD97706)),
                                SizedBox(width: 3),
                                Text(
                                  'Default',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFFD97706),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.address,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                        height: 1.35,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(height: 1, color: Color(0xFFF3F4F6)),
          const SizedBox(height: 10),

          // Action row: Edit, Set Default, Delete
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const NeverScrollableScrollPhysics(),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () => _onEdit(item),
                  child: const Row(
                    children: [
                      Icon(Icons.edit_outlined, size: 16, color: Color(0xFFD97706)),
                      SizedBox(width: 4),
                      Text(
                        'Edit',
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFD97706),
                        ),
                      ),
                    ],
                  ),
                ),
                if (!item.isDefault) ...[
                  const SizedBox(width: 18),
                  GestureDetector(
                    onTap: () => _onSetDefault(item.id),
                    child: const Row(
                      children: [
                        Icon(Icons.location_on_outlined, size: 16, color: Color(0xFF6B7280)),
                        SizedBox(width: 4),
                        Text(
                          'Set default',
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(width: 18),
                GestureDetector(
                  onTap: () => _onDelete(item.id),
                  child: const Row(
                    children: [
                      Icon(Icons.delete_outline_rounded, size: 16, color: Color(0xFFEF4444)),
                      SizedBox(width: 4),
                      Text(
                        'Delete',
                        style: TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFEF4444),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

enum _AddressType { home, work, other }

class _AddressItem {
  final String id;
  final String title;
  final String address;
  bool isDefault;
  final _AddressType type;

  _AddressItem({
    required this.id,
    required this.title,
    required this.address,
    required this.isDefault,
    required this.type,
  });
}
