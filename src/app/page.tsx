"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUserProfile } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const profile = getStoredUserProfile();
    if (!profile || !profile.isAuthenticated) {
      router.replace("/login");
    } else if (profile.role) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs font-medium text-dark-muted">Initializing TIDAL Marine Copilot...</p>
      </div>
    </div>
  );
}
