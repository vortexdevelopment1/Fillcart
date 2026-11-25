import 'package:fillcart_vendor/features/order_flow/models/order_flow_model.dart';

/// Available tabs in the Vendor Orders Management screen.
enum VendorOrderTab {
  all(label: 'All'),
  newOrders(label: 'New'),
  preparing(label: 'Preparing'),
  riderAtStore(label: 'Rider at store'),
  completed(label: 'Completed'),
  cancel(label: 'Cancel');

  const VendorOrderTab({required this.label});
  final String label;
}

/// Status of a vendor order.
enum VendorOrderStatus {
  newOrder,
  preparing,
  riderAtStore,
  completed,
  cancelled,
}

/// Filter criteria for the orders screen.
class VendorOrderFilter {
  const VendorOrderFilter({
    this.sortBy = 'Newest first',
    this.categories = const {'Vegetables', 'Grocery'},
    this.payment,
  });

  final String sortBy;
  final Set<String> categories;
  final String? payment;

  VendorOrderFilter copyWith({
    String? sortBy,
    Set<String>? categories,
    String? payment,
    bool clearPayment = false,
  }) {
    return VendorOrderFilter(
      sortBy: sortBy ?? this.sortBy,
      categories: categories ?? this.categories,
      payment: clearPayment ? null : (payment ?? this.payment),
    );
  }
}

/// Represents an individual order item on the vendor app.
class VendorOrder {
  const VendorOrder({
    required this.orderId,
    required this.customerName,
    required this.itemCount,
    required this.summaryItems,
    required this.totalAmount,
    required this.paymentMethod,
    required this.category,
    required this.status,
    this.timeLeft,
    this.packedCount,
    this.totalPacked,
    this.readyTime,
    this.riderName,
    this.riderArrived = false,
    this.orderDateTime,
    this.cancellationReason,
    this.cancellationStage,
    this.cancellationTime,
    this.commissionAmount,
    this.earnedAmount,
    this.items = const [],
  });

  final String orderId;
  final String customerName;
  final int itemCount;
  final String summaryItems;
  final double totalAmount;
  final String paymentMethod;
  final String category;
  final VendorOrderStatus status;
  final String? timeLeft;
  final int? packedCount;
  final int? totalPacked;
  final String? readyTime;
  final String? riderName;
  final bool riderArrived;
  final String? orderDateTime;
  final String? cancellationReason;
  final String? cancellationStage;
  final String? cancellationTime;
  final double? commissionAmount;
  final double? earnedAmount;
  final List<OrderItem> items;

  /// Default mock orders matching the provided UI screens.
  static List<VendorOrder> mockOrders = [
    // --- New Orders ---
    const VendorOrder(
      orderId: '#FC2841',
      customerName: 'Kunal',
      itemCount: 6,
      summaryItems: 'Tomato, Onion, Coriander +3 more',
      totalAmount: 386,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.newOrder,
      timeLeft: '2:45 left',
      orderDateTime: 'Today, 8:02 PM',
      items: [
        OrderItem(name: 'Fresh Tomatoes (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: false),
        OrderItem(name: 'Nashik Red Onions (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: false),
        OrderItem(name: 'Coriander Bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: false),
        OrderItem(name: 'Green Chillies 250g', quantity: 1, unitPrice: 30, unit: '250g', isPacked: false),
        OrderItem(name: 'Potatoes (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: false),
        OrderItem(name: 'Fresh Ginger 100g', quantity: 1, unitPrice: 30, unit: '100g', isPacked: false),
      ],
    ),
    const VendorOrder(
      orderId: '#FC2840',
      customerName: 'Mohit S.',
      itemCount: 6,
      summaryItems: 'Tomato, Onion, Coriander +3 more',
      totalAmount: 386,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.newOrder,
      timeLeft: '2:45 left',
      orderDateTime: 'Today, 7:58 PM',
      items: [
        OrderItem(name: 'Fresh Tomatoes (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: false),
        OrderItem(name: 'Nashik Red Onions (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: false),
        OrderItem(name: 'Coriander Bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: false),
        OrderItem(name: 'Potatoes (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: false),
      ],
    ),

    // --- Preparing Order ---
    const VendorOrder(
      orderId: '#FC2841',
      customerName: 'Priya S.',
      itemCount: 8,
      summaryItems: 'Tomato, Onion, Coriander +5 more',
      totalAmount: 420,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.preparing,
      timeLeft: '4:45 left',
      packedCount: 5,
      totalPacked: 8,
      readyTime: 'Ready by 8:10 PM',
      orderDateTime: 'Today, 7:45 PM',
      items: [
        OrderItem(name: 'Tomato (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: true),
        OrderItem(name: 'Onion (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: true),
        OrderItem(name: 'Coriander bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: true),
        OrderItem(name: 'Green chilli 250 g', quantity: 1, unitPrice: 30, unit: '250 g', isPacked: true),
        OrderItem(name: 'Potato (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: true),
        OrderItem(name: 'Ginger 100 g', quantity: 1, unitPrice: 30, unit: '100 g', isPacked: false),
        OrderItem(name: 'Garlic 200 g', quantity: 1, unitPrice: 45, unit: '200 g', isPacked: false),
        OrderItem(name: 'Lemons (4 pcs)', quantity: 1, unitPrice: 20, unit: 'pack', isPacked: false),
      ],
    ),
    const VendorOrder(
      orderId: '#FV9991',
      customerName: 'Anita',
      itemCount: 6,
      summaryItems: 'Tomato, Onion, Coriander +3 more',
      totalAmount: 386,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.preparing,
      timeLeft: '4:45 left',
      packedCount: 6,
      totalPacked: 6,
      readyTime: 'Ready by 8:10 PM',
      orderDateTime: 'Today · 7:42 PM',
      items: [
        OrderItem(name: 'Tomato (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: true),
        OrderItem(name: 'Onion (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: true),
        OrderItem(name: 'Coriander bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: true),
        OrderItem(name: 'Green chilli 250 g', quantity: 1, unitPrice: 30, unit: '250 g', isPacked: true),
        OrderItem(name: 'Potato (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: true),
        OrderItem(name: 'Ginger 100 g', quantity: 1, unitPrice: 30, unit: '100 g', isPacked: true),
      ],
    ),

    // --- Rider at store Order ---
    const VendorOrder(
      orderId: '#FV9991',
      customerName: 'Imran K. has arrived',
      itemCount: 5,
      summaryItems: 'Tomato, Onion, Coriander +2 more',
      totalAmount: 386,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.riderAtStore,
      readyTime: 'Ready since 7:41 PM',
      riderName: 'Imran K.',
      riderArrived: true,
      orderDateTime: 'Today, 7:30 PM',
      items: [
        OrderItem(name: 'Tomato (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: true),
        OrderItem(name: 'Onion (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: true),
        OrderItem(name: 'Coriander bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: true),
        OrderItem(name: 'Green chilli 250 g', quantity: 1, unitPrice: 30, unit: '250 g', isPacked: true),
        OrderItem(name: 'Potato (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: true),
      ],
    ),

    // --- Completed Orders ---
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 6,
      summaryItems: 'Tomato, Onion, Coriander +3 more',
      totalAmount: 386,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.completed,
      orderDateTime: '12 November ,6:52 PM',
      riderName: 'Imran K.',
      commissionAmount: 49,
      earnedAmount: 337,
      items: [
        OrderItem(name: 'Tomato (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: true),
        OrderItem(name: 'Onion (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: true),
        OrderItem(name: 'Coriander bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: true),
        OrderItem(name: 'Green chili 250 g', quantity: 1, unitPrice: 30, unit: '250 g', isPacked: true),
        OrderItem(name: 'Potato (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: true),
        OrderItem(name: 'Ginger 100 g', quantity: 1, unitPrice: 30, unit: '100 g', isPacked: true),
      ],
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Onion, Coriander +2 more',
      totalAmount: 524,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.completed,
      orderDateTime: '12 November ,6:52 PM',
      riderName: 'Vikram S.',
      commissionAmount: 63,
      earnedAmount: 461,
      items: [
        OrderItem(name: 'Farm Fresh Tomatoes (1 kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: true),
        OrderItem(name: 'Fresh Onion (1 kg)', quantity: 3, unitPrice: 35, unit: 'kg', isPacked: true),
        OrderItem(name: 'Coriander Bunch (100g)', quantity: 1, unitPrice: 15, unit: 'bunch', isPacked: true),
        OrderItem(name: 'Amul Taaza Milk (500ml)', quantity: 2, unitPrice: 28, unit: 'pouch', isPacked: true),
        OrderItem(name: 'Aashirvaad Atta (5kg)', quantity: 1, unitPrice: 200, unit: 'bag', isPacked: true),
      ],
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Onion, Coriander +2 more',
      totalAmount: 524,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.completed,
      orderDateTime: '12 November ,6:52 PM',
      riderName: 'Ravi V.',
      commissionAmount: 63,
      earnedAmount: 461,
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Onion, Coriander +2 more',
      totalAmount: 524,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.completed,
      orderDateTime: '12 November ,6:52 PM',
      riderName: 'Imran K.',
      commissionAmount: 63,
      earnedAmount: 461,
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Onion, Coriander +2 more',
      totalAmount: 524,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.completed,
      orderDateTime: '12 November ,6:52 PM',
      riderName: 'Vikram S.',
      commissionAmount: 63,
      earnedAmount: 461,
    ),

    // --- Cancelled Orders ---
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 6,
      summaryItems: 'Tomato, Onion, Coriander +3 more',
      totalAmount: 54,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.cancelled,
      orderDateTime: '12 November ,6:52 PM',
      cancellationReason: 'Changed my mind',
      cancellationStage: 'While packing',
      cancellationTime: '7:50 PM',
      items: [
        OrderItem(name: 'Tomato (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: true),
        OrderItem(name: 'Onion (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: true),
        OrderItem(name: 'Coriander bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: true),
        OrderItem(name: 'Green chili 250 g', quantity: 1, unitPrice: 30, unit: '250 g', isPacked: true),
        OrderItem(name: 'Potato (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: true),
        OrderItem(name: 'Ginger 100 g', quantity: 1, unitPrice: 30, unit: '100 g', isPacked: true),
      ],
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Potato, Onion',
      totalAmount: 54,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.cancelled,
      orderDateTime: '12 November ,6:52 PM',
      cancellationReason: 'Changed my mind',
      cancellationStage: 'While packing',
      cancellationTime: '7:50 PM',
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Potato, Onion',
      totalAmount: 54,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.cancelled,
      orderDateTime: '12 November ,6:52 PM',
      cancellationReason: 'Changed my mind',
      cancellationStage: 'While packing',
      cancellationTime: '7:50 PM',
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Potato, Onion',
      totalAmount: 54,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.cancelled,
      orderDateTime: '12 November ,6:52 PM',
      cancellationReason: 'Changed my mind',
      cancellationStage: 'While packing',
      cancellationTime: '7:50 PM',
    ),
    const VendorOrder(
      orderId: '#FC2822',
      customerName: 'Kunal B.',
      itemCount: 5,
      summaryItems: 'Tomato, Potato, Onion',
      totalAmount: 54,
      paymentMethod: 'Paid online',
      category: 'Vegetables',
      status: VendorOrderStatus.cancelled,
      orderDateTime: '12 November ,6:52 PM',
      cancellationReason: 'Changed my mind',
      cancellationStage: 'While packing',
      cancellationTime: '7:50 PM',
    ),
  ];
}
