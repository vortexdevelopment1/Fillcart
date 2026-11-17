import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/app_status_bloc.dart';

/// Temporary placeholder home screen for Phase 2.2.7 foundation verification.
///
/// Note: Production vendor screens will be implemented in Phase 5 in strict
/// accordance with authoritative Figma specifications.
class PlaceholderHomeScreen extends StatelessWidget {
  const PlaceholderHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Fillcart Vendor Portal'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(FCSpacing.lg),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.storefront_rounded,
                  size: 72,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(height: FCSpacing.md),
                Text(
                  'Vendor App Foundation',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: FCSpacing.xs),
                Text(
                  'Phase 2.2.7 Architecture & Diagnostics',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: FCSpacing.xl),
                BlocBuilder<AppStatusBloc, AppStatusState>(
                  builder: (context, state) {
                    return switch (state) {
                      AppStatusInitial() => const Column(
                        children: [
                          FCLoadingIndicator(),
                          SizedBox(height: FCSpacing.sm),
                          Text('Initializing...'),
                        ],
                      ),
                      AppStatusReady(
                        appName: final appName,
                        version: final version,
                        environment: final env,
                        initializedAt: final time,
                      ) =>
                        Card(
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                              FCSpacing.radiusMd,
                            ),
                            side: BorderSide(
                              color: theme.colorScheme.outlineVariant,
                            ),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(FCSpacing.md),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.check_circle_rounded,
                                      color: theme.colorScheme.primary,
                                      size: 20,
                                    ),
                                    const SizedBox(width: FCSpacing.xs),
                                    Text(
                                      'System Ready',
                                      style: theme.textTheme.titleSmall
                                          ?.copyWith(
                                            fontWeight: FontWeight.bold,
                                            color: theme.colorScheme.primary,
                                          ),
                                    ),
                                  ],
                                ),
                                const Divider(height: FCSpacing.lg),
                                _DiagnosticRow(
                                  label: 'Application',
                                  value: appName,
                                ),
                                _DiagnosticRow(
                                  label: 'Version',
                                  value: version,
                                ),
                                _DiagnosticRow(
                                  label: 'Environment',
                                  value: env,
                                ),
                                _DiagnosticRow(
                                  label: 'Initialized',
                                  value:
                                      '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}:${time.second.toString().padLeft(2, '0')}',
                                ),
                              ],
                            ),
                          ),
                        ),
                    };
                  },
                ),
                const SizedBox(height: FCSpacing.xl),
                FCButton(
                  text: 'Refresh Status',
                  onPressed: () {
                    context.read<AppStatusBloc>().add(
                      const AppStatusRefreshed(),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _DiagnosticRow extends StatelessWidget {
  const _DiagnosticRow({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: FCSpacing.xxs),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          Text(
            value,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
