import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Terms of Service Screen matching Figma reference media_1795674115262_65be187f.png.
class TermsOfServiceScreen extends StatefulWidget {
  const TermsOfServiceScreen({super.key});

  @override
  State<TermsOfServiceScreen> createState() => _TermsOfServiceScreenState();
}

class _TermsOfServiceScreenState extends State<TermsOfServiceScreen> {
  final Set<int> _expandedSections = {0};

  final List<_PolicySection> _sections = const [
    _PolicySection(
      title: '1. Use of the App',
      content:
          'You must be at least 18 years of age or possess legal parental consent to use FillCarts. You agree to use the service in compliance with all relevant local rules and regulations.',
    ),
    _PolicySection(
      title: '2. Orders & Payments',
      content:
          'All orders placed through FillCarts are subject to inventory confirmation and item availability. Payment can be completed using secure cards, net banking, or verified UPI gateways.',
    ),
    _PolicySection(
      title: '3. User Responsibilities',
      content:
          'Users are responsible for safeguarding their login credentials and ensuring accurate delivery addresses and contact information are provided for orders.',
    ),
    _PolicySection(
      title: '4. Limitation of Liability',
      content:
          'FillCarts strives for highest delivery accuracy but is not liable for indirect or consequential damages arising from unforeseen technical delays or weather disruptions.',
    ),
    _PolicySection(
      title: '5. Changes to Terms',
      content:
          'We reserve the right to revise these terms periodically. Continued use of FillCarts following updates constitutes your acceptance of the revised terms.',
    ),
  ];

  void _toggle(int index) {
    setState(() {
      if (_expandedSections.contains(index)) {
        _expandedSections.remove(index);
      } else {
        _expandedSections.add(index);
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
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 10),

                // Top Header
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
                      'Terms of Service',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1E1E1E),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Top Illustration
                Center(
                  child: Container(
                    width: 140,
                    height: 140,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFFBEB),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFF5A623).withValues(alpha: 0.1),
                          blurRadius: 18,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Image.asset(
                      'assets/images/terms_illustration.png',
                      width: 110,
                      height: 110,
                      fit: BoxFit.contain,
                      errorBuilder: (_, _, _) => const Icon(
                        Icons.description_outlined,
                        size: 60,
                        color: Color(0xFFF5A623),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Title & Subtitle
                const Text(
                  'Terms of Service',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E1E1E),
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Last updated: 24 Nov 2026',
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF9CA3AF),
                  ),
                ),
                const SizedBox(height: 12),

                // Intro paragraph
                const Text(
                  'These Terms of Service govern your use of the FillCarts app and services. By using FillCarts, you agree to these terms.',
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF4B5563),
                    height: 1.45,
                  ),
                ),
                const SizedBox(height: 20),

                // Accordion items
                ...List.generate(_sections.length, (idx) {
                  final section = _sections[idx];
                  final isExpanded = _expandedSections.contains(idx);

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFF1EEE6)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        InkWell(
                          onTap: () => _toggle(idx),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    section.title,
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
                            child: Text(
                              section.content,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF6B7280),
                                height: 1.45,
                              ),
                            ),
                          ),
                      ],
                    ),
                  );
                }),
                const SizedBox(height: 28),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PolicySection {
  final String title;
  final String content;

  const _PolicySection({required this.title, required this.content});
}
