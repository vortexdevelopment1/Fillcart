import 'dart:async';
import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/onboarding/onboarding.dart';
import 'package:flutter/material.dart';

/// Splash Screen for the Fillcart Vendor Mobile Application.
///
/// Displays the official centered Fillcart logo with a clean white backdrop,
/// matching the authoritative mobile design specifications.
class SplashScreen extends StatefulWidget {
  const SplashScreen({
    super.key,
    this.duration = const Duration(seconds: 2),
    this.nextScreen,
    this.onFinish,
  });

  /// Duration before navigating to the next screen or invoking [onFinish].
  final Duration duration;

  /// Optional destination screen to navigate to after [duration] elapses.
  /// Defaults to [OnboardingScreen].
  final Widget? nextScreen;

  /// Optional custom callback invoked when splash display duration elapses.
  /// If provided, default navigation is bypassed.
  final VoidCallback? onFinish;

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer(widget.duration, _onTimerElapsed);
  }

  void _onTimerElapsed() {
    if (!mounted) return;

    if (widget.onFinish != null) {
      widget.onFinish!();
      return;
    }

    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => widget.nextScreen ?? const OnboardingScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;
    // Proportional sizing matching the 192px / 360px (~53%) design ratio,
    // clamped between 160.0 and 240.0 for tablets and small devices.
    final logoSize = (screenWidth * 0.53).clamp(160.0, 240.0);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Image.asset(
            AppAssets.splashLogo,
            width: logoSize,
            height: logoSize,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              // If Flutter's asset manifest has not re-bundled yet during hot reload,
              // seamlessly render the authentic splash_logo.png from embedded bytes.
              return Image.memory(
                AppAssets.splashLogoBytes,
                width: logoSize,
                height: logoSize,
                fit: BoxFit.contain,
              );
            },
          ),
        ),
      ),
    );
  }
}
