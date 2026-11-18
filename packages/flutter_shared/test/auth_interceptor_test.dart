import 'package:dio/dio.dart';
import 'package:fillcart_shared/src/network/interceptors/fc_auth_interceptor.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('FillcartAuthInterceptor Unit Tests', () {
    test(
      'attaches Authorization Bearer header when token is present',
      () async {
        final interceptor = FillcartAuthInterceptor(
          dio: Dio(),
          getAccessToken: () async => 'test_access_token_123',
          getRefreshToken: () async => 'test_refresh_token_123',
          saveTokens: (accessToken, refreshToken) async {},
          clearAuthTokens: () async {},
        );

        final options = RequestOptions(path: '/api/v1/orders');
        final handler = RequestInterceptorHandler();

        await interceptor.onRequest(options, handler);

        expect(
          options.headers['Authorization'],
          'Bearer test_access_token_123',
        );
      },
    );

    test('omits Authorization header when skipAuthToken is true', () async {
      final interceptor = FillcartAuthInterceptor(
        dio: Dio(),
        getAccessToken: () async => 'test_access_token_123',
        getRefreshToken: () async => 'test_refresh_token_123',
        saveTokens: (accessToken, refreshToken) async {},
        clearAuthTokens: () async {},
      );

      final options = RequestOptions(
        path: '/api/v1/auth/login',
        extra: {'skipAuthToken': true},
      );
      final handler = RequestInterceptorHandler();

      await interceptor.onRequest(options, handler);

      expect(options.headers.containsKey('Authorization'), isFalse);
    });

    test(
      'isolated deletion of Fillcart auth keys leaves unrelated keys intact',
      () async {
        final secureStorageMock = <String, String>{
          'fc_access_token': 'secret_access',
          'fc_refresh_token': 'secret_refresh',
          'unrelated_user_setting': 'custom_dark_mode',
        };

        final interceptor = FillcartAuthInterceptor(
          dio: Dio(),
          getAccessToken: () async => secureStorageMock['fc_access_token'],
          getRefreshToken: () async => secureStorageMock['fc_refresh_token'],
          saveTokens: (accessToken, refreshToken) async {
            secureStorageMock['fc_access_token'] = accessToken;
            secureStorageMock['fc_refresh_token'] = refreshToken;
          },
          clearAuthTokens: () async {
            secureStorageMock.remove('fc_access_token');
            secureStorageMock.remove('fc_refresh_token');
          },
        );

        // Trigger clear
        await interceptor.clearAuthTokens();

        expect(secureStorageMock.containsKey('fc_access_token'), isFalse);
        expect(secureStorageMock.containsKey('fc_refresh_token'), isFalse);
        // Invariant: Unrelated secure-storage keys are preserved
        expect(secureStorageMock['unrelated_user_setting'], 'custom_dark_mode');
      },
    );
  });
}
