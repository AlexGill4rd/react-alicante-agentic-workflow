import { useSyncExternalStore } from "react";

/** Never changes: the server snapshot is false, the client snapshot is true. */
const subscribe = () => () => {};

/**
 * True once the component has hydrated, false during the server render.
 *
 * Use it to delay rendering something whose markup differs between server and
 * client — a theme-dependent icon, a locale-formatted date. Doing the same
 * with `useState(false)` plus `useEffect(() => setMounted(true))` triggers an
 * extra render and `react-hooks/set-state-in-effect`.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
