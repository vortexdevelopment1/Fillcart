import 'package:bloc_test/bloc_test.dart';
import 'package:fillcart_rider/app/rider_app.dart';
import 'package:fillcart_rider/features/profile/bloc/profile_bloc.dart';
import 'package:fillcart_rider/features/profile/bloc/profile_event.dart';
import 'package:fillcart_rider/features/profile/bloc/profile_state.dart';
import 'package:fillcart_rider/features/profile/models/rider_profile_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('ProfileBloc Unit Tests', () {
    blocTest<ProfileBloc, ProfileState>(
      'updates profile details cleanly on ProfileDetailsUpdated',
      build: ProfileBloc.new,
      act: (bloc) => bloc.add(
        const ProfileDetailsUpdated(
          fullName: 'MS Dhoni',
          mobileNumber: '9876543210',
          email: 'dhoni@fillcart.in',
          dateOfBirth: '07/07/1981',
          emergencyContactName: 'Virat Kohli',
          emergencyContactPhone: '+91 6598132940',
        ),
      ),
      expect: () => [
        isA<ProfileState>()
            .having((s) => s.profile.fullName, 'fullName', 'MS Dhoni')
            .having(
              (s) => s.profile.mobileNumber,
              'mobileNumber',
              '+91 9876543210',
            )
            .having((s) => s.profile.email, 'email', 'dhoni@fillcart.in'),
      ],
    );

    blocTest<ProfileBloc, ProfileState>(
      'updates photo source and marks vehicle RC pending verification',
      build: ProfileBloc.new,
      act: (bloc) {
        bloc.add(const ProfilePhotoUpdated(ProfilePhotoSource.removed));
        bloc.add(const ProfileVehicleRcUpdated('mp 09 ab 4321'));
      },
      expect: () => [
        isA<ProfileState>().having(
          (s) => s.profile.hasPhoto,
          'hasPhoto',
          isFalse,
        ),
        isA<ProfileState>()
            .having(
              (s) => s.documents.vehicleRcNumber,
              'vehicleRcNumber',
              'MP 09 AB 4321',
            )
            .having(
              (s) => s.documents.vehicleRcStatus,
              'vehicleRcStatus',
              ProfileDocumentStatus.pendingVerification,
            ),
      ],
    );

    blocTest<ProfileBloc, ProfileState>(
      'saves and deletes bank account details',
      build: ProfileBloc.new,
      act: (bloc) {
        bloc.add(
          const ProfileBankAccountSaved(
            accountHolderName: 'Ms Dhoni',
            bankName: 'HDFC Bank',
            ifscCode: 'hdfc0000123',
            accountNumber: '998877665544',
          ),
        );
        bloc.add(const ProfileBankAccountDeleted());
      },
      expect: () => [
        isA<ProfileState>()
            .having((s) => s.bankAccount.bankName, 'bankName', 'HDFC Bank')
            .having(
              (s) => s.bankAccount.maskedAccountNumber,
              'masked',
              '**** **** 5544',
            )
            .having((s) => s.bankAccount.ifscCode, 'ifsc', 'HDFC0000123'),
        isA<ProfileState>().having(
          (s) => s.bankAccount.hasLinkedAccount,
          'hasLinkedAccount',
          isFalse,
        ),
      ],
    );
  });

  group('Profile Section Flow Widget Tests', () {
    testWidgets(
      'navigates from Home -> Profile -> Edit Profile -> Photo Bottom Sheet and saves changes',
      (tester) async {
        await tester.binding.setSurfaceSize(const Size(360, 800));
        await tester.pumpWidget(const RiderApp(initialLocation: '/home'));
        await tester.pumpAndSettle();

        // Tap rider profile header on HomeScreen
        await tester.tap(find.byKey(const Key('home_profile_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('profile_screen_scaffold')), findsOneWidget);
        expect(find.text('Virat kohli (khachedu)'), findsOneWidget);
        expect(find.text('London'), findsOneWidget);
        expect(find.text('+91 9350254862'), findsOneWidget);
        expect(find.text('4.7'), findsOneWidget);
        expect(find.text('AYM451202'), findsOneWidget);

        // Open Edit Profile
        await tester.tap(find.byKey(const Key('edit_profile_button')));
        await tester.pumpAndSettle();
        expect(
          find.byKey(const Key('edit_profile_screen_scaffold')),
          findsOneWidget,
        );

        // Open Change Profile Photo bottom sheet
        await tester.tap(find.byKey(const Key('edit_photo_button')));
        await tester.pumpAndSettle();
        expect(
          find.byKey(const Key('change_photo_bottom_sheet')),
          findsOneWidget,
        );
        expect(find.text('Upload From Gallery'), findsOneWidget);
        expect(find.text('Take Photo'), findsOneWidget);
        expect(find.text('Remove Photo'), findsOneWidget);

        await tester.tap(find.byKey(const Key('photo_option_remove')));
        await tester.pumpAndSettle();
        expect(find.text('VK'), findsOneWidget);

        // Edit full name and save
        await tester.enterText(
          find.byKey(const Key('edit_full_name_field')),
          'Mahendra Dhoni',
        );
        await tester.ensureVisible(
          find.byKey(const Key('save_profile_button')),
        );
        await tester.tap(find.byKey(const Key('save_profile_button')));
        await tester.pumpAndSettle();

        expect(find.byKey(const Key('profile_screen_scaffold')), findsOneWidget);
        expect(find.text('Mahendra Dhoni'), findsOneWidget);
      },
    );

    testWidgets(
      'Incentive flow supports Today/Weekly tabs and dark Calendar dialogs',
      (tester) async {
        await tester.binding.setSurfaceSize(const Size(360, 800));
        await tester.pumpWidget(
          const RiderApp(initialLocation: '/profile/incentives'),
        );
        await tester.pumpAndSettle();

        expect(
          find.byKey(const Key('incentive_screen_scaffold')),
          findsOneWidget,
        );
        expect(find.byKey(const Key('incentive_daily_strip')), findsOneWidget);
        expect(find.text('3/5 Orders Completed'), findsOneWidget);

        // Tap second day chip (4/5 completed)
        await tester.tap(find.byKey(const Key('daily_chip_1')));
        await tester.pumpAndSettle();
        expect(find.text('4/5 Orders Completed'), findsOneWidget);

        // Open single-day calendar dialog
        await tester.tap(find.byKey(const Key('incentive_calendar_button')));
        await tester.pumpAndSettle();
        expect(
          find.byKey(const Key('incentive_calendar_dialog')),
          findsOneWidget,
        );
        await tester.tap(find.byKey(const Key('calendar_day_14')));
        await tester.pumpAndSettle();

        // Switch to Weekly tab and open weekly range calendar
        await tester.tap(find.byKey(const Key('incentive_weekly_tab')));
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('incentive_weekly_strip')), findsOneWidget);
        expect(find.text('8-14'), findsOneWidget);

        await tester.tap(find.byKey(const Key('incentive_calendar_button')));
        await tester.pumpAndSettle();
        expect(find.text('October 2020'), findsOneWidget);
        await tester.tap(find.byKey(const Key('calendar_day_8')));
        await tester.pumpAndSettle();
      },
    );

    testWidgets(
      'Documents -> Change Vehicle -> Update Details -> Upload Success -> Back to Documents',
      (tester) async {
        await tester.binding.setSurfaceSize(const Size(360, 800));
        await tester.pumpWidget(
          const RiderApp(initialLocation: '/profile/documents'),
        );
        await tester.pumpAndSettle();

        expect(find.text('Driving License'), findsOneWidget);
        expect(find.text('Aadhaar Card'), findsOneWidget);
        expect(find.text('Vehicle RC'), findsOneWidget);

        await tester.tap(find.byKey(const Key('change_vehicle_button')));
        await tester.pumpAndSettle();
        expect(
          find.byKey(const Key('vehicle_details_screen_scaffold')),
          findsOneWidget,
        );

        await tester.tap(find.byKey(const Key('clear_rc_button')));
        await tester.pumpAndSettle();
        await tester.enterText(
          find.byKey(const Key('vehicle_rc_input')),
          'MP 09 AB 4321',
        );
        await tester.tap(
          find.byKey(const Key('update_vehicle_details_button')),
        );
        await tester.pumpAndSettle();

        expect(
          find.byKey(const Key('upload_details_screen_scaffold')),
          findsOneWidget,
        );
        expect(find.text('Vehicle Details\nUpdated Successfully!'), findsOneWidget);
        expect(find.text('MP 09 AB 4321'), findsOneWidget);

        await tester.tap(find.byKey(const Key('back_to_documents_button')));
        await tester.pumpAndSettle();

        expect(
          find.byKey(const Key('documents_details_screen_scaffold')),
          findsOneWidget,
        );
        expect(find.text('Pending'), findsOneWidget);
      },
    );

    testWidgets(
      'Bank Account supports Change and Delete actions via menu',
      (tester) async {
        await tester.binding.setSurfaceSize(const Size(360, 800));
        await tester.pumpWidget(
          const RiderApp(initialLocation: '/profile/bank'),
        );
        await tester.pumpAndSettle();

        expect(find.text('State Bank Of India'), findsOneWidget);
        expect(find.text('**** **** 1224'), findsOneWidget);
        expect(find.text('IFSC: SBIN0001234'), findsOneWidget);

        // Open more menu and choose Change
        await tester.tap(find.byKey(const Key('bank_more_menu_button')));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const Key('bank_menu_change')));
        await tester.pumpAndSettle();

        await tester.enterText(
          find.byKey(const Key('bank_name_field')),
          'ICICI Bank',
        );
        await tester.enterText(
          find.byKey(const Key('bank_account_number_field')),
          '112233449988',
        );
        await tester.ensureVisible(find.byKey(const Key('save_bank_button')));
        await tester.tap(find.byKey(const Key('save_bank_button')));
        await tester.pumpAndSettle();

        expect(
          tester.widget<Text>(find.byKey(const Key('bank_card_name'))).data,
          equals('ICICI Bank'),
        );
        expect(find.text('**** **** 9988'), findsOneWidget);

        // Open more menu and choose Delete
        await tester.tap(find.byKey(const Key('bank_more_menu_button')));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const Key('bank_menu_delete')));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const Key('confirm_delete_bank_button')));
        await tester.pumpAndSettle();

        expect(find.text('No Bank Account Linked'), findsOneWidget);
      },
    );

    testWidgets(
      'Profile supports Help/About screens and Log Out confirmation',
      (tester) async {
        await tester.binding.setSurfaceSize(const Size(360, 800));
        await tester.pumpWidget(const RiderApp(initialLocation: '/profile'));
        await tester.pumpAndSettle();

        // FAQ'S
        await tester.ensureVisible(find.byKey(const Key('menu_faqs')));
        await tester.tap(find.byKey(const Key('menu_faqs')));
        await tester.pumpAndSettle();
        expect(find.byKey(const Key('faq_screen_scaffold')), findsOneWidget);
        expect(find.text('When will I receive my earnings?'), findsOneWidget);
        await tester.enterText(
          find.byKey(const Key('faq_search_field')),
          'multiple pickups',
        );
        await tester.pumpAndSettle();
        expect(
          find.text('Can I see multiple pickups and drops in one order?'),
          findsOneWidget,
        );
        await tester.tap(find.byKey(const Key('profile_back_button')));
        await tester.pumpAndSettle();

        // Contact Support
        await tester.ensureVisible(
          find.byKey(const Key('menu_contact_support')),
        );
        await tester.tap(find.byKey(const Key('menu_contact_support')));
        await tester.pumpAndSettle();
        expect(
          find.byKey(const Key('contact_support_screen_scaffold')),
          findsOneWidget,
        );
        expect(find.text("What's the issue at pickup?"), findsOneWidget);
        await tester.tap(find.text('Order not ready'));
        await tester.pumpAndSettle();
        expect(find.text('Order not ready'), findsOneWidget);
        expect(
          find.text(
            'Please wait up to 5 minutes at the counter or notify dispatch if the delay continues.',
          ),
          findsOneWidget,
        );
        await tester.tap(find.byKey(const Key('support_end_chat_button')));
        await tester.pumpAndSettle();

        // About App
        await tester.ensureVisible(find.byKey(const Key('menu_about_app')));
        await tester.tap(find.byKey(const Key('menu_about_app')));
        await tester.pumpAndSettle();
        expect(
          find.byKey(const Key('about_app_screen_scaffold')),
          findsOneWidget,
        );
        expect(find.text('Fillcarts'), findsOneWidget);
        expect(find.text('Version 1.0.0'), findsOneWidget);
        await tester.tap(find.byKey(const Key('profile_back_button')));
        await tester.pumpAndSettle();

        // Privacy Policy
        await tester.ensureVisible(
          find.byKey(const Key('menu_privacy_policy')),
        );
        await tester.tap(find.byKey(const Key('menu_privacy_policy')));
        await tester.pumpAndSettle();
        expect(
          find.byKey(const Key('privacy_policy_screen_scaffold')),
          findsOneWidget,
        );
        expect(find.text('Last updated: 24 Nov 2026'), findsOneWidget);
        expect(find.text('1. Information We Collect'), findsOneWidget);
        expect(find.text('5. Your Rights'), findsOneWidget);
        await tester.ensureVisible(find.byKey(const Key('privacy_section_1')));
        await tester.tap(find.byKey(const Key('privacy_section_1')));
        await tester.pumpAndSettle();
        expect(
          find.text(
            'We use your information to verify your rider account, assign nearby delivery orders, process payouts and incentives, and provide timely support.',
          ),
          findsOneWidget,
        );
        await tester.tap(find.byKey(const Key('profile_back_button')));
        await tester.pumpAndSettle();

        // Log Out
        await tester.ensureVisible(
          find.byKey(const Key('profile_logout_button')),
        );
        await tester.tap(find.byKey(const Key('profile_logout_button')));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const Key('confirm_logout_button')));
        await tester.pumpAndSettle();

        // Redirects to Phone Input Screen
        expect(find.text('Log Out'), findsNothing);
      },
    );
  });
}
