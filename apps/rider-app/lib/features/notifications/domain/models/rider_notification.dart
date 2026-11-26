import 'package:flutter/foundation.dart';

/// Type of notification matching Figma reference.
enum NotificationCardType {
  /// Card Type A: New Order Assigned
  newOrderAssigned,

  /// Card Type B: Order Completed
  orderCompleted,

  /// Card Type C: Order Delivered
  orderDelivered,
}

/// Data model representing a notification item in the Fillcart Rider App.
@immutable
class RiderNotification {
  final String id;
  final NotificationCardType type;
  final String title;
  final String? description;
  final String? pickupLocation;
  final String? dropLocation;
  final String? distance;
  final String? orderId;
  final String? amount;
  final String? paymentLabel;
  final String? timestamp;
  final String group; // "Today"
  final bool isNew;

  const RiderNotification({
    required this.id,
    required this.type,
    required this.title,
    this.description,
    this.pickupLocation,
    this.dropLocation,
    this.distance,
    this.orderId,
    this.amount,
    this.paymentLabel,
    this.timestamp,
    required this.group,
    this.isNew = false,
  });

  RiderNotification copyWith({
    String? id,
    NotificationCardType? type,
    String? title,
    String? description,
    String? pickupLocation,
    String? dropLocation,
    String? distance,
    String? orderId,
    String? amount,
    String? paymentLabel,
    String? timestamp,
    String? group,
    bool? isNew,
  }) {
    return RiderNotification(
      id: id ?? this.id,
      type: type ?? this.type,
      title: title ?? this.title,
      description: description ?? this.description,
      pickupLocation: pickupLocation ?? this.pickupLocation,
      dropLocation: dropLocation ?? this.dropLocation,
      distance: distance ?? this.distance,
      orderId: orderId ?? this.orderId,
      amount: amount ?? this.amount,
      paymentLabel: paymentLabel ?? this.paymentLabel,
      timestamp: timestamp ?? this.timestamp,
      group: group ?? this.group,
      isNew: isNew ?? this.isNew,
    );
  }

  /// Initial sample notifications matching Figma reference (exactly 3 items under Today).
  static List<RiderNotification> getInitialSampleNotifications() {
    return const [
      // 1. Today - Notification 1: New order assigned (Unread)
      RiderNotification(
        id: 'notif_1',
        type: NotificationCardType.newOrderAssigned,
        title: 'New order assigned',
        pickupLocation: 'Restaurant Hub, Vijay Nagar Indore. 0 Km',
        dropLocation: 'Radisson square',
        distance: '1.2 Km',
        amount: '₹45.00',
        timestamp: '2 min ago',
        group: 'Today',
        isNew: true,
      ),
      // 2. Today - Notification 2: Order Completed (Unread)
      RiderNotification(
        id: 'notif_2',
        type: NotificationCardType.orderCompleted,
        title: 'Order Completed',
        orderId: 'Order Id #ORD12345',
        amount: '₹45.00',
        paymentLabel: 'Cash Collect',
        timestamp: '16 min ago',
        group: 'Today',
        isNew: true,
      ),
      // 3. Today - Notification 3: Order delivered (Read)
      RiderNotification(
        id: 'notif_3',
        type: NotificationCardType.orderDelivered,
        title: 'Order delivered',
        description: 'Order #FC9210 has been delivered successfully.',
        timestamp: '1 hr ago',
        group: 'Today',
        isNew: false,
      ),
    ];
  }
}
