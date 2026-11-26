import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Dark-themed calendar dialog matching Figma single-day & weekly-range popovers.
Future<DateTime?> showIncentiveCalendarDialog({
  required BuildContext context,
  required DateTime initialDate,
  required bool isWeeklyMode,
}) {
  return showDialog<DateTime>(
    context: context,
    barrierColor: const Color(0x66000000),
    builder: (dialogContext) => Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
      child: _IncentiveCalendarCard(
        initialDate: initialDate,
        isWeeklyMode: isWeeklyMode,
      ),
    ),
  );
}

class _IncentiveCalendarCard extends StatefulWidget {
  final DateTime initialDate;
  final bool isWeeklyMode;

  const _IncentiveCalendarCard({
    required this.initialDate,
    required this.isWeeklyMode,
  });

  @override
  State<_IncentiveCalendarCard> createState() => _IncentiveCalendarCardState();
}

class _IncentiveCalendarCardState extends State<_IncentiveCalendarCard> {
  static const List<String> _months = [
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
  static const List<String> _weekdays = [
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa',
    'Su',
  ];

  late DateTime _visibleMonth;
  late DateTime _selectedStart;

  @override
  void initState() {
    super.initState();
    _selectedStart = DateTime(
      widget.initialDate.year,
      widget.initialDate.month,
      widget.initialDate.day,
    );
    _visibleMonth = DateTime(_selectedStart.year, _selectedStart.month);
  }

  DateTime get _selectedEnd => widget.isWeeklyMode
      ? _selectedStart.add(const Duration(days: 6))
      : _selectedStart;

  bool _isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  bool _isInRange(DateTime day) {
    if (!widget.isWeeklyMode) return false;
    return !day.isBefore(_selectedStart) && !day.isAfter(_selectedEnd);
  }

  void _changeMonth(int delta) {
    setState(() {
      _visibleMonth = DateTime(_visibleMonth.year, _visibleMonth.month + delta);
    });
  }

  @override
  Widget build(BuildContext context) {
    final daysInMonth = DateUtils.getDaysInMonth(
      _visibleMonth.year,
      _visibleMonth.month,
    );
    final firstWeekday = DateTime(
      _visibleMonth.year,
      _visibleMonth.month,
      1,
    ).weekday; // 1=Mo..7=Su
    final leadingEmpty = firstWeekday - 1;
    final totalCells = ((leadingEmpty + daysInMonth + 6) ~/ 7) * 7;

    return Container(
      key: const Key('incentive_calendar_dialog'),
      width: 320,
      padding: const EdgeInsets.fromLTRB(20, 22, 20, 22),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1F26),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  '${_months[_visibleMonth.month - 1]} ${_visibleMonth.year}',
                  key: const Key('calendar_month_label'),
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ),
              IconButton(
                key: const Key('calendar_prev_month'),
                onPressed: () => _changeMonth(-1),
                icon: const Icon(
                  Icons.chevron_left,
                  color: Colors.white,
                  size: 20,
                ),
                visualDensity: VisualDensity.compact,
              ),
              IconButton(
                key: const Key('calendar_next_month'),
                onPressed: () => _changeMonth(1),
                icon: const Icon(
                  Icons.chevron_right,
                  color: Colors.white,
                  size: 20,
                ),
                visualDensity: VisualDensity.compact,
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: _weekdays
                .map(
                  (day) => Expanded(
                    child: Center(
                      child: Text(
                        day,
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 10),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: totalCells,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 8,
              childAspectRatio: 1,
            ),
            itemBuilder: (context, index) {
              final dayNumber = index - leadingEmpty + 1;
              if (dayNumber < 1 || dayNumber > daysInMonth) {
                return const SizedBox.shrink();
              }

              final cellDate = DateTime(
                _visibleMonth.year,
                _visibleMonth.month,
                dayNumber,
              );
              final isStart = _isSameDay(cellDate, _selectedStart);
              final isEnd = _isSameDay(cellDate, _selectedEnd);
              final inRange = _isInRange(cellDate);
              final colIndex = index % 7;

              return GestureDetector(
                key: Key('calendar_day_$dayNumber'),
                onTap: () {
                  setState(() {
                    _selectedStart = cellDate;
                  });
                  Navigator.of(context).pop(cellDate);
                },
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    if (inRange)
                      Positioned.fill(
                        child: Row(
                          children: [
                            Expanded(
                              child: Container(
                                color: isStart || colIndex == 0
                                    ? Colors.transparent
                                    : const Color(0xB3EA73FF),
                              ),
                            ),
                            Expanded(
                              child: Container(
                                color: isEnd || colIndex == 6
                                    ? Colors.transparent
                                    : const Color(0xB3EA73FF),
                              ),
                            ),
                          ],
                        ),
                      ),
                    if (inRange && isStart && colIndex != 6)
                      Align(
                        alignment: Alignment.centerRight,
                        child: FractionallySizedBox(
                          widthFactor: 0.5,
                          heightFactor: 1,
                          child: Container(color: const Color(0xB3EA73FF)),
                        ),
                      ),
                    if (inRange && isEnd && colIndex != 0)
                      Align(
                        alignment: Alignment.centerLeft,
                        child: FractionallySizedBox(
                          widthFactor: 0.5,
                          heightFactor: 1,
                          child: Container(color: const Color(0xB3EA73FF)),
                        ),
                      ),
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: (isStart || isEnd)
                            ? const Color(0xFFE040FB)
                            : Colors.transparent,
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '$dayNumber',
                        style: GoogleFonts.poppins(
                          fontSize: 13.5,
                          fontWeight: (isStart || isEnd)
                              ? FontWeight.w600
                              : FontWeight.w400,
                          color: (isStart || isEnd)
                              ? Colors.black
                              : inRange
                              ? const Color(0xFF1F2937)
                              : const Color(0xFFD1D5DB),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
