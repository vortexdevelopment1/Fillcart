import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../domain/models/rider_notification.dart';

/// Compact Notification Card widget matching the Figma visual reference.
///
/// Visual Specifications:
/// - Unread state: Yellow tint background (approximated Color(0xFFFFFBEA) with
///   subtle border Color(0xFFFDE68A)), high-contrast typography.
/// - Read state: Pure white background (Color(0xFFFFFFFF) with subtle border
///   Color(0xFFEEEEEE)), softened/muted typography.
/// - Compact layout: No separate left-side 28 x 28 px icon box. Text content
///   utilizes the full card width with compact vertical padding and spacing.
class NotificationCard extends StatelessWidget {
  /// Approximated yellow background for unread notification cards derived from
  /// the supplied visual reference screenshot (Figma MCP quota limited).
  static const Color unreadCardYellow = Color(0xFFFFFBEA);

  /// Approximated subtle yellow border for unread cards.
  static const Color unreadCardBorder = Color(0xFFFDE68A);

  /// Pure white background for read notification cards.
  static const Color readCardWhite = Color(0xFFFFFFFF);

  /// Subtle neutral border for read notification cards.
  static const Color readCardBorder = Color(0xFFEEEEEE);

  final RiderNotification notification;

  const NotificationCard({
    super.key,
    required this.notification,
  });

  @override
  Widget build(BuildContext context) {
    final isNew = notification.isNew;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: isNew ? unreadCardYellow : readCardWhite,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isNew ? unreadCardBorder : readCardBorder,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // 1. Header Row: Title & Timestamp
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Text(
                  notification.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    fontWeight: isNew ? FontWeight.w600 : FontWeight.w500,
                    color: isNew
                        ? const Color(0xFF1B1C17)
                        : const Color(0xFF4B5563),
                    height: 1.2,
                  ),
                ),
              ),
              if (notification.timestamp != null) ...[
                const SizedBox(width: 8),
                Text(
                  notification.timestamp!,
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    fontWeight: FontWeight.w400,
                    color: isNew
                        ? const Color(0xFF777980)
                        : const Color(0xFF9CA3AF),
                    height: 1.2,
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 6),

          // 2. Card Content Details according to NotificationCardType
          if (notification.type == NotificationCardType.newOrderAssigned)
            _buildNewOrderDetails(isNew)
          else if (notification.type == NotificationCardType.orderCompleted)
            _buildOrderCompletedDetails(isNew)
          else if (notification.type == NotificationCardType.orderDelivered)
            _buildOrderDeliveredDetails(isNew),
        ],
      ),
    );
  }

  /// Notification 1: New order assigned details
  Widget _buildNewOrderDetails(bool isNew) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (notification.pickupLocation != null)
          Text(
            notification.pickupLocation!,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: isNew ? const Color(0xFF555555) : const Color(0xFF888888),
              height: 1.25,
            ),
          ),
        const SizedBox(height: 4),
        Row(
          children: [
            Text(
              'Deliver to: ',
              style: GoogleFonts.poppins(
                fontSize: 11,
                fontWeight: FontWeight.w400,
                color: isNew ? const Color(0xFF777980) : const Color(0xFF9CA3AF),
              ),
            ),
            Flexible(
              child: Text(
                notification.dropLocation ?? '',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: isNew ? FontWeight.w500 : FontWeight.w400,
                  color: isNew
                      ? const Color(0xFF1B1C17)
                      : const Color(0xFF6B7280),
                ),
              ),
            ),
            if (notification.distance != null) ...[
              const SizedBox(width: 6),
              Text(
                notification.distance!,
                style: GoogleFonts.poppins(
                  fontSize: 11,
                  fontWeight: FontWeight.w400,
                  color: isNew ? const Color(0xFF777980) : const Color(0xFF9CA3AF),
                ),
              ),
            ],
            if (notification.amount != null) ...[
              const SizedBox(width: 8),
              Text(
                notification.amount!,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: isNew ? FontWeight.w600 : FontWeight.w500,
                  color: isNew
                      ? const Color(0xFF1B1C17)
                      : const Color(0xFF4B5563),
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }

  /// Notification 2: Order Completed details
  Widget _buildOrderCompletedDetails(bool isNew) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (notification.orderId != null)
          Text(
            notification.orderId!,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: isNew ? const Color(0xFF555555) : const Color(0xFF888888),
              height: 1.25,
            ),
          ),
        const SizedBox(height: 4),
        Row(
          children: [
            if (notification.amount != null)
              Text(
                notification.amount!,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: isNew ? FontWeight.w600 : FontWeight.w500,
                  color: isNew
                      ? const Color(0xFF1B1C17)
                      : const Color(0xFF4B5563),
                ),
              ),
            if (notification.paymentLabel != null) ...[
              const SizedBox(width: 8),
              Text(
                notification.paymentLabel!,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: isNew ? const Color(0xFF777980) : const Color(0xFF9CA3AF),
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }

  /// Notification 3: Order delivered details
  Widget _buildOrderDeliveredDetails(bool isNew) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (notification.description != null)
          Text(
            notification.description!,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: isNew ? const Color(0xFF555555) : const Color(0xFF888888),
              height: 1.25,
            ),
          ),
      ],
    );
  }
}
