import 'package:fillcart_vendor/features/navigation/presentation/screens/main_vendor_screen.dart';
import 'package:flutter/material.dart';
import '../../models/onboarding_item.dart';
import '../widgets/onboarding_dot_indicator.dart';

/// Onboarding Screen displaying the three sequential onboarding slides for the
/// Fillcart Vendor Mobile Application.
///
/// Features authentic illustrations, pixel-aligned typography, lime/sage
/// animated dot indicators, and sleek navigation controls.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({
    super.key,
    this.items,
    this.nextScreen,
    this.onFinish,
  });

  /// Custom list of onboarding items. Defaults to [OnboardingItem.defaultItems].
  final List<OnboardingItem>? items;

  /// Destination screen after onboarding is completed or skipped.
  /// Defaults to [MainVendorScreen].
  final Widget? nextScreen;

  /// Optional callback invoked when onboarding completes or is skipped.
  /// If provided, default navigation is bypassed.
  final VoidCallback? onFinish;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  late final PageController _pageController;
  late final List<OnboardingItem> _items;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _items = widget.items ?? OnboardingItem.defaultItems;
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _items.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _completeOnboarding();
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _completeOnboarding() {
    if (widget.onFinish != null) {
      widget.onFinish!();
      return;
    }

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => widget.nextScreen ?? const MainVendorScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.sizeOf(context).height;
    final isLastPage = _currentPage == _items.length - 1;
    final isFirstPage = _currentPage == 0;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar / Navigation Header
            SizedBox(
              height: 52.0,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (!isFirstPage)
                      IconButton(
                        icon: const Icon(
                          Icons.arrow_back,
                          color: Color(0xFF1E293B),
                          size: 24.0,
                        ),
                        onPressed: _previousPage,
                        tooltip: 'Back',
                      )
                    else
                      const SizedBox(width: 48.0),
                    if (!isFirstPage)
                      TextButton(
                        onPressed: _completeOnboarding,
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFF64748B),
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        ),
                        child: const Text(
                          'skip',
                          style: TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.w400,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      )
                    else
                      const SizedBox(width: 48.0),
                  ],
                ),
              ),
            ),

            // Page Content (Illustration, Dots, Title, Subtitle)
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _items.length,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemBuilder: (context, index) {
                  final item = _items[index];
                  // Proportional height for the illustration
                  final illustrationHeight = (screenHeight * 0.38).clamp(200.0, 360.0);

                  return SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 8.0),
                          // Illustration container
                          Center(
                            child: SizedBox(
                              height: illustrationHeight,
                              child: Image.asset(
                                item.imagePath,
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) {
                                  // Fallback to embedded raw bytes for instant Hot Reload
                                  return Image.memory(
                                    item.fallbackBytes,
                                    fit: BoxFit.contain,
                                  );
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 24.0),

                          // Dots indicator
                          Center(
                            child: OnboardingDotIndicator(
                              count: _items.length,
                              currentIndex: _currentPage,
                            ),
                          ),
                          const SizedBox(height: 28.0),

                          // Title
                          Text(
                            item.title,
                            style: const TextStyle(
                              fontSize: 32.0,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF000000),
                              height: 1.15,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 14.0),

                          // Subtitle
                          Text(
                            item.description,
                            style: const TextStyle(
                              fontSize: 16.0,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF64748B),
                              height: 1.35,
                            ),
                          ),
                          const SizedBox(height: 24.0),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // Bottom Action Button
            Padding(
              padding: const EdgeInsets.fromLTRB(24.0, 8.0, 24.0, 24.0),
              child: SizedBox(
                width: double.infinity,
                height: 56.0,
                child: ElevatedButton(
                  onPressed: isLastPage ? _completeOnboarding : _nextPage,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: const StadiumBorder(),
                  ),
                  child: isLastPage
                      ? const Text(
                          'Get Started',
                          style: TextStyle(
                            fontSize: 17.0,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Next',
                              style: TextStyle(
                                fontSize: 17.0,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(width: 8.0),
                            Icon(
                              Icons.arrow_forward_rounded,
                              size: 20.0,
                              color: Colors.white,
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
