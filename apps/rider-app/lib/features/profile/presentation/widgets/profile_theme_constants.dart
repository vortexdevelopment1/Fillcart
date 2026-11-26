import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

/// Design tokens and shared header for the Rider Profile section.
abstract final class ProfileTokens {
  static const Color background = Color(0xFFF6F7EB);
  static const Color cardBackground = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color divider = Color(0xFFE5E7EB);
  static const Color fieldBorder = Color(0xFF8C8C8C);
  static const Color magentaAccent = Color(0xFFDF40FA);
  static const Color incentiveOlive = Color(0xFFC9B200);
  static const Color verifiedGreen = Color(0xFF0A7B34);
  static const Color pendingAmber = Color(0xFFC27803);
  static const Color pendingAmberBg = Color(0xFFFDF1DC);
}

/// Shared top app bar header for all Profile section screens.
class ProfileScreenHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onBack;
  final Widget? trailing;

  const ProfileScreenHeader({
    super.key,
    required this.title,
    this.onBack,
    this.trailing,
  });

  void _handleBack(BuildContext context) {
    if (onBack != null) {
      onBack!();
      return;
    }
    try {
      final router = GoRouter.of(context);
      if (router.canPop()) {
        router.pop();
        return;
      }
      router.go('/home');
    } catch (_) {
      Navigator.of(context).maybePop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 8, 8, 8),
      child: SizedBox(
        height: 44,
        child: Row(
          children: [
            IconButton(
              key: const Key('profile_back_button'),
              onPressed: () => _handleBack(context),
              icon: const Icon(
                Icons.arrow_back,
                color: Colors.black,
                size: 24,
              ),
              splashRadius: 22,
            ),
            const SizedBox(width: 4),
            Expanded(
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.w500,
                  color: Colors.black,
                ),
              ),
            ),
            ?trailing,
          ],
        ),
      ),
    );
  }
}
