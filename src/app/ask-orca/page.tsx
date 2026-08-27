"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AskOrcaRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard?scope=chat");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs font-medium text-dark-muted">
          Opening Ask TIDAL Workspace...
        </p>
      </div>
    </div>
  );
}
