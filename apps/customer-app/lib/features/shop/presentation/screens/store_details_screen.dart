import 'dart:async';
import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/category_listing_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/product_details_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/search_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/product_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Store Details Screen matching Figma references with 3 sequentially animated Cart / Promo Bar states.
class StoreDetailsScreen extends StatefulWidget {
  final String storeName;
  final String storeCategory;
  final double rating;
  final String reviewsCount;
  final String deliveryTime;
  final String imagePath;
  final String coverImagePath;
  final int initialCartBarIndex;
  final bool autoCycleCartBar;

  const StoreDetailsScreen({
    super.key,
    this.storeName = 'Fresh Mart',
    this.storeCategory = 'Grocery • Vegetables',
    this.rating = 4.8,
    this.reviewsCount = '1.2k reviews',
    this.deliveryTime = '15–20 mins',
    this.imagePath = 'assets/images/image 71.png',
    this.coverImagePath = 'assets/images/unsplash_F6-U5fGAOik.png',
    this.initialCartBarIndex = 0,
    this.autoCycleCartBar = true,
  });

  @override
  State<StoreDetailsScreen> createState() => _StoreDetailsScreenState();
}

class _StoreDetailsScreenState extends State<StoreDetailsScreen> {
  final TextEditingController _searchController = TextEditingController();
  late int _cartBarIndex;
  Timer? _cartBarTimer;

  late final List<ProductItem> _bestSellingProducts;
  late final List<ProductItem> _discountedProducts;
  late final List<ProductItem> _topPicksProducts;

  @override
  void initState() {
    super.initState();
    _cartBarIndex = widget.initialCartBarIndex;
    if (widget.autoCycleCartBar) {
      _cartBarTimer = Timer.periodic(const Duration(seconds: 3), (_) {
        if (mounted) {
          setState(() {
            _cartBarIndex = (_cartBarIndex + 1) % 3;
          });
        }
      });
    }
    _bestSellingProducts = [
      const ProductItem(
        id: 'bs_1',
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
        id: 'bs_2',
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
        id: 'bs_3',
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
    ];

    _discountedProducts = [
      const ProductItem(
        id: 'dp_1',
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
        id: 'dp_2',
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
        id: 'dp_3',
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
    ];

    _topPicksProducts = [
      const ProductItem(
        id: 'tp_1',
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
        id: 'tp_2',
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
        id: 'tp_3',
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
    ];
  }

  @override
  void dispose() {
    _cartBarTimer?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  void _onCategoryTap(String categoryTitle) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => CategoryListingScreen(categoryTitle: categoryTitle),
      ),
    );
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

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        systemNavigationBarColor: Color(0xFFF6F5F2),
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFCF3),
        body: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Cover Photo + Action Buttons + Floating Store Info Card
              _buildCoverAndHeader(context),
              const SizedBox(height: 14),

              // Search Bar
              _buildSearchBar(context),
              const SizedBox(height: 14),

              // Animated Sequential Promo / Cart Bar (States 1, 2, 3)
              _buildAnimatedCartBar(context),
              const SizedBox(height: 18),

              // 1. Grocery Category
              _buildCategorySection(
                title: 'Grocery',
                items: [
                  _StoreCategoryItem(
                    name: 'Atta, Dal &\nRice',
                    imagePath: 'assets/images/home-image/Group 149.png',
                    onTap: () => _onCategoryTap('Atta, Dal & Rice'),
                  ),
                  _StoreCategoryItem(
                    name: 'Oil, Ghee &\nMasala',
                    imagePath: 'assets/images/home-image/Group 154.png',
                    onTap: () => _onCategoryTap('Oil, Ghee & Masala'),
                  ),
                  _StoreCategoryItem(
                    name: 'Dry Fruits &\nBreakfast',
                    imagePath: 'assets/images/home-image/image 1.png',
                    onTap: () => _onCategoryTap('Dry Fruits & Breakfast'),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // 2. Fresh Category
              _buildCategorySection(
                title: 'Fresh',
                items: [
                  _StoreCategoryItem(
                    name: 'Fruits &\nVeggies',
                    imagePath: 'assets/images/image 5.png',
                    onTap: () => _onCategoryTap('Fruits & Veggies'),
                  ),
                  _StoreCategoryItem(
                    name: 'Dairy',
                    imagePath: 'assets/images/home-image/Group 156.png',
                    onTap: () => _onCategoryTap('Dairy'),
                  ),
                  _StoreCategoryItem(
                    name: 'Egg, Meat &\nFish',
                    imagePath: 'assets/images/home-image/Group 157.png',
                    onTap: () => _onCategoryTap('Egg, Meat & Fish'),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // 3. Snacks & Beverages Category
              _buildCategorySection(
                title: 'Snacks & Beverages',
                items: [
                  _StoreCategoryItem(
                    name: 'Hot & Cold\nBeverages',
                    imagePath: 'assets/images/home-image/Group 158.png',
                    onTap: () => _onCategoryTap('Hot & Cold Beverages'),
                  ),
                  _StoreCategoryItem(
                    name: 'Namkeen &\nChips',
                    imagePath: 'assets/images/home-image/Frame 2147227351.png',
                    onTap: () => _onCategoryTap('Namkeen & Chips'),
                  ),
                  _StoreCategoryItem(
                    name: 'Biscuits,\nCookies',
                    imagePath: 'assets/images/home-image/image 60.png',
                    onTap: () => _onCategoryTap('Biscuits & Cookies'),
                  ),
                  _StoreCategoryItem(
                    name: 'Sweets &\nChocolates',
                    imagePath: 'assets/images/home-image/Group 160.png',
                    onTap: () => _onCategoryTap('Sweets & Chocolates'),
                  ),
                  _StoreCategoryItem(
                    name: 'Instant &\nFrozen Food',
                    imagePath: 'assets/images/home-image/Group 161.png',
                    onTap: () => _onCategoryTap('Instant & Frozen Food'),
                  ),
                  _StoreCategoryItem(
                    name: 'Sauces &\nSpreads',
                    imagePath: 'assets/images/home-image/Group 162-1.png',
                    onTap: () => _onCategoryTap('Sauces & Spreads'),
                  ),
                ],
              ),
              const SizedBox(height: 22),

              // Best Selling Section
              _buildProductSection(
                title: 'Best Selling',
                products: _bestSellingProducts,
                onSeeAll: () => _onCategoryTap('Best Selling'),
              ),
              const SizedBox(height: 22),

              // Discounted Products Section
              _buildProductSection(
                title: 'Discounted Products',
                products: _discountedProducts,
                onSeeAll: () => _onCategoryTap('Discounted Products'),
              ),
              const SizedBox(height: 22),

              // Top Picks for you Section
              _buildProductSection(
                title: 'Top Picks for you',
                products: _topPicksProducts,
                onSeeAll: () => _onCategoryTap('Top Picks for you'),
              ),
              const SizedBox(height: 22),

              // Daily Essentials Red Promo Banner
              _buildDailyEssentialsBanner(context),
              const SizedBox(height: 28),

              // Footer: "Your neighborhood, now online. ⭐"
              _buildFooter(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCoverAndHeader(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        // Cover Image
        SizedBox(
          height: 185,
          width: double.infinity,
          child: Image.asset(
            widget.coverImagePath,
            fit: BoxFit.cover,
            errorBuilder: (_, _, _) => Container(
              color: const Color(0xFF1E293B),
              child: const Icon(Icons.store, size: 60, color: Colors.white54),
            ),
          ),
        ),

        // Dark gradient overlay on top for status bar legibility
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withValues(alpha: 0.6),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ),

        // Top Navigation Buttons: Back and Cart
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () => Navigator.of(context).maybePop(),
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.35),
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
                  ),
                ),
                GestureDetector(
                  onTap: _onOpenCart,
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 6,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: const Icon(
                      Icons.shopping_bag_outlined,
                      color: Color(0xFF1E1E1E),
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        // Floating Store Info Card
        Container(
          margin: const EdgeInsets.only(top: 145, left: 16, right: 16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFF1EEE6), width: 1.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.07),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  widget.imagePath,
                  width: 52,
                  height: 52,
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => Container(
                    width: 52,
                    height: 52,
                    color: const Color(0xFFE2E8F0),
                    child: const Icon(Icons.storefront, color: Color(0xFF10B981), size: 30),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            widget.storeName,
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1E1E1E),
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFF2563EB),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Text(
                            'Top Rated',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const Spacer(),
                        const Icon(Icons.chevron_right, size: 20, color: Color(0xFF9CA3AF)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(5),
                          ),
                          child: const Text(
                            'Open',
                            style: TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF16A34A),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.star_rounded, size: 15, color: Color(0xFFF59E0B)),
                        const SizedBox(width: 3),
                        Flexible(
                          child: Text(
                            '${widget.rating} (${widget.reviewsCount})',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF4B5563),
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${widget.storeCategory} • ${widget.deliveryTime}',
                      style: const TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GestureDetector(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(builder: (_) => const SearchScreen()),
          );
        },
        behavior: HitTestBehavior.opaque,
        child: Container(
          height: 46,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFF1EEE6)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.035),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              const Icon(Icons.search, size: 19, color: Color(0xFF9CA3AF)),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'Search stores, groceries, etc.',
                  style: TextStyle(
                    color: Color(0xFF9E9E9E),
                    fontSize: 13,
                  ),
                ),
              ),
              Image.asset(
                'assets/card-icons/solar_camera-linear.png',
                width: 18,
                height: 18,
                errorBuilder: (_, _, _) => const Icon(Icons.camera_alt_outlined, size: 18, color: Color(0xFF757575)),
              ),
              Container(
                height: 16,
                width: 1,
                color: const Color(0xFFE5E7EB),
                margin: const EdgeInsets.symmetric(horizontal: 8),
              ),
              Image.asset(
                'assets/card-icons/Group.png',
                width: 17,
                height: 17,
                errorBuilder: (_, _, _) => const Icon(Icons.mic_none_rounded, size: 17, color: Color(0xFF757575)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAnimatedCartBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GestureDetector(
        onTap: () {
          setState(() {
            _cartBarIndex = (_cartBarIndex + 1) % 3;
          });
        },
        behavior: HitTestBehavior.opaque,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 350),
          switchInCurve: Curves.easeInOut,
          switchOutCurve: Curves.easeInOut,
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(
              opacity: animation,
              child: SlideTransition(
                position: Tween<Offset>(
                  begin: const Offset(0.0, 0.08),
                  end: Offset.zero,
                ).animate(animation),
                child: child,
              ),
            );
          },
          child: _buildCartBarContent(_cartBarIndex),
        ),
      ),
    );
  }

  Widget _buildCartBarContent(int index) {
    switch (index) {
      case 1:
        return Container(
          key: const ValueKey<int>(1),
          height: 52,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: const LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                Color(0xFF180032),
                Color(0xFF240D39),
                Color(0xFF3B1261),
                Color(0xFF240940),
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF240D39).withValues(alpha: 0.25),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: const Text.rich(
            TextSpan(
              children: [
                TextSpan(
                  text: 'Free Delivery ',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 0.2,
                  ),
                ),
                TextSpan(
                  text: '– On orders above ₹299',
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        );

      case 2:
        return Container(
          key: const ValueKey<int>(2),
          height: 52,
          decoration: BoxDecoration(
            color: const Color(0xFFFFB5B4),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFFFAEAD).withValues(alpha: 0.35),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: const Text(
            'Subscribe & save 5% ⭐',
            style: TextStyle(
              fontSize: 13.5,
              fontWeight: FontWeight.w700,
              color: Color(0xFF8F2929),
              letterSpacing: 0.2,
            ),
          ),
        );

      case 0:
      default:
        return Container(
          key: const ValueKey<int>(0),
          height: 52,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: const LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                Color(0xFF0F172A),
                Color(0xFF1E3A8A),
                Color(0xFF1D4ED8),
                Color(0xFF3B82F6),
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF1D4ED8).withValues(alpha: 0.25),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: const Text.rich(
            TextSpan(
              children: [
                TextSpan(
                  text: '10% OFF ',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 0.2,
                  ),
                ),
                TextSpan(
                  text: '– On orders above ₹499',
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        );
    }
  }

  Widget _buildCategorySection({
    required String title,
    required List<_StoreCategoryItem> items,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 15.5,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1E1E1E),
              letterSpacing: -0.2,
            ),
          ),
          const SizedBox(height: 8),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: items.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 0.98,
            ),
            itemBuilder: (context, index) {
              final item = items[index];
              return GestureDetector(
                onTap: item.onTap,
                behavior: HitTestBehavior.opaque,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFF1EEE6), width: 1.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 4,
                        offset: const Offset(0, 1),
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        top: 8,
                        left: 8,
                        right: 8,
                        child: Text(
                          item.name,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1F1F1F),
                            height: 1.15,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Positioned(
                        right: 4,
                        bottom: 4,
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 82, maxHeight: 58),
                          child: Image.asset(
                            item.imagePath,
                            fit: BoxFit.contain,
                            errorBuilder: (_, _, _) => const Icon(
                              Icons.category_outlined,
                              size: 28,
                              color: Color(0xFF9E9E9E),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildProductSection({
    required String title,
    required List<ProductItem> products,
    required VoidCallback onSeeAll,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1E1E1E),
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
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
        ),
        const SizedBox(height: 12),
        Center(
          child: GestureDetector(
            onTap: onSeeAll,
            behavior: HitTestBehavior.opaque,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF9E6),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFFDE68A)),
              ),
              child: const Text(
                'See all >',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFF5B014),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDailyEssentialsBanner(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFFF93235),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFF93235).withValues(alpha: 0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Daily Essentials',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Lowest price guaranteed',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.white70,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () => _onCategoryTap('Daily Essentials'),
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white70),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'VIEW ALL >',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // 3 Mini Cards Inside Banner
            Row(
              children: [
                _buildMiniProductCard(
                  discountText: '20% off',
                  imagePath: 'assets/images/image 28.png',
                  title: 'Vim Dishwash',
                  priceText: '₹220',
                  oldPriceText: '₹280',
                ),
                const SizedBox(width: 8),
                _buildMiniProductCard(
                  discountText: '20% off',
                  imagePath: 'assets/images/image 29.png',
                  title: 'Harpic cleaner',
                  priceText: '₹150',
                  oldPriceText: '₹190',
                ),
                const SizedBox(width: 8),
                _buildMiniProductCard(
                  discountText: '20% off',
                  imagePath: 'assets/images/home-image/Group 150.png',
                  title: 'Surf excel',
                  priceText: '₹170',
                  oldPriceText: '₹210',
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniProductCard({
    required String discountText,
    required String imagePath,
    required String title,
    required String priceText,
    required String oldPriceText,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(7),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1.5),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                discountText,
                style: const TextStyle(
                  fontSize: 8.5,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Center(
              child: Image.asset(
                imagePath,
                height: 44,
                fit: BoxFit.contain,
                errorBuilder: (_, _, _) => const Icon(Icons.cleaning_services_outlined, size: 36, color: Colors.grey),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1F1F1F),
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 3),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: Text(
                    priceText,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1E1E1E),
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('$title added to cart!'),
                        duration: const Duration(milliseconds: 700),
                        action: SnackBarAction(
                          label: 'VIEW CART',
                          textColor: const Color(0xFFF5B014),
                          onPressed: _onOpenCart,
                        ),
                      ),
                    );
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Container(
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.add, size: 14, color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      color: const Color(0xFFF6F5F2),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 36),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.shopping_cart_outlined,
                size: 32,
                color: const Color(0xFF9CA3AF).withValues(alpha: 0.7),
              ),
              const SizedBox(width: 8),
              const Icon(
                Icons.star_rounded,
                size: 20,
                color: Color(0xFFF59E0B),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Your\nneighborhood,\nnow online. ⭐',
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w900,
              color: Color(0xFF4B5563),
              height: 1.25,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }
}

class _StoreCategoryItem {
  final String name;
  final String imagePath;
  final VoidCallback onTap;

  const _StoreCategoryItem({
    required this.name,
    required this.imagePath,
    required this.onTap,
  });
}
