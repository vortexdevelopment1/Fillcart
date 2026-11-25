import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import '../screens/discount_offer_screen.dart';

/// Thin divider separating menu options.
class PromotionMenuDivider extends PopupMenuEntry<Never> {
  const PromotionMenuDivider({super.key});

  @override
  final double height = 1.0;

  @override
  bool represents(void value) => false;

  @override
  State<PromotionMenuDivider> createState() => _PromotionMenuDividerState();
}

class _PromotionMenuDividerState extends State<PromotionMenuDivider> {
  @override
  Widget build(BuildContext context) {
    return const Divider(
      height: 1,
      thickness: 1,
      color: Color(0xFFF3F4F6),
    );
  }
}

/// Reusable 3-dots popup menu button for promotion screens and cards.
///
/// Matches the Figma 3-dot options menu:
/// - Edit (Pencil icon)
/// - Deactivate (Box with X icon)
/// - Delete (Trash can icon in Red)
class PromotionOptionsMenuButton extends StatelessWidget {
  final String promotionTitle;
  final VoidCallback? onEdit;
  final VoidCallback? onDeactivate;
  final VoidCallback? onDelete;
  final Widget? customTrigger;
  final double iconSize;
  final Color iconColor;
  final Offset offset;

  const PromotionOptionsMenuButton({
    super.key,
    required this.promotionTitle,
    this.onEdit,
    this.onDeactivate,
    this.onDelete,
    this.customTrigger,
    this.iconSize = 18,
    this.iconColor = const Color(0xFF9CA3AF),
    this.offset = const Offset(0, 8),
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      tooltip: 'Promotion options',
      padding: EdgeInsets.zero,
      iconSize: iconSize,
      constraints: const BoxConstraints(minWidth: 164),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      color: Colors.white,
      surfaceTintColor: Colors.transparent,
      elevation: 6,
      shadowColor: Colors.black.withValues(alpha: 0.12),
      offset: offset,
      icon: customTrigger == null
          ? Icon(
              Icons.more_vert,
              color: iconColor,
              size: iconSize,
            )
          : null,
      onSelected: (value) {
        switch (value) {
          case 'edit':
            if (onEdit != null) {
              onEdit!();
            } else {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => DiscountOfferScreen(
                    promotionType: promotionTitle,
                  ),
                ),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Editing $promotionTitle',
                    style: const TextStyle(fontFamily: 'Inter'),
                  ),
                  backgroundColor: const Color(0xFF111827),
                  duration: const Duration(seconds: 2),
                ),
              );
            }
            break;
          case 'deactivate':
            if (onDeactivate != null) {
              onDeactivate!();
            }
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '$promotionTitle deactivated',
                  style: const TextStyle(fontFamily: 'Inter'),
                ),
                backgroundColor: const Color(0xFF111827),
                duration: const Duration(seconds: 2),
              ),
            );
            break;
          case 'delete':
            if (onDelete != null) {
              onDelete!();
            }
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '$promotionTitle deleted',
                  style: const TextStyle(fontFamily: 'Inter'),
                ),
                backgroundColor: const Color(0xFFEF4444),
                duration: const Duration(seconds: 2),
              ),
            );
            break;
        }
      },
      itemBuilder: (context) => [
        // 1. Edit Option
        PopupMenuItem<String>(
          value: 'edit',
          height: 46,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgEditPencil,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF111827),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Edit',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14.5,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF111827),
                ),
              ),
            ],
          ),
        ),
        const PromotionMenuDivider(),

        // 2. Deactivate Option
        PopupMenuItem<String>(
          value: 'deactivate',
          height: 46,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgDeactivate,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF111827),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Deactivate',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14.5,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF111827),
                ),
              ),
            ],
          ),
        ),
        const PromotionMenuDivider(),

        // 3. Delete Option
        PopupMenuItem<String>(
          value: 'delete',
          height: 46,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgDelete,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFFEF4444),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Delete',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14.5,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFFEF4444),
                ),
              ),
            ],
          ),
        ),
      ],
      child: customTrigger,
    );
  }
}
