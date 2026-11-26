import 'package:fillcart_customer/features/home/presentation/screens/customer_home_screen.dart';
import 'package:fillcart_customer/features/shop/data/models/product_model.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/cart_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/category_listing_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/order_confirmed_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/order_delivered_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/order_tracking_screen.dart';
import 'package:fillcart_customer/features/shop/presentation/screens/product_details_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Widget wrap(Widget child) {
    return MaterialApp(
      home: child,
    );
  }

  group('Customer Shopping Flow Screens Tests', () {
    testWidgets('CustomerHomeScreen renders storefront components properly', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CustomerHomeScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Bengali Indore'), findsOneWidget);
      expect(find.text('Delivering to'), findsOneWidget);
      expect(find.text('Grocery'), findsOneWidget);
      expect(find.text('Fresh'), findsOneWidget);
      expect(find.text('Snacks & Beverages'), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.byWidgetPredicate((w) => w is Image && w.image is AssetImage && (w.image as AssetImage).assetName == 'assets/card-icons/Categories.png'), findsOneWidget);
      expect(find.byWidgetPredicate((w) => w is Image && w.image is AssetImage && (w.image as AssetImage).assetName == 'assets/card-icons/Order 4.png'), findsOneWidget);
    });

    testWidgets('CategoryListingScreen renders chips and products', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CategoryListingScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Atta, Dal & Rice'), findsOneWidget);
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Atta'), findsOneWidget);
      expect(find.text('Dal'), findsOneWidget);
      expect(find.text('Filter'), findsOneWidget);
      expect(find.textContaining('Fortune Atta'), findsWidgets);
    });

    testWidgets('ProductDetailsScreen renders product info and actions', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      const testProduct = ProductItem(
        id: 'p_test',
        title: 'Fortune Moong dal',
        weight: '1 kg',
        currentPrice: 129,
        originalPrice: 160,
        discountPercent: 19,
        imagePath: 'assets/images/image 1.png',
      );

      await tester.pumpWidget(wrap(const ProductDetailsScreen(product: testProduct)));
      await tester.pumpAndSettle();

      expect(find.text('Fortune Moong dal'), findsOneWidget);
      expect(find.text('Quantity'), findsOneWidget);
      expect(find.text('Product details'), findsOneWidget);
      expect(find.text('Seller Details'), findsOneWidget);
      expect(find.text('Add to Cart'), findsOneWidget);
      expect(find.text('Buy Now'), findsOneWidget);
    });

    testWidgets('CartScreen renders items and bill breakdown', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const CartScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Cart'), findsOneWidget);
      expect(find.text('Order Summary'), findsOneWidget);
      expect(find.text('7 Items'), findsOneWidget);
      expect(find.text('Bill Details'), findsOneWidget);
      expect(find.text('Total Payable'), findsOneWidget);
      expect(find.text('₹473'), findsOneWidget);
      expect(find.text('Place Order'), findsOneWidget);
    });

    testWidgets('OrderConfirmedScreen renders delivery time and address', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const OrderConfirmedScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Order Confirmed!'), findsOneWidget);
      expect(find.text('Expected Delivery'), findsOneWidget);
      expect(find.text('Arriving in 15-20 mins'), findsOneWidget);
      expect(find.text('Track Order'), findsOneWidget);
    });

    testWidgets('OrderTrackingScreen renders order status and partner info', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const OrderTrackingScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Order Tracking'), findsOneWidget);
      expect(find.text('Store Accepted Your Order'), findsOneWidget);
      expect(find.text('Estimated delivery in 15 mins'), findsOneWidget);
      expect(find.text('Fresh Mart'), findsOneWidget);
      expect(find.text('Rahul'), findsOneWidget);
      expect(find.text('Order Summary'), findsOneWidget);
      expect(find.text('Paid via UPI'), findsOneWidget);
      expect(find.text('Delivering to'), findsOneWidget);
    });

    testWidgets('OrderDeliveredScreen renders confirmation and ratings', (tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(wrap(const OrderDeliveredScreen()));
      await tester.pumpAndSettle();

      expect(find.text('Order Delivered!'), findsOneWidget);
      expect(find.text('ORDER ID #OD552194'), findsOneWidget);
      expect(find.text('Delivered at'), findsOneWidget);
      expect(find.text('02:45 PM'), findsOneWidget);
      expect(find.text('How was your experience?'), findsOneWidget);
      expect(find.text('Rate Rider'), findsOneWidget);
      expect(find.text('Rate Order'), findsOneWidget);
    });
  });
}
