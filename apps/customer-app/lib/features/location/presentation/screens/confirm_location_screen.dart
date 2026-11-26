import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:fillcart_customer/features/home/presentation/screens/customer_home_screen.dart';
import 'package:fillcart_customer/features/location/presentation/widgets/location_map_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Screen confirming the user's detected location, matching Figma design.
class ConfirmLocationScreen extends StatefulWidget {
  final String addressLine;
  final String cityStateZip;

  const ConfirmLocationScreen({
    super.key,
    this.addressLine = '56, MG Road, Indore,',
    this.cityStateZip = 'Madhya Pradesh 452001',
  });

  @override
  State<ConfirmLocationScreen> createState() => _ConfirmLocationScreenState();
}

class _ConfirmLocationScreenState extends State<ConfirmLocationScreen> {
  void _onDeliverHere() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute<void>(builder: (_) => const CustomerHomeScreen()),
      (route) => false,
    );
  }

  void _onChangeLocation() {
    Navigator.of(context).maybePop();
  }

  void _onClose() {
    Navigator.of(context).maybePop();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: Colors.white,
        body: Stack(
          children: [
            // Map background with accuracy radius circle
            const Positioned.fill(
              child: LocationMapView(isAccuracyMode: true),
            ),

            // Top Bar: Close (X) button at top-right
            Positioned(
              top: 0,
              right: 0,
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: GestureDetector(
                    onTap: _onClose,
                    behavior: HitTestBehavior.opaque,
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      child: const Icon(
                        Icons.close,
                        color: Color(0xFF1F1F1F),
                        size: 24,
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Bottom Column containing the Locate FAB and the Floating White Card
            Align(
              alignment: Alignment.bottomCenter,
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.only(left: 21, right: 21, bottom: 20),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      // Locate FAB button floating above the card
                      Padding(
                        padding: const EdgeInsets.only(bottom: 14),
                        child: GestureDetector(
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Re-centering location...'),
                                duration: Duration(milliseconds: 600),
                              ),
                            );
                          },
                          behavior: HitTestBehavior.opaque,
                          child: Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.14),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            alignment: Alignment.center,
                            child: Image.asset(
                              AppAssets.locateFab,
                              width: 40,
                              height: 40,
                              errorBuilder: (_, _, _) => const Icon(
                                Icons.my_location,
                                color: Colors.black,
                                size: 24,
                              ),
                            ),
                          ),
                        ),
                      ),

                      // Bottom Floating White Confirmation Card
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.10),
                              blurRadius: 28,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.fromLTRB(22, 26, 22, 22),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Title
                            const Text(
                              'Is this your current location?',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF1F1F1F),
                                letterSpacing: -0.3,
                              ),
                            ),

                            const SizedBox(height: 14),

                            // Formatted Delivery Address
                            Text(
                              '${widget.addressLine}\n${widget.cityStateZip}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF1F1F1F),
                                height: 1.35,
                              ),
                            ),

                            const SizedBox(height: 14),

                            // Accuracy Indicator
                            const Row(
                              children: [
                                CircleAvatar(
                                  radius: 4,
                                  backgroundColor: Color(0xFF4361EE),
                                ),
                                SizedBox(width: 8),
                                Text(
                                  'Accuracy: High',
                                  style: TextStyle(
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w400,
                                    color: Color(0xFF6B7280),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 22),

                            // Primary Action Button (Yes, Deliver Here)
                            GestureDetector(
                              onTap: _onDeliverHere,
                              behavior: HitTestBehavior.opaque,
                              child: Container(
                                height: 56,
                                width: double.infinity,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF5B014),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  'Yes, Deliver Here',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.black,
                                    letterSpacing: -0.2,
                                  ),
                                ),
                              ),
                            ),

                            const SizedBox(height: 18),

                            // Secondary Action Button (Change Location)
                            GestureDetector(
                              onTap: _onChangeLocation,
                              behavior: HitTestBehavior.opaque,
                              child: const Center(
                                child: Text(
                                  'Change Location',
                                  style: TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF1F1F1F),
                                    letterSpacing: -0.2,
                                  ),
                                ),
                              ),
                            ),
                          ],
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
