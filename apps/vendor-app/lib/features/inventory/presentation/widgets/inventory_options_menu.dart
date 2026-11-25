import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import '../../models/inventory_product.dart';
import '../screens/bulk_update_stock_screen.dart';
import '../screens/product_details_screen.dart';
import '../screens/stock_alert_settings_screen.dart';
import '../screens/update_stock_screen.dart';

/// Thin divider separating menu options.
class InventoryMenuDivider extends PopupMenuEntry<Never> {
  const InventoryMenuDivider({super.key});

  @override
  final double height = 1.0;

  @override
  bool represents(void value) => false;

  @override
  State<InventoryMenuDivider> createState() => _InventoryMenuDividerState();
}

class _InventoryMenuDividerState extends State<InventoryMenuDivider> {
  @override
  Widget build(BuildContext context) {
    return const Divider(
      height: 1,
      thickness: 1,
      color: Color(0xFFF3F4F6),
    );
  }
}

/// 1. Top Header 3-dot options menu for "Products & Inventory" screen.
///
/// Options:
/// - Manage Categories
/// - Bulk Upload Products
/// - Export Product List
/// - Inventory Settings
class InventoryHeaderOptionsMenuButton extends StatelessWidget {
  final VoidCallback? onManageCategories;
  final VoidCallback? onBulkUpload;
  final VoidCallback? onExportList;
  final VoidCallback? onInventorySettings;
  final Widget? customTrigger;
  final Offset offset;

  const InventoryHeaderOptionsMenuButton({
    super.key,
    this.onManageCategories,
    this.onBulkUpload,
    this.onExportList,
    this.onInventorySettings,
    this.customTrigger,
    this.offset = const Offset(0, 48),
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      tooltip: 'Inventory options',
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 184),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      color: Colors.white,
      surfaceTintColor: Colors.transparent,
      elevation: 6,
      shadowColor: Colors.black.withValues(alpha: 0.12),
      offset: offset,
      onSelected: (value) {
        switch (value) {
          case 'manage_categories':
            if (onManageCategories != null) {
              onManageCategories!();
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Manage Categories',
                    style: TextStyle(fontFamily: 'Inter'),
                  ),
                  backgroundColor: Color(0xFF111827),
                  duration: Duration(seconds: 2),
                ),
              );
            }
            break;
          case 'bulk_upload':
            if (onBulkUpload != null) {
              onBulkUpload!();
            } else {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const BulkUpdateStockScreen(),
                ),
              );
            }
            break;
          case 'export_list':
            if (onExportList != null) {
              onExportList!();
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Exporting product list...',
                    style: TextStyle(fontFamily: 'Inter'),
                  ),
                  backgroundColor: Color(0xFF111827),
                  duration: Duration(seconds: 2),
                ),
              );
            }
            break;
          case 'inventory_settings':
            if (onInventorySettings != null) {
              onInventorySettings!();
            } else {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => StockAlertSettingsScreen(
                    product: InventoryProduct.demoProducts.first,
                  ),
                ),
              );
            }
            break;
        }
      },
      itemBuilder: (context) => [
        // 1. Manage Categories
        PopupMenuItem<String>(
          value: 'manage_categories',
          height: 44,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgDiagonalBox,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF111827),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Manage Categories',
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
        const InventoryMenuDivider(),

        // 2. Bulk Upload Products
        PopupMenuItem<String>(
          value: 'bulk_upload',
          height: 44,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgBulkUpload,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF111827),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Bulk Upload Products',
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
        const InventoryMenuDivider(),

        // 3. Export Product List
        PopupMenuItem<String>(
          value: 'export_list',
          height: 44,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgExportList,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF111827),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Export Product List',
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
        const InventoryMenuDivider(),

        // 4. Inventory Settings
        PopupMenuItem<String>(
          value: 'inventory_settings',
          height: 44,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgSettings,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF111827),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Inventory Settings',
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
      ],
      child: customTrigger,
    );
  }
}

/// 2. Product Card 3-dot options menu for each individual product card.
///
/// Options:
/// - Edit Product
/// - Update Stock
/// - Deactivate Product
/// - Delete Product (in Red)
class ProductCardOptionsMenuButton extends StatelessWidget {
  final InventoryProduct product;
  final VoidCallback? onEditProduct;
  final VoidCallback? onUpdateStock;
  final VoidCallback? onDeactivateProduct;
  final VoidCallback? onDeleteProduct;
  final Widget? customTrigger;
  final double iconSize;
  final Color iconColor;
  final Offset offset;

  const ProductCardOptionsMenuButton({
    super.key,
    required this.product,
    this.onEditProduct,
    this.onUpdateStock,
    this.onDeactivateProduct,
    this.onDeleteProduct,
    this.customTrigger,
    this.iconSize = 18,
    this.iconColor = const Color(0xFF9CA3AF),
    this.offset = const Offset(0, 8),
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<String>(
      tooltip: 'Product options',
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
            if (onEditProduct != null) {
              onEditProduct!();
            } else {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const ProductDetailsScreen(),
                ),
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Editing ${product.name}',
                    style: const TextStyle(fontFamily: 'Inter'),
                  ),
                  backgroundColor: const Color(0xFF111827),
                  duration: const Duration(seconds: 2),
                ),
              );
            }
            break;
          case 'update_stock':
            if (onUpdateStock != null) {
              onUpdateStock!();
            } else {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => UpdateStockScreen(product: product),
                ),
              );
            }
            break;
          case 'deactivate':
            if (onDeactivateProduct != null) {
              onDeactivateProduct!();
            }
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '${product.name} deactivated',
                  style: const TextStyle(fontFamily: 'Inter'),
                ),
                backgroundColor: const Color(0xFF111827),
                duration: const Duration(seconds: 2),
              ),
            );
            break;
          case 'delete':
            if (onDeleteProduct != null) {
              onDeleteProduct!();
            }
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  '${product.name} deleted',
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
        // 1. Edit Product
        PopupMenuItem<String>(
          value: 'edit',
          height: 44,
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
                'Edit Product',
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
        const InventoryMenuDivider(),

        // 2. Update Stock
        PopupMenuItem<String>(
          value: 'update_stock',
          height: 44,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              SvgPicture.asset(
                AppAssets.svgUpdateStock,
                width: 20,
                height: 20,
                colorFilter: const ColorFilter.mode(
                  Color(0xFF111827),
                  BlendMode.srcIn,
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'Update Stock',
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
        const InventoryMenuDivider(),

        // 3. Deactivate Product
        PopupMenuItem<String>(
          value: 'deactivate',
          height: 44,
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
                'Deactivate Product',
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
        const InventoryMenuDivider(),

        // 4. Delete Product
        PopupMenuItem<String>(
          value: 'delete',
          height: 44,
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
                'Delete Product',
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
