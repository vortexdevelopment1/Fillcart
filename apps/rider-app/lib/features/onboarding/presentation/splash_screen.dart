import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../shared/constants/rider_colors.dart';

/// Splash screen displaying the original Fillcart Rider logo.
///
/// Implemented according to Figma Frame 1848:51661 ("Splash Screen").
class SplashScreen extends StatefulWidget {
  final Duration delay;

  const SplashScreen({super.key, this.delay = const Duration(seconds: 2)});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Timer? _timer;
  bool _navigated = false;

  @override
  void initState() {
    super.initState();
    if (widget.delay > Duration.zero) {
      _timer = Timer(widget.delay, _navigateToOnboarding);
    } else {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _navigateToOnboarding();
      });
    }
  }

  void _navigateToOnboarding() {
    if (!mounted || _navigated) return;
    _navigated = true;
    context.go('/onboarding');
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RiderColors.background,
      body: Center(
        child: Image.asset(
          'assets/logo/rider_logo.png',
          key: const Key('splash_rider_logo'),
          width: 192,
          height: 192,
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}
