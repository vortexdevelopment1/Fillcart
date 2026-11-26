import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../core/bloc/app_status_bloc.dart';
import '../features/onboarding/presentation/screens/splash_screen.dart';

/// Root widget for the Fillcart Customer Mobile Application.
class CustomerApp extends StatelessWidget {
  const CustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AppStatusBloc()..add(const AppStatusStarted()),
      child: MaterialApp(
        title: 'Fillcart Customer',
        debugShowCheckedModeBanner: false,
        theme: FCTheme.lightTheme.copyWith(
          colorScheme: FCTheme.lightTheme.colorScheme.copyWith(
            primary: const Color(0xFFF5B014),
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: Colors.white,
            foregroundColor: Color(0xFF212121),
            elevation: 0,
          ),
        ),
        darkTheme: FCTheme.darkTheme,
        themeMode: ThemeMode.light,
        home: const SplashScreen(),
      ),
    );
  }
}
