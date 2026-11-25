import 'package:flutter/material.dart';

/// Shared pill toggle switch matching the Notification Settings design.
///
/// ON state renders a `#000000` track with a `#A2D331` thumb;
/// OFF state renders a `#9A9A9A` track with a `#FFFFFF` thumb.
class VendorToggleSwitch extends StatelessWidget {
  const VendorToggleSwitch({
    super.key,
    required this.value,
    required this.onChanged,
  });

  final bool value;
  final ValueChanged<bool> onChanged;

  static const Color activeTrackColor = Color(0xFF000000);
  static const Color activeThumbColor = Color(0xFFA2D331);
  static const Color inactiveTrackColor = Color(0xFF9A9A9A);
  static const Color inactiveThumbColor = Color(0xFFFFFFFF);

  @override
  Widget build(BuildContext context) {
    return Semantics(
      toggled: value,
      enabled: true,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => onChanged(!value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 48,
          height: 28,
          padding: const EdgeInsets.all(3),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            color: value ? activeTrackColor : inactiveTrackColor,
          ),
          alignment: value ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            width: 22,
            height: 22,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: value ? activeThumbColor : inactiveThumbColor,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.18),
                  blurRadius: 3,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
