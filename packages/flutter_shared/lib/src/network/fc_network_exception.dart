import 'package:dio/dio.dart';

/// Classifies the failure mode of a network request.
enum FCNetworkErrorType {
  /// Connection timed out waiting for server socket.
  connectionTimeout,

  /// Sending request data timed out.
  sendTimeout,

  /// Server response was not received within the timeout window.
  receiveTimeout,

  /// Server returned a non-2xx HTTP status code.
  badResponse,

  /// Request was explicitly cancelled by the caller.
  cancelled,

  /// Socket or DNS failure indicating no network connection.
  connectionError,

  /// Unrecognized or client-side failure.
  unknown,
}

/// Standardized, safe domain network exception for Fillcart applications.
///
/// Ensures raw SQL errors, stack traces, and sensitive internal fields are never
/// exposed to UI consumers.
class FCNetworkException implements Exception {
  const FCNetworkException({
    required this.type,
    required this.errorCode,
    required this.message,
    this.statusCode,
    this.requestId,
    this.isOperational = true,
    this.originalError,
  });

  /// Factory constructor mapping raw [DioException] to normalized [FCNetworkException].
  factory FCNetworkException.fromDioException(DioException dioException) {
    final response = dioException.response;
    final statusCode = response?.statusCode;

    // Extract request-id from response headers if available
    String? requestId;
    final headerValue = response?.headers.value('x-request-id');
    if (headerValue != null && headerValue.isNotEmpty) {
      requestId = headerValue;
    } else if (dioException.requestOptions.headers['x-request-id'] is String) {
      requestId = dioException.requestOptions.headers['x-request-id'] as String;
    }

    switch (dioException.type) {
      case DioExceptionType.connectionTimeout:
        return FCNetworkException(
          type: FCNetworkErrorType.connectionTimeout,
          statusCode: statusCode,
          errorCode: 'CONNECTION_TIMEOUT',
          message:
              'Connection timed out. Please check your network and try again.',
          requestId: requestId,
          originalError: dioException.error,
        );

      case DioExceptionType.sendTimeout:
        return FCNetworkException(
          type: FCNetworkErrorType.sendTimeout,
          statusCode: statusCode,
          errorCode: 'SEND_TIMEOUT',
          message: 'Request upload timed out. Please verify your connection.',
          requestId: requestId,
          originalError: dioException.error,
        );

      case DioExceptionType.receiveTimeout:
      case DioExceptionType.transformTimeout:
        return FCNetworkException(
          type: FCNetworkErrorType.receiveTimeout,
          statusCode: statusCode,
          errorCode: 'RECEIVE_TIMEOUT',
          message: 'Server took too long to respond. Please try again shortly.',
          requestId: requestId,
          originalError: dioException.error,
        );

      case DioExceptionType.cancel:
        return FCNetworkException(
          type: FCNetworkErrorType.cancelled,
          statusCode: statusCode,
          errorCode: 'REQUEST_CANCELLED',
          message: 'The request was cancelled.',
          requestId: requestId,
          originalError: dioException.error,
        );

      case DioExceptionType.connectionError:
        return FCNetworkException(
          type: FCNetworkErrorType.connectionError,
          statusCode: statusCode,
          errorCode: 'NETWORK_UNAVAILABLE',
          message:
              'Unable to connect to the server. Please check your internet connection.',
          requestId: requestId,
          originalError: dioException.error,
        );

      case DioExceptionType.badResponse:
        final code = statusCode ?? 0;
        final (errorCode, message) = _mapStatusCodeToError(
          code,
          response?.data,
        );

        return FCNetworkException(
          type: FCNetworkErrorType.badResponse,
          statusCode: statusCode,
          errorCode: errorCode,
          message: message,
          requestId: requestId,
          isOperational: code < 500,
          originalError: dioException.error,
        );

      case DioExceptionType.badCertificate:
      case DioExceptionType.unknown:
        return FCNetworkException(
          type: FCNetworkErrorType.unknown,
          statusCode: statusCode,
          errorCode: 'UNEXPECTED_NETWORK_ERROR',
          message: 'An unexpected network error occurred. Please try again.',
          requestId: requestId,
          isOperational: false,
          originalError: dioException.error,
        );
    }
  }

  /// High-level failure categorization.
  final FCNetworkErrorType type;

  /// HTTP status code if a response was received.
  final int? statusCode;

  /// Machine-readable stable error code (e.g. 'CONNECTION_TIMEOUT', 'NOT_FOUND').
  final String errorCode;

  /// Safe, human-readable user message.
  final String message;

  /// Correlation ID attached to the request/response.
  final String? requestId;

  /// Indicates whether this is an expected client/operational error or an unexpected failure.
  final bool isOperational;

  /// Underlying raw error for local debugging.
  final dynamic originalError;

  static (String, String) _mapStatusCodeToError(
    int statusCode,
    dynamic responseData,
  ) {
    // Check if the backend returned a standardized error format
    if (responseData is Map<String, dynamic>) {
      final errorObj = responseData['error'];
      if (errorObj is Map<String, dynamic>) {
        final code = errorObj['code'];
        final msg = errorObj['message'];
        if (code is String && msg is String) {
          return (code, msg);
        }
      }

      // Check simple message property
      final msg = responseData['message'];
      if (msg is String &&
          msg.isNotEmpty &&
          !msg.contains('SELECT') &&
          !msg.contains('Error:')) {
        return ('HTTP_$statusCode', msg);
      }
    }

    switch (statusCode) {
      case 400:
        return (
          'BAD_REQUEST',
          'The request could not be processed due to invalid data.',
        );
      case 401:
        return (
          'UNAUTHORIZED',
          'Authentication required. Please sign in to continue.',
        );
      case 403:
        return (
          'FORBIDDEN',
          'You do not have permission to access this resource.',
        );
      case 404:
        return ('NOT_FOUND', 'The requested resource was not found.');
      case 409:
        return ('CONFLICT', 'The request conflicts with current server state.');
      case 422:
        return (
          'VALIDATION_ERROR',
          'Validation failed for one or more submitted fields.',
        );
      case 429:
        return (
          'RATE_LIMITED',
          'Too many requests. Please slow down and try again.',
        );
      case 500:
        return (
          'INTERNAL_SERVER_ERROR',
          'An unexpected server error occurred. Please try again later.',
        );
      case 502:
        return (
          'BAD_GATEWAY',
          'Bad gateway. The service is temporarily unreachable.',
        );
      case 503:
        return (
          'SERVICE_UNAVAILABLE',
          'Service is temporarily unavailable. Please retry shortly.',
        );
      case 504:
        return (
          'GATEWAY_TIMEOUT',
          'Gateway timeout. The server took too long to answer.',
        );
      default:
        return (
          'HTTP_$statusCode',
          'Request failed with status code $statusCode.',
        );
    }
  }

  @override
  String toString() {
    return 'FCNetworkException(type: $type, statusCode: $statusCode, errorCode: $errorCode, message: $message, requestId: $requestId)';
  }
}
