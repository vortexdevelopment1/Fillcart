/// Summary metrics for the vendor inventory overview dashboard.
class InventoryMetrics {
  final int totalProducts;
  final int inStockCount;
  final int lowStockCount;
  final int outOfStockCount;
  final int expiringSoonCount;

  const InventoryMetrics({
    this.totalProducts = 324,
    this.inStockCount = 286,
    this.lowStockCount = 24,
    this.outOfStockCount = 12,
    this.expiringSoonCount = 8,
  });

  double get inStockPercentage => (inStockCount / totalProducts) * 100;
  double get lowStockPercentage => (lowStockCount / totalProducts) * 100;
  double get outOfStockPercentage => (outOfStockCount / totalProducts) * 100;
}
