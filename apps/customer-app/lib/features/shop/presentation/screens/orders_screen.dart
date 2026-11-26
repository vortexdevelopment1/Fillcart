import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/order_tracking_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/product_details_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/search_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/product_card.dart';
import 'package:fillcart_customer/features/shop/presentation/widgets/storefront_bottom_nav.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Orders Screen matching Figma references:
/// - media_1795669992777_3d8d4107.png (Active Order + Buy Again grid)
/// - media_1795670016317_f8be46b4.jpg (Buy Again full grid)
/// - media_1795670039594_018253ad.jpg (Order History list with status badges)
class OrdersScreen extends StatefulWidget {
  final int initialTabIndex;
  final bool showActiveOrder;

  const OrdersScreen({
    super.key,
    this.initialTabIndex = 0,
    this.showActiveOrder = true,
  });

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  late int _selectedTabIndex;
  late final List<ProductItem> _buyAgainProducts;
  final Set<String> _expandedOrderIds = {};

  @override
  void initState() {
    super.initState();
    _selectedTabIndex = widget.initialTabIndex;
    _buyAgainProducts = [
      const ProductItem(
        id: 'ba_1',
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
        id: 'ba_2',
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
        id: 'ba_3',
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
        id: 'ba_4',
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
        id: 'ba_5',
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
        id: 'ba_6',
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
        id: 'ba_7',
        title: 'Aashirvaad Atta',
        weight: '5 kg',
        optionsCount: '3 options',
        currentPrice: 240,
        originalPrice: 275,
        discountPercent: 12,
        rating: 4.6,
        reviewCount: '5K',
        imagePath: 'assets/images/image 1.png',
      ),
      const ProductItem(
        id: 'ba_8',
        title: 'Pillsbury Atta',
        weight: '2.5 kg',
        optionsCount: '4 options',
        currentPrice: 130,
        originalPrice: 145,
        discountPercent: 10,
        rating: 4.7,
        reviewCount: '4K',
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

  void _showNotice(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(milliseconds: 900),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
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
                    // Top Navigation Header
                    _buildTopHeader(context),
                    const SizedBox(height: 12),

                    // Active Ongoing Order Card (shown on Buy Again when enabled)
                    if (widget.showActiveOrder && _selectedTabIndex == 0) ...[
                      _buildActiveOngoingOrderCard(context),
                      const SizedBox(height: 16),
                    ],

                    // Segmented Tabs: Buy Again | Order History
                    _buildSegmentedTabs(),
                    const SizedBox(height: 14),

                    // Content based on selected tab
                    if (_selectedTabIndex == 0)
                      _buildBuyAgainContent()
                    else
                      _buildOrderHistoryContent(),

                    const SizedBox(height: 36),
                  ],
                ),
              ),
            ),

            // Persistent Bottom Navigation Bar with Order active
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: StorefrontBottomNav(currentIndex: 3),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopHeader(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            GestureDetector(
              onTap: () => Navigator.of(context).maybePop(),
              behavior: HitTestBehavior.opaque,
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.arrow_back, color: Color(0xFF1E1E1E), size: 20),
              ),
            ),
            const SizedBox(width: 14),
            const Expanded(
              child: Text(
                'Orders',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E1E1E),
                ),
              ),
            ),
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(builder: (_) => const SearchScreen()),
                );
              },
              behavior: HitTestBehavior.opaque,
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.search, color: Color(0xFF1E1E1E), size: 20),
              ),
            ),
            const SizedBox(width: 10),
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(builder: (_) => const CartScreen()),
                );
              },
              behavior: HitTestBehavior.opaque,
              child: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.shopping_bag_outlined, color: Color(0xFF1E1E1E), size: 20),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActiveOngoingOrderCard(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: const Color(0xFFF1EEE6)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Top Amber Strip: Out for delivery | 4 min
            Container(
              height: 38,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              color: const Color(0xFFF5A623),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.two_wheeler_rounded, size: 20, color: Color(0xFF1E1E1E)),
                      SizedBox(width: 6),
                      Text(
                        'Out for delivery',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E1E1E),
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Icon(Icons.bolt_rounded, size: 16, color: Color(0xFFB45309)),
                      SizedBox(width: 2),
                      Text(
                        '4 min',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E1E1E),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Store Info Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: Image.asset(
                          'assets/images/burger_co.png',
                          width: 52,
                          height: 52,
                          fit: BoxFit.cover,
                          errorBuilder: (_, _, _) => Container(
                            width: 52,
                            height: 52,
                            color: const Color(0xFFFEF3C7),
                            child: const Icon(Icons.storefront, color: Color(0xFFD97706)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Fresh Mart',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1E1E1E),
                              ),
                            ),
                            SizedBox(height: 3),
                            Text(
                              'Order #VL-8042',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Placed at 9:38 AM • 3 Items',
                              style: TextStyle(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF9CA3AF),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // 4-step Horizontal Progress Stepper
                  _buildStepperTimeline(),
                  const SizedBox(height: 16),

                  // Delivery Partner Information Row
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF9FAFB),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFF1EEE6)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 38,
                          height: 38,
                          decoration: const BoxDecoration(
                            color: Color(0xFFFEF3C7),
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: const Icon(
                            Icons.sports_motorsports_rounded,
                            size: 20,
                            color: Color(0xFFD97706),
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Arjun S.',
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF1E1E1E),
                                ),
                              ),
                              SizedBox(height: 2),
                              Row(
                                children: [
                                  Icon(Icons.star_rounded, size: 14, color: Color(0xFFF59E0B)),
                                  SizedBox(width: 2),
                                  Flexible(
                                    child: Text(
                                      '4.9 • Delivery partner',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w500,
                                        color: Color(0xFF6B7280),
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () => _showNotice('Calling delivery partner...'),
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFFBEB),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFFDE68A)),
                            ),
                            alignment: Alignment.center,
                            child: const Icon(Icons.phone_outlined, size: 17, color: Color(0xFF1E1E1E)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () => _showNotice('Chat opened with delivery partner'),
                          child: Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFFBEB),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFFDE68A)),
                            ),
                            alignment: Alignment.center,
                            child: const Icon(Icons.chat_bubble_outline_rounded, size: 17, color: Color(0xFF1E1E1E)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Products Breakdown
                  const Text(
                    'Products',
                    style: TextStyle(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF4B5563),
                    ),
                  ),
                  const SizedBox(height: 8),
                  _buildProductRow(title: 'Fortune Atta 5kg', price: '₹200', qty: 'Qty 2'),
                  const SizedBox(height: 6),
                  _buildProductRow(title: 'Oil 900ml', price: '₹150.00', qty: 'Qty 2'),
                  const SizedBox(height: 12),
                  const Divider(color: Color(0xFFF1EEE6), height: 1),
                  const SizedBox(height: 12),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Order Total',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF4B5563),
                        ),
                      ),
                      Text(
                        '₹350',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E1E1E),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Track Order Button
                  GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const OrderTrackingScreen(),
                        ),
                      );
                    },
                    behavior: HitTestBehavior.opaque,
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFFDF5),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFF5A623), width: 1.5),
                      ),
                      alignment: Alignment.center,
                      child: const Text(
                        'Track Order',
                        style: TextStyle(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFD97706),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepperTimeline() {
    return Column(
      children: [
        Row(
          children: [
            _buildStepperDot(isCompleted: true, isActive: false),
            Expanded(child: Container(height: 2.5, color: const Color(0xFF10B981))),
            _buildStepperDot(isCompleted: true, isActive: false),
            Expanded(child: Container(height: 2.5, color: const Color(0xFF10B981))),
            _buildStepperDot(isCompleted: false, isActive: true),
            Expanded(child: Container(height: 2.5, color: const Color(0xFFE5E7EB))),
            _buildStepperDot(isCompleted: false, isActive: false),
          ],
        ),
        const SizedBox(height: 6),
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            SizedBox(
              width: 50,
              child: Text(
                'Order\nplaced',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF059669)),
              ),
            ),
            SizedBox(
              width: 50,
              child: Text(
                'Picking\nitems',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFF059669)),
              ),
            ),
            SizedBox(
              width: 60,
              child: Text(
                'Out for\nDelivery',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFFD97706)),
              ),
            ),
            SizedBox(
              width: 50,
              child: Text(
                'Delivered',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: Color(0xFF9CA3AF)),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStepperDot({required bool isCompleted, required bool isActive}) {
    if (isCompleted) {
      return Container(
        width: 22,
        height: 22,
        decoration: const BoxDecoration(
          color: Color(0xFF10B981),
          shape: BoxShape.circle,
        ),
        alignment: Alignment.center,
        child: const Icon(Icons.check, size: 14, color: Colors.white),
      );
    }
    if (isActive) {
      return Container(
        width: 22,
        height: 22,
        decoration: const BoxDecoration(
          color: Color(0xFFF5A623),
          shape: BoxShape.circle,
        ),
        alignment: Alignment.center,
        child: Container(
          width: 8,
          height: 8,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
        ),
      );
    }
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFFD1D5DB), width: 2),
      ),
    );
  }

  Widget _buildProductRow({
    required String title,
    required String price,
    required String qty,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E1E1E),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              qty,
              style: const TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w500,
                color: Color(0xFF9CA3AF),
              ),
            ),
          ],
        ),
        Text(
          price,
          style: const TextStyle(
            fontSize: 13.5,
            fontWeight: FontWeight.w700,
            color: Color(0xFF1E1E1E),
          ),
        ),
      ],
    );
  }

  Widget _buildSegmentedTabs() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        height: 48,
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF1EEE6)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedTabIndex = 0;
                  });
                },
                behavior: HitTestBehavior.opaque,
                child: Container(
                  decoration: BoxDecoration(
                    color: _selectedTabIndex == 0 ? const Color(0xFFF9BF15) : Colors.transparent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    'Buy Again',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: _selectedTabIndex == 0 ? FontWeight.w800 : FontWeight.w600,
                      color: _selectedTabIndex == 0 ? const Color(0xFF1E1E1E) : const Color(0xFF6B7280),
                    ),
                  ),
                ),
              ),
            ),
            Expanded(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedTabIndex = 1;
                  });
                },
                behavior: HitTestBehavior.opaque,
                child: Container(
                  decoration: BoxDecoration(
                    color: _selectedTabIndex == 1 ? const Color(0xFFF9BF15) : Colors.transparent,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    'Order History',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: _selectedTabIndex == 1 ? FontWeight.w800 : FontWeight.w600,
                      color: _selectedTabIndex == 1 ? const Color(0xFF1E1E1E) : const Color(0xFF6B7280),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBuyAgainContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 6),
          child: Text(
            'Items from your past orders — add them back with one tap.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Color(0xFF6B7280),
            ),
          ),
        ),
        const SizedBox(height: 12),

        // 2-column product grid
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _buyAgainProducts.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 14,
              crossAxisSpacing: 14,
              childAspectRatio: 0.72,
            ),
            itemBuilder: (context, idx) {
              final product = _buyAgainProducts[idx];
              return ProductCard(
                product: product,
                onTap: () => _onProductTap(product),
                onAddToCart: () => _showNotice('${product.title} added to cart!'),
                onToggleFavorite: () => _showNotice('Favorite toggled'),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildOrderHistoryContent() {
    final orders = [
      const _HistoryOrderData(
        orderId: 'ORD-8790',
        status: 'Delivered',
        dateText: 'Aug 10, 2026 • 2 items',
        price: '₹40.50',
        rating: 5,
        imagePath: 'assets/images/order_thumb_1.png',
      ),
      const _HistoryOrderData(
        orderId: 'ORD-8763',
        status: 'Delivered',
        dateText: 'Aug 8, 2026 • 2 items',
        price: '₹3,423',
        needsRating: true,
        imagePath: 'assets/images/order_thumb_2.png',
      ),
      const _HistoryOrderData(
        orderId: 'ORD-8741',
        status: 'Cancelled',
        dateText: 'Aug 5, 2026 • 1 item',
        price: '₹39.99',
        imagePath: 'assets/images/order_thumb_3.png',
      ),
      const _HistoryOrderData(
        orderId: 'ORD-8790',
        status: 'Delivered',
        dateText: 'Aug 10, 2026 • 2 items',
        price: '₹40.50',
        rating: 5,
        imagePath: 'assets/images/order_thumb_1.png',
      ),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: orders.map((order) => _buildOrderHistoryCard(order)).toList(),
      ),
    );
  }

  Widget _buildOrderHistoryCard(_HistoryOrderData order) {
    final isExpanded = _expandedOrderIds.contains(order.orderId);
    final isCancelled = order.status == 'Cancelled';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF1EEE6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        onTap: () {
          setState(() {
            if (isExpanded) {
              _expandedOrderIds.remove(order.orderId);
            } else {
              _expandedOrderIds.add(order.orderId);
            }
          });
        },
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Stacked Product Images Thumbnail
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      order.imagePath,
                      width: 56,
                      height: 56,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => Container(
                        width: 56,
                        height: 56,
                        color: const Color(0xFFFEF3C7),
                        child: const Icon(Icons.shopping_bag_outlined, color: Color(0xFFD97706)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Center Details: Order ID, Status, Date, Rating
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                order.orderId,
                                style: const TextStyle(
                                  fontSize: 14.5,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF1E1E1E),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                              decoration: BoxDecoration(
                                color: isCancelled
                                    ? const Color(0xFFFEE2E2)
                                    : const Color(0xFFE6F7ED),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                isCancelled ? '✕ Cancelled' : '✓ Delivered',
                                style: TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  color: isCancelled
                                      ? const Color(0xFFDC2626)
                                      : const Color(0xFF059669),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 3),
                        Text(
                          order.dateText,
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF6B7280),
                          ),
                        ),
                        const SizedBox(height: 4),

                        // Rating row or Rate this order link
                        if (order.rating != null) ...[
                          Row(
                            children: List.generate(
                              5,
                              (idx) => const Icon(
                                Icons.star_rounded,
                                size: 14,
                                color: Color(0xFFF59E0B),
                              ),
                            ),
                          ),
                        ] else if (order.needsRating == true) ...[
                          GestureDetector(
                            onTap: () => _showNotice('Rate ${order.orderId}'),
                            child: const Row(
                              children: [
                                Icon(Icons.star_outline_rounded, size: 14, color: Color(0xFFD97706)),
                                SizedBox(width: 2),
                                Flexible(
                                  child: Text(
                                    'Rate this order',
                                    style: TextStyle(
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFFD97706),
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),

                  // Price and Expand Chevron
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        order.price,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E1E1E),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Icon(
                        isExpanded
                            ? Icons.keyboard_arrow_up_rounded
                            : Icons.keyboard_arrow_down_rounded,
                        size: 20,
                        color: const Color(0xFF9CA3AF),
                      ),
                    ],
                  ),
                ],
              ),

              // Expandable actions (Reorder, Details)
              if (isExpanded) ...[
                const SizedBox(height: 12),
                const Divider(height: 1, color: Color(0xFFF1EEE6)),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => _showNotice('Viewing receipt for ${order.orderId}'),
                      child: const Text('View Receipt'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () => _showNotice('Reordered ${order.orderId} items!'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF9BF15),
                        foregroundColor: const Color(0xFF1E1E1E),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      child: const Text('Reorder', style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _HistoryOrderData {
  final String orderId;
  final String status;
  final String dateText;
  final String price;
  final int? rating;
  final bool? needsRating;
  final String imagePath;

  const _HistoryOrderData({
    required this.orderId,
    required this.status,
    required this.dateText,
    required this.price,
    this.rating,
    this.needsRating,
    required this.imagePath,
  });
}
