import 'package:dio/dio.dart';
import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('FCNetworkClient Configuration Unit Tests', () {
    test('initializes with approved default timeouts and headers', () {
      final client = FCNetworkClient(baseUrl: 'https://api.fillcart.com');

      expect(client.dio.options.baseUrl, 'https://api.fillcart.com');
      expect(client.dio.options.connectTimeout, const Duration(seconds: 10));
      expect(client.dio.options.receiveTimeout, const Duration(seconds: 15));
      expect(client.dio.options.sendTimeout, const Duration(seconds: 10));

      expect(client.dio.options.headers['Accept'], 'application/json');
      expect(client.dio.options.headers['Content-Type'], 'application/json');
    });

    test(
      'exposes underlying dio instance for OpenAPI client compatibility',
      () {
        final client = FCNetworkClient();
        expect(client.dio, isA<Dio>());
      },
    );

    test('registers correlation and safe logging interceptors by default', () {
      final client = FCNetworkClient();

      expect(
        client.dio.interceptors.any((i) => i is FCCorrelationInterceptor),
        isTrue,
      );
      expect(
        client.dio.interceptors.any((i) => i is FCSafeLoggingInterceptor),
        isTrue,
      );
    });
  });

  group('FCCorrelationInterceptor Unit Tests', () {
    test('generates a valid UUID v4 x-request-id when none is supplied', () {
      final interceptor = FCCorrelationInterceptor();
      final options = RequestOptions(path: '/api/v1/health');

      interceptor.onRequest(options, RequestInterceptorHandler());

      final requestId = options.headers['x-request-id'] as String?;
      expect(requestId, isNotNull);
      expect(
        RegExp(
          r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
          caseSensitive: false,
        ).hasMatch(requestId!),
        isTrue,
      );
    });

    test(
      'preserves pre-existing x-request-id if already provided by caller',
      () {
        final interceptor = FCCorrelationInterceptor();
        const customId = 'custom-trace-uuid-12345';
        final options = RequestOptions(
          path: '/api/v1/health',
          headers: {'x-request-id': customId},
        );

        interceptor.onRequest(options, RequestInterceptorHandler());

        expect(options.headers['x-request-id'], customId);
      },
    );
  });

  group('FCSafeLoggingInterceptor Sanitization & Security Tests', () {
    test('recursively redacts sensitive fields case-insensitively', () {
      final sensitiveData = {
        'username': 'fillcart_vendor',
        'password': 'super_secret_password',
        'Token': 'jwt_secret_token_abc',
        'REFRESHTOKEN': 'refresh_token_xyz',
        'Authorization': 'Bearer my_secret_token',
        'cookie': 'session=12345678',
        'nested': {
          'apiKey': 'plain_key',
          'X-API-KEY': 'secret_api_key_val',
          'secret': 'nested_secret_val',
          'items': [
            {'credential': 'user_credential', 'id': 1},
          ],
        },
      };

      final sanitized =
          FCSafeLoggingInterceptor.sanitizeData(sensitiveData)
              as Map<String, dynamic>;

      expect(sanitized['username'], 'fillcart_vendor');
      expect(sanitized['password'], '[REDACTED]');
      expect(sanitized['Token'], '[REDACTED]');
      expect(sanitized['REFRESHTOKEN'], '[REDACTED]');
      expect(sanitized['Authorization'], '[REDACTED]');
      expect(sanitized['cookie'], '[REDACTED]');

      final nested = sanitized['nested'] as Map<String, dynamic>;
      expect(nested['apiKey'], 'plain_key');
      expect(nested['X-API-KEY'], '[REDACTED]');
      expect(nested['secret'], '[REDACTED]');

      final items = nested['items'] as List<dynamic>;
      final item0 = items[0] as Map<String, dynamic>;
      expect(item0['credential'], '[REDACTED]');
      expect(item0['id'], 1);

      // Verify no sensitive credentials appear in serialized string
      final serialized = sanitized.toString();
      expect(serialized, isNot(contains('super_secret_password')));
      expect(serialized, isNot(contains('jwt_secret_token_abc')));
      expect(serialized, isNot(contains('refresh_token_xyz')));
      expect(serialized, isNot(contains('my_secret_token')));
      expect(serialized, isNot(contains('secret_api_key_val')));
      expect(serialized, isNot(contains('nested_secret_val')));
      expect(serialized, isNot(contains('user_credential')));
    });

    test('does not log request or response bodies by default', () {
      final logs = <String>[];
      final interceptor = FCSafeLoggingInterceptor(
        logBody: false,
        logPrinter: (msg) => logs.add(msg),
      );

      final options = RequestOptions(
        path: '/api/v1/auth/login',
        method: 'POST',
        data: {'password': 'sensitive_password_123'},
        headers: {'x-request-id': 'req-test-1'},
      );

      interceptor.onRequest(options, RequestInterceptorHandler());

      expect(
        logs.any((l) => l.contains('[HTTP-REQ] POST /api/v1/auth/login')),
        isTrue,
      );
      expect(logs.any((l) => l.contains('Body:')), isFalse);
      expect(logs.any((l) => l.contains('sensitive_password_123')), isFalse);
    });

    test(
      'redacts sensitive query parameters before URLs are logged (case-insensitive)',
      () {
        final logs = <String>[];
        final interceptor = FCSafeLoggingInterceptor(
          logBody: false,
          logPrinter: (msg) => logs.add(msg),
        );

        final options = RequestOptions(
          path:
              '/api/v1/search?TOKEN=raw_token_xyz&passWORD=raw_pass_123&query=vegetables',
          method: 'GET',
          headers: {'x-request-id': 'req-test-query-param'},
        );

        interceptor.onRequest(options, RequestInterceptorHandler());

        // Verify URL line has redacted tokens
        expect(
          logs.any(
            (l) => l.contains(
              '[HTTP-REQ] GET /api/v1/search?TOKEN=[REDACTED]&passWORD=[REDACTED]&query=vegetables',
            ),
          ),
          isTrue,
        );

        // Verify Query parameter map also redacts sensitive keys
        expect(logs.any((l) => l.contains('TOKEN: [REDACTED]')), isTrue);
        expect(logs.any((l) => l.contains('passWORD: [REDACTED]')), isTrue);
        expect(logs.any((l) => l.contains('query: vegetables')), isTrue);

        // Ensure raw secrets never leaked into any captured log
        final allLogs = logs.join('\n');
        expect(allLogs, isNot(contains('raw_token_xyz')));
        expect(allLogs, isNot(contains('raw_pass_123')));
      },
    );

    test('redacts sensitive query parameters in response and error logs', () {
      final logs = <String>[];
      final interceptor = FCSafeLoggingInterceptor(
        logBody: false,
        logPrinter: (msg) => logs.add(msg),
      );

      final reqOptions = RequestOptions(
        path: '/api/v1/vendors?x-api-key=secret_vendor_key&status=active',
        method: 'GET',
        headers: {'x-request-id': 'req-res-err-test'},
      );

      // Test response logging
      final response = Response<dynamic>(
        requestOptions: reqOptions,
        statusCode: 200,
      );
      interceptor.onResponse(response, ResponseInterceptorHandler());

      expect(
        logs.any(
          (l) => l.contains(
            '[HTTP-RES] 200 GET /api/v1/vendors?x-api-key=[REDACTED]&status=active',
          ),
        ),
        isTrue,
      );

      // Test error logging
      final dioError = DioException(
        requestOptions: reqOptions,
        type: DioExceptionType.badResponse,
        message: 'Internal connection failure with secret_vendor_key',
        response: Response<dynamic>(
          requestOptions: reqOptions,
          statusCode: 500,
        ),
      );
      interceptor.onError(dioError, _TestErrorHandler());

      expect(
        logs.any(
          (l) => l.contains(
            '[HTTP-ERR] 500 GET /api/v1/vendors?x-api-key=[REDACTED]&status=active',
          ),
        ),
        isTrue,
      );

      // Confirm raw sensitive values and raw exception message cannot leak
      final allLogs = logs.join('\n');
      expect(allLogs, isNot(contains('secret_vendor_key')));
      expect(
        allLogs,
        isNot(contains('Internal connection failure with secret_vendor_key')),
      );
    });
  });

  group('FCNetworkException Normalization Unit Tests', () {
    final dummyOptions = RequestOptions(path: '/api/v1/data');

    test('normalizes connectionTimeout error properly', () {
      final dioError = DioException(
        requestOptions: dummyOptions,
        type: DioExceptionType.connectionTimeout,
        error: 'Socket connect timed out',
      );

      final fcException = FCNetworkException.fromDioException(dioError);

      expect(fcException.type, FCNetworkErrorType.connectionTimeout);
      expect(fcException.errorCode, 'CONNECTION_TIMEOUT');
      expect(fcException.message, contains('Connection timed out'));
    });

    test('normalizes sendTimeout and receiveTimeout errors properly', () {
      final sendError = DioException(
        requestOptions: dummyOptions,
        type: DioExceptionType.sendTimeout,
      );
      final fcSend = FCNetworkException.fromDioException(sendError);
      expect(fcSend.type, FCNetworkErrorType.sendTimeout);
      expect(fcSend.errorCode, 'SEND_TIMEOUT');

      final receiveError = DioException(
        requestOptions: dummyOptions,
        type: DioExceptionType.receiveTimeout,
      );
      final fcReceive = FCNetworkException.fromDioException(receiveError);
      expect(fcReceive.type, FCNetworkErrorType.receiveTimeout);
      expect(fcReceive.errorCode, 'RECEIVE_TIMEOUT');
    });

    test('normalizes connectionError (offline) properly', () {
      final dioError = DioException(
        requestOptions: dummyOptions,
        type: DioExceptionType.connectionError,
      );

      final fcException = FCNetworkException.fromDioException(dioError);

      expect(fcException.type, FCNetworkErrorType.connectionError);
      expect(fcException.errorCode, 'NETWORK_UNAVAILABLE');
      expect(fcException.message, contains('Unable to connect to the server'));
    });

    test(
      'normalizes HTTP 400, 401, 403, 404, 500, 503 status codes safely',
      () {
        for (final (code, expectedCode) in [
          (400, 'BAD_REQUEST'),
          (401, 'UNAUTHORIZED'),
          (403, 'FORBIDDEN'),
          (404, 'NOT_FOUND'),
          (500, 'INTERNAL_SERVER_ERROR'),
          (503, 'SERVICE_UNAVAILABLE'),
        ]) {
          final response = Response<dynamic>(
            requestOptions: dummyOptions,
            statusCode: code,
            headers: Headers.fromMap({
              'x-request-id': ['res-trace-456'],
            }),
          );
          final dioError = DioException(
            requestOptions: dummyOptions,
            response: response,
            type: DioExceptionType.badResponse,
          );

          final fcException = FCNetworkException.fromDioException(dioError);

          expect(fcException.type, FCNetworkErrorType.badResponse);
          expect(fcException.statusCode, code);
          expect(fcException.errorCode, expectedCode);
          expect(fcException.requestId, 'res-trace-456');
          expect(fcException.message, isNotEmpty);
        }
      },
    );

    test(
      'extracts custom backend error code and message when structured error is returned',
      () {
        final response = Response<dynamic>(
          requestOptions: dummyOptions,
          statusCode: 422,
          data: {
            'error': {
              'code': 'CUSTOM_VALIDATION_ERROR',
              'message': 'Provided phone number is invalid',
            },
          },
        );
        final dioError = DioException(
          requestOptions: dummyOptions,
          response: response,
          type: DioExceptionType.badResponse,
        );

        final fcException = FCNetworkException.fromDioException(dioError);

        expect(fcException.errorCode, 'CUSTOM_VALIDATION_ERROR');
        expect(fcException.message, 'Provided phone number is invalid');
        expect(fcException.statusCode, 422);
      },
    );
  });
}

class _TestErrorHandler extends ErrorInterceptorHandler {
  @override
  void next(DioException err) {
    // Interceptor test handler: absorbs error to avoid unhandled async exceptions in tests.
  }
}
