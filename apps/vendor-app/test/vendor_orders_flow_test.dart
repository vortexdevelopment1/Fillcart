import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fillcart_vendor/features/order_management/models/vendor_order_model.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/report_issues_screen.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_cancelled_order_details_screen.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_completed_order_details_screen.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_invoice_screen.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_orders_screen.dart';
import 'package:fillcart_vendor/features/order_management/presentation/widgets/order_filter_sort_bottom_sheet.dart';

void main() {
  Widget createTestWidget({VendorOrderTab initialTab = VendorOrderTab.all}) {
    return MaterialApp(
      home: VendorOrdersScreen(initialTab: initialTab),
    );
  }

  setUp(() {
    TestWidgetsFlutterBinding.ensureInitialized();
  });

  testWidgets('Orders screen renders search bar, filter button and all category tabs',
      (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(createTestWidget());
    await tester.pumpAndSettle();

    // 1. Header & search
    expect(find.text('Orders'), findsOneWidget);
    expect(find.text('Search order ID, name or item'), findsOneWidget);
    expect(find.byKey(const Key('filter_button')), findsOneWidget);

    // 2. All tabs exist
    expect(find.text('All'), findsOneWidget);
    expect(find.text('New'), findsOneWidget);
    expect(find.text('Preparing'), findsOneWidget);
    expect(find.text('Completed'), findsOneWidget);
    expect(find.text('Cancel'), findsOneWidget);

    // 3. Tab 'All' shows sections
    expect(find.text('New Orders'), findsOneWidget);
    expect(find.text('Preparing Order'), findsOneWidget);
    expect(find.text('Rider at store'), findsNWidgets(2)); // Tab pill + Section header
  });

  testWidgets('Switching to New, Preparing and Rider at store tabs filters cards correctly',
      (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(createTestWidget());
    await tester.pumpAndSettle();

    // Switch to 'New'
    await tester.tap(find.text('New'));
    await tester.pumpAndSettle();
    expect(find.text('New Orders'), findsOneWidget);
    expect(find.text('Preparing Order'), findsNothing);

    // Switch to 'Preparing'
    await tester.tap(find.text('Preparing'));
    await tester.pumpAndSettle();
    expect(find.text('Preparing Order'), findsOneWidget);
    expect(find.text('5 of 8 packed'), findsOneWidget);

    // Switch to 'Rider at store'
    await tester.tap(find.text('Rider at store'));
    await tester.pumpAndSettle();
    expect(find.text('Rider at store'), findsNWidgets(2)); // tab label + section title
    expect(find.text('Imran K. has arrived'), findsOneWidget);
  });

  testWidgets('Completed tab shows delivered badge, banner, and navigates to completed details & invoice',
      (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(createTestWidget());
    await tester.pumpAndSettle();

    // Switch to 'Completed'
    await tester.ensureVisible(find.text('Completed'));
    await tester.tap(find.text('Completed'));
    await tester.pumpAndSettle();

    expect(find.text('Delivered'), findsWidgets);
    expect(
      find.text(
        'Tap a completed order to view its delivery details, payment status, order summary and the complete order timeline.',
      ),
      findsOneWidget,
    );

    // Tap first completed order (#FC2822)
    await tester.tap(find.textContaining('#FC2822').first);
    await tester.pumpAndSettle();

    // Verify VendorCompletedOrderDetailsScreen
    expect(find.byType(VendorCompletedOrderDetailsScreen), findsOneWidget);
    expect(find.text('Bill and payout'), findsOneWidget);
    expect(find.text('You earned'), findsOneWidget);
    expect(find.text('₹337'), findsOneWidget);
    expect(find.text('Download invoice'), findsOneWidget);

    // Scroll if needed and tap Download Invoice button
    await tester.ensureVisible(find.text('Download invoice'));
    await tester.tap(find.text('Download invoice'));
    await tester.pumpAndSettle();

    // Verify VendorInvoiceScreen
    expect(find.byType(VendorInvoiceScreen), findsOneWidget);
    expect(find.text('Rahul Mart'), findsOneWidget);
    expect(find.text('GSTIN: 07AAAAA0000A1Z5'), findsOneWidget);
    expect(find.text('Download PDF'), findsOneWidget);
    expect(find.text('Share invoice'), findsOneWidget);

    // Tap Download PDF
    await tester.tap(find.text('Download PDF'));
    await tester.pumpAndSettle();
    expect(find.textContaining('downloaded successfully'), findsOneWidget);
  });

  testWidgets('Cancel tab shows cancelled badge, warning banner, and navigates to cancel details & report issues',
      (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(createTestWidget());
    await tester.pumpAndSettle();

    // Switch to 'Cancel'
    await tester.ensureVisible(find.text('Cancel'));
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();

    expect(find.text('Cancel'), findsWidgets);
    expect(
      find.text(
        'Tap a cancelled order to see when it was cancelled, what was already packed and what to do next.',
      ),
      findsOneWidget,
    );

    // Tap first cancelled order (#FC2822)
    await tester.ensureVisible(find.textContaining('#FC2822').first);
    await tester.tap(find.textContaining('#FC2822').first);
    await tester.pumpAndSettle();

    // Verify VendorCancelledOrderDetailsScreen
    expect(find.byType(VendorCancelledOrderDetailsScreen), findsOneWidget);
    expect(find.text('Cancelled by'), findsOneWidget);
    expect(find.text('Changed my mind'), findsOneWidget);
    expect(find.text('Total Order value'), findsOneWidget);
    expect(find.text('Contact Support'), findsOneWidget);

    // Tap Contact Support to open ReportIssuesScreen (Image 3)
    await tester.ensureVisible(find.text('Contact Support'));
    await tester.tap(find.text('Contact Support'));
    await tester.pumpAndSettle();

    // Verify ReportIssuesScreen
    expect(find.byType(ReportIssuesScreen), findsOneWidget);
    expect(find.text('Report Issues'), findsOneWidget);
    expect(find.text('What went wrong?'), findsOneWidget);
    expect(find.text('Wrong or missing item'), findsOneWidget);
    expect(find.text('Payment or payout problem'), findsOneWidget);
    expect(find.text('Rider problem'), findsOneWidget);
    expect(find.text('Customer problem'), findsOneWidget);
    expect(find.text('Something else'), findsOneWidget);
    expect(find.text('Describe the problem'), findsOneWidget);
    expect(find.text('Tell us what happened'), findsOneWidget);

    // Select Rider problem & type description
    await tester.tap(find.text('Rider problem'));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.widgetWithText(TextField, 'Tell us what happened'),
      'Rider arrived too late and was unresponsive.',
    );
    await tester.pumpAndSettle();

    // Tap Submit report
    await tester.tap(find.text('Submit report'));
    await tester.pumpAndSettle();

    // Should return to order details screen with snackbar
    expect(find.byType(ReportIssuesScreen), findsNothing);
    expect(find.textContaining('submitted'), findsOneWidget);
  });

  testWidgets('Search query without matches displays No orders found screen (Image 1)',
      (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(createTestWidget());
    await tester.pumpAndSettle();

    // Enter non-matching query 'FC9999'
    await tester.enterText(find.byType(TextField), 'FC9999');
    await tester.pumpAndSettle();

    // Verify Image 1 layout: No orders found empty state
    expect(find.text('No orders found'), findsOneWidget);
    expect(
      find.textContaining('We couldn\'t find an order matching “FC9999”'),
      findsOneWidget,
    );
    expect(find.byKey(const Key('search_back_button')), findsOneWidget);

    // Tap back button in search header to exit search mode
    await tester.tap(find.byKey(const Key('search_back_button')));
    await tester.pumpAndSettle();

    // Should return to standard Orders screen with All tabs
    expect(find.text('Orders'), findsOneWidget);
    expect(find.text('Search order ID, name or item'), findsOneWidget);
    expect(find.text('New Orders'), findsOneWidget);
  });

  testWidgets('Filter bottom sheet opens, updates filters and resets correctly',
      (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(createTestWidget());
    await tester.pumpAndSettle();

    // Tap filter button beside search bar
    await tester.tap(find.byKey(const Key('filter_button')));
    await tester.pumpAndSettle();

    // Verify filter modal
    expect(find.byType(OrderFilterSortBottomSheet), findsOneWidget);
    expect(find.text('Filter and sort'), findsOneWidget);
    expect(find.text('Sort by'), findsOneWidget);
    expect(find.text('Category'), findsOneWidget);
    expect(find.text('Payment'), findsOneWidget);
    expect(find.text('Show Orders'), findsOneWidget);

    // Select 'Highest value'
    await tester.tap(find.text('Highest value'));
    await tester.pumpAndSettle();

    // Tap 'Show Orders'
    await tester.tap(find.text('Show Orders'));
    await tester.pumpAndSettle();

    expect(find.byType(OrderFilterSortBottomSheet), findsNothing);
  });

  testWidgets('Search query filters orders live by order ID or customer name',
      (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(createTestWidget());
    await tester.pumpAndSettle();

    // Enter search text '#FC2841'
    await tester.enterText(find.byType(TextField), '#FC2841');
    await tester.pumpAndSettle();

    // Should find order #FC2841 and not #FC2840
    expect(find.textContaining('#FC2841'), findsWidgets);
    expect(find.textContaining('#FC2840'), findsNothing);

    // Clear search
    await tester.tap(find.byIcon(Icons.close_rounded));
    await tester.pumpAndSettle();

    expect(find.textContaining('#FC2840'), findsWidgets);
  });
}
