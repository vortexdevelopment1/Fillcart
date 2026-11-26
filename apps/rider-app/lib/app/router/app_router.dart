import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../features/authentication/bloc/auth_bloc.dart';
import '../../features/authentication/bloc/auth_state.dart';
import '../../features/authentication/presentation/otp_success_screen.dart';
import '../../features/authentication/presentation/otp_verification_screen.dart';
import '../../features/authentication/presentation/phone_number_input_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/earnings/presentation/screens/earnings_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/kyc/presentation/screens/aadhaar_details_screen.dart';
import '../../features/kyc/presentation/screens/aadhaar_otp_verification_screen.dart';
import '../../features/kyc/presentation/screens/aadhaar_verify_success_screen.dart';
import '../../features/kyc/presentation/screens/bank_details_screen.dart';
import '../../features/kyc/presentation/screens/document_rejected_screen.dart';
import '../../features/kyc/presentation/screens/driving_license_screen.dart';
import '../../features/kyc/presentation/screens/pending_verification_screen.dart';
import '../../features/kyc/presentation/screens/permissions_screen.dart';
import '../../features/kyc/presentation/screens/vehicle_details_screen.dart';
import '../../features/kyc/presentation/screens/verification_success_screen.dart';
import '../../features/navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import '../../features/notifications/presentation/screens/notification_preferences_screen.dart';
import '../../features/notifications/presentation/screens/notification_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/onboarding/presentation/splash_screen.dart';
import '../../features/orders/presentation/screens/multi_order_placeholder_screen.dart';
import '../../features/orders/presentation/screens/orders_screen.dart';

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
            redirect: (context, state) {
              try {
                final authState = context.read<AuthBloc>().state;
                if (authState is AuthSuccess) {
                  return '/kyc/vehicle';
                }
              } catch (_) {}
              return null;
            },
            builder: (context, state) => const PhoneNumberInputScreen(),
          ),
          GoRoute(
            path: '/otp',
            redirect: (context, state) {
              try {
                final authState = context.read<AuthBloc>().state;
                if (authState is AuthSuccess) {
                  return '/kyc/vehicle';
                }
              } catch (_) {}
              return null;
            },
            builder: (context, state) {
              final phone = state.uri.queryParameters['phone'] ?? '';
              return OtpVerificationScreen(phoneNumber: phone);
            },
          ),
          GoRoute(
            path: '/otp-success',
            builder: (context, state) => const OtpSuccessScreen(),
          ),
          GoRoute(
            path: '/kyc/vehicle',
            builder: (context, state) => const VehicleDetailsScreen(),
          ),
          GoRoute(
            path: '/kyc/aadhaar',
            builder: (context, state) => const AadhaarDetailsScreen(),
          ),
          GoRoute(
            path: '/kyc/aadhaar-otp',
            builder: (context, state) => const AadhaarOtpVerificationScreen(),
          ),
          GoRoute(
            path: '/kyc/aadhaar-success',
            builder: (context, state) => const AadhaarVerifySuccessScreen(),
          ),
          GoRoute(
            path: '/kyc/driving-license',
            builder: (context, state) => const DrivingLicenseScreen(),
          ),
          GoRoute(
            path: '/kyc/bank',
            builder: (context, state) => const BankDetailsScreen(),
          ),
          GoRoute(
            path: '/kyc/pending',
            builder: (context, state) {
              final outcome = state.uri.queryParameters['outcome'];
              return PendingVerificationScreen(simulatedOutcome: outcome);
            },
          ),
          GoRoute(
            path: '/kyc/success',
            builder: (context, state) => const VerificationSuccessScreen(),
          ),
          GoRoute(
            path: '/kyc/rejected',
            builder: (context, state) => const DocumentRejectedScreen(),
          ),
          GoRoute(
            path: '/kyc/permissions',
            builder: (context, state) => const PermissionsScreen(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) {
              final isEmpty = state.uri.queryParameters['empty'] == 'true';
              return NotificationScreen(
                initialNotifications: isEmpty ? const [] : null,
              );
            },
          ),
          GoRoute(
            path: '/notifications/preferences',
            builder: (context, state) =>
                const NotificationPreferencesScreen(),
          ),
          GoRoute(
            path: '/multi-order',
            builder: (context, state) => const MultiOrderPlaceholderScreen(),
          ),
          StatefulShellRoute.indexedStack(
            builder: (context, state, navigationShell) {
              return Scaffold(
                backgroundColor: const Color(0xFFF3F4E5),
                body: navigationShell,
                bottomNavigationBar: RiderBottomNavBar(
                  selectedIndex: navigationShell.currentIndex,
                  onTabSelected: (index) {
                    navigationShell.goBranch(
                      index,
                      initialLocation: index == navigationShell.currentIndex,
                    );
                  },
                ),
              );
            },
            branches: [
              StatefulShellBranch(
                routes: [
                  GoRoute(
                    path: '/home',
                    builder: (context, state) =>
                        const HomeScreen(showBottomNavBar: false),
                  ),
                ],
              ),
              StatefulShellBranch(
                routes: [
                  GoRoute(
                    path: '/orders',
                    builder: (context, state) =>
                        const OrdersScreen(showBottomNavBar: false),
                  ),
                ],
              ),
              StatefulShellBranch(
                routes: [
                  GoRoute(
                    path: '/earnings',
                    builder: (context, state) =>
                        const EarningsScreen(showBottomNavBar: false),
                  ),
                ],
              ),
              StatefulShellBranch(
                routes: [
                  GoRoute(
                    path: '/dashboard',
                    builder: (context, state) =>
                        const DashboardScreen(showBottomNavBar: false),
                  ),
                ],
              ),
            ],
          ),
        ],
      );
}
