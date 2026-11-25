import 'package:fillcart_vendor/features/dashboard/presentation/screens/vendor_dashboard_screen.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/vendor_earnings_screen.dart';
import 'package:fillcart_vendor/features/inventory/presentation/screens/vendor_inventory_screen.dart';
import 'package:fillcart_vendor/features/navigation/presentation/widgets/vendor_bottom_nav_bar.dart';
import 'package:fillcart_vendor/features/order_management/presentation/screens/vendor_orders_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/vendor_profile_screen.dart';
import 'package:flutter/material.dart';

/// Main screen hosting the primary vendor workflows with floating bottom navigation.
class MainVendorScreen extends StatefulWidget {
  const MainVendorScreen({
    super.key,
    this.initialIndex = 0,
  });

  final int initialIndex;

  @override
  State<MainVendorScreen> createState() => _MainVendorScreenState();
}

class _MainVendorScreenState extends State<MainVendorScreen> {
  late int _currentIndex;
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _screens = [
      const VendorDashboardScreen(),
      const VendorEarningsScreen(),
      const VendorOrdersScreen(),
      VendorInventoryScreen(
        onBackToHome: () => _onTabTapped(0),
      ),
      const VendorProfileScreen(),
    ];
  }

  void _onTabTapped(int index) {
    if (_currentIndex != index) {
      setState(() {
        _currentIndex = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      extendBody: true,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          child: VendorBottomNavBar(
            currentIndex: _currentIndex,
            onTap: _onTabTapped,
          ),
        ),
      ),
    );
  }
}
