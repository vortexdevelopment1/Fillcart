import 'package:fillcart_rider/features/orders/domain/models/payment_summary.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_contact_card.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_header.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_order_id_card.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_otp_box_row.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_payment_method_selector.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_primary_button.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_status_toast.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_stop_timeline_card.dart';
import 'package:fillcart_rider/features/orders/presentation/widgets/multi_order_swipe_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _wrapWithMaterial(Widget child) {
  return MaterialApp(
    home: Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: child,
      ),
    ),
  );
}

void main() {
  group('Multi-Order Shared UI Components (Batch 2.2)', () {
    testWidgets('MultiOrderHeader supports left-aligned with back and centered without back', (tester) async {
      var backTapped = false;
      await tester.pumpWidget(
        _wrapWithMaterial(
          MultiOrderHeader(
            title: 'Order Details',
            showBackButton: true,
            onBack: () => backTapped = true,
          ),
        ),
      );
      expect(find.text('Order Details'), findsOneWidget);
      final backBtn = find.byKey(const Key('multi_order_header_back_button'));
      expect(backBtn, findsOneWidget);
      await tester.tap(backBtn);
      expect(backTapped, isTrue);

      await tester.pumpWidget(
        _wrapWithMaterial(
          const MultiOrderHeader(
            title: 'Payment Received',
            showBackButton: false,
          ),
        ),
      );
      expect(find.text('Payment Received'), findsOneWidget);
      expect(
        find.byKey(const Key('multi_order_header_back_button')),
        findsNothing,
      );
      final titleWidget = tester.widget<Text>(
        find.byKey(const Key('multi_order_header_title')),
      );
      expect(titleWidget.textAlign, TextAlign.center);
    });

    testWidgets('MultiOrderStatusToast renders supplied message', (tester) async {
      await tester.pumpWidget(
        _wrapWithMaterial(
          const MultiOrderStatusToast(message: 'Order accepted successfully'),
        ),
      );
      expect(find.text('Order accepted successfully'), findsOneWidget);
      expect(find.byIcon(Icons.check_circle), findsOneWidget);
    });

    testWidgets('MultiOrderPrimaryButton respects enabled/disabled state', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        _wrapWithMaterial(
          MultiOrderPrimaryButton(
            label: 'Continue',
            enabled: false,
            onPressed: () => tapped = true,
          ),
        ),
      );
      await tester.tap(find.byKey(const Key('multi_order_primary_button')));
      expect(tapped, isFalse);

      await tester.pumpWidget(
        _wrapWithMaterial(
          MultiOrderPrimaryButton(
            label: 'Continue',
            enabled: true,
            onPressed: () => tapped = true,
          ),
        ),
      );
      await tester.tap(find.byKey(const Key('multi_order_primary_button')));
      expect(tapped, isTrue);
    });

    testWidgets('MultiOrderSwipeButton ignores tap and completes only on valid drag', (tester) async {
      var completedCount = 0;
      await tester.pumpWidget(
        _wrapWithMaterial(
          SizedBox(
            width: 328,
            child: MultiOrderSwipeButton(
              label: 'Accept',
              onSwipeComplete: () => completedCount++,
            ),
          ),
        ),
      );

      final buttonFinder = find.byKey(const Key('multi_order_swipe_button'));
      await tester.tap(buttonFinder);
      await tester.pump();
      expect(completedCount, equals(0));

      // Short drag below threshold should reset without completing
      await tester.drag(buttonFinder, const Offset(80, 0));
      await tester.pumpAndSettle();
      expect(completedCount, equals(0));

      // Full drag past threshold should complete once
      await tester.drag(buttonFinder, const Offset(280, 0));
      await tester.pumpAndSettle();
      expect(completedCount, equals(1));
    });

    testWidgets('Disabled MultiOrderSwipeButton cannot activate on drag', (tester) async {
      var completedCount = 0;
      await tester.pumpWidget(
        _wrapWithMaterial(
          SizedBox(
            width: 328,
            child: MultiOrderSwipeButton(
              label: 'Confirm Pickup',
              enabled: false,
              onSwipeComplete: () => completedCount++,
            ),
          ),
        ),
      );

      await tester.drag(
        find.byKey(const Key('multi_order_swipe_button')),
        const Offset(280, 0),
      );
      await tester.pumpAndSettle();
      expect(completedCount, equals(0));
    });

    testWidgets('MultiOrderOtpBoxRow supports 4-digit mode, focus progression, and completion', (tester) async {
      String? completedOtp;
      await tester.pumpWidget(
        _wrapWithMaterial(
          MultiOrderOtpBoxRow(
            length: 4,
            onCompleted: (otp) => completedOtp = otp,
          ),
        ),
      );

      for (var i = 0; i < 4; i++) {
        expect(find.byKey(Key('multi_order_otp_box_$i')), findsOneWidget);
      }
      expect(find.byKey(const Key('multi_order_otp_box_4')), findsNothing);

      await tester.enterText(find.byKey(const Key('multi_order_otp_box_0')), '4');
      await tester.enterText(find.byKey(const Key('multi_order_otp_box_1')), '8');
      await tester.enterText(find.byKey(const Key('multi_order_otp_box_2')), '2');
      await tester.enterText(find.byKey(const Key('multi_order_otp_box_3')), '1');
      await tester.pump();

      expect(completedOtp, equals('4821'));
    });

    testWidgets('MultiOrderOtpBoxRow supports 6-digit mode, error display, and disabled state', (tester) async {
      String? completedOtp;
      await tester.pumpWidget(
        _wrapWithMaterial(
          MultiOrderOtpBoxRow(
            length: 6,
            errorText: 'Incorrect delivery OTP',
            enabled: false,
            onCompleted: (otp) => completedOtp = otp,
          ),
        ),
      );

      for (var i = 0; i < 6; i++) {
        final field = tester.widget<TextField>(
          find.byKey(Key('multi_order_otp_box_$i')),
        );
        expect(field.enabled, isFalse);
      }
      expect(find.text('Incorrect delivery OTP'), findsOneWidget);

      await tester.pumpWidget(
        _wrapWithMaterial(
          MultiOrderOtpBoxRow(
            length: 6,
            enabled: true,
            onCompleted: (otp) => completedOtp = otp,
          ),
        ),
      );

      final digits = ['6', '5', '4', '3', '2', '1'];
      for (var i = 0; i < 6; i++) {
        await tester.enterText(
          find.byKey(Key('multi_order_otp_box_$i')),
          digits[i],
        );
      }
      await tester.pump();
      expect(completedOtp, equals('654321'));
    });

    testWidgets('MultiOrderPaymentMethodSelector handles single selection', (tester) async {
      PaymentMethod selected = PaymentMethod.cash;
      await tester.pumpWidget(
        _wrapWithMaterial(
          StatefulBuilder(
            builder: (context, setState) {
              return MultiOrderPaymentMethodSelector(
                selectedMethod: selected,
                onMethodSelected: (method) {
                  setState(() => selected = method);
                },
              );
            },
          ),
        ),
      );

      expect(find.text('Collected Cash'), findsOneWidget);
      expect(find.text('UPI'), findsOneWidget);

      await tester.tap(find.byKey(const Key('payment_option_upi')));
      await tester.pump();
      expect(selected, equals(PaymentMethod.upi));

      await tester.tap(find.byKey(const Key('payment_option_cash')));
      await tester.pump();
      expect(selected, equals(PaymentMethod.cash));
    });

    testWidgets('MultiOrderContactCard renders content and optional Call callback', (tester) async {
      var called = false;
      await tester.pumpWidget(
        _wrapWithMaterial(
          MultiOrderContactCard(
            label: 'Pickup from',
            name: 'Apollo Pharmacy & Essentials',
            address: 'Shop 4, C21 Mall, Indore',
            distanceText: '0 Km',
            onCall: () => called = true,
          ),
        ),
      );

      expect(find.text('Pickup from'), findsOneWidget);
      expect(find.text('Apollo Pharmacy & Essentials'), findsOneWidget);
      expect(find.text('Shop 4, C21 Mall, Indore · 0 Km'), findsOneWidget);
      await tester.tap(find.byKey(const Key('multi_order_contact_call_button')));
      expect(called, isTrue);

      await tester.pumpWidget(
        _wrapWithMaterial(
          const MultiOrderContactCard(
            label: 'Customer details',
            name: 'Rahul Verma',
            address: 'Vijay Nagar, Indore',
          ),
        ),
      );
      expect(
        find.byKey(const Key('multi_order_contact_call_button')),
        findsNothing,
      );
    });

    testWidgets('MultiOrderOrderIdCard renders order ID', (tester) async {
      await tester.pumpWidget(
        _wrapWithMaterial(
          const MultiOrderOrderIdCard(orderId: '#ORD-8821'),
        ),
      );
      expect(find.text('Order ID'), findsOneWidget);
      expect(find.text('#ORD-8821'), findsOneWidget);
    });

    testWidgets('MultiOrderStopTimelineCard renders pickup and drop-off markers', (tester) async {
      await tester.pumpWidget(
        _wrapWithMaterial(
          const MultiOrderStopTimelineCard(
            orderId: '#ORD-8821',
            statusBadge: 'New',
            expectedEarningText: '₹145',
            etaText: '20 mins',
            paymentLabel: 'Cash On delivery',
            stops: [
              MultiOrderStopNode(
                tag: 'Pickup 1',
                title: 'Apollo Pharmacy & Essentials',
                subtitle: 'Vijay Nagar, Indore',
              ),
              MultiOrderStopNode(
                tag: 'Deliver to',
                title: 'Rahul Verma',
                subtitle: 'Scheme 54, Indore',
                isDropOff: true,
              ),
            ],
          ),
        ),
      );

      expect(find.text('#ORD-8821'), findsOneWidget);
      expect(find.text('New'), findsOneWidget);
      expect(find.text('₹145'), findsOneWidget);
      expect(find.byKey(const Key('timeline_pickup_marker')), findsOneWidget);
      expect(find.byKey(const Key('timeline_dropoff_marker')), findsOneWidget);
      expect(find.text('20 mins'), findsOneWidget);
      expect(find.text('Cash On delivery'), findsOneWidget);
    });
  });
}
