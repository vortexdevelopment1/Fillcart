import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../core/bloc/app_status_bloc.dart';
import '../features/navigation/presentation/screens/main_vendor_screen.dart';

/// Root widget for the Fillcart Vendor Mobile Application.
class VendorApp extends StatelessWidget {
  const VendorApp({super.key, this.home});

  final Widget? home;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AppStatusBloc()..add(const AppStatusStarted()),
      child: MaterialApp(
        title: 'Fillcart Vendor',
        debugShowCheckedModeBanner: false,
        theme: FCTheme.lightTheme,
        darkTheme: FCTheme.darkTheme,
        themeMode: ThemeMode.system,
        home: home ?? const MainVendorScreen(),
      ),
    );
  }
}
