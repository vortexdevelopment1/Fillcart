/// Data model representing a product in the vendor inventory.
class InventoryProduct {
  final String id;
  final String name;
  final String category;
  final String subCategory;
  final String sku;
  final int currentStock;
  final int lowStockThreshold;
  final double price;
  final double mrp;
  final double discountPercent;
  final String? imageUrl;
  final String? expiryDate;
  final bool isLowStock;
  final bool isOutOfStock;

  const InventoryProduct({
    required this.id,
    required this.name,
    required this.category,
    required this.subCategory,
    required this.sku,
    required this.currentStock,
    required this.lowStockThreshold,
    required this.price,
    required this.mrp,
    required this.discountPercent,
    this.imageUrl,
    this.expiryDate,
    this.isLowStock = false,
    this.isOutOfStock = false,
  });

  String get categoryPath => '$category > $subCategory';

  /// Standard demo products matching the design specifications.
  static List<InventoryProduct> get demoProducts => const [
        InventoryProduct(
          id: 'prod_1',
          name: 'Amul Taaza Milk (1 L)',
          category: 'Dairy',
          subCategory: 'Milk',
          sku: 'AMU-MLK-1L',
          currentStock: 120,
          lowStockThreshold: 20,
          price: 68.0,
          mrp: 72.0,
          discountPercent: 5.5,
          isLowStock: false,
          isOutOfStock: false,
        ),
        InventoryProduct(
          id: 'prod_2',
          name: 'Britannia White Bread (400 g)',
          category: 'Bakery',
          subCategory: 'Bread',
          sku: 'BRT-BRD-400G',
          currentStock: 12,
          lowStockThreshold: 20,
          price: 45.0,
          mrp: 50.0,
          discountPercent: 10.0,
          isLowStock: true,
          isOutOfStock: false,
        ),
        InventoryProduct(
          id: 'prod_3',
          name: 'Farm Eggs (12 pcs)',
          category: 'Dairy',
          subCategory: 'Eggs',
          sku: 'FRM-EGG-12P',
          currentStock: 52,
          lowStockThreshold: 15,
          price: 45.0,
          mrp: 50.0,
          discountPercent: 10.0,
          isLowStock: false,
          isOutOfStock: false,
        ),
        InventoryProduct(
          id: 'prod_4',
          name: 'Surf Excel Detergent (1 kg)',
          category: 'Home Care',
          subCategory: 'Laundry',
          sku: 'SRF-DET-1KG',
          currentStock: 48,
          lowStockThreshold: 10,
          price: 278.0,
          mrp: 316.0,
          discountPercent: 12.0,
          isLowStock: false,
          isOutOfStock: false,
        ),
        InventoryProduct(
          id: 'prod_5',
          name: 'Aashirvaad Shudh Chakki Atta (5 kg)',
          category: 'Staples',
          subCategory: 'Flours',
          sku: 'ASH-ATT-5KG',
          currentStock: 18,
          lowStockThreshold: 20,
          price: 245.0,
          mrp: 270.0,
          discountPercent: 9.0,
          isLowStock: true,
          isOutOfStock: false,
        ),
        InventoryProduct(
          id: 'prod_6',
          name: 'Tata Salt (1 kg)',
          category: 'Staples',
          subCategory: 'Spices & Seasoning',
          sku: 'TAT-SLT-1KG',
          currentStock: 0,
          lowStockThreshold: 25,
          price: 28.0,
          mrp: 30.0,
          discountPercent: 6.5,
          isLowStock: false,
          isOutOfStock: true,
        ),
      ];
}
