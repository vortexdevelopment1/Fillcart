import 'package:bloc_test/bloc_test.dart';
import 'package:fillcart_vendor/core/bloc/app_status_bloc.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('AppStatusBloc Unit Tests', () {
    test('initial state is AppStatusInitial', () {
      final bloc = AppStatusBloc();
      expect(bloc.state, equals(const AppStatusInitial()));
      bloc.close();
    });

    blocTest<AppStatusBloc, AppStatusState>(
      'emits AppStatusReady when AppStatusStarted is added',
      build: () => AppStatusBloc(),
      act: (bloc) => bloc.add(const AppStatusStarted()),
      expect: () => [
        isA<AppStatusReady>()
            .having((s) => s.appName, 'appName', 'Fillcart Vendor')
            .having((s) => s.version, 'version', '0.0.1')
            .having((s) => s.environment, 'environment', 'development'),
      ],
    );

    blocTest<AppStatusBloc, AppStatusState>(
      'emits AppStatusReady when AppStatusRefreshed is added',
      build: () => AppStatusBloc(),
      act: (bloc) => bloc.add(const AppStatusRefreshed()),
      expect: () => [
        isA<AppStatusReady>()
            .having((s) => s.appName, 'appName', 'Fillcart Vendor')
            .having((s) => s.version, 'version', '0.0.1')
            .having((s) => s.environment, 'environment', 'development'),
      ],
    );
  });
}
