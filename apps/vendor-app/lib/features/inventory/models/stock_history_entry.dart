/// Represents an event in a product's stock adjustment history.
class StockHistoryEntry {
  final String id;
  final String productId;
  final int changeAmount;
  final String actionTitle;
  final String reason;
  final String timestamp;
  final String? orderId;

  const StockHistoryEntry({
    required this.id,
    required this.productId,
    required this.changeAmount,
    required this.actionTitle,
    required this.reason,
    required this.timestamp,
    this.orderId,
  });

  bool get isAddition => changeAmount > 0;

  String get formattedChange => isAddition ? '+$changeAmount' : '$changeAmount';

  /// Standard demo history entries matching the design (Image 4).
  static List<StockHistoryEntry> getDemoHistory(String productId) => [
        const StockHistoryEntry(
          id: 'hist_1',
          productId: 'prod_1',
          changeAmount: 50,
          actionTitle: 'Stock added',
          reason: 'New stock received',
          timestamp: 'Today, 11:24 AM',
        ),
        const StockHistoryEntry(
          id: 'hist_2',
          productId: 'prod_1',
          changeAmount: -6,
          actionTitle: 'Stock reduced',
          reason: 'Order fulfilled (Ord #FC78421)',
          timestamp: 'Yesterday, 8:12 PM',
          orderId: 'FC78421',
        ),
        const StockHistoryEntry(
          id: 'hist_3',
          productId: 'prod_1',
          changeAmount: -6,
          actionTitle: 'Stock reduced',
          reason: 'Order fulfilled (Ord #FC78403)',
          timestamp: '12 Nov 2026, 5:32 PM',
          orderId: 'FC78403',
        ),
        const StockHistoryEntry(
          id: 'hist_4',
          productId: 'prod_1',
          changeAmount: 40,
          actionTitle: 'Stock added',
          reason: 'Stock correction',
          timestamp: '10 Nov 2026, 10:15 AM',
        ),
        const StockHistoryEntry(
          id: 'hist_5',
          productId: 'prod_1',
          changeAmount: -12,
          actionTitle: 'Stock reduced',
          reason: 'Damaged products',
          timestamp: '08 Nov 2026, 2:40 PM',
        ),
      ];
}
