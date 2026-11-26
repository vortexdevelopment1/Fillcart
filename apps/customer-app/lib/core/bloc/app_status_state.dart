import 'package:equatable/equatable.dart';

sealed class AppStatusState extends Equatable {
  const AppStatusState();

  @override
  List<Object?> get props => [];
}

final class AppStatusInitial extends AppStatusState {
  const AppStatusInitial();
}

final class AppStatusReady extends AppStatusState {
  final String appName;
  final String version;
  final String environment;
  final DateTime initializedAt;

  const AppStatusReady({
    required this.appName,
    required this.version,
    required this.environment,
    required this.initializedAt,
  });

  @override
  List<Object?> get props => [appName, version, environment, initializedAt];
}

