import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import '../widgets/product_insight_tile.dart';
import '../widgets/product_metric_card.dart';
import '../widgets/product_sales_trend_chart.dart';

/// Screen displaying detailed product performance insights, sales trends, and inventory movement.
class ProductInsightsScreen extends StatelessWidget {
  const ProductInsightsScreen({
    super.key,
    this.productName = 'Amul Taaza Milk (1 L)',
    this.sku = 'SKU: AMU-MLK-1L',
    this.price = '₹68',
    this.imagePath = 'assets/cardsicon/amul_milk.png',
  });

  final String productName;
  final String sku;
  final String price;
  final String imagePath;

  @override
  Widget build(BuildContext context) {
    const bgColor = Color(0xFFF1EEE6);

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar with Back Button & Screen Title
              Row(
                children: [
                  InkWell(
                    onTap: () => Navigator.maybePop(context),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Center(
                        child: SvgPicture.asset(
                          AppAssets.svgBackArrow,
                          width: 20,
                          height: 20,
                          colorFilter: const ColorFilter.mode(
                            Color(0xFF111827),
                            BlendMode.srcIn,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Product Insights',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF111827),
                      height: 1.4,
                      letterSpacing: 0,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Product Info Header Card
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Image.asset(
                        imagePath,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(
                          Icons.local_drink_rounded,
                          color: Color(0xFF3B82F6),
                          size: 32,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            productName,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 15.5,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            sku,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 12,
                              color: Color(0xFF9CA3AF),
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            price,
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF111827),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Performance (Last 7 Days) Section
              const Text(
                'Performance (Last 7 Days)',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),

              // 3-Column Performance Metrics
              const Row(
                children: [
                  Expanded(
                    child: ProductMetricCard(
                      value: '126',
                      label: 'Units Sold',
                      badgeText: '↑ +18%',
                      isPositive: true,
                    ),
                  ),
                  SizedBox(width: 14),
                  Expanded(
                    child: ProductMetricCard(
                      value: '₹10,710',
                      label: 'Revenue',
                      badgeText: '↑ +20%',
                      isPositive: true,
                    ),
                  ),
                  SizedBox(width: 14),
                  Expanded(
                    child: ProductMetricCard(
                      value: '₹85',
                      label: 'Avg. Price',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 22),

              // Sales Trend Section
              const Text(
                'Sales Trend',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),
              const ProductSalesTrendChart(),
              const SizedBox(height: 22),

              // More Insights Section
              const Text(
                'More Insights',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 12),

              const ProductInsightTile(
                title: 'Stock Movement',
                subtitle: '126 sold · 40 in stock',
                iconPath: 'assets/cardsicon/stock_momentum.png',
              ),
              const SizedBox(height: 8),

              const ProductInsightTile(
                title: 'Order Distribution',
                subtitle: 'Added in 48 orders',
                iconPath: 'assets/cardsicon/order_distribution.png',
              ),
              const SizedBox(height: 8),

              const ProductInsightTile(
                title: 'Customer Demand',
                subtitle: '+18% higher than previous 7 days',
                iconPath: 'assets/cardsicon/custom_demand.png',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
