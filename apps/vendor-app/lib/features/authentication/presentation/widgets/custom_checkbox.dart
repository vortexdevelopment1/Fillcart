import 'package:flutter/material.dart';

/// Reusable squircle checkbox matching the exact Figma specifications.
class CustomCheckbox extends StatelessWidget {
  final bool value;
  final ValueChanged<bool>? onChanged;
  final double size;

  const CustomCheckbox({
    super.key,
    required this.value,
    this.onChanged,
    this.size = 22.0,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onChanged != null ? () => onChanged!(!value) : null,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: value ? const Color(0xFF000000) : Colors.white,
          borderRadius: BorderRadius.circular(6.0),
          border: Border.all(
            color: value ? const Color(0xFF000000) : const Color(0xFFCBD5E1),
            width: 1.5,
          ),
        ),
        child: value
            ? const Icon(
                Icons.check,
                size: 14.0,
                color: Colors.white,
              )
            : null,
      ),
    );
  }
}
