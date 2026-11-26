import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';

import '../widgets/incentive_calendar_dialog.dart';
import '../widgets/profile_theme_constants.dart';

/// Incentive & Rewards Screen matching Figma Today's & Weekly Incentive screens.
class IncentiveScreen extends StatefulWidget {
  const IncentiveScreen({super.key});

  @override
  State<IncentiveScreen> createState() => _IncentiveScreenState();
}

class _IncentiveScreenState extends State<IncentiveScreen> {
  static const List<String> _fullMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  static const List<String> _shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  static const List<String> _shortWeekdays3 = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];
  static const List<String> _shortWeekdays2 = [
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa',
    'Su',
  ];

  bool _isWeekly = false;
  DateTime _dailyAnchor = DateTime(2020, 6, 23);
  int _selectedDailyIndex = 0;

  DateTime _weeklyAnchor = DateTime(2020, 10, 8);
  int _selectedWeeklyIndex = 0;

  List<DateTime> get _dailyOptions => List.generate(
    5,
    (index) => _dailyAnchor.add(Duration(days: index)),
  );

  List<DateTime> get _weeklyOptions => List.generate(
    4,
    (index) => _weeklyAnchor.add(Duration(days: index * 7)),
  );

  int _completedOrdersForSelection() {
    if (_isWeekly) {
      return const [3, 4, 2, 5][_selectedWeeklyIndex % 4];
    }
    return const [3, 4, 2, 1, 5][_selectedDailyIndex % 5];
  }

  Future<void> _openCalendar() async {
    final initial = _isWeekly
        ? _weeklyOptions[_selectedWeeklyIndex]
        : _dailyOptions[_selectedDailyIndex];
    final picked = await showIncentiveCalendarDialog(
      context: context,
      initialDate: initial,
      isWeeklyMode: _isWeekly,
    );
    if (picked != null && mounted) {
      setState(() {
        if (_isWeekly) {
          _weeklyAnchor = picked;
          _selectedWeeklyIndex = 0;
        } else {
          _dailyAnchor = picked;
          _selectedDailyIndex = 0;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final completedOrders = _completedOrdersForSelection();
    const targetOrders = 5;
    final remaining = (targetOrders - completedOrders).clamp(0, targetOrders);
    final percent = ((completedOrders / targetOrders) * 100).round();

    return Scaffold(
      key: const Key('incentive_screen_scaffold'),
      backgroundColor: ProfileTokens.background,
      body: SafeArea(
        child: Column(
          children: [
            const ProfileScreenHeader(title: 'Incentive'),
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                child: Column(
                  children: [
                    _SegmentedModeToggle(
                      isWeekly: _isWeekly,
                      onChanged: (weekly) {
                        setState(() {
                          _isWeekly = weekly;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    _isWeekly ? _buildWeeklyStrip() : _buildDailyStrip(),
                    const SizedBox(height: 16),
                    _IncentiveProgressBannerCard(
                      completedOrders: completedOrders,
                      targetOrders: targetOrders,
                      remainingOrders: remaining,
                      percent: percent,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDailyStrip() {
    final days = _dailyOptions;
    return Container(
      key: const Key('incentive_daily_strip'),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4EB),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E7DC)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          for (int i = 0; i < days.length; i++)
            Expanded(
              child: GestureDetector(
                key: Key('daily_chip_$i'),
                onTap: () => setState(() => _selectedDailyIndex = i),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: _selectedDailyIndex == i
                        ? Colors.white
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: _selectedDailyIndex == i
                        ? const [
                            BoxShadow(
                              color: Color(0x10000000),
                              blurRadius: 4,
                              offset: Offset(0, 1),
                            ),
                          ]
                        : null,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _fullMonths[days[i].month - 1].substring(
                          0,
                          days[i].month == 6 || days[i].month == 7 ? 4 : 3,
                        ),
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF4B5563),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _selectedDailyIndex == i
                              ? ProfileTokens.magentaAccent
                              : Colors.transparent,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          '${days[i].day}',
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: _selectedDailyIndex == i
                                ? FontWeight.w600
                                : FontWeight.w500,
                            color: _selectedDailyIndex == i
                                ? Colors.white
                                : const Color(0xFF374151),
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _shortWeekdays3[days[i].weekday - 1],
                        style: GoogleFonts.poppins(
                          fontSize: 12,
                          fontWeight: _selectedDailyIndex == i
                              ? FontWeight.w600
                              : FontWeight.w400,
                          color: _selectedDailyIndex == i
                              ? Colors.black
                              : const Color(0xFF4B5563),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          IconButton(
            key: const Key('incentive_calendar_button'),
            onPressed: _openCalendar,
            icon: SvgPicture.asset(
              'assets/svg/calender.svg',
              width: 28,
              height: 28,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyStrip() {
    final weeks = _weeklyOptions;
    return Container(
      key: const Key('incentive_weekly_strip'),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F4EB),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE5E7DC)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          for (int i = 0; i < weeks.length; i++)
            Expanded(
              child: GestureDetector(
                key: Key('weekly_chip_$i'),
                onTap: () => setState(() => _selectedWeeklyIndex = i),
                child: Builder(
                  builder: (context) {
                    final start = weeks[i];
                    final end = start.add(const Duration(days: 6));
                    final isSelected = _selectedWeeklyIndex == i;
                    final monthLabel = _shortMonths[start.month - 1];
                    final rangeLabel = '${start.day}-${end.day}';
                    final wdLabel =
                        '${_shortWeekdays2[start.weekday - 1]}-${_shortWeekdays2[end.weekday - 1]}';

                    return Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 8,
                        horizontal: 2,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected ? Colors.white : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: isSelected
                            ? const [
                                BoxShadow(
                                  color: Color(0x10000000),
                                  blurRadius: 4,
                                  offset: Offset(0, 1),
                                ),
                              ]
                            : null,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            monthLabel,
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              fontWeight: FontWeight.w400,
                              color: const Color(0xFF4B5563),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? ProfileTokens.magentaAccent
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                rangeLabel,
                                maxLines: 1,
                                style: GoogleFonts.poppins(
                                  fontSize: 11.5,
                                  fontWeight: isSelected
                                      ? FontWeight.w600
                                      : FontWeight.w500,
                                  color: isSelected
                                      ? Colors.white
                                      : const Color(0xFF374151),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 6),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              wdLabel,
                              maxLines: 1,
                              style: GoogleFonts.poppins(
                                fontSize: 11.5,
                                fontWeight: isSelected
                                    ? FontWeight.w600
                                    : FontWeight.w400,
                                color: isSelected
                                    ? Colors.black
                                    : const Color(0xFF4B5563),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
          IconButton(
            key: const Key('incentive_calendar_button'),
            onPressed: _openCalendar,
            icon: SvgPicture.asset(
              'assets/svg/calender.svg',
              width: 28,
              height: 28,
            ),
          ),
        ],
      ),
    );
  }
}

class _SegmentedModeToggle extends StatelessWidget {
  final bool isWeekly;
  final ValueChanged<bool> onChanged;

  const _SegmentedModeToggle({
    required this.isWeekly,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 46,
      padding: const EdgeInsets.all(5),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(999),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              key: const Key('incentive_todays_tab'),
              onTap: () => onChanged(false),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: !isWeekly
                      ? ProfileTokens.incentiveOlive
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  "Today's",
                  style: GoogleFonts.poppins(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: !isWeekly ? Colors.white : Colors.black,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              key: const Key('incentive_weekly_tab'),
              onTap: () => onChanged(true),
              child: Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: isWeekly
                      ? ProfileTokens.incentiveOlive
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  'Weekly',
                  style: GoogleFonts.poppins(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color: isWeekly ? Colors.white : Colors.black,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _IncentiveProgressBannerCard extends StatelessWidget {
  final int completedOrders;
  final int targetOrders;
  final int remainingOrders;
  final int percent;

  const _IncentiveProgressBannerCard({
    required this.completedOrders,
    required this.targetOrders,
    required this.remainingOrders,
    required this.percent,
  });

  @override
  Widget build(BuildContext context) {
    final headlineText = remainingOrders == 0
        ? 'Goal achieved!'
        : '$remainingOrders more order${remainingOrders == 1 ? '' : 's'}';
    final subText = remainingOrders == 0
        ? 'you unlocked your incentive reward'
        : 'to earn your incentive reward';

    return Container(
      key: const Key('incentive_reward_card'),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFFF6D9FF),
            Color(0xFFEDAFFF),
            Color(0xFFE097FC),
          ],
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 8,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 7,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SvgPicture.asset(
                            'assets/svg/incentives.svg',
                            width: 16,
                            height: 16,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'UNLOCK INCENTIVE',
                            style: GoogleFonts.poppins(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w500,
                              color: Colors.black,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerRight,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'COMPLETE WITHIN',
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w400,
                            color: const Color(0xFF4B5563),
                          ),
                        ),
                        Text(
                          '5:00 AM – 7:00 PM',
                          style: GoogleFonts.poppins(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w500,
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: Color(0x339333EA)),
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 16, 14, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  headlineText,
                  key: const Key('incentive_remaining_orders'),
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subText,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Expanded(
                      child: Text(
                        '$completedOrders/$targetOrders Orders Completed',
                        key: const Key('incentive_completed_ratio'),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.poppins(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF1F2937),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Image.asset(
                      'assets/icons/profile_incentive.png',
                      width: 38,
                      height: 38,
                      fit: BoxFit.contain,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                _SegmentedStepBar(
                  completed: completedOrders,
                  total: targetOrders,
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SvgPicture.asset(
                        'assets/svg/light.svg',
                        width: 16,
                        height: 16,
                      ),
                      const SizedBox(width: 8),
                      Flexible(
                        child: Text.rich(
                          TextSpan(
                            style: GoogleFonts.poppins(
                              fontSize: 12.5,
                              color: Colors.black,
                            ),
                            children: [
                              const TextSpan(text: "Keep going — you're "),
                              TextSpan(
                                text: '$percent%',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const TextSpan(text: ' of the way there!'),
                            ],
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
}

class _SegmentedStepBar extends StatelessWidget {
  final int completed;
  final int total;

  const _SegmentedStepBar({required this.completed, required this.total});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: Container(
            height: 12,
            color: const Color(0x80F8E7FF),
            child: Row(
              children: [
                for (int i = 0; i < total; i++)
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: i < completed
                            ? const Color(0xFF9E1CF3)
                            : Colors.transparent,
                        border: i < total - 1
                            ? const Border(
                                right: BorderSide(
                                  color: Color(0x667E22CE),
                                  width: 1,
                                ),
                              )
                            : null,
                        borderRadius: i == completed - 1
                            ? const BorderRadius.horizontal(
                                right: Radius.circular(999),
                              )
                            : null,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            for (int i = 1; i <= total; i++)
              Text(
                '$i',
                style: GoogleFonts.poppins(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w500,
                  color: i <= completed
                      ? const Color(0xFF1F2937)
                      : const Color(0xFF6B21A8),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
