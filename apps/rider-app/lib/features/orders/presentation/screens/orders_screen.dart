import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../navigation/presentation/widgets/rider_bottom_nav_bar.dart';
import '../widgets/orders_slider_bar.dart';
import 'order_view_details_screen.dart';

/// Order Details Screen implementing Available and Completed tabs.
class OrdersScreen extends StatefulWidget {
  final int initialTabIndex;

  const OrdersScreen({
    super.key,
    this.initialTabIndex = 0,
  });

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  late int _selectedTab;
  int _countdownSeconds = 7;
  Timer? _countdownTimer;
  Timer? _acceptTransitionTimer;
  double _dragOffset = 0.0;
  bool _isAcceptedCheckmark = false;
  bool _isAtEnd = false;
  bool _hasAvailableOrder = true;

  static const _creamBg = Color(0xFFF3F4E5);
  static const _oliveGold = Color(0xFFCCB900);

  @override
  void initState() {
    super.initState();
    _selectedTab = widget.initialTabIndex;
    _startCountdown();
  }

  void _startCountdown() {
    _countdownTimer?.cancel();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_countdownSeconds > 1) {
        setState(() => _countdownSeconds--);
      } else {
        setState(() => _countdownSeconds = 7);
      }
    });
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _acceptTransitionTimer?.cancel();
    super.dispose();
  }

  void _onTabChanged(int index) {
    if (_selectedTab != index) {
      setState(() => _selectedTab = index);
    }
  }

  void _onBack() {
    if (Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    } else {
      context.go('/home');
    }
  }

  void _reachEndAndComplete() {
    if (_isAtEnd || _isAcceptedCheckmark) return;
    setState(() {
      _isAtEnd = true;
    });
    _acceptTransitionTimer?.cancel();
    _acceptTransitionTimer = Timer(const Duration(milliseconds: 700), () {
      if (!mounted) return;
      setState(() {
        _isAcceptedCheckmark = true;
      });
    });
  }

  void _onDismissOrder() {
    setState(() {
      _hasAvailableOrder = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _creamBg,
      bottomNavigationBar: const RiderBottomNavBar(selectedIndex: 1),
      body: SafeArea(
        bottom: false,
        child: Column(
          children: [
            // Header + Slider
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      GestureDetector(
                        onTap: _onBack,
                        behavior: HitTestBehavior.opaque,
                        child: const Padding(
                          padding: EdgeInsets.only(right: 12, top: 4, bottom: 4),
                          child: Icon(
                            Icons.arrow_back,
                            size: 22,
                            color: Color(0xFF000000),
                          ),
                        ),
                      ),
                      Text(
                        'Order Details',
                        key: const Key('orders_screen_heading'),
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF000000),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  OrdersSliderBar(
                    selectedIndex: _selectedTab,
                    onTabChanged: _onTabChanged,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Body
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                child: _selectedTab == 0
                    ? _buildAvailableTab()
                    : _buildCompletedTab(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // 1. AVAILABLE ORDERS TAB (Image 4)
  // ===========================================================================
  Widget _buildAvailableTab() {
    if (!_hasAvailableOrder) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            const Icon(
              Icons.delivery_dining_outlined,
              size: 48,
              color: Color(0xFF52525B),
            ),
            const SizedBox(height: 12),
            Text(
              'No Available Orders',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF000000),
              ),
            ),
            const SizedBox(height: 6),
            TextButton(
              onPressed: () => setState(() {
                _hasAvailableOrder = true;
                _countdownSeconds = 7;
              }),
              child: Text(
                'Check Again',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: _oliveGold,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      key: const Key('available_order_card'),
      width: double.infinity,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          // Top Route Info
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      SizedBox(
                        width: 16,
                        child: Column(
                          children: [
                            const SizedBox(height: 2),
                            SvgPicture.asset(
                              'assets/icons/pickup.svg',
                              width: 16,
                              height: 16,
                            ),
                            const SizedBox(height: 2),
                            Expanded(
                              child: CustomPaint(
                                size: const Size(2, double.infinity),
                                painter: _VerticalDashedLinePainter(),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Pickup',
                                  style: GoogleFonts.poppins(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w400,
                                    color: const Color(0xFF52525B),
                                  ),
                                ),
                                Text(
                                  '0 Km',
                                  style: GoogleFonts.poppins(
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w400,
                                    color: const Color(0xFF52525B),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Restaurant Hub',
                              style: GoogleFonts.poppins(
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                                color: const Color(0xFF000000),
                              ),
                            ),
                            Text(
                              'Vijay Nagar, Indore',
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                fontWeight: FontWeight.w400,
                                color: const Color(0xFF52525B),
                              ),
                            ),
                            const SizedBox(height: 14),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(
                      width: 16,
                      child: SvgPicture.asset(
                        'assets/icons/drop.svg',
                        width: 16,
                        height: 16,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Drop',
                            style: GoogleFonts.poppins(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF52525B),
                            ),
                          ),
                          Text(
                            '1.2 km',
                            style: GoogleFonts.poppins(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF52525B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 2),
                      Text(
                        'Radisson Square, Indore',
                        style: GoogleFonts.poppins(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF000000),
                        ),
                      ),
                      Text(
                        'Tilak Nagar, Indore',
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF52525B),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Bottom Warm Yellow Action Section
          Container(
            width: double.infinity,
            color: const Color(0xFFFFFAC7),
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
            child: Column(
              children: [
                // 3-Step Swipe-to-Accept Slider matching the screen recording:
                // Continuous interpolation as thumb slides (t = 0.0 -> 1.0):
                // - Track: #C4B600 -> #FFE700
                // - Thumb circle: White -> Grey -> Black (with black -> white >>> arrows)
                // - Label: "Accept" (white) -> "Accepted" (black)
                // - Reached end: black SVG thumb on right -> fades to centered black checkmark
                LayoutBuilder(
                  builder: (context, constraints) {
                    const thumbSize = 44.0;
                    const padding = 4.0;
                    final totalWidth = constraints.maxWidth;
                    final maxDrag = (totalWidth - thumbSize - padding * 2)
                        .clamp(0.0, double.infinity);
                    final t = maxDrag > 0
                        ? (_dragOffset / maxDrag).clamp(0.0, 1.0)
                        : 0.0;
                    final reachedEnd = _isAtEnd || t >= 0.95;

                    final trackColor = (reachedEnd || _isAcceptedCheckmark)
                        ? const Color(0xFFFFE700)
                        : Color.lerp(_oliveGold, const Color(0xFFFFE700), t)!;
                    final thumbBgColor = reachedEnd
                        ? const Color(0xFF000000)
                        : Color.lerp(Colors.white, const Color(0xFF000000), t)!;
                    final thumbArrowColor = reachedEnd
                        ? Colors.white
                        : Color.lerp(const Color(0xFF000000), Colors.white, t)!;
                    final showAcceptedText = reachedEnd || t >= 0.35;
                    final labelColor = reachedEnd
                        ? const Color(0xFF000000)
                        : Color.lerp(Colors.white, const Color(0xFF000000), t)!;

                    return GestureDetector(
                      key: const Key('accept_order_slider'),
                      onTap: () {
                        if (_isAtEnd || _isAcceptedCheckmark) return;
                        setState(() => _dragOffset = maxDrag);
                        _reachEndAndComplete();
                      },
                      onHorizontalDragUpdate: (details) {
                        if (_isAtEnd || _isAcceptedCheckmark) return;
                        final nextOffset =
                            (_dragOffset + details.delta.dx).clamp(0.0, maxDrag);
                        setState(() {
                          _dragOffset = nextOffset;
                        });
                        if (maxDrag > 0 && nextOffset >= maxDrag * 0.95) {
                          _reachEndAndComplete();
                        }
                      },
                      onHorizontalDragEnd: (_) {
                        if (_isAtEnd || _isAcceptedCheckmark) return;
                        if (maxDrag > 0 && _dragOffset >= maxDrag * 0.70) {
                          setState(() => _dragOffset = maxDrag);
                          _reachEndAndComplete();
                        } else {
                          setState(() => _dragOffset = 0.0);
                        }
                      },
                      child: Container(
                        height: 52,
                        padding: const EdgeInsets.all(padding),
                        decoration: BoxDecoration(
                          color: trackColor,
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 220),
                          child: _isAcceptedCheckmark
                              ? const Center(
                                  key: ValueKey('checkmark_state'),
                                  child: Icon(
                                    Icons.check_rounded,
                                    key: Key('accept_slider_checkmark'),
                                    size: 30,
                                    color: Color(0xFF000000),
                                  ),
                                )
                              : Stack(
                                  key: const ValueKey('slider_state'),
                                  alignment: Alignment.center,
                                  children: [
                                    Text(
                                      showAcceptedText ? 'Accepted' : 'Accept',
                                      style: GoogleFonts.poppins(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                        color: labelColor,
                                      ),
                                    ),
                                    Align(
                                      alignment: Alignment.centerLeft,
                                      child: Transform.translate(
                                        offset: Offset(_dragOffset, 0),
                                        child: Container(
                                          key: const Key('accept_slider_thumb'),
                                          width: thumbSize,
                                          height: thumbSize,
                                          decoration: BoxDecoration(
                                            color: thumbBgColor,
                                            shape: BoxShape.circle,
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.black
                                                    .withValues(alpha: 0.18),
                                                blurRadius: 4,
                                                offset: const Offset(0, 1),
                                              ),
                                            ],
                                          ),
                                          alignment: Alignment.center,
                                          child: SvgPicture.asset(
                                            'assets/icons/accept_slider.svg',
                                            key: t == 0.0
                                                ? const ValueKey<String>(
                                                    'swip_white_icon',
                                                  )
                                                : reachedEnd
                                                    ? const ValueKey<String>(
                                                        'swip_black_icon',
                                                      )
                                                    : const ValueKey<String>(
                                                        'swip_dragging_icon',
                                                      ),
                                            width: 22,
                                            height: 16,
                                            fit: BoxFit.contain,
                                            colorFilter: t == 0.0
                                                ? null
                                                : ColorFilter.mode(
                                                    thumbArrowColor,
                                                    BlendMode.srcIn,
                                                  ),
                                            placeholderBuilder: (_) =>
                                                const SizedBox(
                                              width: 22,
                                              height: 16,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 12),

                // Countdown Rejection Bar
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFAC7),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFFFFBEBE),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 34,
                        height: 34,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            CircularProgressIndicator(
                              value: _countdownSeconds / 7,
                              strokeWidth: 2.5,
                              backgroundColor: const Color(0xFFFFBEBE),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                Color(0xFFD90D0D),
                              ),
                            ),
                            Text(
                              '${_countdownSeconds}s',
                              style: GoogleFonts.poppins(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFFD90D0D),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Accept within ${_countdownSeconds}s',
                          style: GoogleFonts.poppins(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF3F3F46),
                          ),
                        ),
                      ),
                      GestureDetector(
                        key: const Key('dismiss_order_button'),
                        onTap: _onDismissOrder,
                        child: Container(
                          width: 30,
                          height: 30,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFF52525B),
                              width: 1.2,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: const Icon(
                            Icons.close,
                            size: 16,
                            color: Color(0xFF3F3F46),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 2. COMPLETED ORDERS TAB (Image 5)
  // ===========================================================================
  Widget _buildCompletedTab() {
    return Container(
      key: const Key('completed_order_card'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Status Badge & Timestamp
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF34A853),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 14,
                      height: 14,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.check,
                        size: 10,
                        color: Color(0xFF34A853),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'Completed',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  'Today, 10:30 Am',
                  textAlign: TextAlign.end,
                  style: GoogleFonts.poppins(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF52525B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Distance & Earning Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Total Travel Distance',
                      style: GoogleFonts.poppins(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF000000),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '6.4 Km',
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: FontWeight.w400,
                        color: const Color(0xFF52525B),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '₹95',
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF000000),
                    ),
                  ),
                  Text(
                    'Earn',
                    style: GoogleFonts.poppins(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF52525B),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const Divider(height: 20, color: Color(0xFFE4E4E7)),

          // Route Timeline
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    SizedBox(
                      width: 16,
                      child: Column(
                        children: [
                          const SizedBox(height: 2),
                          SvgPicture.asset(
                            'assets/icons/pickup.svg',
                            width: 16,
                            height: 16,
                          ),
                          const SizedBox(height: 2),
                          Expanded(
                            child: CustomPaint(
                              size: const Size(2, double.infinity),
                              painter: _VerticalDashedLinePainter(),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Restaurant Hub',
                            style: GoogleFonts.poppins(
                              fontSize: 14.5,
                              fontWeight: FontWeight.w500,
                              color: const Color(0xFF000000),
                            ),
                          ),
                          Text(
                            'Vijay Nagar, Indore',
                            style: GoogleFonts.poppins(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF52525B),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'To',
                            style: GoogleFonts.poppins(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w500,
                              color: const Color(0xFF52525B),
                            ),
                          ),
                          const SizedBox(height: 8),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 16,
                    child: SvgPicture.asset(
                      'assets/icons/drop.svg',
                      width: 16,
                      height: 16,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Order Deliver',
                      style: GoogleFonts.poppins(
                        fontSize: 14.5,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF000000),
                      ),
                    ),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.only(left: 28),
                child: Text(
                  'Tilak Nagar, Indore',
                  style: GoogleFonts.poppins(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF52525B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // View Details Button -> navigates to OrderViewDetailsScreen
          GestureDetector(
            key: const Key('view_details_button'),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const OrderViewDetailsScreen(),
                ),
              );
            },
            child: Container(
              width: double.infinity,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFFF7F7F7),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFFD4D4D8),
                  width: 1,
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'View Details',
                    style: GoogleFonts.poppins(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xFF000000),
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Icon(
                    Icons.chevron_right_rounded,
                    size: 20,
                    color: Color(0xFF000000),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _VerticalDashedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF52525B)
      ..strokeWidth = 1.4
      ..strokeCap = StrokeCap.round;

    const dashHeight = 4.0;
    const dashSpace = 4.0;
    double startY = 4.0;
    final x = size.width / 2;

    while (startY < size.height - 4.0) {
      canvas.drawLine(
        Offset(x, startY),
        Offset(x, (startY + dashHeight).clamp(0.0, size.height - 4.0)),
        paint,
      );
      startY += dashHeight + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
