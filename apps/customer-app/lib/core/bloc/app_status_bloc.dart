import 'package:flutter_bloc/flutter_bloc.dart';
import 'app_status_event.dart';
import 'app_status_state.dart';

export 'app_status_event.dart';
export 'app_status_state.dart';

/// Foundation BLoC managing application lifecycle readiness and diagnostics for Customer App.
class AppStatusBloc extends Bloc<AppStatusEvent, AppStatusState> {
  AppStatusBloc() : super(const AppStatusInitial()) {
    on<AppStatusStarted>(_onStarted);
    on<AppStatusRefreshed>(_onRefreshed);
  }

  void _onStarted(AppStatusStarted event, Emitter<AppStatusState> emit) {
    emit(
      AppStatusReady(
        appName: 'Fillcart Customer',
        version: '0.0.1',
        environment: 'development',
        initializedAt: DateTime.now(),
      ),
    );
  }

  void _onRefreshed(AppStatusRefreshed event, Emitter<AppStatusState> emit) {
    emit(
      AppStatusReady(
        appName: 'Fillcart Customer',
        version: '0.0.1',
        environment: 'development',
        initializedAt: DateTime.now(),
      ),
    );
  }
}

