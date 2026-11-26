import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../features/authentication/bloc/auth_bloc.dart';
import '../../features/authentication/bloc/auth_state.dart';
import '../../features/authentication/presentation/otp_success_screen.dart';
import '../../features/authentication/presentation/otp_verification_screen.dart';
import '../../features/authentication/presentation/phone_number_input_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/orders/presentation/screens/orders_screen.dart';
import '../../features/earnings/presentation/screens/earnings_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
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
import '../../features/onboarding/presentation/onboarding_screen.dart';
import '../../features/onboarding/presentation/splash_screen.dart';
import '../../features/profile/presentation/screens/bank_account_screen.dart';
import '../../features/profile/presentation/screens/documents_details_screen.dart';
import '../../features/profile/presentation/screens/edit_profile_screen.dart';
import '../../features/profile/presentation/screens/incentive_screen.dart';
import '../../features/profile/presentation/screens/profile_info_screens.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../features/profile/presentation/screens/upload_details_screen.dart';
import '../../features/profile/presentation/screens/vehicle_details_screen.dart';

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
            path: '/home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/orders',
            builder: (context, state) => const OrdersScreen(),
          ),
          GoRoute(
            path: '/earnings',
            builder: (context, state) => const EarningsScreen(),
          ),
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/profile/edit',
            builder: (context, state) => const EditProfileScreen(),
          ),
          GoRoute(
            path: '/profile/incentives',
            builder: (context, state) => const IncentiveScreen(),
          ),
          GoRoute(
            path: '/profile/documents',
            builder: (context, state) => const DocumentsDetailsScreen(),
          ),
          GoRoute(
            path: '/profile/vehicle',
            builder: (context, state) => const ProfileVehicleDetailsScreen(),
          ),
          GoRoute(
            path: '/profile/vehicle-success',
            builder: (context, state) => const UploadDetailsScreen(),
          ),
          GoRoute(
            path: '/profile/bank',
            builder: (context, state) => const BankAccountScreen(),
          ),
          GoRoute(
            path: '/profile/faq',
            builder: (context, state) => const FaqScreen(),
          ),
          GoRoute(
            path: '/profile/support',
            builder: (context, state) => const ContactSupportScreen(),
          ),
          GoRoute(
            path: '/profile/about',
            builder: (context, state) => const AboutAppScreen(),
          ),
          GoRoute(
            path: '/profile/privacy-policy',
            builder: (context, state) => const PrivacyPolicyScreen(),
          ),
        ],
      );
}
