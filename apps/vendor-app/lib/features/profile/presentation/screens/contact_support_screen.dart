import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class ContactTopicItem {
  final String question;
  final String answer;

  ContactTopicItem({required this.question, required this.answer});
}

/// Screen for Contact Support & Help Topics.
/// Matches Figma design: Contact Support (Image 7).
class ContactSupportScreen extends StatefulWidget {
  const ContactSupportScreen({super.key});

  @override
  State<ContactSupportScreen> createState() => _ContactSupportScreenState();
}

class _ContactSupportScreenState extends State<ContactSupportScreen> {
  final TextEditingController _searchController = TextEditingController();
  int? _expandedIndex = 0; // Default first item expanded matching Image 7

  final List<ContactTopicItem> _allTopics = [
    ContactTopicItem(
      question: 'How do I update my store details?',
      answer:
          'Go to Profile > Store & Business Details and update the information. Click on \'Save Changes\' to keep the updates.',
    ),
    ContactTopicItem(
      question: 'Can I change my store logo?',
      answer:
          'Yes, you can update your store logo anytime from Profile > Edit Profile and tapping the edit pencil icon on your avatar.',
    ),
    ContactTopicItem(
      question: 'How do I add new products?',
      answer:
          'Navigate to the Inventory tab and click on \'Update Stock\' or the add product button at the top to configure items.',
    ),
    ContactTopicItem(
      question: 'What is the commission charge?',
      answer:
          'Commission charges depend on your product category and will be itemized in your weekly payout summaries under the Earnings tab.',
    ),
    ContactTopicItem(
      question: 'How can I track my orders?',
      answer:
          'Go to the Orders tab to track live incoming orders, preparing orders, out for delivery items, and completed orders in real time.',
    ),
    ContactTopicItem(
      question: 'Can I pause my shop temporarily?',
      answer:
          'Yes, you can toggle your shop status between Online and Offline anytime using the top bar switch on the Home dashboard.',
    ),
    ContactTopicItem(
      question: 'How do I contact support?',
      answer:
          'You can contact our vendor support team via 24/7 in-app chat, direct call at +91 98765 43210, or email at support@shopconnect.in.',
    ),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<ContactTopicItem> get _filteredTopics {
    final query = _searchController.text.trim().toLowerCase();
    if (query.isEmpty) return _allTopics;
    return _allTopics
        .where((topic) =>
            topic.question.toLowerCase().contains(query) ||
            topic.answer.toLowerCase().contains(query))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final topics = _filteredTopics;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF8FAFC),
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: SvgPicture.asset(
            AppAssets.svgBackArrow,
            width: 24,
            height: 24,
            colorFilter: const ColorFilter.mode(
              Color(0xFF111827),
              BlendMode.srcIn,
            ),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Contact Support',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827),
          ),
        ),
        centerTitle: false,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search Bar matching standard clean pill container
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: Container(
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: const Color(0xFFE5E7EB),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.03),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    SvgPicture.asset(
                      AppAssets.svgSearch,
                      width: 20,
                      height: 20,
                      colorFilter: const ColorFilter.mode(
                        Color(0xFF4B5563),
                        BlendMode.srcIn,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Theme(
                        data: Theme.of(context).copyWith(
                          inputDecorationTheme: const InputDecorationTheme(
                            filled: false,
                            fillColor: Colors.transparent,
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            disabledBorder: InputBorder.none,
                            errorBorder: InputBorder.none,
                            focusedErrorBorder: InputBorder.none,
                          ),
                        ),
                        child: TextField(
                          controller: _searchController,
                          onChanged: (_) => setState(() {}),
                          textAlignVertical: TextAlignVertical.center,
                          style: const TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14.5,
                            fontWeight: FontWeight.w400,
                            color: Color(0xFF111827),
                          ),
                          decoration: const InputDecoration(
                            hintText: 'Search help topics...',
                            hintStyle: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 14.5,
                              fontWeight: FontWeight.w400,
                              color: Color(0xFF4B5563),
                            ),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            disabledBorder: InputBorder.none,
                            errorBorder: InputBorder.none,
                            focusedErrorBorder: InputBorder.none,
                            filled: false,
                            fillColor: Colors.transparent,
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                          ),
                        ),
                      ),
                    ),
                    if (_searchController.text.isNotEmpty)
                      GestureDetector(
                        onTap: () {
                          _searchController.clear();
                          setState(() {});
                        },
                        child: const Icon(
                          Icons.close,
                          size: 18,
                          color: Color(0xFF9CA3AF),
                        ),
                      ),
                  ],
                ),
              ),
            ),

            // Topics List
            Expanded(
              child: topics.isEmpty
                  ? const Center(
                      child: Text(
                        'No matching topics found.',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 15,
                          color: Color(0xFF6B7280),
                        ),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                      itemCount: topics.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final item = topics[index];
                        final isExpanded = _expandedIndex == index;

                        return Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: const Color(0xFFE5E7EB),
                              width: 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.02),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Header
                              InkWell(
                                onTap: () {
                                  setState(() {
                                    if (isExpanded) {
                                      _expandedIndex = null;
                                    } else {
                                      _expandedIndex = index;
                                    }
                                  });
                                },
                                borderRadius: isExpanded
                                    ? const BorderRadius.only(
                                        topLeft: Radius.circular(16),
                                        topRight: Radius.circular(16),
                                      )
                                    : BorderRadius.circular(16),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isExpanded
                                        ? const Color(0xFFDDF884)
                                        : Colors.white,
                                    borderRadius: isExpanded
                                        ? const BorderRadius.only(
                                            topLeft: Radius.circular(15),
                                            topRight: Radius.circular(15),
                                          )
                                        : BorderRadius.circular(15),
                                  ),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          item.question,
                                          style: const TextStyle(
                                            fontFamily: 'Inter',
                                            fontSize: 14.5,
                                            fontWeight: FontWeight.w600,
                                            color: Color(0xFF111827),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Icon(
                                        isExpanded
                                            ? Icons.keyboard_arrow_up_rounded
                                            : Icons.keyboard_arrow_down_rounded,
                                        color: const Color(0xFF111827),
                                        size: 22,
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                              // Expanded Content Body
                              if (isExpanded)
                                Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.only(
                                      bottomLeft: Radius.circular(16),
                                      bottomRight: Radius.circular(16),
                                    ),
                                  ),
                                  child: Text(
                                    item.answer,
                                    style: const TextStyle(
                                      fontFamily: 'Inter',
                                      fontSize: 13.5,
                                      height: 1.45,
                                      color: Color(0xFF4B5563),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
