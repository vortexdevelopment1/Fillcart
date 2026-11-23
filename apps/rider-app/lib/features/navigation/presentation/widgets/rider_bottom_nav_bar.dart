import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Reusable Rider Bottom Navigation Bar matching Figma Component 5 (Node 1359:19422).
///
/// Figma Specifications:
/// - Dimensions: 360 x 68 px
/// - Background: #FFFFFF
/// - Four tabs with supplied Figma icons:
///   0. Home (assets/icons/nav_home.png)
///   1. Orders (assets/icons/nav_orders.png)
///   2. Earnings (assets/icons/nav_earnings.png)
///   3. Dashboard (assets/icons/nav_dashboard.png)
/// - Selected Tab: #1B1C17 (Dark), Poppins SemiBold 12 px
/// - Unselected Tab: #777980 (Grey), Poppins Regular 12 px
class RiderBottomNavBar extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int>? onTabSelected;

  const RiderBottomNavBar({
    super.key,
    int? selectedIndex,
    int? currentIndex,
    this.onTabSelected,
  }) : selectedIndex = currentIndex ?? selectedIndex ?? 0;

  void _handleTabTap(BuildContext context, int index) {
    if (index == selectedIndex) return;

    if (onTabSelected != null) {
      onTabSelected!(index);
      return;
    }

    // Direct routing for implemented screens
    if (index == 0) {
      try {
        GoRouter.of(context).go('/home');
        return;
      } catch (_) {}
    } else if (index == 1) {
      try {
        GoRouter.of(context).go('/orders');
        return;
      } catch (_) {}
    } else if (index == 2) {
      try {
        GoRouter.of(context).go('/earnings');
        return;
      } catch (_) {}
    } else if (index == 3) {
      try {
        GoRouter.of(context).go('/dashboard');
        return;
      } catch (_) {}
    }

    // Inform user that screen is part of upcoming batches
    final tabNames = ['Home', 'Orders', 'Earnings', 'Dashboard'];
    final tabName = tabNames[index];
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '$tabName screen will be available in upcoming batches.',
          style: GoogleFonts.poppins(fontSize: 13, color: Colors.white),
        ),
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        backgroundColor: RiderColors.onSurfaceDark,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('rider_bottom_nav_bar'),
      height: 68,
      decoration: const BoxDecoration(
        color: RiderColors.surface,
        border: Border(
          top: BorderSide(
            color: Color(0xFFEEEEEE),
            width: 1.0,
          ),
        ),
      ),
      child: Row(
        children: [
          _buildNavItem(
            context: context,
            index: 0,
            label: 'Home',
            iconAsset: 'assets/icons/nav_home.png',
            key: const Key('nav_tab_home'),
          ),
          _buildNavItem(
            context: context,
            index: 1,
            label: 'Orders',
            iconAsset: 'assets/icons/nav_orders.png',
            key: const Key('nav_tab_orders'),
          ),
          _buildNavItem(
            context: context,
            index: 2,
            label: 'Earnings',
            iconAsset: 'assets/icons/nav_earnings.png',
            key: const Key('nav_tab_earnings'),
          ),
          _buildNavItem(
            context: context,
            index: 3,
            label: 'Dashboard',
            iconAsset: 'assets/icons/nav_dashboard.png',
            key: const Key('nav_tab_dashboard'),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required int index,
    required String label,
    required String iconAsset,
    required Key key,
  }) {
    final isSelected = index == selectedIndex;
    final color = isSelected ? RiderColors.onSurfaceDark : RiderColors.textSecondary;

    return Expanded(
      child: InkWell(
        key: key,
        onTap: () => _handleTabTap(context, index),
        child: SizedBox(
          height: 68,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                iconAsset,
                width: 64,
                height: 32,
                fit: BoxFit.contain,
              ),
              const SizedBox(height: 4),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
