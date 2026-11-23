import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// Screen for displaying Privacy Policy, Terms of Service and App information.
class PrivacyAboutScreen extends StatelessWidget {
  const PrivacyAboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
          'Privacy & About',
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // App Info Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
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
                  children: [
                    // Cards Icon - 48x48
                    Image.asset(
                      AppAssets.cardPrivacy,
                      width: 48,
                      height: 48,
                      fit: BoxFit.contain,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Fillcart Vendor',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Version 1.0.0 (Build 102)',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Section: Privacy Policy
              const Text(
                'Privacy Policy',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFFE5E7EB),
                    width: 1,
                  ),
                ),
                child: const Text(
                  'Fillcart respects and protects the confidentiality of your store and account information. Personal data, business documents, banking records, and catalog listings are encrypted and used solely for authenticating your merchant identity, delivering customer orders, and processing secure weekly payouts.\n\nWe never share your proprietary data with unauthorized third parties. For comprehensive guidelines or data inquiries, reach out to privacy@fillcart.com.',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13.5,
                    height: 1.5,
                    color: Color(0xFF4B5563),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Section: Terms of Service
              const Text(
                'Terms of Service',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827),
                ),
              ),
              const SizedBox(height: 10),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFFE5E7EB),
                    width: 1,
                  ),
                ),
                child: const Text(
                  'By operating as a registered vendor on Fillcart, you agree to fulfill orders accurately, adhere to freshness and packaging standards, maintain truthful catalog inventories, and abide by agreed delivery handover timelines.\n\nPayouts are disbursed every weekly settlement cycle directly to your verified bank account.',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13.5,
                    height: 1.5,
                    color: Color(0xFF4B5563),
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
