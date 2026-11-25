import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_details_screen.dart';
import 'package:fillcart_vendor/features/order_management/models/vendor_order_model.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_orders_screen.dart';
import 'package:flutter/material.dart';

/// Pop-up widget displayed when a new order arrives on the Dashboard screen.
class NewOrderWaitingPopup extends StatelessWidget {
  const NewOrderWaitingPopup({
    super.key,
    required this.onClose,
    required this.onViewAll,
    required this.onTapOrder,
  });

  final VoidCallback onClose;
  final VoidCallback onViewAll;
  final void Function(String orderId) onTapOrder;

  @override
  Widget build(BuildContext context) {
    const brandLime = Color(0xFFC8F169);
    const darkBg = Color(0xFF111827);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: brandLime,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.22),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '3 new orders waiting',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: darkBg,
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 5,
                    ),
                    decoration: BoxDecoration(
                      color: darkBg,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Text(
                      'Accept in 2:45',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  InkWell(
                    key: const Key('close_new_order_popup_button'),
                    onTap: onClose,
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: darkBg.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.close_rounded,
                        size: 16,
                        color: darkBg,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Order 1 (Tappable -> Opens Order Details Flow)
          _buildPopupOrderCard(
            orderTitle: '#FC2841 · Anita K.',
            subtitle: '6 items · ₹386 · Paid online',
            timeLeft: '2:45',
            timeLeftColor: const Color(0xFFDC2626),
            onTap: () => onTapOrder('#FC2841'),
          ),
          const SizedBox(height: 10),

          // Order 2
          _buildPopupOrderCard(
            orderTitle: '#FC2840 · Mohit S.',
            subtitle: '4 items · ₹210 · COD',
            timeLeft: '4:10',
            timeLeftColor: const Color(0xFFB45309),
            onTap: () => onTapOrder('#FC2840'),
          ),
          const SizedBox(height: 12),

          // View All New Orders Link
          InkWell(
            key: const Key('view_all_new_orders_popup_button'),
            onTap: onViewAll,
            child: const Padding(
              padding: EdgeInsets.symmetric(vertical: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'View all new orders',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: darkBg,
                    ),
                  ),
                  SizedBox(width: 6),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 16,
                    color: darkBg,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPopupOrderCard({
    required String orderTitle,
    required String subtitle,
    required String timeLeft,
    required Color timeLeftColor,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    orderTitle,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    timeLeft,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14.5,
                      fontWeight: FontWeight.w700,
                      color: timeLeftColor,
                    ),
                  ),
                  const Text(
                    'left',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 10.5,
                      fontWeight: FontWeight.w400,
                      color: Color(0xFF9CA3AF),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Helper function to display the new orders popup as a modal dialog from anywhere.
Future<void> showNewOrderWaitingPopup({
  required BuildContext context,
  VoidCallback? onViewAll,
  void Function(String orderId)? onTapOrder,
}) {
  return showDialog<void>(
    context: context,
    barrierDismissible: true,
    barrierColor: Colors.black.withValues(alpha: 0.5),
    builder: (ctx) => Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16),
      child: NewOrderWaitingPopup(
        onClose: () => Navigator.pop(ctx),
        onViewAll: () {
          Navigator.pop(ctx);
          if (onViewAll != null) {
            onViewAll();
          } else {
            Navigator.push<void>(
              ctx,
              MaterialPageRoute<void>(
                builder: (_) => const VendorOrdersScreen(
                  initialTab: VendorOrderTab.newOrders,
                ),
              ),
            );
          }
        },
        onTapOrder: (orderId) {
          Navigator.pop(ctx);
          if (onTapOrder != null) {
            onTapOrder(orderId);
          } else {
            Navigator.push<void>(
              ctx,
              MaterialPageRoute<void>(
                builder: (_) => const OrderDetailsScreen(),
              ),
            );
          }
        },
      ),
    ),
  );
}
