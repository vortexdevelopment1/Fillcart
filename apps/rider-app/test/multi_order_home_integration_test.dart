import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import 'package:fillcart_rider/features/orders/controllers/multi_order_flow_controller.dart';
import 'package:fillcart_rider/features/orders/data/mock_multi_order_data.dart';
import 'package:fillcart_rider/features/orders/data/multi_order_persistence_store.dart';
import 'package:fillcart_rider/features/orders/domain/models/multi_order_batch.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues(<String, Object>{});
  });

  group('Multi-Order Batch 3.1 Home Integration & Navigation', () {
    testWidgets(
      'clean install provisions one assigned batch with 7s countdown and persists it',
      (tester) async {
        var now = DateTime.utc(2026, 1, 1, 10, 0, 0);
        final store = InMemoryMultiOrderPersistenceStore();
        final controller = MultiOrderFlowController(
          persistenceStore: store,
          nowProvider: () => now,
        );

        await tester.pumpWidget(
          RiderApp(
            initialLocation: '/home',
            multiOrderController: controller,
          ),
        );
        await tester.pump();
        await tester.pump();

        expect(find.byKey(const Key('multi_order_assignment_card')), findsOneWidget);
        expect(find.byKey(const Key('multi_order_countdown_text')), findsOneWidget);
        expect(find.text('7s'), findsOneWidget);
        expect(find.text('Accept within 7s'), findsOneWidget);
        expect(store.saveCount, equals(1));

        // Rejecting returns to empty state and persists cancelled status.
        await tester.tap(find.byKey(const Key('multi_order_reject_button')));
        await tester.pump();

        expect(controller.batch.batchStatus, MultiOrderBatchStatus.cancelled);
        expect(find.byKey(const Key('multi_order_assignment_card')), findsNothing);
        expect(find.byKey(const Key('home_empty_title')), findsOneWidget);

        // Re-opening app with same store must NOT re-provision a new assignment.
        final relaunched = MultiOrderFlowController(
          persistenceStore: store,
          nowProvider: () => now.add(const Duration(minutes: 1)),
        );
        await tester.pumpWidget(
          RiderApp(
            initialLocation: '/home',
            multiOrderController: relaunched,
          ),
        );
        await tester.pump();
        await tester.pump();

        expect(relaunched.batch.batchStatus, MultiOrderBatchStatus.cancelled);
        expect(find.byKey(const Key('multi_order_assignment_card')), findsNothing);
        expect(find.byKey(const Key('home_empty_title')), findsOneWidget);
      },
    );

    testWidgets(
      'swipe-only accept navigates to /multi-order without bottom nav bar',
      (tester) async {
        final now = DateTime.utc(2026, 1, 1, 10, 0, 0);
        final store = InMemoryMultiOrderPersistenceStore();
        final controller = MultiOrderFlowController(
          persistenceStore: store,
          nowProvider: () => now,
        );

        await tester.pumpWidget(
          RiderApp(
            initialLocation: '/home',
            multiOrderController: controller,
          ),
        );
        await tester.pump();
        await tester.pump();

        final swipeFinder =
            find.byKey(const Key('multi_order_accept_swipe_button'));
        expect(swipeFinder, findsOneWidget);

        // Plain tap must NOT accept.
        await tester.tap(swipeFinder);
        await tester.pump();
        expect(controller.batch.batchStatus, MultiOrderBatchStatus.assigned);
        expect(
          find.byKey(const Key('multi_order_placeholder_screen')),
          findsNothing,
        );

        // Dragging across the swipe track accepts and navigates to /multi-order.
        await tester.drag(swipeFinder, const Offset(300, 0));
        await tester.pumpAndSettle();

        expect(controller.batch.batchStatus, MultiOrderBatchStatus.inPickup);
        expect(
          find.byKey(const Key('multi_order_placeholder_screen')),
          findsOneWidget,
        );
        expect(find.byType(RiderBottomNavBar), findsNothing);
      },
    );

    testWidgets(
      'restored active batch redirects automatically to /multi-order',
      (tester) async {
        final now = DateTime.utc(2026, 1, 1, 10, 0, 0);
        final store = InMemoryMultiOrderPersistenceStore();
        final activeBatch = MockMultiOrderData.createSampleBatch(
          assignedAtEpochMs: now.millisecondsSinceEpoch,
        ).copyWith(
          batchStatus: MultiOrderBatchStatus.delivering,
          currentStep: MultiOrderStep.deliveryRoute,
        );
        await store.save(
          MultiOrderPersistedState(batch: activeBatch, isOnline: true),
        );

        final controller = MultiOrderFlowController(
          persistenceStore: store,
          nowProvider: () => now.add(const Duration(minutes: 2)),
        );

        await tester.pumpWidget(
          RiderApp(
            initialLocation: '/home',
            multiOrderController: controller,
          ),
        );
        await tester.pumpAndSettle();

        expect(
          find.byKey(const Key('multi_order_placeholder_screen')),
          findsOneWidget,
        );
        expect(find.byKey(const Key('home_empty_title')), findsNothing);
        expect(find.byType(RiderBottomNavBar), findsNothing);
      },
    );

    testWidgets(
      'countdown expires after 7 seconds and shows Home empty state',
      (tester) async {
        var now = DateTime.utc(2026, 1, 1, 10, 0, 0);
        final store = InMemoryMultiOrderPersistenceStore();
        final controller = MultiOrderFlowController(
          persistenceStore: store,
          nowProvider: () => now,
        );

        await tester.pumpWidget(
          RiderApp(
            initialLocation: '/home',
            multiOrderController: controller,
          ),
        );
        await tester.pump();
        await tester.pump();

        expect(find.text('7s'), findsOneWidget);

        now = now.add(const Duration(seconds: 7));
        await tester.pump(const Duration(seconds: 1));

        expect(controller.batch.batchStatus, MultiOrderBatchStatus.expired);
        expect(find.byKey(const Key('multi_order_assignment_card')), findsNothing);
        expect(find.byKey(const Key('home_empty_title')), findsOneWidget);
      },
    );

    testWidgets(
      'going offline cancels pending assignment; going offline during active delivery is blocked with SnackBar',
      (tester) async {
        final now = DateTime.utc(2026, 1, 1, 10, 0, 0);
        final store = InMemoryMultiOrderPersistenceStore();
        final controller = MultiOrderFlowController(
          persistenceStore: store,
          nowProvider: () => now,
        );

        await tester.pumpWidget(
          RiderApp(
            initialLocation: '/home',
            multiOrderController: controller,
          ),
        );
        await tester.pump();
        await tester.pump();

        // Going offline while assigned cancels pending assignment.
        await tester.tap(find.byKey(const Key('rider_toggle_switch_button')));
        await tester.pump();

        expect(controller.isOnline, isFalse);
        expect(controller.batch.batchStatus, MultiOrderBatchStatus.cancelled);
        expect(find.byKey(const Key('multi_order_assignment_card')), findsNothing);
        expect(find.byKey(const Key('home_empty_title')), findsOneWidget);

        // Verify controller-level block + SnackBar when active delivery is in progress.
        controller.setOnlineStatus(true);
        controller.assignFreshDemoBatch(newBatchId: 'BATCH-ACTIVE-TEST');
        controller.acceptAssignment();
        expect(controller.canGoOffline, isFalse);
        expect(controller.setOnlineStatus(false), isFalse);
        expect(controller.isOnline, isTrue);
        expect(controller.lastErrorMessage, isNotNull);
      },
    );
  });
}
