import 'package:flutter/material.dart';

/// Smooth animated page dot indicator for the onboarding flow.
/// Features a lime-green pill for the active page and sage-green dots for inactive pages.
class OnboardingDotIndicator extends StatelessWidget {
  final int count;
  final int currentIndex;
  final Color activeColor;
  final Color inactiveColor;

  const OnboardingDotIndicator({
    super.key,
    required this.count,
    required this.currentIndex,
    this.activeColor = const Color(0xFFA8D934),
    this.inactiveColor = const Color(0xFFADBD87),
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(count, (index) {
        final bool isActive = index == currentIndex;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeInOut,
          margin: const EdgeInsets.symmetric(horizontal: 4.0),
          height: 8.0,
          width: isActive ? 20.0 : 8.0,
          decoration: BoxDecoration(
            color: isActive ? activeColor : inactiveColor,
            borderRadius: BorderRadius.circular(4.0),
          ),
        );
      }),
    );
  }
}
