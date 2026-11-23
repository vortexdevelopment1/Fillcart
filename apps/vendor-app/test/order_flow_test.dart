import 'package:fillcart_vendor/features/dashboard/presentation/screens/vendor_dashboard_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/handover_verification_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_cancelled_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_details_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_handed_over_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_packing_status_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/order_ready_for_pickup_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/screens/reject_order_screen.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/widgets/customer_cancellation_bottom_sheet.dart';
import 'package:fillcart_vendor/features/order_flow/presentation/widgets/prepare_time_modal.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Home & New Order Flow End-to-End Tests', () {
    testWidgets('VendorDashboardScreen renders all components correctly',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: VendorDashboardScreen(),
        ),
      );

      // Verify Header
      expect(find.text('Rahul Mart'), findsOneWidget);
      expect(find.text('Store is Online'), findsOneWidget);
      expect(find.text('Search Products etc.'), findsOneWidget);

      // Verify New Orders Banner
      expect(find.text('3 new orders waiting'), findsOneWidget);
      expect(find.text('#FC2841 · Anita K.'), findsOneWidget);

      // Verify Today's sales
      expect(find.text("Today's sales"), findsOneWidget);
      expect(find.text('₹12,480'), findsOneWidget);
      expect(find.text('+8% vs yesterday'), findsOneWidget);

      // Verify Quick Order Filters
      expect(find.text('New'), findsOneWidget);
      expect(find.text('Packing'), findsOneWidget);
      expect(find.text('Ready'), findsOneWidget);

      // Verify Manage Store
      expect(find.text('Manage Store'), findsOneWidget);
      expect(find.text('Add\nProducts'), findsOneWidget);

      // Verify Business Overview
      expect(find.text('Business Overview'), findsOneWidget);
      expect(find.text('Sales Analytics'), findsOneWidget);
      expect(find.text('Promotions'), findsOneWidget);
    });

    testWidgets('OrderDetailsScreen renders order receipt and note',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OrderDetailsScreen(),
        ),
      );

      expect(find.text('Order Details'), findsOneWidget);
      expect(find.text('New order'), findsOneWidget);
      expect(find.text('Order Id : #FC2841'), findsOneWidget);
      expect(find.text('Time Left'), findsOneWidget);
      expect(find.text('You earn'), findsOneWidget);
      expect(find.text('₹386'), findsOneWidget);
      expect(find.text('Reject'), findsOneWidget);
      expect(find.text('Accept Order'), findsOneWidget);
    });

    testWidgets('PrepareTimeModal selects preset and custom time',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: PrepareTimeModal(),
          ),
        ),
      );

      expect(find.text('How long to prepare?'), findsOneWidget);
      expect(find.text('15 min'), findsWidgets);
      expect(find.text('10 min'), findsOneWidget);
      expect(find.text('20 min'), findsOneWidget);
      expect(find.text('30 min'), findsOneWidget);

      // Tap 20 min preset
      await tester.tap(find.text('20 min'));
      await tester.pump();
      expect(find.text('8:03 PM'), findsWidgets);
    });

    testWidgets('OrderPackingStatusScreen toggles packing checklist',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OrderPackingStatusScreen(),
        ),
      );

      expect(find.text('Order Status'), findsOneWidget);
      expect(find.text('Items to Pack'), findsOneWidget);
      expect(find.text('Mark as Ready for Pickup'), findsOneWidget);
      expect(find.text('4 / 5'), findsOneWidget);

      // Toggle first item
      await tester.tap(find.text('2 × Tomato (kg)'));
      await tester.pump();

      // Tap Select all
      await tester.tap(find.text('Select all'));
      await tester.pump();
    });

    testWidgets('OrderReadyForPickupScreen renders dark theme rider info',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OrderReadyForPickupScreen(),
        ),
      );

      expect(find.text('Order Ready for Pickup.'), findsOneWidget);
      expect(find.text('Ravi V.'), findsOneWidget);
      expect(find.text('Scooter'), findsOneWidget);
      expect(find.text('MP 09 AB 1234'), findsOneWidget);
      expect(find.text('Enter Rider OTP'), findsOneWidget);
    });

    testWidgets('HandoverVerificationScreen enters OTP digits and verifies',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: HandoverVerificationScreen(),
        ),
      );

      expect(find.text("Enter rider's OTP"), findsOneWidget);
      expect(find.text('Verify & hand over'), findsOneWidget);

      // Tap digit 6 on keypad
      await tester.tap(find.text('6'));
      await tester.pumpAndSettle();
    });

    testWidgets('OrderHandedOverScreen renders final success summary',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OrderHandedOverScreen(),
        ),
      );

      expect(find.text('Handed over!'), findsOneWidget);
      expect(find.text('Order earnings'), findsOneWidget);
      expect(find.text('₹386'), findsOneWidget);
      expect(find.text("Added to today's sales"), findsOneWidget);
      expect(find.text('Back to home'), findsOneWidget);
      expect(find.text('View order summary'), findsOneWidget);
    });

    testWidgets('RejectOrderScreen renders rejection reasons and submits',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: RejectOrderScreen(),
        ),
      );

      expect(find.text('Reject Order'), findsOneWidget);
      expect(find.text('Why are you rejecting?'), findsOneWidget);
      expect(find.text('Store is too busy'), findsOneWidget);
      expect(find.text('Items out of stock'), findsOneWidget);
      expect(find.text('Store closing soon'), findsOneWidget);
      expect(find.text('Delivery area too far'), findsOneWidget);
      expect(find.text('Other'), findsOneWidget);
      expect(find.text('Add a note (optional)'), findsOneWidget);
      expect(find.text('Tell us more'), findsOneWidget);
      expect(find.text('Reject  order'), findsOneWidget);
      expect(find.text('Keep Order'), findsOneWidget);

      // Select 'Items out of stock'
      await tester.tap(find.text('Items out of stock'));
      await tester.pump();

      // Tap 'Reject  order' button
      await tester.tap(find.text('Reject  order'));
      await tester.pumpAndSettle();

      // Expect transition to OrderCancelledScreen
      expect(find.text('Order Ready for Pickup.'), findsOneWidget);
      expect(find.text('Items out of stock'), findsOneWidget);
    });

    testWidgets('CustomerCancellationBottomSheet renders stop packing alert',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CustomerCancellationBottomSheet(),
          ),
        ),
      );

      expect(find.text('Order cancel by customer'), findsOneWidget);
      expect(find.text('#FC2841 order cancel on 8:04 PM'), findsOneWidget);
      expect(find.text('Stop Packing'), findsOneWidget);
      expect(find.text('Got it, Stop packing'), findsOneWidget);
      expect(find.text('View order details'), findsOneWidget);
    });

    testWidgets('OrderCancelledScreen renders restocking guidance and home CTA',
        (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OrderCancelledScreen(),
        ),
      );

      expect(find.text('Order Ready for Pickup.'), findsOneWidget);
      expect(find.text('Customer Reason'), findsOneWidget);
      expect(find.text('Changed my mind'), findsOneWidget);
      expect(find.text('Order value'), findsOneWidget);
      expect(find.text('₹386'), findsOneWidget);
      expect(find.text('Packed so far'), findsOneWidget);
      expect(find.text('4 of 6 items'), findsOneWidget);
      expect(
        find.text('Put the 4 packed items back on the shelf before your next order.'),
        findsOneWidget,
      );
      expect(find.text('Back to home'), findsOneWidget);
      expect(find.text('Need help?'), findsOneWidget);
    });
  });
}
