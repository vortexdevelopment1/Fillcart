import 'package:dio/dio.dart';
import 'package:uuid/uuid.dart';

/// Interceptor that ensures every outgoing HTTP request carries a unique
/// `x-request-id` header for distributed correlation and tracing.
///
/// If caller has already supplied an `x-request-id` in the request options,
/// it is preserved and not overwritten.
class FCCorrelationInterceptor extends Interceptor {
  FCCorrelationInterceptor({Uuid? uuid}) : _uuid = uuid ?? const Uuid();

  final Uuid _uuid;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final existingId = options.headers['x-request-id'];

    if (existingId == null ||
        (existingId is String && existingId.trim().isEmpty)) {
      options.headers['x-request-id'] = _uuid.v4();
    }

    handler.next(options);
  }
}
