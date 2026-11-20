import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../features/authentication/bloc/auth_bloc.dart';
import '../features/authentication/data/mock_auth_repository.dart';
import '../shared/theme/rider_theme.dart';
import 'router/app_router.dart';

/// Root widget for the Fillcart Rider Application.
class RiderApp extends StatefulWidget {
  final AuthRepository? authRepository;
  final GoRouter? router;
  final String? initialLocation;

  const RiderApp({
    super.key,
    this.authRepository,
    this.router,
    this.initialLocation,
  });

  @override
  State<RiderApp> createState() => _RiderAppState();
}

class _RiderAppState extends State<RiderApp> {
  late final GoRouter _router;
  late final AuthBloc _authBloc;

  @override
  void initState() {
    super.initState();
    _router =
        widget.router ??
        AppRouter.createRouter(
          initialLocation: widget.initialLocation ?? '/splash',
        );
    _authBloc = AuthBloc(
      repository: widget.authRepository ?? const MockAuthRepository(),
    );
  }

  @override
  void dispose() {
    _authBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _authBloc,
      child: MaterialApp.router(
        title: 'Fillcart Rider',
        debugShowCheckedModeBanner: false,
        theme: RiderTheme.lightTheme,
        darkTheme: RiderTheme.darkTheme,
        themeMode: ThemeMode.light,
        routerConfig: _router,
      ),
    );
  }
}
