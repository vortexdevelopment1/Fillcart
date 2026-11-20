import 'package:equatable/equatable.dart';

/// Base class for application lifecycle and diagnostic status states.
sealed class AppStatusState extends Equatable {
  const AppStatusState();

  @override
  List<Object?> get props => [];
}

/// Initial uninitialized status before the startup sequence executes.
final class AppStatusInitial extends AppStatusState {
  const AppStatusInitial();
}

/// Status representing a successfully initialized application foundation.
final class AppStatusReady extends AppStatusState {
  const AppStatusReady({
    required this.appName,
    required this.version,
    required this.environment,
    required this.initializedAt,
  });

  final String appName;
  final String version;
  final String environment;
  final DateTime initializedAt;

  @override
  List<Object?> get props => [appName, version, environment, initializedAt];
}
