import 'dart:typed_data';
import 'package:fillcart_vendor/core/constants/app_assets.dart';

/// Data model representing a single onboarding slide.
class OnboardingItem {
  final String title;
  final String description;
  final String imagePath;
  final Uint8List fallbackBytes;

  const OnboardingItem({
    required this.title,
    required this.description,
    required this.imagePath,
    required this.fallbackBytes,
  });

  /// The standard three onboarding items matching the vendor app design.
  static List<OnboardingItem> get defaultItems => [
        OnboardingItem(
          title: 'Open your\ndigital store',
          description:
              'Take your shop online and reach more customers in your city with fillcarts.',
          imagePath: AppAssets.onboarding1,
          fallbackBytes: AppAssets.onboarding1Bytes,
        ),
        OnboardingItem(
          title: 'Manage your\nstore with ease.',
          description:
              'Add products, track orders and keep your inventory up to date, all in one place.',
          imagePath: AppAssets.onboarding2,
          fallbackBytes: AppAssets.onboarding2Bytes,
        ),
        OnboardingItem(
          title: 'Track earnings,\nget paid weekly',
          description:
              'See your daily earnings, track settlements and receive payouts directly to your bank, every week.',
          imagePath: AppAssets.onboarding3,
          fallbackBytes: AppAssets.onboarding3Bytes,
        ),
      ];
}
