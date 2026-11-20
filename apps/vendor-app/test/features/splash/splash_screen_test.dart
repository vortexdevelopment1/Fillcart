import 'package:fillcart_vendor/core/constants/app_assets.dart';
import 'package:fillcart_vendor/features/splash/splash.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('SplashScreen Widget Tests', () {
    testWidgets('renders SplashScreen with centered logo asset and white background', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SplashScreen(
            duration: Duration(seconds: 1),
          ),
        ),
      );

      // Verify Scaffold with white background
      final scaffold = tester.widget<Scaffold>(find.byType(Scaffold));
      expect(scaffold.backgroundColor, Colors.white);

      // Verify Image.asset is rendered with AppAssets.splashLogo
      final imageFinder = find.byType(Image);
      expect(imageFinder, findsOneWidget);

      final imageWidget = tester.widget<Image>(imageFinder);
      expect(imageWidget.image, isA<AssetImage>());
      final assetImage = imageWidget.image as AssetImage;
      expect(assetImage.assetName, AppAssets.splashLogo);
      expect(imageWidget.fit, BoxFit.contain);
    });

    testWidgets('invokes onFinish callback after duration elapses', (
      WidgetTester tester,
    ) async {
      bool finished = false;

      await tester.pumpWidget(
        MaterialApp(
          home: SplashScreen(
            duration: const Duration(milliseconds: 500),
            onFinish: () {
              finished = true;
            },
          ),
        ),
      );

      expect(finished, isFalse);

      // Advance clock past duration
      await tester.pump(const Duration(milliseconds: 600));
      await tester.pumpAndSettle();

      expect(finished, isTrue);
    });
  });
}
