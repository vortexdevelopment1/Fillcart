import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/product_details_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/product_card.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/storefront_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Pixel-accurate Search Screen matching Figma reference media_1795599529203_16ffd88e.jpg.
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<String> _recentSearches = [
    'Almond butter',
    'iPhone cable',
    'Face wash',
    'Highlighters',
  ];

  // Comprehensive product catalog matching Figma designs across all categories
  late List<ProductItem> _allProducts;
  late List<ProductItem> _trendingProducts;

  @override
  void initState() {
    super.initState();
    _allProducts = [
      const ProductItem(
        id: 'p_atta_1',
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
        id: 'p_atta_2',
        title: 'Nature Fresh Atta',
        weight: '10 kg',
        optionsCount: '1 option',
        currentPrice: 480,
        originalPrice: 565,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: '5.2K',
        imagePath: 'assets/images/nature_fresh_atta.png',
      ),
      const ProductItem(
        id: 'p_atta_3',
        title: 'Aashirvaad Wheat Atta',
        weight: '5 kg',
        optionsCount: '3 options',
        currentPrice: 230,
        originalPrice: 255,
        discountPercent: 10,
        rating: 4.7,
        reviewCount: '4K',
        imagePath: 'assets/images/aashirvaad_atta.png',
      ),
      const ProductItem(
        id: 'p_oil_1',
        title: 'Fortune Sunlite Refined Oil',
        weight: '1 L',
        optionsCount: '2 options',
        currentPrice: 142,
        originalPrice: 170,
        discountPercent: 16,
        rating: 4.8,
        reviewCount: '2.1K',
        imagePath: 'assets/images/home-image/image 2.png',
      ),
      const ProductItem(
        id: 'p_dal_1',
        title: 'Tata Sampann Toor Dal',
        weight: '1 kg',
        optionsCount: '1 option',
        currentPrice: 165,
        originalPrice: 190,
        discountPercent: 12,
        rating: 4.9,
        reviewCount: '1.8K',
        imagePath: 'assets/images/home-image/image 3.png',
      ),
      const ProductItem(
        id: 'p_rice_1',
        title: 'India Gate Basmati Rice',
        weight: '5 kg',
        optionsCount: '2 options',
        currentPrice: 399,
        originalPrice: 475,
        discountPercent: 18,
        rating: 4.8,
        reviewCount: '3.9K',
        imagePath: 'assets/images/home-image/Group 149.png',
      ),
      const ProductItem(
        id: 'p_recent_1',
        title: 'Almond butter',
        weight: '350 g',
        optionsCount: '2 options',
        currentPrice: 299,
        originalPrice: 360,
        discountPercent: 17,
        rating: 4.9,
        reviewCount: '1.2K',
        imagePath: 'assets/images/home-image/image 1.png',
      ),
      const ProductItem(
        id: 'p_recent_2',
        title: 'iPhone cable',
        weight: '1 m',
        optionsCount: '3 colors',
        currentPrice: 499,
        originalPrice: 699,
        discountPercent: 28,
        rating: 4.8,
        reviewCount: '4.5K',
        imagePath: 'assets/images/home-image/image 38.png',
      ),
      const ProductItem(
        id: 'p_recent_3',
        title: 'Face wash',
        weight: '150 ml',
        optionsCount: '2 variants',
        currentPrice: 189,
        originalPrice: 220,
        discountPercent: 14,
        rating: 4.7,
        reviewCount: '2.8K',
        imagePath: 'assets/images/home-image/image 21.png',
      ),
      const ProductItem(
        id: 'p_recent_4',
        title: 'Highlighters',
        weight: 'Set of 6',
        optionsCount: 'Pastel set',
        currentPrice: 120,
        originalPrice: 160,
        discountPercent: 25,
        rating: 4.9,
        reviewCount: '3.1K',
        imagePath: 'assets/images/home-image/image 31.png',
      ),
      const ProductItem(
        id: 'p_store_1',
        title: 'The Burger Co. Truffle Burger',
        weight: 'Regular',
        optionsCount: 'Single / Meal',
        currentPrice: 16,
        originalPrice: 20,
        discountPercent: 20,
        rating: 4.9,
        reviewCount: '5K',
        imagePath: 'assets/images/burger_co.png',
      ),
      const ProductItem(
        id: 'p_store_2',
        title: 'Daily Grind Coffee',
        weight: '250 ml',
        optionsCount: 'Hot / Iced',
        currentPrice: 9,
        originalPrice: 12,
        discountPercent: 25,
        rating: 4.8,
        reviewCount: '3K',
        imagePath: 'assets/images/daily_grind_coffee.png',
      ),
      const ProductItem(
        id: 'p_store_3',
        title: 'Fresh Market Organic Basket',
        weight: '3 kg box',
        optionsCount: 'Standard',
        currentPrice: 42,
        originalPrice: 50,
        discountPercent: 16,
        rating: 4.9,
        reviewCount: '4.2K',
        imagePath: 'assets/images/fresh_market_order.png',
      ),
    ];

    _trendingProducts = [
      _allProducts[0], // Fortune Atta
      _allProducts[1], // Nature Fresh Atta
      _allProducts[2], // Aashirvaad Wheat Atta
    ];
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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
      MaterialPageRoute<void>(builder: (_) => const CartScreen()),
    );
  }

  void _executeSearch(String query) {
    final trimmed = query.trim();
    if (trimmed.isEmpty) return;

    setState(() {
      _searchQuery = trimmed;
      if (!_recentSearches.contains(trimmed)) {
        _recentSearches.insert(0, trimmed);
        if (_recentSearches.length > 8) {
          _recentSearches.removeLast();
        }
      }
    });
  }

  void _selectRecentChip(String term) {
    _searchController.text = term;
    _searchController.selection = TextSelection.fromPosition(
      TextPosition(offset: term.length),
    );
    setState(() {
      _searchQuery = term;
    });
  }

  void _clearSearch() {
    _searchController.clear();
    setState(() {
      _searchQuery = '';
    });
  }

  List<ProductItem> _getFilteredProducts() {
    if (_searchQuery.trim().isEmpty) return const [];
    final q = _searchQuery.trim().toLowerCase();
    return _allProducts.where((p) {
      return p.title.toLowerCase().contains(q) ||
          p.weight.toLowerCase().contains(q) ||
          p.optionsCount.toLowerCase().contains(q);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _getFilteredProducts();
    final isSearching = _searchQuery.trim().isNotEmpty;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        systemNavigationBarColor: Color(0xFFFFF4D8),
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFCF3),
        body: Stack(
          children: [
            Positioned.fill(
              bottom: 64,
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildTopSearchBar(context),
                    const SizedBox(height: 14),

                    if (isSearching)
                      _buildSearchResults(filtered)
                    else ...[
                      // Recent Searches Section
                      if (_recentSearches.isNotEmpty) ...[
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Recent',
                                style: TextStyle(
                                  fontSize: 16.5,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF1E1E1E),
                                ),
                              ),
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _recentSearches.clear();
                                  });
                                },
                                behavior: HitTestBehavior.opaque,
                                child: const Text(
                                  'Clear all',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFFF5B014),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 10),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _recentSearches.map((term) {
                              return GestureDetector(
                                onTap: () => _selectRecentChip(term),
                                behavior: HitTestBehavior.opaque,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7.5),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: const Color(0xFFE5E7EB)),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.02),
                                        blurRadius: 4,
                                        offset: const Offset(0, 1),
                                      ),
                                    ],
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(
                                        Icons.access_time_rounded,
                                        size: 15,
                                        color: Color(0xFF4B5563),
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        term,
                                        style: const TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w500,
                                          color: Color(0xFF1F1F1F),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                        const SizedBox(height: 18),
                      ],

                      // Hero Promo Banner matching Home Screen
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: GestureDetector(
                          onTap: () => _selectRecentChip('Atta'),
                          behavior: HitTestBehavior.opaque,
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: Image.asset(
                              'assets/images/image 69.png',
                              height: 110,
                              width: double.infinity,
                              fit: BoxFit.fill,
                              errorBuilder: (_, _, _) => Container(
                                height: 110,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFFF5B014), Color(0xFFFFD54F)],
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 22),

                      // 🔥 Trending Section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: const Text(
                          '🔥 Trending',
                          style: TextStyle(
                            fontSize: 16.5,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1E1E1E),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildProductHorizontalList(_trendingProducts),

                      const SizedBox(height: 22),

                      // Popular Right Now Section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: const [
                            Flexible(
                              child: Text(
                                'Popular Right Now',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF1E1E1E),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Updated 2 min ago',
                              style: TextStyle(
                                fontSize: 12,
                                color: Color(0xFF9CA3AF),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildProductHorizontalList(_trendingProducts),

                      const SizedBox(height: 30),
                    ],
                  ],
                ),
              ),
            ),

            // Bottom Navigation Bar with Search tab active
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: StorefrontBottomNav(currentIndex: 2),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopSearchBar(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFF4BA00),
            Color(0xFFF7BD1B),
            Color(0xFFFAD44F),
            Color(0xFFFEE689),
            Color(0xFFFFFCF3),
          ],
          stops: [0.0, 0.25, 0.55, 0.80, 1.0],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.06),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                GestureDetector(
                  onTap: () {
                    if (_searchQuery.isNotEmpty) {
                      _clearSearch();
                    } else {
                      Navigator.of(context).maybePop();
                    }
                  },
                  behavior: HitTestBehavior.opaque,
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 2),
                    child: Icon(Icons.arrow_back, color: Color(0xFF374151), size: 20),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    onChanged: (val) {
                      setState(() {
                        _searchQuery = val;
                      });
                    },
                    onSubmitted: _executeSearch,
                    textInputAction: TextInputAction.search,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF1F1F1F),
                    ),
                    decoration: const InputDecoration(
                      hintText: "Search for 'Store'",
                      hintStyle: TextStyle(
                        color: Color(0xFF9E9E9E),
                        fontSize: 13.5,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                    ),
                  ),
                ),
                if (_searchQuery.isNotEmpty)
                  GestureDetector(
                    onTap: _clearSearch,
                    behavior: HitTestBehavior.opaque,
                    child: const Padding(
                      padding: EdgeInsets.all(4.0),
                      child: Icon(Icons.close, size: 18, color: Color(0xFF757575)),
                    ),
                  )
                else ...[
                  Container(
                    height: 20,
                    width: 1,
                    color: const Color(0xFFE5E7EB),
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                  ),
                  Image.asset(
                    'assets/card-icons/solar_camera-linear.png',
                    width: 20,
                    height: 20,
                    errorBuilder: (_, _, _) => const Icon(Icons.camera_alt_outlined, size: 20, color: Color(0xFF757575)),
                  ),
                  const SizedBox(width: 8),
                  Image.asset(
                    'assets/card-icons/Group.png',
                    width: 19,
                    height: 19,
                    errorBuilder: (_, _, _) => const Icon(Icons.mic_none_rounded, size: 20, color: Color(0xFF757575)),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSearchResults(List<ProductItem> results) {
    if (results.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
        child: Column(
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                color: Color(0xFFFFF9E6),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.search_off_rounded, size: 36, color: Color(0xFFF5B014)),
            ),
            const SizedBox(height: 16),
            Text(
              'No results for "$_searchQuery"',
              style: const TextStyle(
                fontSize: 16.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E1E1E),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Try searching for Atta, Rice, Dal, Oil, Coffee, or Burger',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _clearSearch,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF5B014),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                elevation: 0,
              ),
              child: const Text('View All Products'),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                child: Text(
                  'Results for "$_searchQuery"',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E1E1E),
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                '${results.length} found',
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF6B7280),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: results.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 14,
              childAspectRatio: 0.68,
            ),
            itemBuilder: (context, index) {
              final product = results[index];
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
              );
            },
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildProductHorizontalList(List<ProductItem> products) {
    return SizedBox(
      height: 255,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        itemCount: products.length,
        separatorBuilder: (_, _) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final product = products[index];
          return SizedBox(
            width: 145,
            child: ProductCard(
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
            ),
          );
        },
      ),
    );
  }
}
