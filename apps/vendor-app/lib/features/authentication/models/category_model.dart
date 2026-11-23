import 'package:flutter/material.dart';

/// Representation of a business category or sub-category item.
class CategoryItem {
  final String id;
  final String name;
  final String? emoji;
  final IconData? iconData;

  const CategoryItem({
    required this.id,
    required this.name,
    this.emoji,
    this.iconData,
  });

  static const List<CategoryItem> defaultCategories = [
    CategoryItem(id: 'grocery', name: 'Grocery', emoji: '🛒'),
    CategoryItem(id: 'vegetables', name: 'Vegetables', emoji: '🥦'),
    CategoryItem(id: 'beauty', name: 'Beauty', emoji: '💄'),
    CategoryItem(id: 'stationery', name: 'Stationery', emoji: '📚'),
    CategoryItem(id: 'electronics', name: 'Electronics', emoji: '⚡'),
  ];

  static const List<CategoryItem> defaultSubCategories = [
    CategoryItem(id: 'fruits_vegetables', name: 'Fruits & Vegetables', emoji: '🍏', iconData: Icons.apple),
    CategoryItem(id: 'dairy_bread_eggs', name: 'Dairy, Bread & Eggs', emoji: '🧁', iconData: Icons.breakfast_dining),
    CategoryItem(id: 'atta_rice_oil_dals', name: 'Atta, Rice, Oil & Dals', emoji: '🍴', iconData: Icons.restaurant),
    CategoryItem(id: 'tea_coffee_more', name: 'Tea, Coffee & More', emoji: '☕', iconData: Icons.local_cafe),
    CategoryItem(id: 'ice_creams_more', name: 'Ice Creams & More', emoji: '🍦', iconData: Icons.icecream),
    CategoryItem(id: 'masala_dry_fruits_more', name: 'Masala, Dry Fruits & More', emoji: '🍲', iconData: Icons.ramen_dining),
    CategoryItem(id: 'frozen_food', name: 'Frozen Food', emoji: '❄️', iconData: Icons.ac_unit),
    CategoryItem(id: 'sweet_cravings', name: 'Sweet Cravings', emoji: '🍬', iconData: Icons.cake),
    CategoryItem(id: 'breakfast_sauces', name: 'Breakfast & Sauces', emoji: '🥣', iconData: Icons.soup_kitchen),
    CategoryItem(id: 'cold_drinks_juices', name: 'Cold Drinks & Juices', emoji: '🥤', iconData: Icons.local_drink),
    CategoryItem(id: 'munchies', name: 'Munchies', emoji: '🍿', iconData: Icons.bakery_dining),
    CategoryItem(id: 'meats_fish_chicken_eggs', name: 'Meats, Fish, Chicken & Eggs', emoji: '🥩', iconData: Icons.set_meal),
    CategoryItem(id: 'jewellery', name: 'Jewellery', emoji: '💎', iconData: Icons.diamond),
    CategoryItem(id: 'biscuits', name: 'Biscuits', emoji: '🍪', iconData: Icons.cookie),
    CategoryItem(id: 'packaged_food', name: 'Packaged Food', emoji: '🥫', iconData: Icons.inventory_2),
  ];
}
