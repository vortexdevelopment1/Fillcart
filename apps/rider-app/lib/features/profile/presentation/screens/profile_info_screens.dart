import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../shared/constants/rider_colors.dart';
import '../../bloc/profile_bloc.dart';
import '../widgets/profile_theme_constants.dart';

/// FAQ's Screen matching Figma FAQ's design with live search & yellow expanded headers.
class FaqScreen extends StatefulWidget {
  const FaqScreen({super.key});

  @override
  State<FaqScreen> createState() => _FaqScreenState();
}

class _FaqScreenState extends State<FaqScreen> {
  static const List<({String question, String answer})> _faqs = [
    (
      question: 'When will I receive my earnings?',
      answer:
          'Your earnings are settled according to your payout schedule. You can check the Earnings section for the next settlement date and payment status.',
    ),
    (
      question: 'How do I accept a new order?',
      answer:
          'When a new delivery request arrives, review the pickup and drop location details and tap Accept before the countdown timer expires.',
    ),
    (
      question: 'What happens if I miss an order request?',
      answer:
          'Missed requests are automatically reassigned to another nearby rider. Keep your app online and notifications enabled so you never miss one.',
    ),
    (
      question: 'Can I see multiple pickups and drops in one order?',
      answer:
          'Yes. Multi-stop orders clearly display every pickup and drop stop in sequence on the active delivery screen.',
    ),
    (
      question: 'How do I contact support?',
      answer:
          'You can reach rider support anytime from Profile -> Contact Support to start a guided support chat.',
    ),
  ];

  final TextEditingController _searchController = TextEditingController();
  int? _expandedIndex = 0;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.trim().toLowerCase();
    final filtered = _faqs
        .where(
          (item) =>
              query.isEmpty ||
              item.question.toLowerCase().contains(query) ||
              item.answer.toLowerCase().contains(query),
        )
        .toList();

    return Scaffold(
      key: const Key('faq_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            const ProfileScreenHeader(title: "FAQ’s"),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 14),
              child: Container(
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x08000000),
                      blurRadius: 6,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: TextField(
                  key: const Key('faq_search_field'),
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  style: GoogleFonts.poppins(
                    fontSize: 13.5,
                    color: Colors.black,
                  ),
                  decoration: InputDecoration(
                    hintText: 'Search help topics...',
                    hintStyle: GoogleFonts.poppins(
                      fontSize: 13.5,
                      color: ProfileTokens.textSecondary,
                    ),
                    prefixIcon: const Icon(
                      Icons.search,
                      color: Color(0xFF4B5563),
                      size: 20,
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
            ),
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Text(
                        'No matching help topics found.',
                        style: GoogleFonts.poppins(
                          fontSize: 13.5,
                          color: ProfileTokens.textSecondary,
                        ),
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                      itemCount: filtered.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final item = filtered[index];
                        final originalIndex = _faqs.indexOf(item);
                        final isExpanded = _expandedIndex == originalIndex;
                        return ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            key: Key('faq_item_$originalIndex'),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x0A000000),
                                  blurRadius: 6,
                                  offset: Offset(0, 2),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                InkWell(
                                  onTap: () {
                                    setState(() {
                                      _expandedIndex = isExpanded
                                          ? null
                                          : originalIndex;
                                    });
                                  },
                                  child: Container(
                                    color: isExpanded
                                        ? RiderColors.primaryYellow
                                        : Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 15,
                                    ),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            item.question,
                                            style: GoogleFonts.poppins(
                                              fontSize: 13.5,
                                              fontWeight: FontWeight.w500,
                                              color: Colors.black,
                                              height: 1.35,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 10),
                                        AnimatedRotation(
                                          turns: isExpanded ? 0.5 : 0,
                                          duration: const Duration(
                                            milliseconds: 200,
                                          ),
                                          child: SvgPicture.asset(
                                            'assets/svg/bottom_arrow.svg',
                                            width: 14,
                                            height: 14,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                if (isExpanded)
                                  Padding(
                                    padding: const EdgeInsets.fromLTRB(
                                      16,
                                      14,
                                      16,
                                      16,
                                    ),
                                    child: Text(
                                      item.answer,
                                      style: GoogleFonts.poppins(
                                        fontSize: 12.5,
                                        color: ProfileTokens.textSecondary,
                                        height: 1.5,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
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

class _SupportChatEntry {
  final bool isUser;
  final String text;
  final String time;
  final List<String> options;

  const _SupportChatEntry({
    required this.isUser,
    required this.text,
    this.time = '',
    this.options = const [],
  });
}

/// Contact Support Screen matching Figma conversational Support Chat screen.
class ContactSupportScreen extends StatefulWidget {
  const ContactSupportScreen({super.key});

  @override
  State<ContactSupportScreen> createState() => _ContactSupportScreenState();
}

class _ContactSupportScreenState extends State<ContactSupportScreen> {
  static const List<String> _pickupIssues = [
    'Restaurant is closed',
    'Order not ready',
    'Item unavailable',
    'Long waiting time',
    'Wrong order received',
    'Restaurant refusing handover',
    'Other issue',
  ];

  late List<_SupportChatEntry> _messages;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _messages = _initialMessages();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  List<_SupportChatEntry> _initialMessages() => [
    const _SupportChatEntry(
      isUser: false,
      text: "What's the issue at pickup?",
      time: '3:36 PM',
      options: _pickupIssues,
    ),
    const _SupportChatEntry(
      isUser: true,
      text: 'Restaurant is closed',
      time: '3:36 PM',
    ),
    const _SupportChatEntry(
      isUser: false,
      text:
          "We couldn't complete the pickup because the restaurant appears to be closed.",
      time: '3:36 PM',
      options: ['Take Photo', 'Call Restaurant', 'Contact Support'],
    ),
  ];

  String _botReplyForOption(String option) {
    return switch (option) {
      'Restaurant is closed' =>
        "We couldn't complete the pickup because the restaurant appears to be closed.",
      'Order not ready' =>
        'Please wait up to 5 minutes at the counter or notify dispatch if the delay continues.',
      'Item unavailable' =>
        'Please ask the store staff for a replacement or contact support to update the order.',
      'Long waiting time' =>
        'We have logged the pickup wait time. You can contact support if wait exceeds 10 minutes.',
      'Wrong order received' =>
        'Do not confirm pickup. Verify the order ID with staff or escalate to support.',
      'Restaurant refusing handover' =>
        'Our support team can intervene with the partner store right away.',
      'Other issue' =>
        'Please share a photo or connect directly with an agent for immediate help.',
      'Take Photo' =>
        'Camera ready — upload a clear storefront photo to complete closure verification.',
      'Call Restaurant' =>
        'Connecting you to the restaurant contact number...',
      'Contact Support' =>
        'Connecting you to a live Fillcart support specialist now.',
      _ => 'Support has noted "$option". An agent will assist shortly.',
    };
  }

  void _handleOptionTap(String option) {
    if (option == 'Take Photo' ||
        option == 'Call Restaurant' ||
        option == 'Contact Support') {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            _botReplyForOption(option),
            style: GoogleFonts.poppins(fontSize: 13),
          ),
          backgroundColor: RiderColors.onSurfaceDark,
          behavior: SnackBarBehavior.floating,
          duration: const Duration(seconds: 2),
        ),
      );
      return;
    }

    setState(() {
      _messages.add(
        _SupportChatEntry(isUser: true, text: option, time: '3:36 PM'),
      );
      _messages.add(
        _SupportChatEntry(
          isUser: false,
          text: _botReplyForOption(option),
          time: '3:36 PM',
          options: const ['Take Photo', 'Call Restaurant', 'Contact Support'],
        ),
      );
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _endChat() {
    if (context.canPop()) {
      context.pop();
      return;
    }
    setState(() {
      _messages = _initialMessages();
    });
  }

  @override
  Widget build(BuildContext context) {
    String firstName = 'Dhoni';
    try {
      final fullName = context.watch<ProfileBloc>().state.profile.fullName;
      final parts = fullName.trim().split(RegExp(r'\s+'));
      if (parts.isNotEmpty && parts.last.isNotEmpty) {
        firstName = parts.last;
      }
    } catch (_) {}

    return Scaffold(
      key: const Key('contact_support_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            ProfileScreenHeader(
              title: 'Contact Support',
              trailing: TextButton(
                key: const Key('support_end_chat_button'),
                onPressed: _endChat,
                child: Text(
                  'End chat',
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF6B5E00),
                  ),
                ),
              ),
            ),
            Expanded(
              child: ListView(
                controller: _scrollController,
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                children: [
                  Center(
                    child: Text(
                      'Today',
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: Colors.black,
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 260),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        "Hi $firstName! I’m here to help you with your pickup.",
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          color: Colors.black,
                          height: 1.45,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  for (final msg in _messages) ...[
                    if (msg.isUser)
                      Align(
                        alignment: Alignment.centerRight,
                        child: Container(
                          constraints: const BoxConstraints(maxWidth: 220),
                          padding: const EdgeInsets.fromLTRB(14, 12, 14, 10),
                          decoration: BoxDecoration(
                            color: Colors.black,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                msg.text,
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  color: Colors.white,
                                ),
                              ),
                              if (msg.time.isNotEmpty) ...[
                                const SizedBox(height: 6),
                                Text(
                                  msg.time,
                                  style: GoogleFonts.poppins(
                                    fontSize: 11,
                                    color: const Color(0xFFD1D5DB),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      )
                    else
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Container(
                          constraints: const BoxConstraints(maxWidth: 265),
                          padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                msg.text,
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  color: Colors.black,
                                  height: 1.45,
                                ),
                              ),
                              if (msg.options.isNotEmpty) ...[
                                const SizedBox(height: 12),
                                Wrap(
                                  direction: Axis.vertical,
                                  spacing: 8,
                                  children: msg.options
                                      .map(
                                        (opt) => InkWell(
                                          onTap: () => _handleOptionTap(opt),
                                          borderRadius: BorderRadius.circular(
                                            10,
                                          ),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 8,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                              border: Border.all(
                                                color: ProfileTokens.divider,
                                              ),
                                            ),
                                            child: Text(
                                              opt,
                                              style: GoogleFonts.poppins(
                                                fontSize: 12.5,
                                                fontWeight: FontWeight.w400,
                                                color: Colors.black,
                                              ),
                                            ),
                                          ),
                                        ),
                                      )
                                      .toList(),
                                ),
                              ],
                              if (msg.time.isNotEmpty) ...[
                                const SizedBox(height: 8),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: Text(
                                    msg.time,
                                    style: GoogleFonts.poppins(
                                      fontSize: 11,
                                      color: ProfileTokens.textSecondary,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    const SizedBox(height: 14),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// About App Screen matching Figma About App design.
class AboutAppScreen extends StatelessWidget {
  const AboutAppScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('about_app_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            const ProfileScreenHeader(title: 'About App'),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 36, 24, 24),
                child: Column(
                  children: [
                    Container(
                      width: 98,
                      height: 98,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x0A000000),
                            blurRadius: 8,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Image.asset(
                        'assets/logo/rider_logo.png',
                        fit: BoxFit.contain,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Fillcarts',
                      style: GoogleFonts.poppins(
                        fontSize: 17,
                        fontWeight: FontWeight.w500,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Version 1.0.0',
                      style: GoogleFonts.poppins(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF4B5563),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Fillcarts is a hyperlocal delivery platform that connects customers with nearby stores and enables fast and reliable deliveries through trusted delivery partners.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 13.5,
                        color: ProfileTokens.textSecondary,
                        height: 1.55,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Privacy Policy Screen accessible from Profile -> About App -> Privacy Policy.
class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('privacy_policy_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            const ProfileScreenHeader(title: 'Privacy Policy'),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Image.asset(
                          'assets/icons/profile_privacypolicy.png',
                          width: 96,
                          height: 96,
                          fit: BoxFit.contain,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Your Data & Security',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Fillcart collects only the information necessary to verify your rider account, assign nearby deliveries, and settle payouts safely to your linked bank account.',
                        style: GoogleFonts.poppins(
                          fontSize: 13.5,
                          color: const Color(0xFF4B5563),
                          height: 1.55,
                        ),
                      ),
                      const SizedBox(height: 14),
                      Text(
                        'Location Usage',
                        style: GoogleFonts.poppins(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Location access is used while you are online to match nearby orders and provide live delivery tracking to customers.',
                        style: GoogleFonts.poppins(
                          fontSize: 13.5,
                          color: const Color(0xFF4B5563),
                          height: 1.55,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
