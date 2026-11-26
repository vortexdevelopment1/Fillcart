import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Genuine horizontal drag-to-complete swipe button for Multi-Order actions.
///
/// Tapping never triggers [onSwipeComplete]; the thumb must be dragged past
/// [completionThreshold] of the available track travel.
class MultiOrderSwipeButton extends StatefulWidget {
  final String label;
  final VoidCallback? onSwipeComplete;
  final bool enabled;
  final double height;
  final double completionThreshold;
  final Key? buttonKey;

  const MultiOrderSwipeButton({
    super.key,
    required this.label,
    required this.onSwipeComplete,
    this.enabled = true,
    this.height = 48,
    this.completionThreshold = 0.78,
    this.buttonKey,
  });

  @override
  State<MultiOrderSwipeButton> createState() => _MultiOrderSwipeButtonState();
}

class _MultiOrderSwipeButtonState extends State<MultiOrderSwipeButton> {
  static const double _trackPadding = 4;

  double _dragOffset = 0;
  bool _hasCompletedCurrentDrag = false;

  bool get _isInteractive => widget.enabled && widget.onSwipeComplete != null;

  @override
  void didUpdateWidget(covariant MultiOrderSwipeButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!widget.enabled && _dragOffset != 0) {
      _dragOffset = 0;
      _hasCompletedCurrentDrag = false;
    }
  }

  void _resetDrag() {
    if (!mounted) return;
    setState(() {
      _dragOffset = 0;
      _hasCompletedCurrentDrag = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final thumbSize = widget.height - (_trackPadding * 2);

    return Semantics(
      button: true,
      enabled: _isInteractive,
      label: widget.label,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final trackWidth =
              constraints.maxWidth.isFinite ? constraints.maxWidth : 328.0;
          final maxTravel =
              (trackWidth - thumbSize - (_trackPadding * 2)).clamp(0.0, 1000.0);

          return GestureDetector(
            key: widget.buttonKey ?? const Key('multi_order_swipe_button'),
            behavior: HitTestBehavior.opaque,
            onHorizontalDragStart: _isInteractive
                ? (_) {
                    _hasCompletedCurrentDrag = false;
                  }
                : null,
            onHorizontalDragUpdate: _isInteractive
                ? (details) {
                    if (_hasCompletedCurrentDrag) return;
                    setState(() {
                      _dragOffset =
                          (_dragOffset + details.delta.dx).clamp(0.0, maxTravel);
                    });
                  }
                : null,
            onHorizontalDragEnd: _isInteractive
                ? (_) {
                    if (_hasCompletedCurrentDrag) {
                      _resetDrag();
                      return;
                    }
                    final completed = maxTravel > 0 &&
                        _dragOffset >= maxTravel * widget.completionThreshold;
                    if (completed) {
                      _hasCompletedCurrentDrag = true;
                      widget.onSwipeComplete?.call();
                    }
                    _resetDrag();
                  }
                : null,
            onHorizontalDragCancel: _isInteractive ? _resetDrag : null,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              width: trackWidth,
              height: widget.height,
              decoration: BoxDecoration(
                color: _isInteractive
                    ? const Color(0xFFC4B300)
                    : const Color(0xFFD9D180),
                borderRadius: BorderRadius.circular(100),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: thumbSize + 12),
                      child: Text(
                        widget.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white.withValues(
                            alpha: _isInteractive ? 1.0 : 0.7,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    left: _trackPadding + _dragOffset,
                    top: _trackPadding,
                    child: Container(
                      key: const Key('multi_order_swipe_thumb'),
                      width: thumbSize,
                      height: thumbSize,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(
                          alpha: _isInteractive ? 1.0 : 0.75,
                        ),
                        shape: BoxShape.circle,
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x1F000000),
                            blurRadius: 4,
                            offset: Offset(0, 1),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.keyboard_double_arrow_right,
                          size: 20,
                          color: Color(0xFF080808),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
