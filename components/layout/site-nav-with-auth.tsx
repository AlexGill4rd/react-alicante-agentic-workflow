import { EnvVarWarning } from "@/app/_components/env-var-warning";
import { AuthButton } from "@/components/forms/auth-button";
import { SiteNav } from "@/components/layout/site-nav";
import { getAuthenticatedUser } from "@/lib/supabase/get-user";
import { hasEnvVars } from "@/utils/has-env-vars";

/** Fetches the auth status once and renders SiteNav with the Stats link
 * and auth UI wired up. Must be rendered inside a <Suspense> boundary since
 * it reads cookies via Supabase. */
export async function SiteNavWithAuth() {
  const user = hasEnvVars ? await getAuthenticatedUser() : null;

  return (
    <SiteNav
      showStats={Boolean(user)}
      authSlot={
        !hasEnvVars ? <EnvVarWarning /> : <AuthButton user={user} />
      }
    />
  );
}
