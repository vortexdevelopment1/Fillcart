import 'package:flutter/material.dart';

/// Reusable Step Progress Indicator for the 3-step promotion creation flow:
/// Step 1: Products
/// Step 2: Details
/// Step 3: Review
class PromotionStepIndicator extends StatelessWidget {
  const PromotionStepIndicator({
    super.key,
    required this.currentStep,
  });

  /// 1-based index: 1 = Products, 2 = Details, 3 = Review
  final int currentStep;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          _buildStep(
            stepNumber: 1,
            label: 'Products',
            isDone: currentStep > 1,
            isActive: currentStep == 1,
          ),
          _buildConnector(isDone: currentStep > 1),
          _buildStep(
            stepNumber: 2,
            label: 'Details',
            isDone: currentStep > 2,
            isActive: currentStep == 2,
          ),
          _buildConnector(isDone: currentStep > 2),
          _buildStep(
            stepNumber: 3,
            label: 'Review',
            isDone: currentStep > 3,
            isActive: currentStep == 3,
          ),
        ],
      ),
    );
  }

  Widget _buildStep({
    required int stepNumber,
    required String label,
    required bool isDone,
    required bool isActive,
  }) {
    Color circleBg;
    Widget content;

    if (isDone) {
      circleBg = const Color(0xFFC8F169);
      content = const Icon(
        Icons.check,
        size: 16,
        color: Color(0xFF111827),
      );
    } else if (isActive) {
      circleBg = const Color(0xFFC8F169);
      content = Text(
        '$stepNumber',
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 13,
          fontWeight: FontWeight.bold,
          color: Color(0xFF111827),
        ),
      );
    } else {
      circleBg = Colors.white;
      content = Text(
        '$stepNumber',
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: Color(0xFF9CA3AF),
        ),
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: circleBg,
            shape: BoxShape.circle,
            border: isDone || isActive
                ? null
                : Border.all(color: const Color(0xFFE5E7EB), width: 1.5),
          ),
          child: Center(child: content),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: isActive || isDone ? FontWeight.bold : FontWeight.w500,
            color: isActive || isDone
                ? const Color(0xFF111827)
                : const Color(0xFF6B7280),
          ),
        ),
      ],
    );
  }

  Widget _buildConnector({required bool isDone}) {
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.only(bottom: 22, left: 6, right: 6),
        color: isDone ? const Color(0xFFC8F169) : const Color(0xFFE5E7EB),
      ),
    );
  }
}
