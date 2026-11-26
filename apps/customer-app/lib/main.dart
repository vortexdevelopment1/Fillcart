import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'app/customer_app.dart';

/// Deduplication state to prevent cascading log storms across error tiers.
String? _lastReportedErrorSignature;
int _lastReportedErrorTimeMs = 0;
const int _deduplicationWindowMs = 1000;

/// Centralized, safe error reporter with deduplication across error tiers.
void reportError(Object error, StackTrace? stack, {required String origin}) {
  final now = DateTime.now().millisecondsSinceEpoch;
  final signature = '$origin:${error.runtimeType}:${error.toString()}';

  if (signature == _lastReportedErrorSignature &&
      (now - _lastReportedErrorTimeMs) < _deduplicationWindowMs) {
    return;
  }

  _lastReportedErrorSignature = signature;
  _lastReportedErrorTimeMs = now;

  debugPrint(
    '[CUSTOMER-ERROR] [$origin] ${error.runtimeType}: ${error.toString()}',
  );
  if (stack != null && kDebugMode) {
    debugPrint('[CUSTOMER-ERROR-STACK] $stack');
  }
}

void main() {
  runZonedGuarded(
    () {
      WidgetsFlutterBinding.ensureInitialized();

      // 1. Framework errors (widget rendering, layout, animation)
      FlutterError.onError = (FlutterErrorDetails details) {
        reportError(details.exception, details.stack, origin: 'FlutterError');
      };

      // 2. Platform dispatcher errors (asynchronous platform channel & root errors)
      PlatformDispatcher.instance.onError = (Object error, StackTrace stack) {
        reportError(error, stack, origin: 'PlatformDispatcher');
        return true;
      };

      // 3. Launch root application
      runApp(const CustomerApp());
    },
    (Object error, StackTrace stack) {
      // 3-Tier fallback: Uncaught Dart zone errors
      reportError(error, stack, origin: 'ZoneGuarded');
    },
  );
}
