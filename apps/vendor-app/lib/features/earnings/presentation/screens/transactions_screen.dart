import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/earnings/models/earnings_model.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/about_earnings_screen.dart';
import 'package:fillcart_vendor/features/earnings/presentation/screens/transaction_detail_screen.dart';
import 'package:fillcart_vendor/features/profile/presentation/screens/contact_support_screen.dart';

/// Screen 3: Order-wise Transactions List with filter pills and 3-dots menu.
/// Matches Figma Images 3 & 4.
class TransactionsScreen extends StatefulWidget {
  const TransactionsScreen({super.key});

  @override
  State<TransactionsScreen> createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  TransactionType _selectedFilter = TransactionType.all;

  static const Color textBlack = Color(0xFF111827);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color borderColor = Color(0xFFE5E7EB);

  List<EarningTransaction> get _filteredTransactions {
    switch (_selectedFilter) {
      case TransactionType.all:
        return EarningTransaction.mockTransactions;
      case TransactionType.earnings:
        return EarningTransaction.mockTransactions
            .where((t) => t.isPositive)
            .toList();
      case TransactionType.adjustment:
        return EarningTransaction.mockTransactions
            .where((t) => !t.isPositive)
            .toList();
      case TransactionType.refund:
        return [];
    }
  }

  void _showEarningsMenu(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          margin: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.12),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildMenuItem(
                iconAsset: AppAssets.svgDownload,
                fallbackIcon: Icons.download_outlined,
                title: 'Download details (PDF)',
                onTap: () {
                  Navigator.of(ctx).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Downloading transaction details PDF...'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
              const Divider(height: 1, color: Color(0xFFF3F4F6)),
              _buildMenuItem(
                iconAsset: AppAssets.svgShare,
                fallbackIcon: Icons.share_outlined,
                title: 'Share',
                onTap: () {
                  Navigator.of(ctx).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Sharing transaction details...'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
              const Divider(height: 1, color: Color(0xFFF3F4F6)),
              _buildMenuItem(
                iconAsset: AppAssets.svgAbout,
                fallbackIcon: Icons.info_outline,
                title: 'About earnings',
                onTap: () {
                  Navigator.of(ctx).pop();
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const AboutEarningsScreen(),
                    ),
                  );
                },
              ),
              const Divider(height: 1, color: Color(0xFFF3F4F6)),
              _buildMenuItem(
                iconAsset: AppAssets.svgContactSupport,
                fallbackIcon: Icons.headset_mic_outlined,
                title: 'Contact support',
                onTap: () {
                  Navigator.of(ctx).pop();
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const ContactSupportScreen(),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMenuItem({
    required String iconAsset,
    required IconData fallbackIcon,
    required String title,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          children: [
            SvgPicture.asset(
              iconAsset,
              width: 22,
              height: 22,
              colorFilter: const ColorFilter.mode(textBlack, BlendMode.srcIn),
              errorBuilder: (context, error, stackTrace) => Icon(
                fallbackIcon,
                size: 22,
                color: textBlack,
              ),
            ),
            const SizedBox(width: 16),
            Text(
              title,
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: textBlack,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF9FAFB),
        elevation: 0,
        centerTitle: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: textBlack),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Earnings',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: textBlack,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert, color: textBlack),
            onPressed: () => _showEarningsMenu(context),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                children: [
                  // 1. Date Range Pill
                  _buildDateFilterPill(),
                  const SizedBox(height: 14),

                  // 2. Filter Pills Row
                  _buildFilterTabs(),
                  const SizedBox(height: 12),
                ],
              ),
            ),

            // 3. Transactions List
            Expanded(
              child: _filteredTransactions.isEmpty
                  ? const Center(
                      child: Text(
                        'No transactions found for this category',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          color: textMuted,
                        ),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      itemCount: _filteredTransactions.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final tx = _filteredTransactions[index];
                        return _buildTransactionCard(tx);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateFilterPill() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          SvgPicture.asset(
            AppAssets.svgCalendar,
            width: 18,
            height: 18,
            colorFilter: const ColorFilter.mode(textBlack, BlendMode.srcIn),
            errorBuilder: (context, error, stackTrace) => const Icon(
              Icons.calendar_today_outlined,
              size: 18,
              color: textBlack,
            ),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'This week (15 – 21 Jan)',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14.5,
                fontWeight: FontWeight.w600,
                color: textBlack,
              ),
            ),
          ),
          const Icon(
            Icons.keyboard_arrow_down,
            color: textMuted,
            size: 22,
          ),
        ],
      ),
    );
  }

  Widget _buildFilterTabs() {
    final filters = [
      {'type': TransactionType.all, 'label': 'All'},
      {'type': TransactionType.earnings, 'label': 'Earnings'},
      {'type': TransactionType.adjustment, 'label': 'Adjustment'},
      {'type': TransactionType.refund, 'label': 'Refund'},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters.map((f) {
          final type = f['type']! as TransactionType;
          final label = f['label']! as String;
          final isSelected = _selectedFilter == type;

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () {
                setState(() {
                  _selectedFilter = type;
                });
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: isSelected ? textBlack : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? textBlack : borderColor,
                  ),
                ),
                child: Text(
                  label,
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13.5,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: isSelected ? Colors.white : textBlack,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTransactionCard(EarningTransaction tx) {
    return InkWell(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (_) => TransactionDetailScreen(transaction: tx),
          ),
        );
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          children: [
            // Row 1: ID / Title + Amount
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  tx.title,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 15.5,
                    fontWeight: FontWeight.w700,
                    color: textBlack,
                  ),
                ),
                Text(
                  '${tx.isPositive ? '+' : '-'}₹${tx.amount.toInt()}',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: textBlack,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),

            // Row 2: Date + Status pill
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${tx.dateTime} • ${tx.paymentType}',
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: FontWeight.w400,
                    color: textMuted,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: tx.isSettled ? const Color(0xFFF0FDF4) : const Color(0xFFF3F4F6),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    tx.statusLabel,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: tx.isSettled ? const Color(0xFF16A34A) : const Color(0xFF4B5563),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
