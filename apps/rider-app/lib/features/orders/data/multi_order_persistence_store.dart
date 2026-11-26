import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../domain/models/multi_order_batch.dart';

/// Serializable snapshot of the Multi-Order flow state for local persistence.
class MultiOrderPersistedState {
  static const int currentSchemaVersion = 1;

  final int schemaVersion;
  final MultiOrderBatch batch;
  final bool isOnline;

  const MultiOrderPersistedState({
    this.schemaVersion = currentSchemaVersion,
    required this.batch,
    required this.isOnline,
  });

  Map<String, dynamic> toJson() => <String, dynamic>{
        'schemaVersion': schemaVersion,
        'isOnline': isOnline,
        'batch': batch.toJson(),
      };

  factory MultiOrderPersistedState.fromJson(Map<String, dynamic> json) {
    final rawBatch = json['batch'];
    if (rawBatch is! Map) {
      throw const FormatException('Missing or invalid batch in persisted state');
    }
    final isOnline = json['isOnline'];
    if (isOnline is! bool) {
      throw const FormatException('Missing or invalid isOnline in persisted state');
    }
    return MultiOrderPersistedState(
      schemaVersion: (json['schemaVersion'] as num?)?.toInt() ?? 1,
      batch: MultiOrderBatch.fromJson(Map<String, dynamic>.from(rawBatch)),
      isOnline: isOnline,
    );
  }

  String encode() => jsonEncode(toJson());

  factory MultiOrderPersistedState.decode(String source) {
    final decoded = jsonDecode(source);
    if (decoded is! Map) {
      throw const FormatException('Persisted Multi-Order payload must be a JSON object');
    }
    return MultiOrderPersistedState.fromJson(Map<String, dynamic>.from(decoded));
  }
}

/// Result of attempting to load persisted Multi-Order state.
class MultiOrderLoadResult {
  final MultiOrderPersistedState? state;
  final String? errorMessage;

  const MultiOrderLoadResult({this.state, this.errorMessage});

  bool get hasError => errorMessage != null;
}

/// Abstract persistence store for Multi-Order flow state.
abstract class MultiOrderPersistenceStore {
  Future<bool> save(MultiOrderPersistedState state);
  Future<MultiOrderLoadResult> load();
  Future<bool> clear();
}

/// SharedPreferences-backed persistence store for device restarts.
class SharedPreferencesMultiOrderPersistenceStore
    implements MultiOrderPersistenceStore {
  static const String storageKey = 'fillcart_multi_order_flow_state_v1';

  final Future<SharedPreferences> Function() _prefsProvider;

  SharedPreferencesMultiOrderPersistenceStore({
    Future<SharedPreferences> Function()? prefsProvider,
  }) : _prefsProvider = prefsProvider ?? SharedPreferences.getInstance;

  @override
  Future<bool> save(MultiOrderPersistedState state) async {
    try {
      final prefs = await _prefsProvider();
      return await prefs.setString(storageKey, state.encode());
    } catch (_) {
      return false;
    }
  }

  @override
  Future<MultiOrderLoadResult> load() async {
    try {
      final prefs = await _prefsProvider();
      final raw = prefs.getString(storageKey);
      if (raw == null || raw.isEmpty) {
        return const MultiOrderLoadResult();
      }
      final state = MultiOrderPersistedState.decode(raw);
      return MultiOrderLoadResult(state: state);
    } catch (e) {
      return MultiOrderLoadResult(
        errorMessage: 'Failed to restore Multi-Order state: $e',
      );
    }
  }

  @override
  Future<bool> clear() async {
    try {
      final prefs = await _prefsProvider();
      return await prefs.remove(storageKey);
    } catch (_) {
      return false;
    }
  }
}

/// Deterministic in-memory persistence store for unit tests.
class InMemoryMultiOrderPersistenceStore implements MultiOrderPersistenceStore {
  String? _rawJson;
  bool shouldThrowOnRead = false;
  bool shouldThrowOnWrite = false;
  int saveCount = 0;

  @override
  Future<bool> save(MultiOrderPersistedState state) async {
    if (shouldThrowOnWrite) return false;
    _rawJson = state.encode();
    saveCount++;
    return true;
  }

  /// Helper for tests to inject raw/corrupted JSON directly.
  void setRawJsonForTesting(String? raw) {
    _rawJson = raw;
  }

  String? get rawJson => _rawJson;

  @override
  Future<MultiOrderLoadResult> load() async {
    if (shouldThrowOnRead) {
      return const MultiOrderLoadResult(
        errorMessage: 'Simulated storage read failure',
      );
    }
    final raw = _rawJson;
    if (raw == null || raw.isEmpty) {
      return const MultiOrderLoadResult();
    }
    try {
      return MultiOrderLoadResult(state: MultiOrderPersistedState.decode(raw));
    } catch (e) {
      return MultiOrderLoadResult(
        errorMessage: 'Corrupted Multi-Order state: $e',
      );
    }
  }

  @override
  Future<bool> clear() async {
    if (shouldThrowOnWrite) return false;
    _rawJson = null;
    return true;
  }
}
