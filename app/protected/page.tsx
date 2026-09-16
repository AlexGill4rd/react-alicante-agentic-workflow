import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/primitives/card";
import { getAuthenticatedUser } from "@/lib/supabase/get-user";

async function ProtectedContent() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>You&apos;re signed in</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Signed in as {user.email}.
        </p>
      </CardContent>
    </Card>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={null}>
      <ProtectedContent />
    </Suspense>
  );
}
