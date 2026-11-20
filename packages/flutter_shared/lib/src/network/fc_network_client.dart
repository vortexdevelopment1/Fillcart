import 'package:dio/dio.dart';

import 'fc_network_exception.dart';
import 'interceptors/fc_correlation_interceptor.dart';
import 'interceptors/fc_safe_logging_interceptor.dart';

/// Central HTTP networking client for Fillcart mobile applications.
///
/// Wraps [Dio] with standardized connection timeouts, JSON headers, distributed
/// tracing correlation IDs (`x-request-id`), recursive sensitive data redaction,
/// and safe domain exception normalization.
///
/// Exposes the underlying [dio] instance for zero-overhead integration with
/// future OpenAPI-generated Dart client libraries.
class FCNetworkClient {
  FCNetworkClient({
    String? baseUrl,
    Duration connectTimeout = defaultConnectTimeout,
    Duration receiveTimeout = defaultReceiveTimeout,
    Duration sendTimeout = defaultSendTimeout,
    Dio? customDio,
    void Function(String message)? logPrinter,
    bool logBody = false,
  }) : _dio =
           customDio ??
           Dio(
             BaseOptions(
               baseUrl: baseUrl ?? '',
               connectTimeout: connectTimeout,
               receiveTimeout: receiveTimeout,
               sendTimeout: sendTimeout,
               headers: defaultHeaders,
               responseType: ResponseType.json,
             ),
           ) {
    // Only register interceptors if creating default Dio or not already attached
    if (!_dio.interceptors.any((i) => i is FCCorrelationInterceptor)) {
      _dio.interceptors.add(FCCorrelationInterceptor());
    }

    if (!_dio.interceptors.any((i) => i is FCSafeLoggingInterceptor)) {
      _dio.interceptors.add(
        FCSafeLoggingInterceptor(logBody: logBody, logPrinter: logPrinter),
      );
    }
  }

  /// Default connection timeout: 10 seconds.
  static const Duration defaultConnectTimeout = Duration(seconds: 10);

  /// Default receive timeout: 15 seconds.
  static const Duration defaultReceiveTimeout = Duration(seconds: 15);

  /// Default send timeout: 10 seconds.
  static const Duration defaultSendTimeout = Duration(seconds: 10);

  /// Default baseline JSON transport headers.
  static const Map<String, dynamic> defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  final Dio _dio;

  /// Exposes the configured [Dio] instance for consumption by OpenAPI-generated
  /// Dart API clients (e.g. `Openapi(dio: client.dio)`).
  Dio get dio => _dio;

  /// Performs an HTTP GET request with exception normalization.
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    ProgressCallback? onReceiveProgress,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
        onReceiveProgress: onReceiveProgress,
      );
    } on DioException catch (e) {
      throw FCNetworkException.fromDioException(e);
    }
  }

  /// Performs an HTTP POST request with exception normalization.
  ///
  /// NOTE: Automatic network-level retries are explicitly disabled for non-idempotent
  /// mutations to prevent duplicate orders, charges, or server state side-effects.
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    ProgressCallback? onSendProgress,
    ProgressCallback? onReceiveProgress,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
        onReceiveProgress: onReceiveProgress,
      );
    } on DioException catch (e) {
      throw FCNetworkException.fromDioException(e);
    }
  }

  /// Performs an HTTP PUT request with exception normalization.
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    ProgressCallback? onSendProgress,
    ProgressCallback? onReceiveProgress,
  }) async {
    try {
      return await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
        onReceiveProgress: onReceiveProgress,
      );
    } on DioException catch (e) {
      throw FCNetworkException.fromDioException(e);
    }
  }

  /// Performs an HTTP PATCH request with exception normalization.
  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
    ProgressCallback? onSendProgress,
    ProgressCallback? onReceiveProgress,
  }) async {
    try {
      return await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
        onReceiveProgress: onReceiveProgress,
      );
    } on DioException catch (e) {
      throw FCNetworkException.fromDioException(e);
    }
  }

  /// Performs an HTTP DELETE request with exception normalization.
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw FCNetworkException.fromDioException(e);
    }
  }
}
