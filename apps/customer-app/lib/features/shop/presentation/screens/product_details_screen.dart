import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/product_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Product Details Screen matching Figma reference media_1795523061507_f00ede6c.jpg.
class ProductDetailsScreen extends StatefulWidget {
  final ProductItem product;

  const ProductDetailsScreen({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  int _selectedVariantIndex = 0;
  bool _isProductDetailsExpanded = true;
  bool _isBenefitsExpanded = false;
  bool _isFavorite = false;

  final List<Map<String, dynamic>> _variants = [
    {
      'weight': '1 kg',
      'discount': '19% Off',
      'currentPrice': 129,
      'originalPrice': 160,
    },
    {
      'weight': '250 g',
      'discount': '19% Off',
      'currentPrice': 38,
      'originalPrice': 46,
    },
    {
      'weight': '500 g',
      'discount': '19% Off',
      'currentPrice': 70,
      'originalPrice': 80,
    },
    {
      'weight': '2 kg',
      'discount': '20% Off',
      'currentPrice': 212,
      'originalPrice': 250,
    },
  ];

  late List<ProductItem> _relatedProducts;

  @override
  void initState() {
    super.initState();
    _isFavorite = widget.product.isFavorite;
    _relatedProducts = [
      const ProductItem(
        id: 'rel_1',
        title: 'Fortune Atta',
        weight: '1 kg',
        optionsCount: '2 options',
        currentPrice: 59,
        originalPrice: 160,
        discountPercent: 17,
        rating: 4.8,
        reviewCount: '3.1k',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'rel_2',
        title: 'Nature Fresh Atta',
        weight: '10 kg',
        optionsCount: '1 option',
        currentPrice: 480,
        originalPrice: 565,
        discountPercent: 15,
        rating: 4.9,
        reviewCount: '5.2k',
        imagePath: 'assets/images/image 2.png',
      ),
      const ProductItem(
        id: 'rel_3',
        title: 'Aashirvaad Wheat Atta',
        weight: '5 kg',
        optionsCount: '3 options',
        currentPrice: 230,
        originalPrice: 255,
        discountPercent: 10,
        rating: 4.7,
        reviewCount: '4k',
        imagePath: 'assets/images/image 1.png',
      ),
    ];
  }

  void _onAddToCart() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${widget.product.title} (${_variants[_selectedVariantIndex]['weight']}) added to cart!'),
        duration: const Duration(milliseconds: 700),
        action: SnackBarAction(
          label: 'VIEW CART',
          textColor: const Color(0xFFF5B014),
          onPressed: _onBuyNow,
        ),
      ),
    );
  }

  void _onBuyNow() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const CartScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final selectedVariant = _variants[_selectedVariantIndex];

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
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Color(0xFF1E1E1E)),
            onPressed: () => Navigator.of(context).maybePop(),
          ),
          actions: [
            GestureDetector(
              onTap: () {
                setState(() {
                  _isFavorite = !_isFavorite;
                });
              },
              child: Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                alignment: Alignment.center,
                child: Icon(
                  _isFavorite ? Icons.favorite : Icons.favorite_border,
                  size: 20,
                  color: _isFavorite ? Colors.red : const Color(0xFF4B5563),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.share_outlined,
                size: 20,
                color: Color(0xFF4B5563),
              ),
            ),
            const SizedBox(width: 16),
          ],
        ),
        body: Stack(
          children: [
            // Scrollable Content
            Positioned.fill(
              bottom: 84,
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Large Product Image with Carousel Dots & Expiry Badge
                    _buildImageCarousel(),

                    const SizedBox(height: 12),

                    // Main Product Info Box
                    _buildProductInfo(selectedVariant),

                    const SizedBox(height: 16),

                    // Quantity Selection Section
                    _buildQuantitySelector(),

                    const SizedBox(height: 16),

                    // Expandable Details and Benefits
                    _buildExpandableDetails(),

                    const SizedBox(height: 16),

                    // Seller Details
                    _buildSellerDetails(),

                    const SizedBox(height: 20),

                    // Related Products
                    _buildRelatedProducts(),

                    const SizedBox(height: 20),

                    // Also Available At
                    _buildAlsoAvailableAt(),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Bottom Sticky Bar (Add to Cart & Buy Now)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: _buildBottomActionBar(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImageCarousel() {
    return Column(
      children: [
        SizedBox(
          height: 260,
          child: Stack(
            children: [
              Center(
                child: Image.asset(
                  widget.product.imagePath,
                  height: 240,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => const Icon(
                    Icons.shopping_bag_outlined,
                    size: 80,
                    color: Color(0xFFBDBDBD),
                  ),
                ),
              ),
              // Expiry Badge
              Positioned(
                bottom: 8,
                right: 20,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2F6),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'Expiry : 30 Aug 2026',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF475569),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        // Dots
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 20,
              height: 5,
              decoration: BoxDecoration(
                color: const Color(0xFFF5B014),
                borderRadius: BorderRadius.circular(3),
              ),
            ),
            const SizedBox(width: 4),
            Container(
              width: 5,
              height: 5,
              decoration: const BoxDecoration(
                color: Color(0xFFD1D5DB),
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildProductInfo(Map<String, dynamic> variant) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stars Rating
          Row(
            children: const [
              Icon(Icons.star, size: 16, color: Color(0xFFF5B014)),
              Icon(Icons.star, size: 16, color: Color(0xFFF5B014)),
              Icon(Icons.star, size: 16, color: Color(0xFFF5B014)),
              Icon(Icons.star, size: 16, color: Color(0xFFF5B014)),
              Icon(Icons.star_half, size: 16, color: Color(0xFFF5B014)),
              SizedBox(width: 6),
              Text(
                '4.7',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E1E1E),
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          // Title
          Text(
            widget.product.title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: Color(0xFF1E1E1E),
              letterSpacing: -0.3,
            ),
          ),

          const SizedBox(height: 6),

          // Weight & Discount tag
          Row(
            children: [
              Text(
                variant['weight'] as String,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF6B7280),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                (variant['discount'] as String).toUpperCase(),
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF16A34A),
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          // Price Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                '₹${variant['currentPrice']}',
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E1E1E),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '₹${variant['originalPrice']}',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF9CA3AF),
                  decoration: TextDecoration.lineThrough,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuantitySelector() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quantity',
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E1E1E),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: List.generate(_variants.length, (index) {
              final v = _variants[index];
              final isSelected = _selectedVariantIndex == index;
              return Expanded(
                child: Padding(
                  padding: EdgeInsets.only(
                    right: index < _variants.length - 1 ? 8 : 0,
                  ),
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedVariantIndex = index;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFFEF9EE) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? const Color(0xFFF5B014) : const Color(0xFFE5E7EB),
                          width: isSelected ? 1.5 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            v['weight'] as String,
                            style: const TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1F1F1F),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            v['discount'] as String,
                            style: const TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF16A34A),
                            ),
                          ),
                          const SizedBox(height: 4),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  '₹${v['currentPrice']}',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF1F1F1F),
                                  ),
                                ),
                                const SizedBox(width: 3),
                                Text(
                                  '₹${v['originalPrice']}',
                                  style: const TextStyle(
                                    fontSize: 9.5,
                                    color: Color(0xFF9CA3AF),
                                    decoration: TextDecoration.lineThrough,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildExpandableDetails() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          // Product Details Accordion
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFF0EFEA)),
            ),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isProductDetailsExpanded = !_isProductDetailsExpanded;
                    });
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Product details',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E1E1E),
                          ),
                        ),
                        Icon(
                          _isProductDetailsExpanded
                              ? Icons.keyboard_arrow_up
                              : Icons.keyboard_arrow_down,
                          color: const Color(0xFF6B7280),
                        ),
                      ],
                    ),
                  ),
                ),
                if (_isProductDetailsExpanded)
                  Padding(
                    padding: const EdgeInsets.only(left: 16, right: 16, bottom: 14),
                    child: const Text(
                      'Choose wholesome nutrition with fortune Unpolished Moong Dal, naturally processed to retain essential nutrients and deliver authentic taste in every bite.',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF6B7280),
                        height: 1.4,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // Benefits Accordion
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFF0EFEA)),
            ),
            child: Column(
              children: [
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isBenefitsExpanded = !_isBenefitsExpanded;
                    });
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Benefits',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E1E1E),
                          ),
                        ),
                        Icon(
                          _isBenefitsExpanded
                              ? Icons.keyboard_arrow_up
                              : Icons.keyboard_arrow_down,
                          color: const Color(0xFF6B7280),
                        ),
                      ],
                    ),
                  ),
                ),
                if (_isBenefitsExpanded)
                  Padding(
                    padding: const EdgeInsets.only(left: 16, right: 16, bottom: 14),
                    child: const Text(
                      '• High in dietary fiber and essential plant nutrients\n• Rich source of natural protein\n• Free from chemical polish and artificial colors',
                      style: TextStyle(
                        fontSize: 12.5,
                        color: Color(0xFF6B7280),
                        height: 1.4,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSellerDetails() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFF0EFEA)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Seller Details',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E1E1E),
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              crossAxisAlignment: WrapCrossAlignment.center,
              children: const [
                Text(
                  'Seller Name: Fresh Mart Superstore',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF1F1F1F),
                  ),
                ),
                SizedBox(width: 6),
                Icon(Icons.verified, size: 16, color: Color(0xFF2563EB)),
              ],
            ),
            const SizedBox(height: 6),
            const Text(
              '⚡ 15-20 min • Free Delivery on ₹199',
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF4B5563),
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              '★ 4.8  (2k reviews) • 12k+ Orders',
              style: TextStyle(
                fontSize: 12,
                color: Color(0xFF6B7280),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRelatedProducts() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            'Related Products',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E1E1E),
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 255,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            physics: const BouncingScrollPhysics(),
            itemCount: _relatedProducts.length,
            separatorBuilder: (_, _) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final product = _relatedProducts[index];
              return SizedBox(
                width: 145,
                child: ProductCard(
                  product: product,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => ProductDetailsScreen(product: product),
                      ),
                    );
                  },
                  onAddToCart: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('${product.title} added to cart!'),
                        duration: const Duration(milliseconds: 700),
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildAlsoAvailableAt() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            'Also Available At',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E1E1E),
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 90,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            physics: const BouncingScrollPhysics(),
            children: [
              _buildStoreMiniCard('assets/images/image 71.png', '1.8 km'),
              const SizedBox(width: 12),
              _buildStoreMiniCard('assets/images/image 73.png', '1.5 km'),
              const SizedBox(width: 12),
              _buildStoreMiniCard('assets/images/image 71.png', '2.2 km'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStoreMiniCard(String imagePath, String distance) {
    return Container(
      width: 120,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFF0EFEA)),
      ),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.asset(
              imagePath,
              width: double.infinity,
              height: double.infinity,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => Container(color: const Color(0xFFE5E7EB)),
            ),
          ),
          Positioned(
            top: 6,
            right: 6,
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
    );
  }

  Widget _buildBottomActionBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: Color(0xFFE5E7EB))),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            // Add to Cart Button
            Expanded(
              child: GestureDetector(
                onTap: _onAddToCart,
                behavior: HitTestBehavior.opaque,
                child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFFE5E7EB), width: 1.5),
                  ),
                  alignment: Alignment.center,
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text(
                            'Add to Cart',
                            style: TextStyle(
                              fontSize: 14.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF1F1F1F),
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.shopping_cart_outlined, size: 18, color: Color(0xFF1F1F1F)),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(width: 12),

            // Buy Now Button
            Expanded(
              child: GestureDetector(
                onTap: _onBuyNow,
                behavior: HitTestBehavior.opaque,
                child: Container(
                  height: 50,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5B014),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Text(
                        'Buy Now',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Colors.black,
                        ),
                      ),
                      SizedBox(width: 6),
                      Icon(Icons.arrow_forward, size: 18, color: Colors.black),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
