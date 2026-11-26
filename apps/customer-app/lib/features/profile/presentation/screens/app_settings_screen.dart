import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// App Setting Screen matching Figma reference media_1795674006217_4fe1a161.png.
class AppSettingsScreen extends StatefulWidget {
  final String initialAppearance;
  final String initialLanguage;

  const AppSettingsScreen({
    super.key,
    this.initialAppearance = 'Light',
    this.initialLanguage = 'English',
  });

  @override
  State<AppSettingsScreen> createState() => _AppSettingsScreenState();
}

class _AppSettingsScreenState extends State<AppSettingsScreen> {
  late String _selectedAppearance;
  late String _selectedLanguage;

  bool _orderUpdates = true;
  bool _offersDeals = true;
  bool _soundAlerts = false;
  bool _locationAccess = false;
  bool _shareAnalytics = true;

  @override
  void initState() {
    super.initState();
    _selectedAppearance = widget.initialAppearance;
    _selectedLanguage = widget.initialLanguage;
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        systemNavigationBarColor: Color(0xFFFFFCF3),
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFFFFCF3),
        body: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 10),

                // Top Navigation Bar
                Row(
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.of(context).maybePop(),
                      behavior: HitTestBehavior.opaque,
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.05),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: const Icon(Icons.arrow_back, color: Color(0xFF1E1E1E), size: 20),
                      ),
                    ),
                    const SizedBox(width: 14),
                    const Text(
                      'App Setting',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1E1E1E),
                      ),
                    ),
                    const Spacer(),
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: const Icon(Icons.search, color: Color(0xFF1E1E1E), size: 20),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // 1. APPEARANCE
                _buildSectionHeader('APPEARANCE'),
                _buildCardGroup(
                  children: [
                    _buildRadioItem(
                      title: 'Light',
                      isSelected: _selectedAppearance == 'Light',
                      isFirst: true,
                      onTap: () => setState(() => _selectedAppearance = 'Light'),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildRadioItem(
                      title: 'Dark',
                      isSelected: _selectedAppearance == 'Dark',
                      onTap: () => setState(() => _selectedAppearance = 'Dark'),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildRadioItem(
                      title: 'System Default',
                      isSelected: _selectedAppearance == 'System Default',
                      isLast: true,
                      onTap: () => setState(() => _selectedAppearance = 'System Default'),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                // 2. LANGUAGE
                _buildSectionHeader('LANGUAGE'),
                _buildCardGroup(
                  children: [
                    _buildRadioItem(
                      title: 'English',
                      isSelected: _selectedLanguage == 'English',
                      isFirst: true,
                      onTap: () => setState(() => _selectedLanguage = 'English'),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildRadioItem(
                      title: 'Hindi',
                      isSelected: _selectedLanguage == 'Hindi',
                      onTap: () => setState(() => _selectedLanguage = 'Hindi'),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildRadioItem(
                      title: 'Kannada',
                      isSelected: _selectedLanguage == 'Kannada',
                      onTap: () => setState(() => _selectedLanguage = 'Kannada'),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildRadioItem(
                      title: 'Tamil',
                      isSelected: _selectedLanguage == 'Tamil',
                      onTap: () => setState(() => _selectedLanguage = 'Tamil'),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildRadioItem(
                      title: 'Telugu',
                      isSelected: _selectedLanguage == 'Telugu',
                      isLast: true,
                      onTap: () => setState(() => _selectedLanguage = 'Telugu'),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                // 3. NOTIFICATIONS
                _buildSectionHeader('NOTIFICATIONS'),
                _buildCardGroup(
                  children: [
                    _buildSwitchItem(
                      title: 'Order updates',
                      subtitle: 'Track deliveries in real-time',
                      value: _orderUpdates,
                      onChanged: (val) => setState(() => _orderUpdates = val),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildSwitchItem(
                      title: 'Offers & deals',
                      subtitle: "Don't miss cashbacks and discounts",
                      value: _offersDeals,
                      onChanged: (val) => setState(() => _offersDeals = val),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildSwitchItem(
                      title: 'Sound alerts',
                      subtitle: 'Play sound for notifications',
                      value: _soundAlerts,
                      onChanged: (val) => setState(() => _soundAlerts = val),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                // 4. PRIVACY
                _buildSectionHeader('PRIVACY'),
                _buildCardGroup(
                  children: [
                    _buildSwitchItem(
                      title: 'Location access',
                      subtitle: 'Required for delivery',
                      value: _locationAccess,
                      onChanged: (val) => setState(() => _locationAccess = val),
                    ),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildSwitchItem(
                      title: 'Share analytics',
                      subtitle: 'Help us improve the app',
                      value: _shareAnalytics,
                      onChanged: (val) => setState(() => _shareAnalytics = val),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                // 5. ABOUT
                _buildSectionHeader('ABOUT'),
                _buildCardGroup(
                  children: [
                    _buildInfoItem(label: 'App version', value: 'v4.12.1'),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildInfoItem(label: 'Build', value: '20260813'),
                    const Divider(height: 1, color: Color(0xFFF3F4F6)),
                    _buildInfoItem(label: 'Platform', value: 'Android 14'),
                  ],
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 11.5,
          fontWeight: FontWeight.w800,
          color: Color(0xFF6B7280),
          letterSpacing: 0.8,
        ),
      ),
    );
  }

  Widget _buildCardGroup({required List<Widget> children}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFF1EEE6)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: children,
      ),
    );
  }

  Widget _buildRadioItem({
    required String title,
    required bool isSelected,
    required VoidCallback onTap,
    bool isFirst = false,
    bool isLast = false,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        color: isSelected ? const Color(0xFFFFFBEB) : Colors.white,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 14.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                color: const Color(0xFF1E1E1E),
              ),
            ),
            if (isSelected)
              const Icon(
                Icons.check,
                size: 18,
                color: Color(0xFFD97706),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchItem({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E1E1E),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF9CA3AF),
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeTrackColor: const Color(0xFFF5A623),
            activeThumbColor: Colors.white,
            inactiveTrackColor: const Color(0xFFE5E7EB),
            inactiveThumbColor: Colors.white,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoItem({required String label, required String value}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E1E1E),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }
}
