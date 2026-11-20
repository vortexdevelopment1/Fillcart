import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../core/bloc/app_status_bloc.dart';
import '../features/navigation/presentation/screens/main_vendor_screen.dart';
import '../features/splash/splash.dart';

/// Root widget for the Fillcart Vendor Mobile Application.
class VendorApp extends StatelessWidget {
  const VendorApp({
    super.key,
    this.home,
    this.enableSplash,
  });

  /// Optional override for the home screen (primarily for testing and previews).
  final Widget? home;

  /// Controls whether the splash screen is shown on boot. Defaults to true.
  final bool? enableSplash;

  @override
  Widget build(BuildContext context) {
    final showSplash = enableSplash ?? true;

    return BlocProvider(
      create: (context) => AppStatusBloc()..add(const AppStatusStarted()),
      child: MaterialApp(
        title: 'Fillcart Vendor',
        debugShowCheckedModeBanner: false,
        theme: FCTheme.lightTheme,
        darkTheme: FCTheme.darkTheme,
        themeMode: ThemeMode.system,
        home: home ??
            (showSplash
                ? const SplashScreen()
                : const MainVendorScreen()),
      ),
    );
  }
}
