import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// FAQ's Screen matching Figma reference media_1795674018947_ff1e822a.png.
class FaqScreen extends StatefulWidget {
  final String initialCategory;

  const FaqScreen({
    super.key,
    this.initialCategory = 'All',
  });

  @override
  State<FaqScreen> createState() => _FaqScreenState();
}

class _FaqScreenState extends State<FaqScreen> {
  final TextEditingController _searchController = TextEditingController();
  late String _selectedCategory;
  final Set<String> _expandedQuestions = {'Where is my order?'};

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.initialCategory;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _toggleQuestion(String question) {
    setState(() {
      if (_expandedQuestions.contains(question)) {
        _expandedQuestions.remove(question);
      } else {
        _expandedQuestions.add(question);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        systemNavigationBarColor: Color(0xFFFFFCF3),
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFCF3),
        body: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 10),

                      // Top Navigation Header
                      Row(
                        children: [
                          GestureDetector(
                            onTap: () => Navigator.of(context).maybePop(),
                            behavior: HitTestBehavior.opaque,
                            child: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.05),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              alignment: Alignment.center,
                              child: const Icon(Icons.arrow_back, color: Color(0xFF1E1E1E), size: 20),
                            ),
                          ),
                          const SizedBox(width: 14),
                          const Text(
                            "FAQ's",
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1E1E1E),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // Search FAQs input
                      Container(
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFF1EEE6), width: 1.2),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Row(
                          children: [
                            Image.asset(
                              'assets/card-icons/Search.png',
                              width: 20,
                              height: 20,
                              errorBuilder: (_, _, _) => const Icon(
                                Icons.search,
                                size: 20,
                                color: Color(0xFF9CA3AF),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextField(
                                controller: _searchController,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF1E1E1E),
                                ),
                                decoration: const InputDecoration(
                                  hintText: 'Search FAQs...',
                                  hintStyle: TextStyle(
                                    fontSize: 14.5,
                                    fontWeight: FontWeight.w400,
                                    color: Color(0xFF9CA3AF),
                                  ),
                                  border: InputBorder.none,
                                  isDense: true,
                                  contentPadding: EdgeInsets.zero,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18),

                      // Category Filter Chips
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        physics: const BouncingScrollPhysics(),
                        child: Row(
                          children: [
                            _buildFilterChip(
                              title: 'All',
                              icon: Icons.tune_rounded,
                              isSelected: _selectedCategory == 'All',
                              onTap: () => setState(() => _selectedCategory = 'All'),
                            ),
                            const SizedBox(width: 10),
                            _buildFilterChip(
                              title: 'Orders',
                              icon: Icons.inventory_2_outlined,
                              isSelected: _selectedCategory == 'Orders',
                              onTap: () => setState(() => _selectedCategory = 'Orders'),
                            ),
                            const SizedBox(width: 10),
                            _buildFilterChip(
                              title: 'Wallet & Payments',
                              icon: Icons.account_balance_wallet_outlined,
                              isSelected: _selectedCategory == 'Wallet & Payments',
                              onTap: () => setState(() => _selectedCategory = 'Wallet & Payments'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 22),

                      // Section: ORDERS
                      if (_selectedCategory == 'All' || _selectedCategory == 'Orders') ...[
                        _buildSectionHeader('ORDERS'),
                        _buildAccordionCard(
                          questions: [
                            _FaqItem(
                              question: 'Where is my order?',
                              answer:
                                  'You can track your active deliveries in real-time on the Orders screen by clicking "Track Order" on your active delivery card.',
                            ),
                            _FaqItem(
                              question: 'How do I cancel an order?',
                              answer:
                                  'Orders can be cancelled before the store finishes packing your items. Go to Orders, select the order, and choose "Cancel Order".',
                            ),
                            _FaqItem(
                              question: 'What if an item is missing?',
                              answer:
                                  'If an item is missing from your delivered order, please chat with support using the button below to initiate an immediate replacement or full refund.',
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                      ],

                      // Section: WALLET & PAYMENTS
                      if (_selectedCategory == 'All' || _selectedCategory == 'Wallet & Payments') ...[
                        _buildSectionHeader('WALLET & PAYMENTS'),
                        _buildAccordionCard(
                          questions: [
                            _FaqItem(
                              question: 'How do I add money to Wallet?',
                              answer:
                                  'Navigate to Account > Fillcarts Money and tap "Top Up Wallet" using UPI, Debit Card, Credit Card, or Net Banking.',
                            ),
                            _FaqItem(
                              question: 'How long does a refund take?',
                              answer:
                                  'Wallet refunds are credited instantly. Bank and card refunds typically reflect in your account within 2–5 business days.',
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                      ],

                      // Section: ACCOUNT
                      if (_selectedCategory == 'All') ...[
                        _buildSectionHeader('ACCOUNT'),
                        _buildAccordionCard(
                          questions: [
                            _FaqItem(
                              question: 'How do I change my phone number?',
                              answer:
                                  'Open Account > Personal Info, edit your phone number, and click "Verify new number" to confirm via SMS OTP.',
                            ),
                            _FaqItem(
                              question: 'How do referrals work?',
                              answer:
                                  'Share your referral code from Account > Refer & Earn. When a friend places their first order, you both receive ₹100 wallet cashback!',
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                      ],
                    ],
                  ),
                ),
              ),

              // Bottom "Still need help?" Card
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFF1EEE6)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Still need help?',
                              style: TextStyle(
                                fontSize: 14.5,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1E1E1E),
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Chat with our support team',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Connecting to live support chat...'),
                              duration: Duration(milliseconds: 900),
                            ),
                          );
                        },
                        icon: const Icon(Icons.chat_bubble_outline_rounded, size: 16),
                        label: const Text('Chat'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF5A623),
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          textStyle: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 11.5,
          fontWeight: FontWeight.w800,
          color: Color(0xFF6B7280),
          letterSpacing: 0.8,
        ),
      ),
    );
  }

  Widget _buildFilterChip({
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF9BF15) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? const Color(0xFFF9BF15) : const Color(0xFFF1EEE6),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? const Color(0xFF1E1E1E) : const Color(0xFF6B7280),
            ),
            const SizedBox(width: 6),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: isSelected ? const Color(0xFF1E1E1E) : const Color(0xFF4B5563),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccordionCard({required List<_FaqItem> questions}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF1EEE6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: List.generate(questions.length, (idx) {
          final item = questions[idx];
          final isExpanded = _expandedQuestions.contains(item.question);
          final isLast = idx == questions.length - 1;

          return Column(
            children: [
              InkWell(
                onTap: () => _toggleQuestion(item.question),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          item.question,
                          style: const TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E1E1E),
                          ),
                        ),
                      ),
                      Icon(
                        isExpanded
                            ? Icons.keyboard_arrow_up_rounded
                            : Icons.keyboard_arrow_down_rounded,
                        size: 20,
                        color: const Color(0xFF6B7280),
                      ),
                    ],
                  ),
                ),
              ),
              if (isExpanded)
                Padding(
                  padding: const EdgeInsets.only(left: 16, right: 16, bottom: 14),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      item.answer,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                        height: 1.4,
                      ),
                    ),
                  ),
                ),
              if (!isLast) const Divider(height: 1, color: Color(0xFFF3F4F6)),
            ],
          );
        }),
      ),
    );
  }
}

class _FaqItem {
  final String question;
  final String answer;

  const _FaqItem({required this.question, required this.answer});
}
