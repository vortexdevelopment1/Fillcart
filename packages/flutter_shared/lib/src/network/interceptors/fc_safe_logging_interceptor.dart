import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

/// Interceptor that safely logs HTTP requests, responses, and errors.
///
/// Security constraints:
/// - Request and response bodies are NOT logged by default.
/// - Headers and query parameters are recursively and case-insensitively sanitized.
/// - Sensitive keys (passwords, tokens, cookies, auth headers) are masked as '[REDACTED]'.
class FCSafeLoggingInterceptor extends Interceptor {
  FCSafeLoggingInterceptor({
    this.logBody = false,
    void Function(String message)? logPrinter,
  }) : _print = logPrinter ?? debugPrint;

  /// Whether to include sanitized payload bodies in logs. Disabled by default for security.
  final bool logBody;

  final void Function(String message) _print;

  static const Set<String> _sensitiveKeys = {
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'password',
    'token',
    'refreshtoken',
    'accesstoken',
    'secret',
    'credential',
    'pin',
    'otp',
  };

  static bool _isSensitiveKey(String key) {
    final lower = key.toLowerCase();
    if (_sensitiveKeys.contains(lower)) return true;
    final normalized = lower.replaceAll(RegExp(r'[-_]'), '');
    return _sensitiveKeys.contains(normalized);
  }

  /// Safely formats a URI for logging with sensitive query parameters redacted.
  static String sanitizedUriString(Uri uri) {
    final path = uri.path.isEmpty ? '/' : uri.path;
    final allParams = uri.queryParametersAll;
    if (allParams.isEmpty) {
      return path;
    }

    final queryParts = <String>[];
    for (final entry in allParams.entries) {
      final key = entry.key;
      final isSensitive = _isSensitiveKey(key);

      for (final value in entry.value) {
        if (isSensitive) {
          queryParts.add('$key=[REDACTED]');
        } else {
          queryParts.add('$key=$value');
        }
      }
    }

    return '$path?${queryParts.join('&')}';
  }

  /// Recursively sanitizes headers, query parameters, or payload maps/lists case-insensitively.
  static dynamic sanitizeData(dynamic data) {
    if (data == null) return null;

    if (data is Map) {
      final sanitized = <String, dynamic>{};
      for (final entry in data.entries) {
        final keyStr = entry.key.toString();

        if (_isSensitiveKey(keyStr)) {
          sanitized[keyStr] = '[REDACTED]';
        } else {
          sanitized[keyStr] = sanitizeData(entry.value);
        }
      }
      return sanitized;
    }

    if (data is List) {
      return data.map((dynamic item) => sanitizeData(item)).toList();
    }

    return data;
  }

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    options.extra['_request_start_time'] =
        DateTime.now().millisecondsSinceEpoch;

    final requestId = options.headers['x-request-id'] ?? 'unknown';
    final safeUrl = sanitizedUriString(options.uri);

    _print('[HTTP-REQ] ${options.method} $safeUrl (requestId: $requestId)');

    final mergedQueryParams = <String, dynamic>{
      ...options.uri.queryParameters,
      ...options.queryParameters,
    };

    if (mergedQueryParams.isNotEmpty) {
      final sanitizedParams = sanitizeData(mergedQueryParams);
      _print('  Query: $sanitizedParams');
    }

    if (logBody && options.data != null) {
      final sanitizedBody = sanitizeData(options.data);
      _print('  Body: $sanitizedBody');
    }

    handler.next(options);
  }

  @override
  void onResponse(
    Response<dynamic> response,
    ResponseInterceptorHandler handler,
  ) {
    final startTime =
        response.requestOptions.extra['_request_start_time'] as int?;
    final durationMs = startTime != null
        ? DateTime.now().millisecondsSinceEpoch - startTime
        : -1;

    final requestId =
        response.requestOptions.headers['x-request-id'] ??
        response.headers.value('x-request-id') ??
        'unknown';

    final safeUrl = sanitizedUriString(response.requestOptions.uri);

    _print(
      '[HTTP-RES] ${response.statusCode} ${response.requestOptions.method} '
      '$safeUrl (${durationMs}ms, requestId: $requestId)',
    );

    if (logBody && response.data != null) {
      final sanitizedBody = sanitizeData(response.data);
      _print('  Response: $sanitizedBody');
    }

    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final startTime = err.requestOptions.extra['_request_start_time'] as int?;
    final durationMs = startTime != null
        ? DateTime.now().millisecondsSinceEpoch - startTime
        : -1;

    final requestId =
        err.requestOptions.headers['x-request-id'] ??
        err.response?.headers.value('x-request-id') ??
        'unknown';

    final statusCode = err.response?.statusCode ?? 0;
    final safeUrl = sanitizedUriString(err.requestOptions.uri);

    _print(
      '[HTTP-ERR] $statusCode ${err.requestOptions.method} $safeUrl '
      '(type: ${err.type}, ${durationMs}ms, requestId: $requestId)',
    );

    handler.next(err);
  }
}
