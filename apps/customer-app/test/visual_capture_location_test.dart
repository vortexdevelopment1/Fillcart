import 'dart:io';
import 'dart:ui' as ui;
import 'package:fillcart_customer/core/constants/app_assets.dart';
import 'package:fillcart_customer/features/location/presentation/screens/confirm_location_screen.dart';
import 'package:fillcart_customer/features/location/presentation/screens/enable_location_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Capture visual screenshots of location screens',
      (WidgetTester tester) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    binding.platformDispatcher.textScaleFactorTestValue = 1.0;
    await binding.setSurfaceSize(const Size(460, 1024));
    addTearDown(() => binding.setSurfaceSize(null));

    // 1. EnableLocationScreen
    final key1 = GlobalKey();
    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: RepaintBoundary(
          key: key1,
          child: const MediaQuery(
            data: MediaQueryData(
              size: Size(460, 1024),
              padding: EdgeInsets.only(top: 48, bottom: 24),
            ),
            child: EnableLocationScreen(),
          ),
        ),
      ),
    );
    // Precache map image so it paints in frame 1
    await tester.runAsync(() async {
      await precacheImage(
        const AssetImage(AppAssets.mapBg),
        key1.currentContext!,
      );
    });
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));

    await tester.runAsync(() async {
      final boundary1 =
          key1.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image1 = await boundary1.toImage(pixelRatio: 1.0);
      final byteData1 = await image1.toByteData(format: ui.ImageByteFormat.png);
      final dir = Directory('build/screenshots');
      if (!dir.existsSync()) dir.createSync(recursive: true);
      File('build/screenshots/enable_location_actual.png')
          .writeAsBytesSync(byteData1!.buffer.asUint8List());
    });

    // 2. ConfirmLocationScreen
    final key2 = GlobalKey();
    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        home: RepaintBoundary(
          key: key2,
          child: const MediaQuery(
            data: MediaQueryData(
              size: Size(460, 1024),
              padding: EdgeInsets.only(top: 48, bottom: 24),
            ),
            child: ConfirmLocationScreen(),
          ),
        ),
      ),
    );
    await tester.runAsync(() async {
      await precacheImage(
        const AssetImage(AppAssets.mapBg),
        key2.currentContext!,
      );
    });
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));

    await tester.runAsync(() async {
      final boundary2 =
          key2.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image2 = await boundary2.toImage(pixelRatio: 1.0);
      final byteData2 = await image2.toByteData(format: ui.ImageByteFormat.png);
      File('build/screenshots/confirm_location_actual.png')
          .writeAsBytesSync(byteData2!.buffer.asUint8List());
    });
  });
}
