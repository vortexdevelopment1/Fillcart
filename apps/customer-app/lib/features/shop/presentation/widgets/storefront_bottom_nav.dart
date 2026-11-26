import 'package:fillcart_customer/features/home/presentation/screens/customer_home_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/categories_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/orders_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/search_screen.dart';
import 'package:flutter/material.dart';

/// Authoritative bottom navigation bar for storefront screens matching Figma designs.
class StorefrontBottomNav extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int>? onTabSelected;

  const StorefrontBottomNav({
    super.key,
    required this.currentIndex,
    this.onTabSelected,
  });

  void _handleTap(BuildContext context, int index) {
    if (index == currentIndex) return;

    if (onTabSelected != null) {
      onTabSelected!(index);
      return;
    }

    Widget targetScreen;
    switch (index) {
      case 0:
        targetScreen = const CustomerHomeScreen();
        break;
      case 1:
        targetScreen = const CategoriesScreen();
        break;
      case 2:
        targetScreen = const SearchScreen();
        break;
      case 3:
      default:
        targetScreen = const OrdersScreen();
        break;
    }

    Navigator.of(context).pushReplacement(
      PageRouteBuilder<void>(
        pageBuilder: (context, _, _) => targetScreen,
        transitionDuration: Duration.zero,
        reverseTransitionDuration: Duration.zero,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: const Color(0xFFFFF4D8),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildItem(
            context: context,
            index: 0,
            label: 'Home',
            iconPath: 'assets/card-icons/Home.png',
            fallbackIcon: Icons.home_outlined,
          ),
          _buildItem(
            context: context,
            index: 1,
            label: 'Categories',
            iconPath: 'assets/card-icons/Categories.png',
            fallbackIcon: Icons.grid_view_rounded,
          ),
          _buildItem(
            context: context,
            index: 2,
            label: 'Search',
            iconPath: 'assets/card-icons/Search.png',
            fallbackIcon: Icons.search_rounded,
          ),
          _buildItem(
            context: context,
            index: 3,
            label: 'Order',
            iconPath: 'assets/card-icons/Order 4.png',
            fallbackIcon: Icons.receipt_long_outlined,
          ),
        ],
      ),
    );
  }

  Widget _buildItem({
    required BuildContext context,
    required int index,
    required String label,
    required String iconPath,
    required IconData fallbackIcon,
  }) {
    final isSelected = currentIndex == index;

    if (isSelected) {
      return GestureDetector(
        onTap: () => _handleTap(context, index),
        behavior: HitTestBehavior.opaque,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 4,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset(
                iconPath,
                width: 18,
                height: 18,
                color: const Color(0xFFF5B014),
                errorBuilder: (_, _, _) => Icon(fallbackIcon, size: 18, color: const Color(0xFFF5B014)),
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1F1F1F),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return GestureDetector(
      onTap: () => _handleTap(context, index),
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.all(10),
        child: Image.asset(
          iconPath,
          width: 21,
          height: 21,
          color: const Color(0xFF757575),
          errorBuilder: (_, _, _) => Icon(fallbackIcon, size: 21, color: const Color(0xFF757575)),
        ),
      ),
    );
  }
}
