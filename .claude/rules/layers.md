# Layers

Each layer has one job. A layer imports only from the layers below it.

| Layer     | Location                    | Job                                           |
| --------- | --------------------------- | --------------------------------------------- |
| Component | `components/`, `_components/` | Renders the view and holds the event handlers |
| Hook      | `hooks/`                    | Business logic and state                      |
| Service   | `services/`                 | API calls — the data layer                    |
| Utils     | `utils/`                    | Pure functions                                |

- A component renders and defines its event handlers (`onClick`, `onSubmit`). A handler stays thin: it updates local UI state (an open or closed menu) or calls a function from a hook.
- Business logic and state live in custom hooks. One hook, one concern.
- A hook calls services. It never calls Supabase, `fetch` or an SDK directly.
- Only services make API calls.
- Pure functions (formatting, sorting, grouping) go in utils, not in a hook or a component.
- A Server Component has no state, so it needs no hook. It calls services and utils directly.

This rule assumes plain React state. With Redux or a similar store, the store owns state and logic, so the layers change — revisit this rule first.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
