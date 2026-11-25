library;

/// Data models for the Vendor Earnings and Settlements feature.

enum SettlementStatus {
  settled,
  processing,
  failed,
}

enum TransactionType {
  all,
  earnings,
  adjustment,
  refund,
}

class EarningTransaction {
  const EarningTransaction({
    required this.id,
    required this.title,
    required this.dateTime,
    required this.paymentType,
    required this.amount,
    required this.isPositive,
    required this.statusLabel,
    this.isSettled = true,
  });

  final String id;
  final String title;
  final String dateTime;
  final String paymentType;
  final double amount;
  final bool isPositive;
  final String statusLabel;
  final bool isSettled;

  static const List<EarningTransaction> mockTransactions = [
    EarningTransaction(
      id: '#FC23456',
      title: '#FC23456',
      dateTime: '20 Jan, 10:24 AM',
      paymentType: 'Online',
      amount: 306,
      isPositive: true,
      statusLabel: 'Settled',
      isSettled: true,
    ),
    EarningTransaction(
      id: 'ADJ-1029',
      title: 'Adjustment',
      dateTime: '19 Jan, 16:12 PM',
      paymentType: 'COD',
      amount: 50,
      isPositive: false,
      statusLabel: 'Processed',
      isSettled: false,
    ),
    EarningTransaction(
      id: '#FC23456',
      title: '#FC23456',
      dateTime: '20 Jan, 10:24 AM',
      paymentType: 'Online',
      amount: 320,
      isPositive: true,
      statusLabel: 'Settled',
      isSettled: true,
    ),
    EarningTransaction(
      id: '#FC23456',
      title: '#FC23456',
      dateTime: '20 Jan, 10:24 AM',
      paymentType: 'COD',
      amount: 320,
      isPositive: true,
      statusLabel: 'Settled',
      isSettled: true,
    ),
  ];
}

class SettlementRecord {
  const SettlementRecord({
    required this.id,
    required this.period,
    required this.amount,
    required this.status,
    required this.bankAccount,
    required this.bankName,
    required this.transferDate,
  });

  final String id;
  final String period;
  final double amount;
  final SettlementStatus status;
  final String bankAccount;
  final String bankName;
  final String transferDate;

  static const List<SettlementRecord> mockSettlements = [
    SettlementRecord(
      id: 'STL012389',
      period: '10 - 16 Feb, 2026',
      amount: 11800,
      status: SettlementStatus.settled,
      bankAccount: '•••• •••• 2044',
      bankName: 'HDFC Bank',
      transferDate: '19 Feb, 2025',
    ),
    SettlementRecord(
      id: 'STL012389',
      period: '27 - 02 Feb, 2026',
      amount: 11800,
      status: SettlementStatus.failed,
      bankAccount: '•••• •••• 2044',
      bankName: 'HDFC Bank',
      transferDate: '19 Feb, 2025',
    ),
    SettlementRecord(
      id: 'STL012389',
      period: '27 - 02 Feb, 2026',
      amount: 11800,
      status: SettlementStatus.processing,
      bankAccount: '•••• •••• 2044',
      bankName: 'HDFC Bank',
      transferDate: '19 Feb, 2025',
    ),
  ];
}
