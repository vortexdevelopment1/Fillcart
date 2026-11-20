import 'dart:async';
import 'package:dio/dio.dart';

/// Callback type for token retrieval and persistence
typedef TokenProvider = Future<String?> Function();
typedef TokenPersister =
    Future<void> Function(String accessToken, String refreshToken);
typedef TokenClearer = Future<void> Function();

/// Single-flight, queued auth interceptor for Fillcart mobile clients.
///
/// Features:
/// 1. Injects `Authorization: Bearer <accessToken>` unless `skipAuthToken: true`.
/// 2. Single-flight token refresh: concurrent 401s queue behind a single shared refresh operation.
/// 3. Prevents infinite loops via `_hasRetriedAuth` extra flag (strictly max 1 retry).
/// 4. Refresh request carries `skipAuthRefresh: true` so a failed refresh call never recursively triggers itself.
/// 5. Network errors do NOT clear credentials; definitive 401 on refresh triggers isolated Fillcart credential clearing.
class FillcartAuthInterceptor extends QueuedInterceptor {
  FillcartAuthInterceptor({
    required this.dio,
    required this.getAccessToken,
    required this.getRefreshToken,
    required this.saveTokens,
    required this.clearAuthTokens,
    this.refreshPath = '/api/v1/auth/refresh',
  });

  final Dio dio;
  final TokenProvider getAccessToken;
  final TokenProvider getRefreshToken;
  final TokenPersister saveTokens;
  final TokenClearer clearAuthTokens;
  final String refreshPath;

  Completer<String?>? _activeRefreshCompleter;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (options.extra['skipAuthToken'] == true) {
      return handler.next(options);
    }

    final token = await getAccessToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    return handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final response = err.response;
    final options = err.requestOptions;

    // Only intercept 401s that haven't opted out and haven't already retried
    if (response?.statusCode != 401 ||
        options.extra['skipAuthRefresh'] == true ||
        options.extra['_hasRetriedAuth'] == true) {
      return handler.next(err);
    }

    try {
      final newAccessToken = await _executeSingleFlightRefresh();

      if (newAccessToken == null) {
        return handler.next(err);
      }

      // Retry original request exactly once with new token
      options.headers['Authorization'] = 'Bearer $newAccessToken';
      options.extra['_hasRetriedAuth'] = true;

      final response = await dio.fetch<dynamic>(options);
      return handler.resolve(response);
    } catch (e) {
      return handler.next(err);
    }
  }

  Future<String?> _executeSingleFlightRefresh() async {
    if (_activeRefreshCompleter != null) {
      return _activeRefreshCompleter!.future;
    }

    _activeRefreshCompleter = Completer<String?>();

    try {
      final currentRefresh = await getRefreshToken();
      if (currentRefresh == null || currentRefresh.isEmpty) {
        await clearAuthTokens();
        _activeRefreshCompleter!.complete(null);
        return null;
      }

      final response = await dio.post<dynamic>(
        refreshPath,
        data: {'refreshToken': currentRefresh},
        options: Options(
          extra: {'skipAuthRefresh': true, 'skipAuthToken': true},
        ),
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final newAccess = data['accessToken'] as String?;
        final newRefresh = data['refreshToken'] as String?;

        if (newAccess != null && newRefresh != null) {
          await saveTokens(newAccess, newRefresh);
          _activeRefreshCompleter!.complete(newAccess);
          return newAccess;
        }
      }

      await clearAuthTokens();
      _activeRefreshCompleter!.complete(null);
      return null;
    } on DioException catch (dioErr) {
      // Clear tokens only on definitive auth rejection (401), not transient network errors
      if (dioErr.response?.statusCode == 401) {
        await clearAuthTokens();
      }
      _activeRefreshCompleter!.complete(null);
      return null;
    } catch (e) {
      _activeRefreshCompleter!.complete(null);
      return null;
    } finally {
      _activeRefreshCompleter = null;
    }
  }
}
