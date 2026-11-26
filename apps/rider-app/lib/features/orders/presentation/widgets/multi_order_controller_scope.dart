import 'package:flutter/widgets.dart';

import '../../controllers/multi_order_flow_controller.dart';

/// Application-level inherited scope providing [MultiOrderFlowController].
class MultiOrderControllerScope
    extends InheritedNotifier<MultiOrderFlowController> {
  const MultiOrderControllerScope({
    super.key,
    required MultiOrderFlowController controller,
    required super.child,
  }) : super(notifier: controller);

  /// Subscribes the calling [BuildContext] to [MultiOrderFlowController] updates.
  static MultiOrderFlowController of(BuildContext context) {
    final scope = context
        .dependOnInheritedWidgetOfExactType<MultiOrderControllerScope>();
    assert(scope != null, 'No MultiOrderControllerScope found in context.');
    return scope!.notifier!;
  }

  /// Reads [MultiOrderFlowController] without subscribing to rebuilds.
  static MultiOrderFlowController? maybeOf(BuildContext context) {
    return context
        .getInheritedWidgetOfExactType<MultiOrderControllerScope>()
        ?.notifier;
  }
}
