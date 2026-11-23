/// Item in a vendor customer order.
class OrderItem {
  const OrderItem({
    required this.name,
    required this.quantity,
    required this.unitPrice,
    this.unit = '',
    this.isPacked = false,
  });

  final String name;
  final int quantity;
  final double unitPrice;
  final String unit;
  final bool isPacked;

  double get totalPrice => quantity * unitPrice;

  OrderItem copyWith({
    String? name,
    int? quantity,
    double? unitPrice,
    String? unit,
    bool? isPacked,
  }) {
    return OrderItem(
      name: name ?? this.name,
      quantity: quantity ?? this.quantity,
      unitPrice: unitPrice ?? this.unitPrice,
      unit: unit ?? this.unit,
      isPacked: isPacked ?? this.isPacked,
    );
  }
}

/// Order detail data for the customer order.
class OrderFlowData {
  const OrderFlowData({
    required this.orderId,
    required this.customerName,
    required this.items,
    required this.itemTotal,
    required this.packingCharge,
    required this.taxes,
    required this.totalEarnings,
    required this.timeRemaining,
    required this.paymentMethod,
    required this.category,
    required this.customerNote,
    required this.riderName,
    required this.riderRating,
    required this.riderDeliveries,
    required this.riderVehicle,
    required this.riderPlate,
    required this.riderOtp,
  });

  final String orderId;
  final String customerName;
  final List<OrderItem> items;
  final double itemTotal;
  final double packingCharge;
  final double taxes;
  final double totalEarnings;
  final String timeRemaining;
  final String paymentMethod;
  final String category;
  final String customerNote;
  final String riderName;
  final String riderRating;
  final String riderDeliveries;
  final String riderVehicle;
  final String riderPlate;
  final String riderOtp;

  static const defaultOrder = OrderFlowData(
    orderId: '#FC2841',
    customerName: 'Anita K.',
    items: [
      OrderItem(name: 'Tomato (kg)', quantity: 2, unitPrice: 40, unit: 'kg', isPacked: true),
      OrderItem(name: 'Onion (kg)', quantity: 3, unitPrice: 32, unit: 'kg', isPacked: true),
      OrderItem(name: 'Coriander bunch', quantity: 1, unitPrice: 20, unit: 'bunch', isPacked: true),
      OrderItem(name: 'Green chilli 250 g', quantity: 1, unitPrice: 30, unit: '250 g', isPacked: true),
      OrderItem(name: 'Potato (kg)', quantity: 2, unitPrice: 35, unit: 'kg', isPacked: false),
      OrderItem(name: 'Ginger 100 g', quantity: 1, unitPrice: 30, unit: '100 g', isPacked: false),
    ],
    itemTotal: 326,
    packingCharge: 10,
    taxes: 50,
    totalEarnings: 386,
    timeRemaining: '2:45',
    paymentMethod: 'Paid online',
    category: 'Vegetables',
    customerNote: 'please pick fresh, medium-size tomatoes.',
    riderName: 'Ravi V.',
    riderRating: '4.8',
    riderDeliveries: '1,240',
    riderVehicle: 'Scooter',
    riderPlate: 'MP 09 AB 1234',
    riderOtp: '4826',
  );
}
