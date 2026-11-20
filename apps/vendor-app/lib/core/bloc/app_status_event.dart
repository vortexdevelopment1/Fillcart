import 'package:equatable/equatable.dart';

/// Base class for application lifecycle and diagnostic status events.
sealed class AppStatusEvent extends Equatable {
  const AppStatusEvent();

  @override
  List<Object?> get props => [];
}

/// Dispatched upon application startup to initialize baseline diagnostics.
final class AppStatusStarted extends AppStatusEvent {
  const AppStatusStarted();
}

/// Dispatched to refresh runtime diagnostic status.
final class AppStatusRefreshed extends AppStatusEvent {
  const AppStatusRefreshed();
}
