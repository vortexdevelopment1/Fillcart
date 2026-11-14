# Fillcart Shared (`fillcart_shared`)

`fillcart_shared` is a standalone internal Dart package providing reusable Flutter UI components, styling themes, networking wrappers, and common utilities shared across all mobile clients within the Fillcart monorepo:

- `apps/customer-app/`
- `apps/vendor-app/`
- `apps/rider-app/`

---

## 1. Architectural Boundaries

To preserve strict domain separation and maintainability:

- **What belongs here**:
  - Reusable, app-agnostic Flutter widgets (custom buttons, load indicators, form inputs, dialogs).
  - Design tokens, typography styles, color palette definitions, and theme builders.
  - Core networking clients, Dio interceptors, error handling abstractions, and retry policies.
  - Generic extension methods, formatting utilities, and device helpers.
- **What is STRICTLY PROHIBITED here**:
  - Customer-, vendor-, or rider-specific business logic.
  - Application-specific navigation graphs and routing controllers.
  - Full-screen feature views or stateful workflows tied to a single application.
  - Direct dependencies on backend implementation details.

---

## 2. Directory Layout

```text
packages/flutter_shared/
├── lib/
│   ├── fillcart_shared.dart        # Public export entry point
│   └── src/                        # Internal package implementation
│       ├── components/             # Reusable compound UI components
│       ├── widgets/                # Atomic and foundational widgets
│       ├── theme/                  # Design tokens and theme system
│       │   ├── colors/
│       │   ├── typography/
│       │   ├── spacing/
│       │   └── themes/
│       ├── network/                # HTTP client wrappers, interceptors, error parsers
│       ├── utils/                  # Pure utility functions and formatters
│       ├── constants/              # Mobile ecosystem constants
│       └── extensions/             # Dart & Flutter extension methods
├── test/                           # Unit and widget tests for shared elements
├── pubspec.yaml                    # Package metadata
└── README.md                       # Package documentation
```

---

## 3. Monorepo Consumption

Mobile applications in `apps/` consume this package through local path references in their future `pubspec.yaml` configurations:

```yaml
dependencies:
  fillcart_shared:
    path: ../../packages/flutter_shared
```

Public APIs must be exported through `lib/fillcart_shared.dart`. Applications must never import directly from `package:fillcart_shared/src/*`.
