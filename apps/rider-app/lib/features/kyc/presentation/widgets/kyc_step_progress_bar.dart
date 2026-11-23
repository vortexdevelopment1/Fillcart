import 'package:flutter/material.dart';
import '../../../../shared/constants/rider_colors.dart';

/// Reusable four-segment progress indicator for KYC Wizard.
///
/// Visual Specifications (matching Figma update):
/// - 4 equal horizontal segments separated by 6 px gap
/// - Height: 4 px
/// - Rounded caps (radius: 4 px)
/// - Active color: #FFE700 (RiderColors.primaryYellow)
/// - Inactive color: Pale yellow (Color(0xFFFFF494) / #FFE700 with ~28% alpha)
class KycStepProgressBar extends StatelessWidget {
  final int currentStep;
  final int totalSteps;

  const KycStepProgressBar({
    super.key,
    required this.currentStep,
    this.totalSteps = 4,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(totalSteps, (index) {
        final isActive = index < currentStep;
        return Expanded(
          child: Container(
            margin: EdgeInsets.only(right: index < totalSteps - 1 ? 6.0 : 0.0),
            height: 4.0,
            decoration: BoxDecoration(
              color: isActive
                  ? RiderColors.primaryYellow
                  : const Color(0xFFFFF494),
              borderRadius: BorderRadius.circular(4.0),
            ),
          ),
        );
      }),
    );
  }
}
