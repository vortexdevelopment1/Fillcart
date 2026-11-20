import 'package:go_router/go_router.dart';

import '../../features/authentication/presentation/otp_verification_screen.dart';
import '../../features/authentication/presentation/phone_number_input_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/onboarding/presentation/splash_screen.dart';

/// Centralized application router using GoRouter.
abstract final class AppRouter {
  static GoRouter createRouter({String initialLocation = '/splash'}) =>
      GoRouter(
        initialLocation: initialLocation,
        routes: [
          GoRoute(path: '/', redirect: (context, state) => '/splash'),
          GoRoute(
            path: '/splash',
            builder: (context, state) => const SplashScreen(),
          ),
          GoRoute(
            path: '/onboarding',
            builder: (context, state) => const OnboardingScreen(),
          ),
          GoRoute(
            path: '/phone',
            builder: (context, state) => const PhoneNumberInputScreen(),
          ),
          GoRoute(
            path: '/otp',
            builder: (context, state) {
              final phone = state.uri.queryParameters['phone'] ?? '';
              return OtpVerificationScreen(phoneNumber: phone);
            },
          ),
        ],
      );
}
