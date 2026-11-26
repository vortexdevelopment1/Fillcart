import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Minimal temporary placeholder route for `/multi-order` in Batch 3.1.
///
/// Full 14-screen Multi-Order workflow implementation is deferred to Batch 3.2.
class MultiOrderPlaceholderScreen extends StatelessWidget {
  const MultiOrderPlaceholderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('multi_order_placeholder_screen'),
      backgroundColor: const Color(0xFFF3F4E5),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Multi-Order Workflow',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF1B1C17),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Temporary Batch 3.1 route placeholder. The full Multi-Order screens will be implemented in Batch 3.2.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF555555),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
