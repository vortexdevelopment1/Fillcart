import 'package:equatable/equatable.dart';

sealed class AppStatusEvent extends Equatable {
  const AppStatusEvent();

  @override
  List<Object?> get props => [];
}

final class AppStatusStarted extends AppStatusEvent {
  const AppStatusStarted();
}

final class AppStatusRefreshed extends AppStatusEvent {
  const AppStatusRefreshed();
}

