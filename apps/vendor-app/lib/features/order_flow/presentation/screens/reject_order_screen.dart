import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'order_cancelled_screen.dart';

/// Screen for rejecting an incoming order with a reason and optional note.
class RejectOrderScreen extends StatefulWidget {
  const RejectOrderScreen({
    super.key,
    this.orderId = '#FC2841',
  });

  final String orderId;

  @override
  State<RejectOrderScreen> createState() => _RejectOrderScreenState();
}

class _RejectOrderScreenState extends State<RejectOrderScreen> {
  // Rejection reasons matching Figma design
  static const List<String> _rejectionReasons = [
    'Store is too busy',
    'Items out of stock',
    'Store closing soon',
    'Delivery area too far',
    'Other',
  ];

  String _selectedReason = 'Store is too busy';
  final TextEditingController _noteController = TextEditingController();

  @override
  void dispose() {
    _noteController.dispose();
    super.dispose();
  }

  void _onRejectOrder() {
    // Navigate to Order Cancelled / Rejected confirmation screen
    Navigator.pushReplacement<void, void>(
      context,
      MaterialPageRoute<void>(
        builder: (_) => OrderCancelledScreen(
          orderId: widget.orderId,
          title: 'Order Ready for Pickup.',
          subtitle: 'The customer canceled ${widget.orderId} at 7:50 PM. Stop packing this order.',
          customerReason: _selectedReason == 'Store is too busy'
              ? 'Changed my mind'
              : _selectedReason,
          orderValue: '₹386',
          packedStatus: '4 of 6 items',
          isVendorRejection: true,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        toolbarHeight: 52,
        leadingWidth: 52,
        centerTitle: true,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: Center(
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: const Color.fromRGBO(255, 255, 255, 0.36),
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [
                  BoxShadow(
                    offset: Offset(0, 1),
                    blurRadius: 2,
                    color: Color(0x1A000000),
                  ),
                ],
              ),
              child: IconButton(
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                icon: SvgPicture.asset(
                  AppAssets.svgBackArrow,
                  width: 20,
                  height: 20,
                  colorFilter: const ColorFilter.mode(
                    Color(0xFF111827),
                    BlendMode.srcIn,
                  ),
                ),
                onPressed: () => Navigator.maybePop(context),
              ),
            ),
          ),
        ),
        title: const Text(
          'Reject Order',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Color(0xFF111827),
            height: 28 / 20,
            letterSpacing: 0,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 12),
                    // Section title
                    const Text(
                      'Why are you rejecting?',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Reasons card with custom radio buttons and dividers
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Column(
                        children: List.generate(_rejectionReasons.length, (index) {
                          final reason = _rejectionReasons[index];
                          final isSelected = reason == _selectedReason;
                          final isLast = index == _rejectionReasons.length - 1;

                          return Column(
                            children: [
                              InkWell(
                                onTap: () {
                                  setState(() {
                                    _selectedReason = reason;
                                  });
                                },
                                borderRadius: BorderRadius.vertical(
                                  top: index == 0
                                      ? const Radius.circular(18)
                                      : Radius.zero,
                                  bottom: isLast
                                      ? const Radius.circular(18)
                                      : Radius.zero,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                  child: Row(
                                    children: [
                                      // Custom Radio Button
                                      Container(
                                        width: 22,
                                        height: 22,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: isSelected
                                                ? const Color(0xFF111827)
                                                : const Color(0xFF9CA3AF),
                                            width: 1.8,
                                          ),
                                        ),
                                        child: isSelected
                                            ? Center(
                                                child: Container(
                                                  width: 11,
                                                  height: 11,
                                                  decoration: const BoxDecoration(
                                                    color: Color(0xFF111827),
                                                    shape: BoxShape.circle,
                                                  ),
                                                ),
                                              )
                                            : null,
                                      ),
                                      const SizedBox(width: 14),
                                      // Reason Label
                                      Expanded(
                                        child: Text(
                                          reason,
                                          style: const TextStyle(
                                            fontFamily: 'Inter',
                                            fontSize: 15,
                                            fontWeight: FontWeight.w500,
                                            color: Color(0xFF111827),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              if (!isLast)
                                const Divider(
                                  height: 1,
                                  thickness: 1,
                                  color: Color(0xFFF3F4F6),
                                  indent: 16,
                                  endIndent: 16,
                                ),
                            ],
                          );
                        }),
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Add a note label
                    const Text(
                      'Add a note (optional)',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Note text area
                    Container(
                      height: 96,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: const Color(0xFFE5E7EB),
                          width: 1,
                        ),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      child: TextField(
                        controller: _noteController,
                        maxLines: null,
                        expands: true,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF111827),
                        ),
                        decoration: const InputDecoration(
                          hintText: 'Tell us more',
                          hintStyle: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            color: Color(0xFF9CA3AF),
                          ),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: EdgeInsets.zero,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Fixed Bottom Action Buttons
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
              child: Column(
                children: [
                  // Reject order primary button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFB82318),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(27),
                        ),
                      ),
                      onPressed: _onRejectOrder,
                      child: const Text(
                        'Reject  order',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Keep Order secondary outline button
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(
                          color: Color(0xFF111827),
                          width: 1.0,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(27),
                        ),
                      ),
                      onPressed: () => Navigator.maybePop(context),
                      child: const Text(
                        'Keep Order',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
