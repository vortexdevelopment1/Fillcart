import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Items configuration for the Vendor Bottom Navigation Bar.
enum VendorNavItem {
  home(
    label: 'Home',
    activeIcon: 'assets/bottomnavigation/Home_fillded.svg',
    inactiveIcon: 'assets/bottomnavigation/Home.svg',
  ),
  earnings(
    label: 'Earnings',
    activeIcon: 'assets/bottomnavigation/Earings_fillded.svg',
    inactiveIcon: 'assets/bottomnavigation/Earings.svg',
  ),
  orders(
    label: 'Orders',
    activeIcon: 'assets/bottomnavigation/Orders_fillded.svg',
    inactiveIcon: 'assets/bottomnavigation/Orders.svg',
  ),
  inventory(
    label: 'Inventory',
    activeIcon: 'assets/bottomnavigation/Inventory_fillded.svg',
    inactiveIcon: 'assets/bottomnavigation/Inventory.svg',
  ),
  profile(
    label: 'Profile',
    activeIcon: 'assets/bottomnavigation/Profile_fillded.svg',
    inactiveIcon: 'assets/bottomnavigation/Profile.svg',
  );

  const VendorNavItem({
    required this.label,
    required this.activeIcon,
    required this.inactiveIcon,
  });

  final String label;
  final String activeIcon;
  final String inactiveIcon;
}

/// A floating pill-shaped bottom navigation bar matching the Fillcart Vendor design.
class VendorBottomNavBar extends StatelessWidget {
  const VendorBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;

  /// Signature Fillcart Vendor accent lime color.
  static const Color activeColor = Color(0xFFC8F169);

  /// Unselected item color.
  static const Color inactiveColor = Color(0xFFECEFF1);

  /// Capsule background dark charcoal/black tone.
  static const Color navBarBackground = Color(0xFF0C0D0E);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: navBarBackground,
        borderRadius: BorderRadius.circular(40),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 24,
            spreadRadius: 1,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: List.generate(VendorNavItem.values.length, (index) {
          final item = VendorNavItem.values[index];
          final isSelected = index == currentIndex;

          return Expanded(
            child: _NavBarItemWidget(
              item: item,
              isSelected: isSelected,
              onTap: () => onTap(index),
            ),
          );
        }),
      ),
    );
  }
}

class _NavBarItemWidget extends StatelessWidget {
  const _NavBarItemWidget({
    required this.item,
    required this.isSelected,
    required this.onTap,
  });

  final VendorNavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final textColor = isSelected
        ? VendorBottomNavBar.activeColor
        : VendorBottomNavBar.inactiveColor;

    return Semantics(
      button: true,
      selected: isSelected,
      label: item.label,
      child: InkResponse(
        onTap: onTap,
        highlightShape: BoxShape.circle,
        splashColor: VendorBottomNavBar.activeColor.withValues(alpha: 0.15),
        containedInkWell: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 22,
                height: 22,
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  transitionBuilder: (child, animation) {
                    return ScaleTransition(scale: animation, child: child);
                  },
                  child: SvgPicture.asset(
                    isSelected ? item.activeIcon : item.inactiveIcon,
                    key: ValueKey<String>(
                      '${item.label}_${isSelected ? 'active' : 'inactive'}',
                    ),
                    width: 22,
                    height: 22,
                  ),
                ),
              ),
              const SizedBox(height: 5),
              AnimatedDefaultTextStyle(
                duration: const Duration(milliseconds: 200),
                style: TextStyle(
                  color: textColor,
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  letterSpacing: 0.1,
                ),
                child: Text(
                  item.label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 11,
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                    letterSpacing: 0.1,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
