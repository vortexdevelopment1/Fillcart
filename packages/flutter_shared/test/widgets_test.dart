import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Widget buildTestableWidget(Widget child) {
    return MaterialApp(
      theme: FCTheme.lightTheme,
      home: Scaffold(body: Center(child: child)),
    );
  }

  group('FCButton Widget Tests', () {
    testWidgets('renders primary button with label text and handles tap', (
      tester,
    ) async {
      var tapped = false;

      await tester.pumpWidget(
        buildTestableWidget(
          FCButton(text: 'Submit Order', onPressed: () => tapped = true),
        ),
      );

      expect(find.text('Submit Order'), findsOneWidget);
      expect(find.byType(ElevatedButton), findsOneWidget);

      await tester.tap(find.byType(FCButton));
      await tester.pump();

      expect(tapped, isTrue);
    });

    testWidgets('renders secondary and outlined variants correctly', (
      tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          Column(
            children: [
              FCButton(
                text: 'Secondary Action',
                variant: FCButtonVariant.secondary,
                onPressed: () {},
              ),
              FCButton(
                text: 'Outlined Action',
                variant: FCButtonVariant.outlined,
                onPressed: () {},
              ),
            ],
          ),
        ),
      );

      expect(find.text('Secondary Action'), findsOneWidget);
      expect(find.byType(FilledButton), findsOneWidget);

      expect(find.text('Outlined Action'), findsOneWidget);
      expect(find.byType(OutlinedButton), findsOneWidget);
    });

    testWidgets('loading state displays FCLoadingIndicator and disables taps', (
      tester,
    ) async {
      var tapped = false;

      await tester.pumpWidget(
        buildTestableWidget(
          FCButton(
            text: 'Saving Data',
            isLoading: true,
            onPressed: () => tapped = true,
          ),
        ),
      );

      expect(find.byType(FCLoadingIndicator), findsOneWidget);
      expect(find.text('Saving Data'), findsNothing);

      await tester.tap(find.byType(FCButton));
      await tester.pump();

      expect(tapped, isFalse);
    });

    testWidgets('disabled state does not fire onPressed callback', (
      tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const FCButton(text: 'Disabled Button', onPressed: null),
        ),
      );

      final buttonWidget = tester.widget<ElevatedButton>(
        find.byType(ElevatedButton),
      );
      expect(buttonWidget.onPressed, isNull);
    });

    testWidgets('enforces minimum touch target of 48x48dp for accessibility', (
      tester,
    ) async {
      await tester.pumpWidget(
        buildTestableWidget(FCButton(text: 'Touch Target', onPressed: () {})),
      );

      final size = tester.getSize(find.byType(FCButton));
      expect(size.height, greaterThanOrEqualTo(FCSpacing.minTouchTarget));
      expect(size.width, greaterThanOrEqualTo(FCSpacing.minTouchTarget));
    });
  });

  group('FCTextField Widget Tests', () {
    testWidgets('renders label, hint text, and handles user input', (
      tester,
    ) async {
      final controller = TextEditingController();

      await tester.pumpWidget(
        buildTestableWidget(
          FCTextField(
            controller: controller,
            labelText: 'Vendor Email',
            hintText: 'vendor@fillcart.com',
          ),
        ),
      );

      expect(find.text('Vendor Email'), findsOneWidget);
      expect(find.text('vendor@fillcart.com'), findsOneWidget);

      await tester.enterText(find.byType(TextFormField), 'store@fillcart.com');
      await tester.pump();

      expect(controller.text, 'store@fillcart.com');
    });

    testWidgets('displays error text when provided', (tester) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const FCTextField(
            labelText: 'Password',
            errorText: 'Password must be at least 8 characters',
          ),
        ),
      );

      expect(
        find.text('Password must be at least 8 characters'),
        findsOneWidget,
      );
    });

    testWidgets('respects obscureText for sensitive inputs', (tester) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const FCTextField(labelText: 'PIN', obscureText: true),
        ),
      );

      final editableText = tester.widget<EditableText>(
        find.byType(EditableText),
      );
      expect(editableText.obscureText, isTrue);
    });
  });

  group('FCLoadingIndicator Widget Tests', () {
    testWidgets(
      'renders circular progress indicator with expected size and stroke',
      (tester) async {
        await tester.pumpWidget(
          buildTestableWidget(
            const FCLoadingIndicator(size: 32.0, strokeWidth: 3.0),
          ),
        );

        final sizedBox = tester.widget<SizedBox>(find.byType(SizedBox).first);
        expect(sizedBox.width, 32.0);
        expect(sizedBox.height, 32.0);

        final indicator = tester.widget<CircularProgressIndicator>(
          find.byType(CircularProgressIndicator),
        );
        expect(indicator.strokeWidth, 3.0);
      },
    );
  });

  group('FCErrorView Widget Tests', () {
    testWidgets('renders error title, message, and icon', (tester) async {
      await tester.pumpWidget(
        buildTestableWidget(
          const FCErrorView(
            title: 'Connection Lost',
            message: 'Unable to reach the server. Please check your network.',
          ),
        ),
      );

      expect(find.text('Connection Lost'), findsOneWidget);
      expect(
        find.text('Unable to reach the server. Please check your network.'),
        findsOneWidget,
      );
      expect(find.byIcon(Icons.error_outline_rounded), findsOneWidget);
      expect(find.byType(FCButton), findsNothing);
    });

    testWidgets(
      'renders retry button and fires callback when onRetry is provided',
      (tester) async {
        var retried = false;

        await tester.pumpWidget(
          buildTestableWidget(
            FCErrorView(
              message: 'Something went wrong while fetching data.',
              onRetry: () => retried = true,
              retryButtonText: 'Retry Request',
            ),
          ),
        );

        expect(find.text('Retry Request'), findsOneWidget);

        await tester.tap(find.text('Retry Request'));
        await tester.pump();

        expect(retried, isTrue);
      },
    );
  });
}
