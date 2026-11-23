import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:fillcart_vendor/core/constants/app_assets.dart';

/// Screen allowing vendors to submit issues regarding an order (wrong item, payout, rider, etc.)
/// Matches screenshot design with radio option card, problem description input, and submit action.
class ReportIssuesScreen extends StatefulWidget {
  const ReportIssuesScreen({
    super.key,
    this.orderId,
  });

  final String? orderId;

  @override
  State<ReportIssuesScreen> createState() => _ReportIssuesScreenState();
}

class _ReportIssuesScreenState extends State<ReportIssuesScreen> {
  final TextEditingController _descriptionController = TextEditingController();

  final List<String> _issueOptions = const [
    'Wrong or missing item',
    'Payment or payout problem',
    'Rider problem',
    'Customer problem',
    'Something else',
  ];

  late String _selectedIssue;

  static const Color darkCharcoal = Color(0xFF111827);

  @override
  void initState() {
    super.initState();
    _selectedIssue = _issueOptions.first;
  }

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  void _submitReport() {
    final orderPrefix =
        widget.orderId != null ? ' for ${widget.orderId}' : '';

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Issue report$orderPrefix submitted. Our support team will assist you shortly.',
          style: const TextStyle(fontFamily: 'Inter'),
        ),
        backgroundColor: const Color(0xFF111827),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F5F7),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF4F5F7),
        elevation: 0,
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
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Report Issues',
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
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Section 1: What went wrong?
                    const Text(
                      'What went wrong?',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Radio options card
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: List.generate(_issueOptions.length, (index) {
                          final option = _issueOptions[index];
                          final isSelected = _selectedIssue == option;
                          final isLast = index == _issueOptions.length - 1;

                          return Column(
                            children: [
                              InkWell(
                                onTap: () {
                                  setState(() {
                                    _selectedIssue = option;
                                  });
                                },
                                borderRadius: BorderRadius.vertical(
                                  top: index == 0
                                      ? const Radius.circular(16)
                                      : Radius.zero,
                                  bottom: isLast
                                      ? const Radius.circular(16)
                                      : Radius.zero,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 14,
                                  ),
                                  child: Row(
                                    children: [
                                      // Custom Radio Indicator
                                      Container(
                                        width: 22,
                                        height: 22,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: isSelected
                                                ? const Color(0xFF111827)
                                                : const Color(0xFF94A3B8),
                                            width: 1.8,
                                          ),
                                        ),
                                        child: isSelected
                                            ? Center(
                                                child: Container(
                                                  width: 11,
                                                  height: 11,
                                                  decoration:
                                                      const BoxDecoration(
                                                    shape: BoxShape.circle,
                                                    color: Color(0xFF111827),
                                                  ),
                                                ),
                                              )
                                            : null,
                                      ),
                                      const SizedBox(width: 14),
                                      Expanded(
                                        child: Text(
                                          option,
                                          style: const TextStyle(
                                            fontFamily: 'Inter',
                                            fontSize: 15,
                                            fontWeight: FontWeight.w400,
                                            color: Color(0xFF111827),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              if (!isLast)
                                const Divider(
                                  color: Color(0xFFF1F5F9),
                                  height: 1,
                                  thickness: 1,
                                  indent: 16,
                                  endIndent: 16,
                                ),
                            ],
                          );
                        }),
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Section 2: Describe the problem
                    const Text(
                      'Describe the problem',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 14,
                        fontWeight: FontWeight.w400,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Text Area Input
                    Container(
                      height: 96,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: const Color(0xFFE2E8F0),
                          width: 1,
                        ),
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      child: TextField(
                        controller: _descriptionController,
                        maxLines: null,
                        expands: true,
                        textAlignVertical: TextAlignVertical.top,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: Color(0xFF111827),
                        ),
                        decoration: const InputDecoration(
                          hintText: 'Tell us what happened',
                          hintStyle: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            color: Color(0xFF94A3B8),
                          ),
                          border: InputBorder.none,
                          isDense: true,
                          contentPadding: EdgeInsets.zero,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Submit Report Button
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _submitReport,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: darkCharcoal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(28),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Submit report',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
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
