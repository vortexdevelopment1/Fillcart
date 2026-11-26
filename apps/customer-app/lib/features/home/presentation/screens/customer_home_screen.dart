import 'package:fillcart_customer/features/location/presentation/screens/confirm_location_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/account_screen.dart';
import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/category_listing_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/product_details_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/store_details_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/product_card.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/storefront_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Full Customer Home Storefront Screen accurately matching the Figma reference media_1795585531818_2c137b31.jpg.
class CustomerHomeScreen extends StatefulWidget {
  const CustomerHomeScreen({super.key});

  @override
  State<CustomerHomeScreen> createState() => _CustomerHomeScreenState();
}

class _CustomerHomeScreenState extends State<CustomerHomeScreen> {
  String _selectedTopCategory = 'All';

  late List<ProductItem> _recentlyBought;

  @override
  void initState() {
    super.initState();
    _recentlyBought = [
      const ProductItem(
        id: 'p1',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.5K',
        imagePath: 'assets/images/image 61 copy.png',
      ),
      const ProductItem(
        id: 'p2',
        title: 'Nature Fresh Atta',
        weight: '10 kg',
        optionsCount: '1 option',
        currentPrice: 480,
        originalPrice: 565,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: '5.2K',
        imagePath: 'assets/images/image 51.png',
      ),
      const ProductItem(
        id: 'p3',
        title: 'Aashirvaad Wheat Atta',
        weight: '5 kg',
        optionsCount: '3 options',
        currentPrice: 230,
        originalPrice: 255,
        discountPercent: 10,
        rating: 4.7,
        reviewCount: '4K',
        imagePath: 'assets/images/image 50.png',
      ),
    ];
  }

  void _onCategoryTap(String categoryName) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => CategoryListingScreen(categoryTitle: categoryName),
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
        backgroundColor: const Color(0xFFFEFCF6),
        body: Stack(
          children: [
            // Scrollable Content
            Positioned.fill(
              bottom: 68,
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Top Gradient Header: Location, Search, and Category Filter Bar
                    _buildTopHeader(),

                    const SizedBox(height: 12),

                    // ₹100 OFF Hero Promo Banner (image 69.png)
                    _buildHeroOfferBanner(),

                    const SizedBox(height: 16),

                    // 1. Grocery Category
                    _buildCategorySection(
                      title: 'Grocery',
                      items: [
                        _CategoryItem(
                          name: 'Atta, Dal &\nRice',
                          primaryImage: 'assets/images/home-image/Group 149.png',
                          onTap: () => _onCategoryTap('Atta, Dal & Rice'),
                        ),
                        _CategoryItem(
                          name: 'Oil, Ghee &\nMasala',
                          primaryImage: 'assets/images/home-image/Group 154.png',
                          onTap: () => _onCategoryTap('Oil, Ghee & Masala'),
                        ),
                        _CategoryItem(
                          name: 'Dry Fruits &\nCereals',
                          primaryImage: 'assets/images/home-image/image 1.png',
                          onTap: () => _onCategoryTap('Dry Fruits & Cereals'),
                        ),
                      ],
                    ),

                    // 2. Fresh Category
                    _buildCategorySection(
                      title: 'Fresh',
                      items: [
                        _CategoryItem(
                          name: 'Fruits &\nVeggies',
                          primaryImage: 'assets/images/image 5.png',
                          secondaryImage: 'assets/images/image 6.png',
                          onTap: () => _onCategoryTap('Fruits & Veggies'),
                        ),
                        _CategoryItem(
                          name: 'Dairy',
                          primaryImage: 'assets/images/home-image/Group 156.png',
                          onTap: () => _onCategoryTap('Dairy'),
                        ),
                        _CategoryItem(
                          name: 'Eggs, Meat &\nFish',
                          primaryImage: 'assets/images/home-image/Group 157.png',
                          onTap: () => _onCategoryTap('Eggs, Meat & Fish'),
                        ),
                      ],
                    ),

                    // 3. Snacks & Beverages Category
                    _buildCategorySection(
                      title: 'Snacks & Beverages',
                      items: [
                        _CategoryItem(
                          name: 'Hot & Cold\nBeverages',
                          primaryImage: 'assets/images/home-image/Group 158.png',
                          onTap: () => _onCategoryTap('Hot & Cold Beverages'),
                        ),
                        _CategoryItem(
                          name: 'Namkeen &\nChips',
                          primaryImage: 'assets/images/home-image/Frame 2147227351.png',
                          onTap: () => _onCategoryTap('Namkeen & Chips'),
                        ),
                        _CategoryItem(
                          name: 'Biscuits &\nCookies',
                          primaryImage: 'assets/images/home-image/image 60.png',
                          secondaryImage: 'assets/images/home-image/image 59.png',
                          onTap: () => _onCategoryTap('Biscuits & Cookies'),
                        ),
                        _CategoryItem(
                          name: 'Sweets &\nChocolates',
                          primaryImage: 'assets/images/home-image/Group 160.png',
                          onTap: () => _onCategoryTap('Sweets & Chocolates'),
                        ),
                        _CategoryItem(
                          name: 'Instant &\nFrozen Food',
                          primaryImage: 'assets/images/home-image/Group 161.png',
                          onTap: () => _onCategoryTap('Instant & Frozen Food'),
                        ),
                        _CategoryItem(
                          name: 'Sauces &\nSpreads',
                          primaryImage: 'assets/images/home-image/Group 162-1.png',
                          onTap: () => _onCategoryTap('Sauces & Spreads'),
                        ),
                      ],
                    ),

                    // 4. Beauty & Care Category
                    _buildCategorySection(
                      title: 'Beauty & Care',
                      items: [
                        _CategoryItem(
                          name: 'Bath, Body\n& Oral Care',
                          primaryImage: 'assets/images/home-image/Group 162.png',
                          onTap: () => _onCategoryTap('Beauty & Care'),
                        ),
                        _CategoryItem(
                          name: 'Hair',
                          primaryImage: 'assets/images/home-image/image 18.png',
                          onTap: () => _onCategoryTap('Hair Care'),
                        ),
                        _CategoryItem(
                          name: 'Skin & Face',
                          primaryImage: 'assets/images/home-image/Group 163.png',
                          onTap: () => _onCategoryTap('Skin & Face'),
                        ),
                        _CategoryItem(
                          name: "Men's\nGrooming",
                          primaryImage: 'assets/images/home-image/image 21.png',
                          onTap: () => _onCategoryTap("Men's Grooming"),
                        ),
                        _CategoryItem(
                          name: 'Sexual\nWellness',
                          primaryImage: 'assets/images/home-image/Group 164.png',
                          onTap: () => _onCategoryTap('Sexual Wellness'),
                        ),
                        _CategoryItem(
                          name: 'Baby Care',
                          primaryImage: 'assets/images/home-image/Group 165.png',
                          onTap: () => _onCategoryTap('Baby Care'),
                        ),
                      ],
                    ),

                    // 5. Stationery Category
                    _buildCategorySection(
                      title: 'Stationery',
                      items: [
                        _CategoryItem(
                          name: 'Notebooks',
                          primaryImage: 'assets/images/home-image/Group 166.png',
                          onTap: () => _onCategoryTap('Notebooks'),
                        ),
                        _CategoryItem(
                          name: 'Pens, Pencils\n& Glue',
                          primaryImage: 'assets/images/home-image/Group 167.png',
                          onTap: () => _onCategoryTap('Pens & Pencils'),
                        ),
                        _CategoryItem(
                          name: 'Files &\nFolders',
                          primaryImage: 'assets/images/home-image/Group 168.png',
                          onTap: () => _onCategoryTap('Files & Folders'),
                        ),
                      ],
                    ),

                    // 6. Essentials Category
                    _buildCategorySection(
                      title: 'Essentials',
                      items: [
                        _CategoryItem(
                          name: 'Home\nCleaning',
                          primaryImage: 'assets/images/home-image/image 3.png',
                          onTap: () => _onCategoryTap('Home Cleaning'),
                        ),
                        _CategoryItem(
                          name: 'Laundry\nEssentials',
                          primaryImage: 'assets/images/home-image/Group 150.png',
                          onTap: () => _onCategoryTap('Laundry Essentials'),
                        ),
                        _CategoryItem(
                          name: 'Paper\nProducts',
                          primaryImage: 'assets/images/home-image/image 78.png',
                          onTap: () => _onCategoryTap('Paper Products'),
                        ),
                      ],
                    ),

                    // 7. Electronics Category
                    _buildCategorySection(
                      title: 'Electronics',
                      items: [
                        _CategoryItem(
                          name: 'Home\nElectronics',
                          primaryImage: 'assets/images/home-image/Group 169.png',
                          onTap: () => _onCategoryTap('Home Electronics'),
                        ),
                        _CategoryItem(
                          name: 'Mobile &\nAccessories',
                          primaryImage: 'assets/images/home-image/Group 170.png',
                          onTap: () => _onCategoryTap('Mobile & Accessories'),
                        ),
                        _CategoryItem(
                          name: 'Computer &\nTech',
                          primaryImage: 'assets/images/home-image/image 38.png',
                          onTap: () => _onCategoryTap('Computer & Tech'),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Spider-Man Merch Promo Banner (Offer Card Component 2.png)
                    _buildSpidermanBanner(),

                    const SizedBox(height: 20),

                    // Featured Stores Section
                    _buildSectionHeader('Featured Stores'),
                    const SizedBox(height: 12),
                    _buildFeaturedStores(),
                    _buildSeeAllButton(() => _onCategoryTap('Featured Stores')),

                    const SizedBox(height: 20),

                    // Nearby Stores Section
                    _buildSectionHeader('Nearby Stores'),
                    const SizedBox(height: 12),
                    _buildNearbyStores(),
                    _buildSeeAllButton(() => _onCategoryTap('Nearby Stores')),

                    const SizedBox(height: 20),

                    // Top Picks Section
                    _buildSectionHeader('Top Picks'),
                    const SizedBox(height: 12),
                    _buildTopPicks(),
                    _buildSeeAllButton(() => _onCategoryTap('Top Picks')),

                    const SizedBox(height: 20),

                    // Recently Bought Section
                    _buildSectionHeader('Recently Bought'),
                    const SizedBox(height: 12),
                    _buildRecentlyBought(),

                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),

            // Bottom Navigation Bar
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: StorefrontBottomNav(currentIndex: 0),
            ),
          ],
        ),
      ),
    );
  }

  // --- UI Components ---

  Widget _buildTopHeader() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFF9BF15),
            Color(0xFFFBD145),
            Color(0xFFFDE88F),
            Color(0xFFFEF7D8),
            Color(0xFFFEFCF6),
          ],
          stops: [0.0, 0.45, 0.75, 0.90, 1.0],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // Top Row: Location, Wishlist, Profile
            Padding(
              padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Location Address
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const ConfirmLocationScreen(),
                        ),
                      );
                    },
                    behavior: HitTestBehavior.opaque,
                    child: Row(
                      children: [
                        Image.asset(
                          'assets/card-icons/Group 168.png',
                          width: 24,
                          height: 28,
                          errorBuilder: (_, _, _) => const Icon(
                            Icons.location_on,
                            color: Color(0xFF1E1E1E),
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Delivering to',
                              style: TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF5A4900),
                              ),
                            ),
                            Row(
                              children: const [
                                Text(
                                  'Bengali Indore',
                                  style: TextStyle(
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF1E1E1E),
                                  ),
                                ),
                                SizedBox(width: 4),
                                Icon(
                                  Icons.keyboard_arrow_down_rounded,
                                  size: 18,
                                  color: Color(0xFF1E1E1E),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Right Action Buttons: Wishlist & Profile
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Wishlist opened'), duration: Duration(milliseconds: 600)),
                          );
                        },
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.08),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          alignment: Alignment.center,
                          child: Image.asset(
                            'assets/card-icons/Button.png',
                            width: 22,
                            height: 22,
                            errorBuilder: (_, _, _) => const Icon(Icons.favorite_border, size: 20, color: Color(0xFF1E1E1E)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      GestureDetector(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(builder: (_) => const AccountScreen()),
                          );
                        },
                        child: Container(
                          width: 36,
                          height: 36,
                          decoration: const BoxDecoration(
                            color: Color(0xFF3B82F6),
                            shape: BoxShape.circle,
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Image.asset(
                            'assets/images/user_avatar_highres.png',
                            fit: BoxFit.cover,
                            errorBuilder: (_, _, _) => const Icon(
                              Icons.person,
                              color: Colors.white,
                              size: 22,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GestureDetector(
                onTap: () => _onCategoryTap('Search'),
                behavior: HitTestBehavior.opaque,
                child: Container(
                  height: 46,
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.search,
                        color: Color(0xFF757575),
                        size: 20,
                      ),
                      const SizedBox(width: 10),
                      const Expanded(
                        child: Text(
                          'Search "Fortune oil, chocolate, milk..."',
                          style: TextStyle(
                            color: Color(0xFF9E9E9E),
                            fontSize: 12.5,
                            fontWeight: FontWeight.w400,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Container(
                        height: 20,
                        width: 1,
                        color: const Color(0xFFE5E7EB),
                        margin: const EdgeInsets.symmetric(horizontal: 8),
                      ),
                      GestureDetector(
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Voice Search opened'), duration: Duration(milliseconds: 600)),
                          );
                        },
                        child: Image.asset(
                          'assets/card-icons/Group.png',
                          width: 18,
                          height: 18,
                          errorBuilder: (_, _, _) => const Icon(
                            Icons.mic_none_rounded,
                            color: Color(0xFF757575),
                            size: 20,
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      GestureDetector(
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Visual Search opened'), duration: Duration(milliseconds: 600)),
                          );
                        },
                        child: Image.asset(
                          'assets/card-icons/solar_camera-linear.png',
                          width: 19,
                          height: 19,
                          errorBuilder: (_, _, _) => const Icon(
                            Icons.camera_alt_outlined,
                            color: Color(0xFF757575),
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 12),

            // Filter Bar (Accurately matching Figma: clean tabs with active underline, no pill capsules)
            _buildFilterBar(),

            const SizedBox(height: 6),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterBar() {
    final tabs = [
      {'name': 'All', 'icon': 'assets/card-icons/All.png'},
      {'name': 'GROCERY', 'icon': 'assets/card-icons/icons8-grocery-94 1.png'},
      {'name': 'PAN', 'icon': 'assets/card-icons/Fresh.png'},
      {'name': 'MORE STORE', 'icon': 'assets/card-icons/Essential.png'},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: tabs.map((tab) {
          final isSelected = _selectedTopCategory == tab['name'];
          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedTopCategory = tab['name']!;
              });
            },
            behavior: HitTestBehavior.opaque,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              margin: const EdgeInsets.only(right: 8),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        tab['icon']!,
                        width: 18,
                        height: 18,
                        errorBuilder: (_, _, _) => const Icon(Icons.storefront, size: 16),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        tab['name']!,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                          color: const Color(0xFF1F1F1F),
                          letterSpacing: 0.2,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  // Active underline indicator
                  Container(
                    height: 2.5,
                    width: isSelected ? 36 : 0,
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFEAB308) : Colors.transparent,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildHeroOfferBanner() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GestureDetector(
        onTap: () => _onCategoryTap('Atta, Dal & Rice'),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.asset(
            'assets/images/image 69.png',
            fit: BoxFit.fill,
            width: double.infinity,
            errorBuilder: (_, _, _) => Container(
              height: 120,
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
    );
  }

  Widget _buildCategorySection({
    required String title,
    required List<_CategoryItem> items,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 15,
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
              return _buildCategoryCard(item);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(_CategoryItem item) {
    return GestureDetector(
      onTap: item.onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFF1EEE6), width: 1.2),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.025),
              blurRadius: 4,
              offset: const Offset(0, 1.5),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            children: [
              // Category Title at Top-Left (Exact Figma layout)
              Positioned(
                top: 8,
                left: 8,
                right: 8,
                child: Text(
                  item.name,
                  style: const TextStyle(
                    fontSize: 12.0,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1F1F1F),
                    height: 1.15,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),

              // Bottom-Right Product Images Container
              Positioned(
                right: 6,
                bottom: 6,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    if (item.secondaryImage != null)
                      Padding(
                        padding: const EdgeInsets.only(right: 3),
                        child: Image.asset(
                          item.secondaryImage!,
                          height: 48,
                          fit: BoxFit.contain,
                          errorBuilder: (_, _, _) => const SizedBox.shrink(),
                        ),
                      ),
                    if (item.primaryImage != null)
                      ConstrainedBox(
                        constraints: const BoxConstraints(
                          maxWidth: 92,
                          maxHeight: 64,
                        ),
                        child: Image.asset(
                          item.primaryImage!,
                          height: 60,
                          fit: BoxFit.contain,
                          errorBuilder: (_, _, _) => const Icon(
                            Icons.category_outlined,
                            size: 32,
                            color: Color(0xFF9E9E9E),
                          ),
                        ),
                      )
                    else
                      const SizedBox(height: 60),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSpidermanBanner() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GestureDetector(
        onTap: () => _onCategoryTap('Atta, Dal & Rice'),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.asset(
            'assets/images/Offer Card Component 2.png',
            fit: BoxFit.fill,
            width: double.infinity,
            errorBuilder: (_, _, _) => Container(
              height: 140,
              color: const Color(0xFF0F1E36),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w800,
          color: Color(0xFF1E1E1E),
        ),
      ),
    );
  }

  Widget _buildSeeAllButton(VoidCallback onTap) {
    return Center(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: Padding(
          padding: const EdgeInsets.only(top: 10, bottom: 4),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Text(
                'See all >',
                style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFF5B014),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeaturedStores() {
    return SizedBox(
      height: 205,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        children: [
          _buildStoreCard(
            title: 'Fresh Mart',
            subtitle: '★ 4.8 • Grocery • Vegetables',
            distanceTime: '1.2 Km • Vijay Nagar • 12-15 min',
            imagePath: 'assets/images/image 71.png',
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const StoreDetailsScreen(storeName: 'Fresh Mart'),
                ),
              );
            },
          ),
          const SizedBox(width: 12),
          _buildStoreCard(
            title: 'Digital Electronics',
            subtitle: '★ 4.6 • Electronics & Tech',
            distanceTime: '1.7 Km • Palasia • 20-25 min',
            imagePath: 'assets/images/image 73.png',
          ),
        ],
      ),
    );
  }

  Widget _buildStoreCard({
    required String title,
    required String subtitle,
    required String distanceTime,
    required String imagePath,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap ?? () => _onCategoryTap(title),
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 240,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFF0EFEA)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              child: Image.asset(
                imagePath,
                height: 110,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, _, _) => Container(
                  height: 110,
                  color: const Color(0xFFE5E7EB),
                  child: const Icon(Icons.store, size: 40, color: Color(0xFF9CA3AF)),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1F1F1F),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF6B7280),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    distanceTime,
                    style: const TextStyle(
                      fontSize: 10.5,
                      color: Color(0xFF9CA3AF),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNearbyStores() {
    return SizedBox(
      height: 130,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        children: [
          _buildCompactStoreCard('Organic Vegetable Store', '1.8 km', null),
          const SizedBox(width: 12),
          _buildCompactStoreCard('Grocery Hub 89', '1.5 km', 'assets/images/image 73.png'),
          const SizedBox(width: 12),
          _buildCompactStoreCard('City Pharmacy', '2.0 km', null),
        ],
      ),
    );
  }

  Widget _buildCompactStoreCard(String name, String distance, String? imagePath) {
    return GestureDetector(
      onTap: () => _onCategoryTap(name),
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 140,
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFF0EFEA)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: imagePath != null
                      ? Image.asset(
                          imagePath,
                          height: 65,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (_, _, _) => Container(
                            height: 65,
                            color: const Color(0xFFE5E7EB),
                            child: const Icon(Icons.store, size: 28),
                          ),
                        )
                      : Container(
                          height: 65,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3F4F6),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(
                            Icons.storefront_outlined,
                            size: 26,
                            color: Color(0xFF9CA3AF),
                          ),
                        ),
                ),
                Positioned(
                  top: 4,
                  right: 4,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      distance,
                      style: const TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              name,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1F1F1F),
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopPicks() {
    return SizedBox(
      height: 195,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        children: [
          _buildTopPickCard('Solanki Kirana', '★ 4.6 | 2.5k orders', '15-20 min • 1.1 Km', 'assets/images/Image.png'),
          const SizedBox(width: 12),
          _buildTopPickCard('Solanki Kirana', '★ 4.6 | 2.5k orders', '15-20 min • 1.1 Km', 'assets/images/Image.png'),
        ],
      ),
    );
  }

  Widget _buildTopPickCard(String title, String rating, String details, String imagePath) {
    return GestureDetector(
      onTap: () => _onCategoryTap(title),
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 200,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFF0EFEA)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
                  child: Image.asset(
                    imagePath,
                    height: 95,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(
                      height: 95,
                      color: const Color(0xFFE5E7EB),
                      child: const Icon(Icons.store, size: 30),
                    ),
                  ),
                ),
                Positioned(
                  top: 6,
                  left: 6,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.red.shade600,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text(
                      '🔥 Trending',
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    rating,
                    style: const TextStyle(fontSize: 10.5, color: Color(0xFF6B7280)),
                  ),
                  Text(
                    details,
                    style: const TextStyle(fontSize: 10, color: Color(0xFF9CA3AF)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentlyBought() {
    return SizedBox(
      height: 255,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        physics: const BouncingScrollPhysics(),
        itemCount: _recentlyBought.length,
        separatorBuilder: (_, _) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final product = _recentlyBought[index];
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
              onToggleFavorite: () {
                setState(() {
                  _recentlyBought[index] = product.copyWith(
                    isFavorite: !product.isFavorite,
                  );
                });
              },
            ),
          );
        },
      ),
    );
  }
}

class _CategoryItem {
  final String name;
  final String? primaryImage;
  final String? secondaryImage;
  final VoidCallback onTap;

  const _CategoryItem({
    required this.name,
    this.primaryImage,
    this.secondaryImage,
    required this.onTap,
  });
}
