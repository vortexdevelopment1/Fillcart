class VendorNotification {
  final String id;
  final String title;
  final String subtitle;
  final String timeAgo;
  final bool isToday;
  bool isRead;

  VendorNotification({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.timeAgo,
    required this.isToday,
    this.isRead = false,
  });

  VendorNotification copyWith({
    String? id,
    String? title,
    String? subtitle,
    String? timeAgo,
    bool? isToday,
    bool? isRead,
  }) {
    return VendorNotification(
      id: id ?? this.id,
      title: title ?? this.title,
      subtitle: subtitle ?? this.subtitle,
      timeAgo: timeAgo ?? this.timeAgo,
      isToday: isToday ?? this.isToday,
      isRead: isRead ?? this.isRead,
    );
  }
}
