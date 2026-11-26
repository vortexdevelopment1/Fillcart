import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../domain/models/payment_summary.dart';

/// Shared single-select payment method card (`Collected Cash` vs `UPI`)
/// matching `Collect Payment Screen.png` (`1568:58271`) and
/// `Cash Collect Payment Screen.png` (`1962:51363`).
class MultiOrderPaymentMethodSelector extends StatelessWidget {
  final PaymentMethod selectedMethod;
  final ValueChanged<PaymentMethod> onMethodSelected;
  final bool enabled;
  final Widget? cashLeading;
  final Widget? upiLeading;

  const MultiOrderPaymentMethodSelector({
    super.key,
    required this.selectedMethod,
    required this.onMethodSelected,
    this.enabled = true,
    this.cashLeading,
    this.upiLeading,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('multi_order_payment_method_selector'),
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: RiderColors.surface,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'SELECT PAYMENT METHOD',
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              letterSpacing: 0.4,
              color: const Color(0xFF555555),
            ),
          ),
          const SizedBox(height: 10),
          _PaymentOptionTile(
            tileKey: const Key('payment_option_cash'),
            title: 'Collected Cash',
            subtitle: 'Customer pays with cash',
            isSelected: selectedMethod == PaymentMethod.cash,
            enabled: enabled,
            leading: cashLeading,
            onTap: () => onMethodSelected(PaymentMethod.cash),
          ),
          const SizedBox(height: 10),
          _PaymentOptionTile(
            tileKey: const Key('payment_option_upi'),
            title: 'UPI',
            subtitle: 'Customer pays digitally',
            isSelected: selectedMethod == PaymentMethod.upi,
            enabled: enabled,
            leading: upiLeading,
            onTap: () => onMethodSelected(PaymentMethod.upi),
          ),
        ],
      ),
    );
  }
}

class _PaymentOptionTile extends StatelessWidget {
  final Key tileKey;
  final String title;
  final String subtitle;
  final bool isSelected;
  final bool enabled;
  final Widget? leading;
  final VoidCallback onTap;

  const _PaymentOptionTile({
    required this.tileKey,
    required this.title,
    required this.subtitle,
    required this.isSelected,
    required this.enabled,
    this.leading,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      key: tileKey,
      onTap: enabled ? onTap : null,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFFFFFDF0)
              : RiderColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? RiderColors.primaryYellow
                : const Color(0xFFE5E7EB),
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Row(
          children: [
            if (leading != null) ...[
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color(0xFFFFF6B3)
                      : const Color(0xFFF6F6F6),
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: leading,
              ),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF080808),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF555555),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isSelected ? RiderColors.primaryYellow : Colors.transparent,
                border: Border.all(
                  color: isSelected
                      ? RiderColors.primaryYellow
                      : const Color(0xFF8E8E93),
                  width: 1.5,
                ),
              ),
              child: isSelected
                  ? const Icon(
                      Icons.check,
                      size: 14,
                      color: Color(0xFF080808),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
