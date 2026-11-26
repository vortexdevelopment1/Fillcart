import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:fillcart_customer/features/authentication/presentation/screens/login_screen.dart';
import 'package:fillcart_customer/features/onboarding/presentation/widgets/walkthrough_decorations.dart';
import 'package:fillcart_customer/features/onboarding/presentation/widgets/walkthrough_illustrations.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Walkthrough / Onboarding carousel screen based on Figma designs.
class WalkthroughScreen extends StatefulWidget {
  const WalkthroughScreen({super.key});

  @override
  State<WalkthroughScreen> createState() => _WalkthroughScreenState();
}

class _WalkthroughScreenState extends State<WalkthroughScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  static const List<_WalkthroughItem> _items = [
    _WalkthroughItem(
      title: 'Your Favorite Stores',
      description: 'Explore nearby shops and order\neverything you need.',
    ),
    _WalkthroughItem(
      title: 'Quick Doorstep Delivery',
      description: 'Track your order and enjoy quick\ndelivery.',
    ),
    _WalkthroughItem(
      title: 'Delivered in No Time',
      description: 'Fast delivery from local stores right to\nyour doorstep.',
    ),
  ];

  void _onNextPressed() {
    if (_currentIndex < _items.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 380),
        curve: Curves.easeInOutCubic,
      );
    } else {
      _navigateToLogin();
    }
  }

  void _navigateToLogin() {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder<void>(
        pageBuilder: (_, _, _) => const LoginScreen(),
        transitionsBuilder: (_, animation, _, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 350),
      ),
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.sizeOf(context).height;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
        systemNavigationBarColor: Color(0xFFFFFCF4),
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFCF4),
        body: Stack(
          children: [
            // Static bottom wave anchored at the bottom-left
            const WalkthroughBottomWave(),

            // Swipeable Carousel PageView
            PageView.builder(
              controller: _pageController,
              itemCount: _items.length,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
              },
              itemBuilder: (context, index) {
                final item = _items[index];

                return Stack(
                  children: [
                    // Per-slide organic top shapes & 3D golden spheres
                    WalkthroughSlideDecoration(slideIndex: index),

                    // Main Slide Content
                    SafeArea(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Proportional spacing above the illustration
                          SizedBox(height: screenHeight * 0.13),

                          // Vector Illustration Asset
                          WalkthroughIllustration(step: index),

                          // Spacing between illustration and headline
                          SizedBox(height: screenHeight * 0.055),

                          // Headline (Left-aligned)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: Text(
                              item.title,
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF000000),
                                letterSpacing: -0.6,
                                height: 1.2,
                              ),
                            ),
                          ),

                          const SizedBox(height: 14),

                          // Subtitle (Left-aligned)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 24),
                            child: Text(
                              item.description,
                              style: const TextStyle(
                                fontSize: 16.5,
                                fontWeight: FontWeight.w400,
                                color: Color(0xFF262626),
                                height: 1.45,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),

            // Bottom Navigation Controls (Skip & Next)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 20,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Skip button
                      GestureDetector(
                        onTap: _navigateToLogin,
                        behavior: HitTestBehavior.opaque,
                        child: const Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 4,
                            vertical: 12,
                          ),
                          child: Text(
                            'Skip',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF212121),
                              letterSpacing: -0.2,
                            ),
                          ),
                        ),
                      ),

                      // Next Squircle Action Button (using official Next.png asset)
                      GestureDetector(
                        onTap: _onNextPressed,
                        behavior: HitTestBehavior.opaque,
                        child: Image.asset(
                          AppAssets.nextIcon,
                          width: 68,
                          height: 68,
                          fit: BoxFit.contain,
                        ),
                      ),
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

class _WalkthroughItem {
  final String title;
  final String description;

  const _WalkthroughItem({
    required this.title,
    required this.description,
  });
}
