import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True once hydrated, false during the server render. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
