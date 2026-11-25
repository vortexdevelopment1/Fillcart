import 'package:flutter/material.dart';
import 'order_handed_over_screen.dart';

/// Screen 5 of Flow: Handover Verification / OTP Screen with Custom Keypad.
class HandoverVerificationScreen extends StatefulWidget {
  const HandoverVerificationScreen({
    super.key,
    this.orderId = '#FC2841',
    this.riderName = 'Ravi',
  });

  final String orderId;
  final String riderName;

  @override
  State<HandoverVerificationScreen> createState() =>
      _HandoverVerificationScreenState();
}

class _HandoverVerificationScreenState
    extends State<HandoverVerificationScreen> {
  // Pre-fill with "482" as shown in the screenshot so 1 tap completes it, or allows interactive typing
  String _otp = '482';

  void _onKeyTap(String value) {
    if (_otp.length < 4) {
      setState(() {
        _otp += value;
      });
      if (_otp.length == 4) {
        // Auto-verify after short delay
        Future.delayed(const Duration(milliseconds: 300), () {
          if (mounted) _onVerify();
        });
      }
    }
  }

  void _onBackspace() {
    if (_otp.isNotEmpty) {
      setState(() {
        _otp = _otp.substring(0, _otp.length - 1);
      });
    }
  }

  void _onVerify() {
    Navigator.pushReplacement<void, void>(
      context,
      MaterialPageRoute<void>(
        builder: (_) => OrderHandedOverScreen(
          orderId: widget.orderId,
          riderName: '${widget.riderName} V.',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0F0),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF0F0F0),
        elevation: 0,
        automaticallyImplyLeading: false,
        title: const Text(
          'Handover Verification',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827),
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              const SizedBox(height: 20),

              // Heading
              const Text(
                "Enter rider's OTP",
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'Ask ${widget.riderName} for the 4-digit code shown in his app',
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 13.5,
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF6B7280),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 28),

              // 4 PIN Boxes
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (index) {
                  final digit = index < _otp.length ? _otp[index] : '';
                  final isFilled = digit.isNotEmpty;

                  return Container(
                    width: 41,
                    height: 48,
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isFilled
                            ? const Color(0xFF111827)
                            : const Color(0xFF9CA3AF),
                        width: isFilled ? 1.8 : 1.5,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      digit,
                      style: const TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF111827),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 28),

              // Verify & Hand Over Button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF000000),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: _onVerify,
                  child: const Text(
                    'Verify & hand over',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),

              const Spacer(),

              // Custom Numeric Keypad
              Column(
                children: [
                  _buildKeypadRow(['1', '2', '3']),
                  const SizedBox(height: 12),
                  _buildKeypadRow(['4', '5', '6']),
                  const SizedBox(height: 12),
                  _buildKeypadRow(['7', '8', '9']),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Expanded(child: SizedBox()),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildKeyButton(
                          label: '0',
                          onTap: () => _onKeyTap('0'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildKeyButton(
                          isBackspace: true,
                          onTap: _onBackspace,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildKeypadRow(List<String> keys) {
    return Row(
      children: [
        for (int i = 0; i < keys.length; i++) ...[
          if (i > 0) const SizedBox(width: 12),
          Expanded(
            child: _buildKeyButton(
              label: keys[i],
              onTap: () => _onKeyTap(keys[i]),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildKeyButton({
    String? label,
    bool isBackspace = false,
    required VoidCallback onTap,
  }) {
    return Material(
      color: isBackspace ? const Color(0xFFE5DFD5) : Colors.white,
      borderRadius: BorderRadius.circular(18),
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          height: 56,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: isBackspace
                  ? const Color(0xFFD6D0C5)
                  : const Color(0xFFE5E7EB),
              width: 1,
            ),
          ),
          child: isBackspace
              ? const Icon(
                  Icons.backspace_outlined,
                  size: 22,
                  color: Color(0xFF111827),
                )
              : Text(
                  label!,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF111827),
                  ),
                ),
        ),
      ),
    );
  }
}

