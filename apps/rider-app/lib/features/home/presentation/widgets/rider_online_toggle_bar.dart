import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Interactive Online / Offline status toggle bar matching Figma node 1470:54683 & 153:1171.
///
/// Figma Specifications:
/// - Dimensions: 328 x 36 px
/// - Background: #FFFFFF (White)
/// - Corner Radius: 12 px
/// - Padding: horizontal 16 px, vertical 4 px
/// - Online state:
///   - Indicator dot: #00D850, 6 px diameter
///   - Text: "You are " (#555555, 14 px, Poppins Regular) + "Online" (#00D850, 14 px, Poppins Medium)
///   - Toggle switch: #34C759 background, knob right-aligned
/// - Offline state:
///   - Indicator dot: #DBDBDB, 6 px diameter
///   - Text: "You are " (#555555, 14 px, Poppins Regular) + "Offline" (#080808, 14 px, Poppins Medium)
///   - Toggle switch: #DBDBDB background, knob left-aligned
/// - Toggle: 40 x 20 px, pill radius 100 px, knob 16 x 16 px circular white
class RiderOnlineToggleBar extends StatefulWidget {
  final bool initialOnline;
  final ValueChanged<bool>? onToggleChanged;
  final bool Function(bool targetOnline)? onToggleAttempt;

  const RiderOnlineToggleBar({
    super.key,
    this.initialOnline = true,
    this.onToggleChanged,
    this.onToggleAttempt,
  });

  @override
  State<RiderOnlineToggleBar> createState() => _RiderOnlineToggleBarState();
}

class _RiderOnlineToggleBarState extends State<RiderOnlineToggleBar> {
  late bool _isOnline;

  @override
  void initState() {
    super.initState();
    _isOnline = widget.initialOnline;
  }

  @override
  void didUpdateWidget(covariant RiderOnlineToggleBar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialOnline != oldWidget.initialOnline &&
        widget.initialOnline != _isOnline) {
      _isOnline = widget.initialOnline;
    }
  }

  void _toggle() {
    final targetOnline = !_isOnline;
    if (widget.onToggleAttempt != null &&
        !widget.onToggleAttempt!(targetOnline)) {
      return;
    }
    setState(() {
      _isOnline = targetOnline;
    });
    widget.onToggleChanged?.call(_isOnline);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('rider_online_toggle_bar'),
      width: 328,
      height: 36,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: RiderColors.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Status dot and "You are Online/Offline"
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _isOnline
                      ? RiderColors.onlineGreen
                      : RiderColors.offlineGrey,
                ),
              ),
              const SizedBox(width: 10),
              Text.rich(
                TextSpan(
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: const Color(0xFF555555),
                  ),
                  children: [
                    const TextSpan(text: 'You are '),
                    TextSpan(
                      text: _isOnline ? 'Online' : 'Offline',
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: _isOnline
                            ? RiderColors.onlineGreen
                            : const Color(0xFF080808),
                      ),
                    ),
                  ],
                ),
                key: const Key('rider_status_text'),
              ),
            ],
          ),

          // Right: Animated Toggle Switch (40 x 20 px)
          GestureDetector(
            key: const Key('rider_toggle_switch_button'),
            onTap: _toggle,
            behavior: HitTestBehavior.opaque,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeInOut,
              width: 40,
              height: 20,
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(100),
                color: _isOnline
                    ? const Color(0xFF34C759)
                    : RiderColors.offlineGrey,
              ),
              child: AnimatedAlign(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeInOut,
                alignment: _isOnline
                    ? Alignment.centerRight
                    : Alignment.centerLeft,
                child: Container(
                  width: 16,
                  height: 16,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Color(0x26000000),
                        blurRadius: 2,
                        offset: Offset(0, 1),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
