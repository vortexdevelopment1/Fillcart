import 'package:flutter/material.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Animated page indicator dots matching the Figma onboarding walkthrough design.
class OnboardingPageIndicator extends StatelessWidget {
  final int totalPages;
  final int currentPage;

  const OnboardingPageIndicator({
    super.key,
    required this.totalPages,
    required this.currentPage,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(totalPages, (index) {
        final isActive = index == currentPage;
        return AnimatedContainer(
          key: Key('onboarding_dot_$index'),
          duration: const Duration(milliseconds: 250),
          margin: const EdgeInsets.symmetric(horizontal: 3),
          width: isActive ? 16 : 6,
          height: 6,
          decoration: BoxDecoration(
            color: isActive
                ? RiderColors.primaryYellow
                : RiderColors.offlineGrey,
            borderRadius: BorderRadius.circular(3),
          ),
        );
      }),
    );
  }
}
