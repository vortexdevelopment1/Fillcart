import 'package:fillcart_customer/features/home/presentation/screens/customer_home_screen.dart';
import 'package:fillcart_customer/features/location/presentation/screens/confirm_location_screen.dart';
import 'package:fillcart_customer/features/location/presentation/screens/enable_location_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('EnableLocationScreen renders Figma elements and navigates',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: EnableLocationScreen()));
    await tester.pumpAndSettle();

    // Verify header buttons
    expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    expect(find.text('Skip'), findsOneWidget);

    // Verify card content
    expect(find.text('Find stores near you'), findsOneWidget);
    expect(
      find.textContaining(
        'Allow location access to find nearby',
      ),
      findsOneWidget,
    );
    expect(find.text('Allow Location'), findsOneWidget);
    expect(find.text('Enter Location Manually'), findsOneWidget);
    expect(find.text('You can change this later in settings.'), findsOneWidget);

    // Tap Allow Location to navigate to ConfirmLocationScreen
    await tester.tap(find.text('Allow Location'));
    await tester.pumpAndSettle();
    expect(find.byType(ConfirmLocationScreen), findsOneWidget);
  });

  testWidgets('EnableLocationScreen Skip navigates to CustomerHomeScreen',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: EnableLocationScreen()));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Skip'));
    await tester.pumpAndSettle();
    expect(find.byType(CustomerHomeScreen), findsOneWidget);
  });

  testWidgets('ConfirmLocationScreen renders Figma elements and navigates',
      (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(home: ConfirmLocationScreen()));
    await tester.pumpAndSettle();

    // Verify close button
    expect(find.byIcon(Icons.close), findsOneWidget);

    // Verify card content
    expect(find.text('Is this your current location?'), findsOneWidget);
    expect(
      find.text('56, MG Road, Indore,\nMadhya Pradesh 452001'),
      findsOneWidget,
    );
    expect(find.text('Accuracy: High'), findsOneWidget);
    expect(find.text('Yes, Deliver Here'), findsOneWidget);
    expect(find.text('Change Location'), findsOneWidget);

    // Tap Yes, Deliver Here to navigate to CustomerHomeScreen
    await tester.tap(find.text('Yes, Deliver Here'));
    await tester.pumpAndSettle();
    expect(find.byType(CustomerHomeScreen), findsOneWidget);
  });
}
