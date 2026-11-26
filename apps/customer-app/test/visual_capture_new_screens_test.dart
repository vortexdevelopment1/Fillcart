import 'dart:io';
import 'dart:ui' as ui;
import 'package:fillcart_customer/features/profile/presentation/screens/about_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/account_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/add_address_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/app_settings_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/faq_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/personal_info_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/privacy_policy_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/saved_address_screen.dart';
import 'package:fillcart_customer/features/profile/presentation/screens/terms_of_service_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/categories_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/orders_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/search_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/store_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final outDir = Directory('C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d/screenshots');

  Future<void> captureScreen({
    required WidgetTester tester,
    required Widget screen,
    required String filename,
    Size size = const Size(412, 915),
  }) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    binding.platformDispatcher.textScaleFactorTestValue = 1.0;
    await binding.setSurfaceSize(size);

    final repaintKey = GlobalKey();

    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          fontFamily: 'Montserrat',
          scaffoldBackgroundColor: const Color(0xFFFFFCF3),
        ),
        home: RepaintBoundary(
          key: repaintKey,
          child: MediaQuery(
            data: MediaQueryData(
              size: size,
              padding: const EdgeInsets.only(top: 40, bottom: 20),
            ),
            child: screen,
          ),
        ),
      ),
    );

    await tester.runAsync(() async {
      for (final element in find.byType(Image).evaluate()) {
        final widget = element.widget as Image;
        if (widget.image is AssetImage) {
          try {
            await precacheImage(widget.image, repaintKey.currentContext!);
          } catch (_) {}
        }
      }
    });

    await tester.pumpAndSettle();

    await tester.runAsync(() async {
      final boundary = repaintKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 2.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      final bytes = byteData!.buffer.asUint8List();
      if (!outDir.existsSync()) outDir.createSync(recursive: true);
      File('${outDir.path}/$filename').writeAsBytesSync(bytes);
    });
  }

  testWidgets('Capture visual screenshots of Categories, Orders, and Search screens', (tester) async {
    await captureScreen(
      tester: tester,
      screen: const CategoriesScreen(),
      filename: 'categories_screen_rendered.png',
      size: const Size(412, 980),
    );

    await captureScreen(
      tester: tester,
      screen: const OrdersScreen(initialTabIndex: 0, showActiveOrder: true),
      filename: 'orders_buy_again_rendered.png',
      size: const Size(412, 1150),
    );

    await captureScreen(
      tester: tester,
      screen: const OrdersScreen(initialTabIndex: 1, showActiveOrder: false),
      filename: 'orders_history_rendered.png',
      size: const Size(412, 915),
    );

    await captureScreen(
      tester: tester,
      screen: const AccountScreen(),
      filename: 'account_screen_rendered.png',
      size: const Size(412, 980),
    );

    await captureScreen(
      tester: tester,
      screen: const PersonalInfoScreen(),
      filename: 'personal_info_screen_rendered.png',
      size: const Size(412, 915),
    );

    await captureScreen(
      tester: tester,
      screen: const SearchScreen(),
      filename: 'search_screen_rendered.png',
      size: const Size(412, 915),
    );

    await captureScreen(
      tester: tester,
      screen: const StoreDetailsScreen(initialCartBarIndex: 0, autoCycleCartBar: false),
      filename: 'store_details_state_1.png',
      size: const Size(412, 1100),
    );

    await captureScreen(
      tester: tester,
      screen: const StoreDetailsScreen(initialCartBarIndex: 1, autoCycleCartBar: false),
      filename: 'store_details_state_2.png',
      size: const Size(412, 1100),
    );

    await captureScreen(
      tester: tester,
      screen: const StoreDetailsScreen(initialCartBarIndex: 2, autoCycleCartBar: false),
      filename: 'store_details_state_3.png',
      size: const Size(412, 1100),
    );

    await captureScreen(
      tester: tester,
      screen: const AppSettingsScreen(),
      filename: 'app_settings_screen_rendered.png',
      size: const Size(412, 1050),
    );

    await captureScreen(
      tester: tester,
      screen: const FaqScreen(),
      filename: 'faq_screen_rendered.png',
      size: const Size(412, 1050),
    );

    await captureScreen(
      tester: tester,
      screen: const SavedAddressScreen(),
      filename: 'saved_address_screen_rendered.png',
      size: const Size(412, 915),
    );

    await captureScreen(
      tester: tester,
      screen: const AddAddressScreen(),
      filename: 'add_address_screen_rendered.png',
      size: const Size(412, 1050),
    );

    await captureScreen(
      tester: tester,
      screen: const AddAddressScreen(initialFullMapMode: true),
      filename: 'address_autodetection_rendered.png',
      size: const Size(412, 915),
    );

    await captureScreen(
      tester: tester,
      screen: const AboutScreen(),
      filename: 'about_screen_rendered.png',
      size: const Size(412, 915),
    );

    await captureScreen(
      tester: tester,
      screen: const TermsOfServiceScreen(),
      filename: 'terms_of_service_screen_rendered.png',
      size: const Size(412, 980),
    );

    await captureScreen(
      tester: tester,
      screen: const PrivacyPolicyScreen(),
      filename: 'privacy_policy_screen_rendered.png',
      size: const Size(412, 980),
    );
  });
}
