import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../features/authentication/bloc/auth_bloc.dart';
import '../features/authentication/data/mock_auth_repository.dart';
import '../features/kyc/bloc/kyc_bloc.dart';
import '../features/profile/bloc/profile_bloc.dart';
import '../shared/theme/rider_theme.dart';
import 'router/app_router.dart';

/// Root widget for the Fillcart Rider Application.
class RiderApp extends StatefulWidget {
  final AuthRepository? authRepository;
  final KycBloc? kycBloc;
  final ProfileBloc? profileBloc;
  final GoRouter? router;
  final String? initialLocation;

  const RiderApp({
    super.key,
    this.authRepository,
    this.kycBloc,
    this.profileBloc,
    this.router,
    this.initialLocation,
  });

  @override
  State<RiderApp> createState() => _RiderAppState();
}

class _RiderAppState extends State<RiderApp> {
  late final GoRouter _router;
  late final AuthBloc _authBloc;
  late final KycBloc _kycBloc;
  late final ProfileBloc _profileBloc;

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
    _kycBloc = widget.kycBloc ?? KycBloc();
    _profileBloc = widget.profileBloc ?? ProfileBloc();
  }

  @override
  void dispose() {
    _authBloc.close();
    if (widget.kycBloc == null) {
      _kycBloc.close();
    }
    if (widget.profileBloc == null) {
      _profileBloc.close();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider.value(value: _authBloc),
        BlocProvider.value(value: _kycBloc),
        BlocProvider.value(value: _profileBloc),
      ],
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
