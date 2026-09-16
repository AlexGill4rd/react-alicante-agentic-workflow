import Link from "next/link";
import { Button } from "@/components/primitives/button";
import type { getAuthenticatedUser } from "@/lib/supabase/get-user";
import { LogoutButton } from "./logout-button";

interface AuthButtonProps {
  user: Awaited<ReturnType<typeof getAuthenticatedUser>>;
}

export function AuthButton({ user }: AuthButtonProps) {
  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
