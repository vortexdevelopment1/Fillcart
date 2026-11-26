import 'dart:io';
import 'dart:ui' as ui;
import 'package:fillcart_customer/features/home/presentation/screens/customer_home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final outDir = Directory('C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d/screenshots');
  if (!outDir.existsSync()) {
    outDir.createSync(recursive: true);
  }

  testWidgets('Capture visual screenshots of customer home screen with precached assets', (WidgetTester tester) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    binding.platformDispatcher.textScaleFactorTestValue = 1.0;
    await binding.setSurfaceSize(const Size(412, 1200));

    final repaintKey = GlobalKey();

    await tester.pumpWidget(
      MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          fontFamily: 'Montserrat',
          scaffoldBackgroundColor: const Color(0xFFFEFCF6),
        ),
        home: RepaintBoundary(
          key: repaintKey,
          child: const MediaQuery(
            data: MediaQueryData(
              size: Size(412, 1200),
              padding: EdgeInsets.only(top: 40, bottom: 20),
            ),
            child: CustomerHomeScreen(),
          ),
        ),
      ),
    );

    // Precache all AssetImages found in the tree
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

    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));

    final boundary = repaintKey.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    await tester.runAsync(() async {
      final image = await boundary.toImage(pixelRatio: 2.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      final bytes = byteData!.buffer.asUint8List();
      final file = File('${outDir.path}/1_customer_home.png');
      await file.writeAsBytes(bytes);
    });
  });
}
