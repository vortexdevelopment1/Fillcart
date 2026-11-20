/// Exception thrown when authentication fails.
class AuthException implements Exception {
  final String message;
  const AuthException(this.message);

  @override
  String toString() => message;
}

/// Abstract contract for authentication operations.
abstract class AuthRepository {
  Future<bool> sendOtp({required String phoneNumber});
  Future<Map<String, dynamic>> verifyOtp({
    required String phoneNumber,
    required String otp,
  });
}

/// Mock implementation of [AuthRepository] for frontend-only MVP.
///
/// Mock rules:
/// - Any valid 10-digit phone number is accepted.
/// - OTP '1234' succeeds.
/// - Any other OTP throws an [AuthException].
class MockAuthRepository implements AuthRepository {
  final Duration delay;

  const MockAuthRepository({this.delay = const Duration(milliseconds: 150)});

  static const String validMockOtp = '1234';

  @override
  Future<bool> sendOtp({required String phoneNumber}) async {
    final cleanPhone = phoneNumber.replaceAll(RegExp(r'\D'), '');
    if (cleanPhone.length != 10) {
      throw const AuthException('Please enter a valid 10-digit mobile number.');
    }
    if (delay > Duration.zero) {
      await Future<void>.delayed(delay);
    }
    return true;
  }

  @override
  Future<Map<String, dynamic>> verifyOtp({
    required String phoneNumber,
    required String otp,
  }) async {
    if (delay > Duration.zero) {
      await Future<void>.delayed(delay);
    }

    if (otp == validMockOtp || otp == '123456') {
      return {
        'riderId': 'RIDER-TEST-001',
        'phoneNumber': phoneNumber,
        'token': 'mock-rider-jwt-token-batch1',
        'isVerified': true,
      };
    } else {
      throw const AuthException(
        'Invalid verification code. Enter 1234 for mock verification.',
      );
    }
  }
}
