import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/order_flow/models/order_flow_model.dart';
import 'order_ready_for_pickup_screen.dart';

/// Screen 3 of Flow: Order Packing Status Screen.
class OrderPackingStatusScreen extends StatefulWidget {
  const OrderPackingStatusScreen({
    super.key,
    this.orderId = '#FC2841',
    this.readyByTime = '7:58 PM',
  });

  final String orderId;
  final String readyByTime;

  @override
  State<OrderPackingStatusScreen> createState() =>
      _OrderPackingStatusScreenState();
}

class _OrderPackingStatusScreenState extends State<OrderPackingStatusScreen> {
  late List<OrderItem> _items;

  @override
  void initState() {
    super.initState();
    // Default matching Figma: 4 items packed, 1 pending
    _items = [
      const OrderItem(name: 'Tomato (kg)', quantity: 2, unitPrice: 40, isPacked: true),
      const OrderItem(name: 'Onion (kg)', quantity: 3, unitPrice: 32, isPacked: true),
      const OrderItem(name: 'Coriander bunch', quantity: 1, unitPrice: 20, isPacked: true),
      const OrderItem(name: 'Green chilli 250 g', quantity: 1, unitPrice: 30, isPacked: true),
      const OrderItem(name: 'Potato (kg)', quantity: 2, unitPrice: 35, isPacked: false),
    ];
  }

  int get _packedCount => _items.where((i) => i.isPacked).length;
  int get _totalCount => _items.length;
  int get _pendingCount => _totalCount - _packedCount;
  double get _progress => _totalCount == 0 ? 0.0 : _packedCount / _totalCount;

  void _toggleItem(int index) {
    setState(() {
      _items[index] = _items[index].copyWith(
        isPacked: !_items[index].isPacked,
      );
    });
  }

  void _selectAll() {
    final allPacked = _items.every((i) => i.isPacked);
    setState(() {
      _items = _items.map((i) => i.copyWith(isPacked: !allPacked)).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F5F7),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF4F5F7),
        elevation: 0,
        leading: IconButton(
          icon: SvgPicture.asset(
            AppAssets.svgBackArrow,
            width: 24,
            height: 24,
            colorFilter: const ColorFilter.mode(
              Color(0xFF111827),
              BlendMode.srcIn,
            ),
          ),
          onPressed: () => Navigator.maybePop(context),
        ),
        title: const Text(
          'Order Status',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827),
          ),
        ),
        centerTitle: false,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Countdown & Progress Card
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: const Color(0xFF111827),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Ready by ${widget.readyByTime} · time left',
                                    style: const TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w400,
                                      color: Color(0xFFCCCCCC),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    '11:20',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 36,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                ],
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    '$_packedCount / $_totalCount',
                                    style: const TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 22,
                                      fontWeight: FontWeight.w700,
                                      color: Color(0xFFC8F169),
                                    ),
                                  ),
                                  const Text(
                                    'packed',
                                    style: TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w400,
                                      color: Color(0xFF9CA3AF),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),

                          // Progress Bar
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: _progress,
                              minHeight: 7,
                              backgroundColor: const Color(0xFF1F2937),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                Color(0xFFC8F169),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),

                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '$_packedCount packed',
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w400,
                                  color: Color(0xFFCCCCCC),
                                ),
                              ),
                              Text(
                                '$_pendingCount Pending',
                                style: const TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 12,
                                  fontWeight: FontWeight.w400,
                                  color: Color(0xFFCCCCCC),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Items to Pack Checklist Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Items to Pack',
                                style: TextStyle(
                                  fontFamily: 'Inter',
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF111827),
                                ),
                              ),
                              InkWell(
                                onTap: _selectAll,
                                child: const Text(
                                  'Select all',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 13,
                                    fontWeight: FontWeight.w400,
                                    color: Color(0xFF5B5B5B),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // Checklist Items
                          ...List.generate(_items.length, (index) {
                            final item = _items[index];
                            return InkWell(
                              onTap: () => _toggleItem(index),
                              borderRadius: BorderRadius.circular(8),
                              child: Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 8),
                                child: Row(
                                  children: [
                                    // Checkbox box
                                    Container(
                                      width: 22,
                                      height: 22,
                                      decoration: BoxDecoration(
                                        color: item.isPacked
                                            ? const Color(0xFF000000)
                                            : Colors.white,
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(
                                          color: item.isPacked
                                              ? const Color(0xFF000000)
                                              : const Color(0xFF9CA3AF),
                                          width: 1.5,
                                        ),
                                      ),
                                      child: item.isPacked
                                          ? const Icon(
                                              Icons.check,
                                              size: 15,
                                              color: Colors.white,
                                            )
                                          : null,
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        '${item.quantity} × ${item.name}',
                                        style: const TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF0E1512),
                                        ),
                                      ),
                                    ),
                                    // Status pill (Packed / Pending)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 3.5,
                                      ),
                                      decoration: BoxDecoration(
                                        color: item.isPacked
                                            ? const Color(0xFFE3F4EA)
                                            : const Color(0xFFFFDEC9),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Text(
                                        item.isPacked ? 'Packed' : 'Pending',
                                        style: TextStyle(
                                          fontFamily: 'Inter',
                                          fontSize: 11.5,
                                          fontWeight: FontWeight.w700,
                                          color: item.isPacked
                                              ? const Color(0xFF0F6B36)
                                              : const Color(0xFF9E5527),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Customer Note Banner
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Text(
                        'Customer note: please pick fresh, medium-size tomatoes.',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12.5,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF78350F),
                          height: 1.35,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Sticky Bottom CTA: "Mark as Ready for Pickup"
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(27),
                    ),
                  ),
                  onPressed: () {
                    Navigator.push<void>(
                      context,
                      MaterialPageRoute<void>(
                        builder: (_) => OrderReadyForPickupScreen(
                          orderId: widget.orderId,
                        ),
                      ),
                    );
                  },
                  child: const Text(
                    'Mark as Ready for Pickup',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
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

