import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'promotion_options_menu.dart';

enum PromotionStatus {
  active,
  scheduled,
  expired,
}

class PromotionCardTile extends StatelessWidget {
  const PromotionCardTile({
    super.key,
    required this.title,
    required this.subtitle,
    required this.dateRange,
    required this.status,
    required this.iconAsset,
    this.iconBgColor,
    this.onTap,
    this.onEdit,
    this.onDeactivate,
    this.onDelete,
  });

  final String title;
  final String subtitle;
  final String dateRange;
  final PromotionStatus status;
  final String iconAsset;
  final Color? iconBgColor;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onDeactivate;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    Color tagBg;
    Color tagTextColor;
    String tagLabel;

    switch (status) {
      case PromotionStatus.active:
        tagBg = const Color(0xFFD1FADF);
        tagTextColor = const Color(0xFF027A48);
        tagLabel = 'Active';
        break;
      case PromotionStatus.scheduled:
        tagBg = const Color(0xFFF3E8FF);
        tagTextColor = const Color(0xFF7E22CE);
        tagLabel = 'Scheduled';
        break;
      case PromotionStatus.expired:
        tagBg = const Color(0xFFF3F4F6);
        tagTextColor = const Color(0xFF6B7280);
        tagLabel = 'Expired';
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Icon squircle - Fixed 40px width, 42px height as in Figma
                Container(
                  width: 40,
                  height: 42,
                  decoration: BoxDecoration(
                    color: iconBgColor ?? Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  clipBehavior: Clip.antiAlias,
                  alignment: Alignment.center,
                  child: Image.asset(
                    iconAsset,
                    width: 40,
                    height: 42,
                    fit: BoxFit.contain,
                    filterQuality: FilterQuality.high,
                  ),
                ),
                const SizedBox(width: 12),
                // Text details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              title,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF111827),
                                height: 1.2,
                                letterSpacing: -0.2,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: tagBg,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              tagLabel,
                              style: TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: tagTextColor,
                                height: 1.2,
                              ),
                            ),
                          ),
                          const SizedBox(width: 4),
                          PromotionOptionsMenuButton(
                            promotionTitle: title,
                            iconSize: 18,
                            iconColor: const Color(0xFF9CA3AF),
                            onEdit: onEdit,
                            onDeactivate: onDeactivate,
                            onDelete: onDelete,
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF6B7280),
                          height: 1.2,
                          letterSpacing: -0.1,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          SvgPicture.asset(
                            AppAssets.svgCalendar,
                            width: 11,
                            height: 11,
                            colorFilter: const ColorFilter.mode(
                              Color(0xFF9CA3AF),
                              BlendMode.srcIn,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            dateRange,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 11,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF6B7280),
                              height: 1.2,
                              letterSpacing: -0.1,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
