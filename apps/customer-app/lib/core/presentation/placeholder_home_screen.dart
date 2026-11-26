import 'package:fillcart_shared/fillcart_shared.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/app_status_bloc.dart';

/// Customer application home screen.
class CustomerPlaceholderHomeScreen extends StatelessWidget {
  const CustomerPlaceholderHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Fillcart'),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.search_rounded),
            onPressed: () {},
            tooltip: 'Search products',
          ),
          IconButton(
            icon: const Icon(Icons.shopping_bag_outlined),
            onPressed: () {},
            tooltip: 'Cart',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(FCSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero banner
              Container(
                padding: const EdgeInsets.all(FCSpacing.lg),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      theme.colorScheme.primary,
                      theme.colorScheme.tertiary,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(FCSpacing.radiusLg),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.bolt_rounded,
                          color: Colors.white,
                          size: 28,
                        ),
                        const SizedBox(width: FCSpacing.xs),
                        Text(
                          '10-Minute Delivery',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: FCSpacing.sm),
                    Text(
                      'Groceries & Essentials\nDelivered to your doorstep',
                      style: theme.textTheme.headlineSmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: FCSpacing.xl),

              // Categories section
              Text(
                'Shop by Category',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: FCSpacing.md),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _CategoryChip(
                    icon: Icons.local_grocery_store_rounded,
                    label: 'Groceries',
                    theme: theme,
                  ),
                  _CategoryChip(
                    icon: Icons.eco_rounded,
                    label: 'Fruits & Veg',
                    theme: theme,
                  ),
                  _CategoryChip(
                    icon: Icons.fastfood_rounded,
                    label: 'Snacks',
                    theme: theme,
                  ),
                  _CategoryChip(
                    icon: Icons.clean_hands_rounded,
                    label: 'Personal Care',
                    theme: theme,
                  ),
                ],
              ),
              const SizedBox(height: FCSpacing.xl),

              // Diagnostics / System status
              BlocBuilder<AppStatusBloc, AppStatusState>(
                builder: (context, state) {
                  return switch (state) {
                    AppStatusInitial() => const Center(
                        child: Column(
                          children: [
                            FCLoadingIndicator(),
                            SizedBox(height: FCSpacing.sm),
                            Text('Loading Customer App...'),
                          ],
                        ),
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
                          borderRadius: BorderRadius.circular(FCSpacing.radiusMd),
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
                                    'Customer Portal Active',
                                    style: theme.textTheme.titleSmall?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: theme.colorScheme.primary,
                                    ),
                                  ),
                                ],
                              ),
                              const Divider(height: FCSpacing.lg),
                              _InfoRow(label: 'Application', value: appName),
                              const SizedBox(height: FCSpacing.xs),
                              _InfoRow(label: 'Version', value: version),
                              const SizedBox(height: FCSpacing.xs),
                              _InfoRow(label: 'Environment', value: env),
                              const SizedBox(height: FCSpacing.xs),
                              _InfoRow(
                                label: 'Initialized',
                                value: time.toIso8601String().substring(0, 19),
                              ),
                            ],
                          ),
                        ),
                      ),
                  };
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final ThemeData theme;

  const _CategoryChip({
    required this.icon,
    required this.label,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CircleAvatar(
          radius: 28,
          backgroundColor: theme.colorScheme.primaryContainer,
          child: Icon(icon, color: theme.colorScheme.onPrimaryContainer),
        ),
        const SizedBox(height: FCSpacing.xs),
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
        Text(
          value,
          style: theme.textTheme.bodySmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

