import '../domain/models/multi_order_batch.dart';
import '../domain/models/order_item.dart';
import '../domain/models/payment_summary.dart';
import '../domain/models/sub_order.dart';

/// Provides realistic, clearly identified mock data for the Multi Order demo flow.
///
/// Corresponds directly to Figma Canvas `900:10586`, Section `1570:35429`
/// ("Muiltyorder screen"). All merchant locations, customer destinations,
/// item lists, and 4-digit OTPs are strictly simulated for local demo use.
abstract final class MockMultiOrderData {
  /// Demo customer details matching the Figma reference in Indore, MP.
  static const String demoCustomerName = 'Rahul Verma';
  static const String demoCustomerPhone = '+91 98765 43210';
  static const String demoDeliveryAddress =
      'Flat 402, Royal Palms Apartments, Scheme 54, Vijay Nagar, Indore, MP 452010';

  /// Generates a fresh, realistic sample [MultiOrderBatch] with 3 pickup stops.
  static MultiOrderBatch createSampleBatch() {
    return MultiOrderBatch(
      id: 'BATCH-IND-7701',
      totalOrders: 3,
      currentPickupSequence: 1,
      customerName: demoCustomerName,
      customerPhone: demoCustomerPhone,
      deliveryAddress: demoDeliveryAddress,
      totalDistanceKm: 5.8,
      totalRiderEarnings: 145.0,
      baseEarnings: 75.0,
      multiOrderBonus: 50.0,
      distanceEarnings: 20.0,
      batchStatus: MultiOrderBatchStatus.assigned,
      currentStep: MultiOrderStep.batchAssigned,
      paymentSummary: const PaymentSummary(
        subtotal: 405.0,
        deliveryFee: 45.0,
        totalAmountDue: 450.0,
        amountCollected: 0.0,
        paymentMethod: PaymentMethod.unselected,
        paymentStatus: PaymentStatus.pending,
        transactionReference: 'UPI-TXN-4492881',
        paymentMethodLabel: null,
      ),
      subOrders: [
        // -------------------------------------------------------------
        // STOP 1: Pharmacy & Health Essentials (#ORD-8821)
        // -------------------------------------------------------------
        SubOrder(
          id: '#ORD-8821',
          sequenceNumber: 1,
          merchantName: 'Apollo Pharmacy & Essentials',
          merchantAddress:
              'Shop 4, Ground Floor, C21 Mall, AB Road, Vijay Nagar, Indore',
          merchantPhone: '+91 98261 22334',
          merchantInstructions:
              'Collect sealed medical pouch from Counter 1. Verify cold-pack inclusion.',
          merchantLatitude: 22.7533,
          merchantLongitude: 75.8937,
          customerName: demoCustomerName,
          customerPhone: demoCustomerPhone,
          deliveryAddress: demoDeliveryAddress,
          pickupOtp: '4821', // Unique 4-digit demo OTP for Stop 1
          isPickupVerified: false,
          status: SubOrderStatus.pending,
          items: const [
            OrderItem(
              id: 'ITEM-101',
              name: 'Paracetamol 650mg Tablets',
              quantity: 2,
              unit: 'Strip of 15',
              price: 32.50,
              isChecked: false,
            ),
            OrderItem(
              id: 'ITEM-102',
              name: 'Instant Hand Sanitizer 100ml',
              quantity: 1,
              unit: 'Bottle',
              price: 50.0,
              isChecked: false,
            ),
            OrderItem(
              id: 'ITEM-103',
              name: 'ORS Electrolyte Drink Apple Flavor 200ml',
              quantity: 3,
              unit: 'Tetra Pack',
              price: 35.0,
              isChecked: false,
            ),
          ],
        ),

        // -------------------------------------------------------------
        // STOP 2: Fresh Dairy & Groceries (#ORD-8822)
        // -------------------------------------------------------------
        SubOrder(
          id: '#ORD-8822',
          sequenceNumber: 2,
          merchantName: 'Nature Fresh Supermart',
          merchantAddress:
              '14-B Mangal City, Scheme 54, Vijay Nagar, Indore',
          merchantPhone: '+91 98262 33445',
          merchantInstructions:
              'Cold insulated bag required for dairy items. Pickup at Dispatch Desk.',
          merchantLatitude: 22.7550,
          merchantLongitude: 75.8960,
          customerName: demoCustomerName,
          customerPhone: demoCustomerPhone,
          deliveryAddress: demoDeliveryAddress,
          pickupOtp: '9102', // Unique 4-digit demo OTP for Stop 2
          isPickupVerified: false,
          status: SubOrderStatus.pending,
          items: const [
            OrderItem(
              id: 'ITEM-201',
              name: 'Amul Taaza Homogenised Toned Milk 500ml',
              quantity: 2,
              unit: 'Pouch',
              price: 27.0,
              isChecked: false,
            ),
            OrderItem(
              id: 'ITEM-202',
              name: 'Harvest Gold 100% Whole Wheat Bread 400g',
              quantity: 1,
              unit: 'Loaf',
              price: 45.0,
              isChecked: false,
            ),
            OrderItem(
              id: 'ITEM-203',
              name: 'Farm Fresh Brown Eggs',
              quantity: 1,
              unit: 'Pack of 6',
              price: 60.0,
              isChecked: false,
            ),
          ],
        ),

        // -------------------------------------------------------------
        // STOP 3: Bakery & Cafe Snacks (#ORD-8823)
        // -------------------------------------------------------------
        SubOrder(
          id: '#ORD-8823',
          sequenceNumber: 3,
          merchantName: 'Chai & Bites Artisan Bakery',
          merchantAddress:
              'Plot 21, PU-4 Commercial, Behind C21 Mall, Vijay Nagar, Indore',
          merchantPhone: '+91 98263 44556',
          merchantInstructions:
              'Hot freshly baked items. Keep bag upright to prevent spills.',
          merchantLatitude: 22.7520,
          merchantLongitude: 75.8920,
          customerName: demoCustomerName,
          customerPhone: demoCustomerPhone,
          deliveryAddress: demoDeliveryAddress,
          pickupOtp: '3357', // Unique 4-digit demo OTP for Stop 3
          isPickupVerified: false,
          status: SubOrderStatus.pending,
          items: const [
            OrderItem(
              id: 'ITEM-301',
              name: 'Flaky Butter Croissant',
              quantity: 2,
              unit: 'Piece',
              price: 45.0,
              isChecked: false,
            ),
            OrderItem(
              id: 'ITEM-302',
              name: 'Cold Brew Vanilla Coffee 300ml',
              quantity: 1,
              unit: 'Glass Bottle',
              price: 85.0,
              isChecked: false,
            ),
            OrderItem(
              id: 'ITEM-303',
              name: 'Masala Bun Maska',
              quantity: 2,
              unit: 'Piece',
              price: 30.0,
              isChecked: false,
            ),
          ],
        ),
      ],
    );
  }
}
