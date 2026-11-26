import 'package:fillcart_customer/features/location/presentation/screens/confirm_location_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/account_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/category_listing_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/storefront_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Categories Screen matching Figma reference media_1795597157804_d312d866.jpg.
class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({super.key});

  void _onCategoryTap(BuildContext context, String categoryTitle) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => CategoryListingScreen(categoryTitle: categoryTitle),
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
                    _buildTopHeader(context),
                    const SizedBox(height: 16),

                    // 1. Grocery
                    _buildCategorySection(
                      context,
                      title: 'Grocery',
                      items: [
                        _CategoryItem(
                          name: 'Atta, Dal &\nRice',
                          primaryImage: 'assets/images/home-image/Group 149.png',
                          onTap: () => _onCategoryTap(context, 'Atta, Dal & Rice'),
                        ),
                        _CategoryItem(
                          name: 'Oil, Ghee\n& Masala',
                          primaryImage: 'assets/images/home-image/Group 154.png',
                          onTap: () => _onCategoryTap(context, 'Oil, Ghee & Masala'),
                        ),
                        _CategoryItem(
                          name: 'Dry Fruits &\nBreakfast',
                          primaryImage: 'assets/images/home-image/image 1.png',
                          onTap: () => _onCategoryTap(context, 'Dry Fruits & Breakfast'),
                        ),
                      ],
                    ),

                    // 2. Fresh
                    _buildCategorySection(
                      context,
                      title: 'Fresh',
                      items: [
                        _CategoryItem(
                          name: 'Fruits &\nVeggies',
                          primaryImage: 'assets/images/image 5.png',
                          secondaryImage: 'assets/images/image 6.png',
                          onTap: () => _onCategoryTap(context, 'Fruits & Veggies'),
                        ),
                        _CategoryItem(
                          name: 'Dairy',
                          primaryImage: 'assets/images/home-image/Group 156.png',
                          onTap: () => _onCategoryTap(context, 'Dairy'),
                        ),
                        _CategoryItem(
                          name: 'Egg, Meat &\nFish',
                          primaryImage: 'assets/images/home-image/Group 157.png',
                          onTap: () => _onCategoryTap(context, 'Egg, Meat & Fish'),
                        ),
                      ],
                    ),

                    // 3. Snacks & Beverages
                    _buildCategorySection(
                      context,
                      title: 'Snacks & Beverages',
                      items: [
                        _CategoryItem(
                          name: 'Hot & Cold\nBeverages',
                          primaryImage: 'assets/images/home-image/Group 158.png',
                          onTap: () => _onCategoryTap(context, 'Hot & Cold Beverages'),
                        ),
                        _CategoryItem(
                          name: 'Namkeen &\nChips',
                          primaryImage: 'assets/images/home-image/Frame 2147227351.png',
                          onTap: () => _onCategoryTap(context, 'Namkeen & Chips'),
                        ),
                        _CategoryItem(
                          name: 'Biscuits,\nCookies',
                          primaryImage: 'assets/images/home-image/image 60.png',
                          secondaryImage: 'assets/images/home-image/image 59.png',
                          onTap: () => _onCategoryTap(context, 'Biscuits, Cookies'),
                        ),
                        _CategoryItem(
                          name: 'Sweets &\nChocolates',
                          primaryImage: 'assets/images/home-image/Group 160.png',
                          onTap: () => _onCategoryTap(context, 'Sweets & Chocolates'),
                        ),
                        _CategoryItem(
                          name: 'Instant &\nFrozen Food',
                          primaryImage: 'assets/images/home-image/Group 161.png',
                          onTap: () => _onCategoryTap(context, 'Instant & Frozen Food'),
                        ),
                        _CategoryItem(
                          name: 'Sauces &\nSpreads',
                          primaryImage: 'assets/images/home-image/Group 162-1.png',
                          onTap: () => _onCategoryTap(context, 'Sauces & Spreads'),
                        ),
                      ],
                    ),

                    // 4. Beauty & Care
                    _buildCategorySection(
                      context,
                      title: 'Beauty & Care',
                      items: [
                        _CategoryItem(
                          name: 'Bath, Body\n& Oral Care',
                          primaryImage: 'assets/images/home-image/Group 162.png',
                          onTap: () => _onCategoryTap(context, 'Bath, Body & Oral Care'),
                        ),
                        _CategoryItem(
                          name: 'Hair',
                          primaryImage: 'assets/images/home-image/image 18.png',
                          onTap: () => _onCategoryTap(context, 'Hair'),
                        ),
                        _CategoryItem(
                          name: 'Skin & Face',
                          primaryImage: 'assets/images/home-image/Group 163.png',
                          onTap: () => _onCategoryTap(context, 'Skin & Face'),
                        ),
                        _CategoryItem(
                          name: "Men's\nGrooming",
                          primaryImage: 'assets/images/home-image/image 21.png',
                          onTap: () => _onCategoryTap(context, "Men's Grooming"),
                        ),
                        _CategoryItem(
                          name: 'Sexual\nWellness',
                          primaryImage: 'assets/images/home-image/Group 164.png',
                          onTap: () => _onCategoryTap(context, 'Sexual Wellness'),
                        ),
                        _CategoryItem(
                          name: 'Baby Care',
                          primaryImage: 'assets/images/home-image/Group 165.png',
                          onTap: () => _onCategoryTap(context, 'Baby Care'),
                        ),
                      ],
                    ),

                    // 5. Stationery
                    _buildCategorySection(
                      context,
                      title: 'Stationery',
                      items: [
                        _CategoryItem(
                          name: 'Notebooks',
                          primaryImage: 'assets/images/home-image/Group 166.png',
                          onTap: () => _onCategoryTap(context, 'Notebooks'),
                        ),
                        _CategoryItem(
                          name: 'Pen, Pencils\n& More',
                          primaryImage: 'assets/images/home-image/Group 167.png',
                          onTap: () => _onCategoryTap(context, 'Pen, Pencils & More'),
                        ),
                        _CategoryItem(
                          name: 'Files &\nFolder',
                          primaryImage: 'assets/images/home-image/Group 168.png',
                          onTap: () => _onCategoryTap(context, 'Files & Folder'),
                        ),
                      ],
                    ),

                    // 6. Essentials
                    _buildCategorySection(
                      context,
                      title: 'Essentials',
                      items: [
                        _CategoryItem(
                          name: 'Home\nCleaning',
                          primaryImage: 'assets/images/home-image/image 3.png',
                          onTap: () => _onCategoryTap(context, 'Home Cleaning'),
                        ),
                        _CategoryItem(
                          name: 'Laundry\nEssentials',
                          primaryImage: 'assets/images/home-image/Group 150.png',
                          onTap: () => _onCategoryTap(context, 'Laundry Essentials'),
                        ),
                        _CategoryItem(
                          name: 'Paper\nProducts',
                          primaryImage: 'assets/images/home-image/image 78.png',
                          onTap: () => _onCategoryTap(context, 'Paper Products'),
                        ),
                      ],
                    ),

                    // 7. Electronics
                    _buildCategorySection(
                      context,
                      title: 'Electronics',
                      items: [
                        _CategoryItem(
                          name: 'Home\nElectronics',
                          primaryImage: 'assets/images/home-image/Group 169.png',
                          onTap: () => _onCategoryTap(context, 'Home Electronics'),
                        ),
                        _CategoryItem(
                          name: 'Mobile &\nAccessories',
                          primaryImage: 'assets/images/home-image/Group 170.png',
                          onTap: () => _onCategoryTap(context, 'Mobile & Accessories'),
                        ),
                        _CategoryItem(
                          name: 'Computer &\nTech',
                          primaryImage: 'assets/images/home-image/image 38.png',
                          onTap: () => _onCategoryTap(context, 'Computer & Tech'),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Authoritative Bottom Navigation Bar
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: StorefrontBottomNav(currentIndex: 1),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopHeader(BuildContext context) {
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
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
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
                        Container(
                          width: 32,
                          height: 32,
                          decoration: const BoxDecoration(
                            color: Color(0xFF8B6C00),
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: const Icon(
                            Icons.location_on,
                            color: Colors.white,
                            size: 18,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Home',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF1E1E1E),
                              ),
                            ),
                            Row(
                              children: const [
                                Text(
                                  'Bengali, Indore',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
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
                  Row(
                    children: [
                      Container(
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
                        child: const Icon(Icons.favorite_border, size: 20, color: Color(0xFF1E1E1E)),
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
                onTap: () => _onCategoryTap(context, 'Search'),
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
                          'Search stores, groceries, etc.',
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
                      Image.asset(
                        'assets/card-icons/solar_camera-linear.png',
                        width: 19,
                        height: 19,
                        errorBuilder: (_, _, _) => const Icon(
                          Icons.camera_alt_outlined,
                          color: Color(0xFF757575),
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Image.asset(
                        'assets/card-icons/Group.png',
                        width: 18,
                        height: 18,
                        errorBuilder: (_, _, _) => const Icon(
                          Icons.mic_none_rounded,
                          color: Color(0xFF757575),
                          size: 20,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildCategorySection(
    BuildContext context, {
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
              return _buildCategoryCard(items[index]);
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
