import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';

/// Editable 4-digit (pickup) or 6-digit (delivery) OTP box row.
///
/// Handles numeric input, automatic forward focus progression, backspace
/// navigation to the previous box, completion callback, and external error state.
class MultiOrderOtpBoxRow extends StatefulWidget {
  final int length;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onCompleted;
  final String? errorText;
  final bool enabled;
  final double boxHeight;

  const MultiOrderOtpBoxRow({
    super.key,
    this.length = 4,
    this.onChanged,
    this.onCompleted,
    this.errorText,
    this.enabled = true,
    this.boxHeight = 48,
  }) : assert(length == 4 || length == 6, 'OTP length must be 4 or 6');

  @override
  State<MultiOrderOtpBoxRow> createState() => _MultiOrderOtpBoxRowState();
}

class _MultiOrderOtpBoxRowState extends State<MultiOrderOtpBoxRow> {
  late List<TextEditingController> _controllers;
  late List<FocusNode> _focusNodes;

  @override
  void initState() {
    super.initState();
    _initFields();
  }

  void _initFields() {
    _controllers = List.generate(widget.length, (_) => TextEditingController());
    _focusNodes = List.generate(
      widget.length,
      (index) => FocusNode()
        ..addListener(() {
          if (mounted) setState(() {});
        }),
    );
  }

  void _disposeFields() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    for (final node in _focusNodes) {
      node.dispose();
    }
  }

  @override
  void didUpdateWidget(covariant MultiOrderOtpBoxRow oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.length != widget.length) {
      _disposeFields();
      _initFields();
    }
  }

  @override
  void dispose() {
    _disposeFields();
    super.dispose();
  }

  String get _currentOtp => _controllers.map((c) => c.text).join();

  void _handleChanged(int index, String value) {
    if (!widget.enabled) return;

    if (value.length > 1) {
      final digits = value.replaceAll(RegExp(r'\D'), '');
      for (var i = 0; i < widget.length && i < digits.length; i++) {
        _controllers[i].text = digits[i];
      }
      final nextIndex =
          digits.length >= widget.length ? widget.length - 1 : digits.length;
      _focusNodes[nextIndex].requestFocus();
    } else if (value.isNotEmpty) {
      if (index + 1 < widget.length) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
      }
    }

    final otp = _currentOtp;
    widget.onChanged?.call(otp);
    if (otp.length == widget.length) {
      widget.onCompleted?.call(otp);
    }
    setState(() {});
  }

  KeyEventResult _handleKeyEvent(int index, KeyEvent event) {
    if (!widget.enabled) return KeyEventResult.ignored;
    if (event is KeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.backspace &&
        _controllers[index].text.isEmpty &&
        index > 0) {
      _controllers[index - 1].clear();
      _focusNodes[index - 1].requestFocus();
      widget.onChanged?.call(_currentOtp);
      setState(() {});
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final hasError = widget.errorText != null && widget.errorText!.isNotEmpty;
    final boxWidth = widget.length == 6 ? 41.0 : 48.0;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: widget.length == 6
              ? MainAxisAlignment.spaceBetween
              : MainAxisAlignment.center,
          children: List.generate(widget.length, (index) {
            final isFocused = _focusNodes[index].hasFocus;
            final isFilled = _controllers[index].text.isNotEmpty;

            final borderColor = hasError
                ? RiderColors.errorRed
                : (isFocused || isFilled)
                    ? RiderColors.primaryYellow
                    : const Color(0xFFE5E7EB);

            return Padding(
              padding: widget.length == 4
                  ? const EdgeInsets.symmetric(horizontal: 6)
                  : EdgeInsets.zero,
              child: Container(
                width: boxWidth,
                height: widget.boxHeight,
                decoration: BoxDecoration(
                  color: widget.enabled
                      ? RiderColors.surface
                      : const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: borderColor,
                    width: (isFocused || isFilled || hasError) ? 1.5 : 1.0,
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x0D000000),
                      blurRadius: 4,
                      offset: Offset(0, 1),
                    ),
                  ],
                ),
                alignment: Alignment.center,
                child: Focus(
                  onKeyEvent: (_, event) => _handleKeyEvent(index, event),
                  child: TextField(
                    key: Key('multi_order_otp_box_$index'),
                    controller: _controllers[index],
                    focusNode: _focusNodes[index],
                    enabled: widget.enabled,
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.number,
                    maxLength: 1,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                    ],
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: isFilled && !hasError
                          ? const Color(0xFF080808)
                          : RiderColors.onSurfaceDark,
                    ),
                    decoration: const InputDecoration(
                      counterText: '',
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      disabledBorder: InputBorder.none,
                      contentPadding: EdgeInsets.zero,
                      isDense: true,
                    ),
                    onChanged: (value) => _handleChanged(index, value),
                  ),
                ),
              ),
            );
          }),
        ),
        if (hasError) ...[
          const SizedBox(height: 8),
          Text(
            widget.errorText!,
            key: const Key('multi_order_otp_error_text'),
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: RiderColors.errorRed,
            ),
          ),
        ],
      ],
    );
  }
}
