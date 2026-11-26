import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/product_details_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/product_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Category Listing Screen matching Figma reference media_1795523028096_68b6a4f8.jpg.
class CategoryListingScreen extends StatefulWidget {
  final String categoryTitle;

  const CategoryListingScreen({
    super.key,
    this.categoryTitle = 'Atta, Dal & Rice',
  });

  @override
  State<CategoryListingScreen> createState() => _CategoryListingScreenState();
}

class _CategoryListingScreenState extends State<CategoryListingScreen> {
  int _selectedFilterIndex = 0;
  final List<String> _filters = ['All', 'Atta', 'Dal', 'Rice', 'Basmati Rice'];
  String _selectedSort = 'Popular';

  late List<ProductItem> _products;

  void _onSortChanged(String newSort) {
    setState(() {
      _selectedSort = newSort;
      if (newSort == 'Price: Low to High') {
        _products.sort((a, b) => a.currentPrice.compareTo(b.currentPrice));
      } else if (newSort == 'Price: High to Low') {
        _products.sort((a, b) => b.currentPrice.compareTo(a.currentPrice));
      } else if (newSort == 'Rating: High to Low') {
        _products.sort((a, b) => b.rating.compareTo(a.rating));
      } else if (newSort == 'Discount: High to Low') {
        _products.sort((a, b) => b.discountPercent.compareTo(a.discountPercent));
      } else {
        // Default Popular
        _products.sort((a, b) => a.id.compareTo(b.id));
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _products = [
      const ProductItem(
        id: 'cat_p1',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 281,
        originalPrice: 342,
        discountPercent: 18,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'cat_p2',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'cat_p3',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'cat_p4',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'cat_p5',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'cat_p6',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'cat_p7',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'cat_p8',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 1.png',
      ),
    ];
  }

  void _onProductTap(ProductItem product) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ProductDetailsScreen(product: product),
      ),
    );
  }

  void _onOpenCart() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const CartScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFCFBF7),
        appBar: AppBar(
          backgroundColor: const Color(0xFFFCFBF7),
          elevation: 0,
          leadingWidth: 56,
          leading: Padding(
            padding: const EdgeInsets.only(left: 16),
            child: Center(
              child: GestureDetector(
                onTap: () => Navigator.of(context).maybePop(),
                child: Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: const Icon(Icons.arrow_back, color: Color(0xFF1E1E1E), size: 18),
                ),
              ),
            ),
          ),
          title: Text(
            widget.categoryTitle,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E1E1E),
            ),
          ),
          actions: [
            Center(
              child: Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: IconButton(
                  padding: EdgeInsets.zero,
                  icon: const Icon(Icons.search, color: Color(0xFF1E1E1E), size: 19),
                  onPressed: () {},
                ),
              ),
            ),
            const SizedBox(width: 8),
            Center(
              child: Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: IconButton(
                  padding: EdgeInsets.zero,
                  icon: const Icon(Icons.shopping_bag_outlined, color: Color(0xFF1E1E1E), size: 19),
                  onPressed: _onOpenCart,
                ),
              ),
            ),
            const SizedBox(width: 16),
          ],
        ),
        body: Column(
          children: [
            // Subcategory horizontal chips
            Container(
              height: 48,
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _filters.length,
                itemBuilder: (context, index) {
                  final isSelected = _selectedFilterIndex == index;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedFilterIndex = index;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFFF5B014) : Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: isSelected ? const Color(0xFFF5B014) : const Color(0xFFE5E7EB),
                          ),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          _filters[index],
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected ? Colors.black : const Color(0xFF4B5563),
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 6),

            // Filter & Sort Pills
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  // Filter Pill with funnel icon matching Figma
                  GestureDetector(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Filter dialog opened'), duration: Duration(milliseconds: 500)),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.filter_alt_outlined, size: 15, color: Color(0xFF1F1F1F)),
                          SizedBox(width: 6),
                          Text(
                            'Filter',
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1F1F1F),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const Spacer(),

                  // Sort Dropdown Pill (Opens and works properly)
                  PopupMenuButton<String>(
                    onSelected: _onSortChanged,
                    itemBuilder: (context) => [
                      const PopupMenuItem(value: 'Popular', child: Text('Popular')),
                      const PopupMenuItem(value: 'Price: Low to High', child: Text('Price: Low to High')),
                      const PopupMenuItem(value: 'Price: High to Low', child: Text('Price: High to Low')),
                      const PopupMenuItem(value: 'Rating: High to Low', child: Text('Rating: High to Low')),
                      const PopupMenuItem(value: 'Discount: High to Low', child: Text('Discount: High to Low')),
                    ],
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 180),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Flexible(
                            child: Text(
                              'Sort: $_selectedSort',
                              style: const TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF1F1F1F),
                              ),
                              overflow: TextOverflow.ellipsis,
                              maxLines: 1,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Icon(Icons.keyboard_arrow_down, size: 16, color: Color(0xFF4B5563)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // 2-Column Product Grid
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                physics: const BouncingScrollPhysics(),
                itemCount: _products.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 16,
                  childAspectRatio: 0.60,
                ),
                itemBuilder: (context, index) {
                  final product = _products[index];
                  return ProductCard(
                    product: product,
                    onTap: () => _onProductTap(product),
                    onAddToCart: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${product.title} added to cart!'),
                          duration: const Duration(milliseconds: 700),
                          action: SnackBarAction(
                            label: 'VIEW CART',
                            textColor: const Color(0xFFF5B014),
                            onPressed: _onOpenCart,
                          ),
                        ),
                      );
                    },
                    onToggleFavorite: () {
                      setState(() {
                        _products[index] = product.copyWith(
                          isFavorite: !product.isFavorite,
                        );
                      });
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
