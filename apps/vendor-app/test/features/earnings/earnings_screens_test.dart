import 'package:fillcart_vendor/features/earnings/earnings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  void setTestViewport(WidgetTester tester) {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
  }

  group('VendorEarningsScreen Widget Tests', () {
    testWidgets('renders all main earnings components correctly',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const VendorEarningsScreen()));
      await tester.pumpAndSettle();

      // Screen title and date pill
      expect(find.text('Earnings'), findsOneWidget);
      expect(find.text('This week (15 – 21 Jan)'), findsOneWidget);

      // Hero sales card
      expect(find.text("Today's sales"), findsOneWidget);
      expect(find.text('₹24,560'), findsOneWidget);
      expect(find.text('+8% vs yesterday'), findsOneWidget);
      expect(find.text('24'), findsOneWidget);
      expect(find.text('Orders'), findsOneWidget);
      expect(find.text('₹520'), findsOneWidget);
      expect(find.text('Avg. order'), findsOneWidget);
      expect(find.text('₹9,860'), findsOneWidget);
      expect(find.text('Payout due'), findsOneWidget);

      // Withdraw status card
      expect(find.text('Available to withdraw'), findsOneWidget);
      expect(find.text('₹8,700'), findsOneWidget);
      expect(find.text('Pending'), findsOneWidget);
      expect(find.text('₹2,400'), findsOneWidget);
      expect(find.text('View payouts'), findsOneWidget);
      expect(find.text('Withdraw earnings'), findsOneWidget);

      // Section: Manage earnings
      expect(find.text('Manage earnings'), findsOneWidget);
      expect(find.text('Earning details'), findsOneWidget);
      expect(find.text('Sales, commissions & deductions'), findsOneWidget);
      expect(find.text('Transactions'), findsOneWidget);
      expect(find.text('Order wise earnings'), findsOneWidget);
      expect(find.text('Payout & settlements'), findsOneWidget);
      expect(find.text('Weekly settlement & history'), findsOneWidget);
      expect(find.text('Statements'), findsOneWidget);
      expect(find.text('Download weekly/monthly reports'), findsOneWidget);
      expect(find.text('Support'), findsOneWidget);
      expect(find.text('Get help with your earnings'), findsOneWidget);
    });

    testWidgets('tapping View payouts navigates to PayoutSettlementScreen',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const VendorEarningsScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('View payouts'));
      await tester.pumpAndSettle();

      expect(find.byType(PayoutSettlementScreen), findsOneWidget);
    });

    testWidgets('tapping Withdraw earnings navigates to WithdrawEarningsScreen',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const VendorEarningsScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Withdraw earnings'));
      await tester.pumpAndSettle();

      expect(find.byType(WithdrawEarningsScreen), findsOneWidget);
    });

    testWidgets('tapping Earning details navigates to EarningDetailsScreen',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const VendorEarningsScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Earning details'));
      await tester.pumpAndSettle();

      expect(find.byType(EarningDetailsScreen), findsOneWidget);
    });

    testWidgets('tapping Transactions navigates to TransactionsScreen',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const VendorEarningsScreen()));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Transactions'));
      await tester.pumpAndSettle();

      expect(find.byType(TransactionsScreen), findsOneWidget);
    });
  });

  group('EarningDetailsScreen Widget Tests', () {
    testWidgets('renders all gross breakdown items and summary cards',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const EarningDetailsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Total earnings'), findsNWidgets(2));
      expect(find.text('42 Orders'), findsOneWidget);
      expect(find.text('Total sales (gross)'), findsOneWidget);
      expect(find.text('₹28,900'), findsOneWidget);
      expect(find.text('Platform commission (10%)'), findsOneWidget);
      expect(find.text('-₹2,890'), findsOneWidget);
      expect(find.text('Taxes (GST)'), findsOneWidget);
      expect(find.text('-₹1,450'), findsOneWidget);
      expect(find.text('Adjustments'), findsOneWidget);
      expect(find.text('₹0'), findsOneWidget);

      expect(find.text('Earnings summary'), findsOneWidget);
      expect(find.text('42'), findsOneWidget);
      expect(find.text('₹585'), findsOneWidget);
    });
  });

  group('TransactionsScreen Widget Tests', () {
    testWidgets('renders transaction list and navigates to TransactionDetailScreen',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const TransactionsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('All'), findsOneWidget);
      expect(find.text('Earnings'), findsNWidgets(2));
      expect(find.text('Adjustment'), findsNWidgets(2));
      expect(find.text('Refund'), findsOneWidget);

      // Tap first transaction
      await tester.tap(find.text('+₹306'));
      await tester.pumpAndSettle();

      expect(find.byType(TransactionDetailScreen), findsOneWidget);
      expect(find.text('Bill Summary'), findsOneWidget);
      expect(find.text('You earned'), findsOneWidget);
      expect(find.text('₹306'), findsOneWidget);
      expect(find.text('Online payment'), findsOneWidget);
    });
  });

  group('AboutEarningsScreen Widget Tests', () {
    testWidgets('renders calculation formula and explanations',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const AboutEarningsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('About Earnings'), findsOneWidget);
      expect(find.text('Earnings formula'), findsOneWidget);
      expect(find.text('What each item means'), findsOneWidget);
      expect(find.text('Item total'), findsWidgets);
      expect(find.text('Packing charge'), findsWidgets);
      expect(find.text('Platform commission'), findsOneWidget);
      expect(find.text('GST on commission'), findsOneWidget);
      expect(find.text('Adjustments'), findsOneWidget);
      expect(find.text('Quick example'), findsOneWidget);
      expect(find.text('You earned'), findsOneWidget);
    });
  });

  group('PayoutSettlementScreen & PayoutDetailsScreen Widget Tests', () {
    testWidgets('renders settlements and navigates to PayoutDetailsScreen',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const PayoutSettlementScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Payout & Settlement'), findsOneWidget);
      expect(find.text('10 - 16 Feb, 2026'), findsOneWidget);
      expect(find.text('Settled'), findsWidgets);
      expect(find.text('Failed'), findsWidgets);
      expect(find.text('Processing'), findsWidgets);

      // Tap View details on first settlement
      await tester.tap(find.text('View details').first);
      await tester.pumpAndSettle();

      expect(find.byType(PayoutDetailsScreen), findsOneWidget);
      expect(find.text('Settled successfully'), findsOneWidget);
      expect(find.text('₹14,250'), findsNWidgets(2));
      expect(find.text('Transfer information'), findsOneWidget);
      expect(find.text('HDFC Bank'), findsOneWidget);
      expect(find.text('Download payout statement'), findsOneWidget);
    });
  });

  group('Withdraw Earnings Flow Widget Tests', () {
    testWidgets('complete withdrawal flow from input to success',
        (tester) async {
      setTestViewport(tester);
      await tester.pumpWidget(buildTestableWidget(const WithdrawEarningsScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Withdraw earnings'), findsOneWidget);
      expect(find.text('Available Balance'), findsOneWidget);
      expect(find.text('₹24,560'), findsOneWidget);
      expect(find.text('HDFC Bank •••• 4821'), findsOneWidget);
      expect(find.text('Verified'), findsOneWidget);
      expect(find.text('Confirm Withdraw'), findsOneWidget);

      // Tap quick pill ₹5,000
      await tester.tap(find.text('₹5,000'));
      await tester.pumpAndSettle();

      // Tap Confirm Withdraw
      await tester.tap(find.text('Confirm Withdraw'));
      await tester.pumpAndSettle();

      expect(find.byType(ProcessingWithdrawalScreen), findsOneWidget);
      expect(find.text('Processing withdrawal'), findsOneWidget);
      expect(find.text('Request sent'), findsOneWidget);
      expect(find.text('Approved'), findsOneWidget);

      // Fast forward past the 2.5s timer to trigger success screen
      await tester.pump(const Duration(milliseconds: 3000));
      await tester.pumpAndSettle();

      expect(find.byType(WithdrawalSuccessfulScreen), findsOneWidget);
      expect(find.text('Withdrawal successful'), findsOneWidget);
      expect(find.text('Back to Home'), findsOneWidget);
    });
  });
}
