/// Product item model for Fillcart storefront.
class ProductItem {
  final String id;
  final String title;
  final String weight;
  final String optionsCount;
  final double currentPrice;
  final double originalPrice;
  final int discountPercent;
  final double rating;
  final String reviewCount;
  final String imagePath;
  final bool isFavorite;

  const ProductItem({
    required this.id,
    required this.title,
    required this.weight,
    this.optionsCount = '2 options',
    required this.currentPrice,
    required this.originalPrice,
    required this.discountPercent,
    this.rating = 4.8,
    this.reviewCount = '3.5K',
    required this.imagePath,
    this.isFavorite = false,
  });

  ProductItem copyWith({
    bool? isFavorite,
  }) {
    return ProductItem(
      id: id,
      title: title,
      weight: weight,
      optionsCount: optionsCount,
      currentPrice: currentPrice,
      originalPrice: originalPrice,
      discountPercent: discountPercent,
      rating: rating,
      reviewCount: reviewCount,
      imagePath: imagePath,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}
