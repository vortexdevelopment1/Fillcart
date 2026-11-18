/// Fillcart Shared Library
///
/// Reusable Flutter widgets, themes, networking utilities, and components
/// shared across Fillcart mobile applications (Customer, Vendor, Rider).
library;

// Theme & Tokens
export 'src/theme/colors/fc_colors.dart';
export 'src/theme/fc_theme.dart';
export 'src/theme/spacing/fc_spacing.dart';
export 'src/theme/typography/fc_typography.dart';

// Reusable Widgets
export 'src/widgets/fc_button.dart';
export 'src/widgets/fc_error_view.dart';
export 'src/widgets/fc_loading_indicator.dart';
export 'src/widgets/fc_text_field.dart';

// Networking Foundation
export 'src/network/fc_network_client.dart';
export 'src/network/fc_network_exception.dart';
export 'src/network/interceptors/fc_correlation_interceptor.dart';
export 'src/network/interceptors/fc_safe_logging_interceptor.dart';
export 'src/network/interceptors/fc_auth_interceptor.dart';
