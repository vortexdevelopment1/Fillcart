import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/constants/rider_colors.dart';
import 'widgets/onboarding_page_indicator.dart';

/// Data model representing an individual onboarding slide.
class OnboardingSlide {
  final String title;
  final String subtitle;
  final String assetPath;
  final double imageWidth;
  final double imageHeight;

  const OnboardingSlide({
    required this.title,
    required this.subtitle,
    required this.assetPath,
    required this.imageWidth,
    required this.imageHeight,
  });
}

/// Swipeable onboarding walkthrough for the Fillcart Rider Application.
///
/// Implemented according to Figma Frames:
/// - 1848:51668 (Page 1: "Start Delivering with Ease")
/// - 1848:51685 (Page 2: "Track Earnings & Rewards")
/// - 1848:51702 (Page 3: "Accept, Navigate & Deliver")
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  late final PageController _pageController;
  int _currentPage = 0;
  bool _navigated = false;

  static const List<OnboardingSlide> _slides = [
    OnboardingSlide(
      title: 'Start Delivering with Ease',
      subtitle:
          'Accept nearby orders, manage deliveries efficiently, and stay connected with customers in real time.',
      assetPath: 'assets/onboarding/onboarding_delivery.png',
      imageWidth: 304,
      imageHeight: 303,
    ),
    OnboardingSlide(
      title: 'Track Earnings & Rewards',
      subtitle:
          'Monitor your daily earnings, unlock incentives, and achieve bonus targets as you complete more deliveries.',
      assetPath: 'assets/onboarding/onboarding_earnings.png',
      imageWidth: 288,
      imageHeight: 362,
    ),
    OnboardingSlide(
      title: 'Accept, Navigate & Deliver',
      subtitle:
          'Receive instant order requests, follow optimized routes, and complete deliveries quickly and smoothly.',
      assetPath: 'assets/onboarding/onboarding_navigation.png',
      imageWidth: 288,
      imageHeight: 362,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _navigateToPhone() {
    if (_navigated) return;
    _navigated = true;
    context.go('/phone');
  }

  void _onNextPressed() {
    if (_currentPage < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _navigateToPhone();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RiderColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar with Skip Button
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 8.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    key: const Key('onboarding_skip_button'),
                    onPressed: _navigateToPhone,
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFF555555),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                    ),
                    child: Text(
                      'Skip',
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF555555),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Middle: Swipable PageView
            Expanded(
              child: PageView.builder(
                key: const Key('onboarding_page_view'),
                controller: _pageController,
                itemCount: _slides.length,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                itemBuilder: (context, index) {
                  final slide = _slides[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      children: [
                        // Illustration area: Expanded so it occupies identical vertical space on all slides
                        Expanded(
                          child: Align(
                            alignment: Alignment.bottomCenter,
                            child: ConstrainedBox(
                              constraints: BoxConstraints(
                                maxWidth: slide.imageWidth,
                                maxHeight: 362,
                              ),
                              child: Image.asset(
                                slide.assetPath,
                                key: Key('onboarding_image_$index'),
                                fit: BoxFit.contain,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Title: Positioned on the exact same baseline across all slides
                        Text(
                          slide.title,
                          key: Key('onboarding_title_$index'),
                          textAlign: TextAlign.center,
                          style: GoogleFonts.poppins(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            height: 28 / 20,
                            color: const Color(0xFF000000),
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Subtitle: Fixed container height ensuring text lines stay aligned across slides
                        SizedBox(
                          height: 68,
                          child: Text(
                            slide.subtitle,
                            key: Key('onboarding_subtitle_$index'),
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                              height: 22 / 14,
                              color: const Color(0xFF5B5B5B),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Bottom Bar: Centered Dots Indicator + Circular Next Button
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 24.0,
              ),
              child: SizedBox(
                height: 48,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Horizontally centered 3-dot indicator group
                    Center(
                      child: OnboardingPageIndicator(
                        totalPages: _slides.length,
                        currentPage: _currentPage,
                      ),
                    ),

                    // Circular Next Action Button (aligned right)
                    Align(
                      alignment: Alignment.centerRight,
                      child: GestureDetector(
                        key: const Key('onboarding_next_button'),
                        onTap: _onNextPressed,
                        child: Container(
                          width: 48,
                          height: 48,
                          decoration: const BoxDecoration(
                            color: RiderColors.primaryYellow,
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: const Icon(
                            Icons.arrow_forward_rounded,
                            size: 22,
                            color: RiderColors.onSurfaceDark,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
