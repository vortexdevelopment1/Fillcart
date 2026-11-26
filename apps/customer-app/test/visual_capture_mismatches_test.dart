import 'dart:io';
import 'dart:ui' as ui;
import 'package:fillcart_customer/features/home/presentation/screens/customer_home_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/category_listing_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/order_delivered_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/order_tracking_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final outDir = Directory('C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d/screenshots');
  if (!outDir.existsSync()) {
    outDir.createSync(recursive: true);
  }

  Future<void> captureScreen(WidgetTester tester, Widget screen, String filename, {bool scrollDown = false}) async {
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
          child: MediaQuery(
            data: const MediaQueryData(
              size: Size(412, 915),
              padding: EdgeInsets.only(top: 40, bottom: 20),
            ),
            child: screen,
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

    if (scrollDown) {
      await tester.drag(find.byType(SingleChildScrollView).first, const Offset(0, -900));
      await tester.pumpAndSettle();
    } else {
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
    }

    final boundary = repaintKey.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    await tester.runAsync(() async {
      final image = await boundary.toImage(pixelRatio: 2.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      final bytes = byteData!.buffer.asUint8List();
      final file = File('${outDir.path}/$filename');
      await file.writeAsBytes(bytes);
    });
  }

  testWidgets('Capture visual screenshots of all 4 updated screens', (WidgetTester tester) async {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    await binding.setSurfaceSize(const Size(412, 915));

    await captureScreen(tester, const CustomerHomeScreen(), '1_home_screen_updated.png');
    await captureScreen(tester, const CustomerHomeScreen(), '1_home_screen_lower_updated.png', scrollDown: true);
    await captureScreen(tester, const CategoryListingScreen(), '2_grocery_screen_updated.png');
    await captureScreen(tester, const OrderTrackingScreen(), '3_order_tracking_updated.png');
    await captureScreen(tester, const OrderDeliveredScreen(), '4_order_delivered_updated.png');
  });
}
