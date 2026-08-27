"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  getStoredUserProfile,
  saveUserProfile,
  clearUserSession,
  DEFAULT_DEMO_PROFILE,
} from "@/lib/storage";
import { UserProfile } from "@/types/user";
import { TopicScope } from "@/types/decision";

// Dynamically import DockedCopilotPanel to preserve First Load JS performance
const DockedCopilotPanel = dynamic(
  () => import("@/components/dashboard/docked-copilot-panel").then((m) => m.DockedCopilotPanel),
  { ssr: false }
);

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_DEMO_PROFILE);
  const [mounted, setMounted] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = getStoredUserProfile();
    if (!profile || !profile.isAuthenticated) {
      router.replace("/login");
    } else if (!profile.role) {
      router.replace("/onboarding");
    } else {
      setUserProfile(profile);
    }
  }, [router]);

  // Determine active scope from pathname & searchParams
  let currentScope: TopicScope = "home";
  if (pathname?.startsWith("/dashboard/research")) {
    currentScope = "research";
  } else if (pathname?.startsWith("/dashboard/fishing")) {
    currentScope = "fishing";
  } else if (pathname?.startsWith("/dashboard/coastal-authority")) {
    currentScope = "coastal-authority";
  } else if (pathname?.startsWith("/dashboard/disaster-management")) {
    currentScope = "disaster-management";
  } else if (pathname === "/dashboard") {
    const scopeParam = searchParams.get("scope") as TopicScope | null;
    if (
      scopeParam &&
      [
        "home",
        "chat",
        "fishing",
        "weather",
        "alerts",
        "research",
        "routes",
        "zones",
        "coastal-authority",
        "disaster-management",
        "settings",
      ].includes(scopeParam)
    ) {
      currentScope = scopeParam;
    }
  }

  // Research Mode state is synchronized with the Research route/scope
  const isResearchMode = currentScope === "research" || Boolean(pathname?.startsWith("/dashboard/research"));

  const handleSignOut = () => {
    clearUserSession();
    router.push("/login");
  };

  const handleReconfigureRole = () => {
    router.push("/onboarding");
  };

  const handleSwitchAccount = (targetProfile: UserProfile) => {
    const updated = saveUserProfile(targetProfile);
    setUserProfile(updated);
    router.push("/dashboard?scope=home");
  };

  const handleSelectScope = (scope: TopicScope) => {
    if (scope === "research") {
      router.push("/dashboard/research");
    } else if (scope === "fishing") {
      router.push("/dashboard/fishing");
    } else if (scope === "coastal-authority") {
      router.push("/dashboard/coastal-authority");
    } else if (scope === "disaster-management") {
      router.push("/dashboard/disaster-management");
    } else {
      router.push(`/dashboard?scope=${scope}`);
    }
  };

  const handleToggleResearchMode = (enabled: boolean) => {
    if (enabled) {
      router.push("/dashboard/research");
    } else {
      router.push("/dashboard?scope=home");
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-dark-muted">
            Initializing TIDAL Marine Decision Workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-dark-text font-sans">
      {/* 1. PERSISTENT GLOBAL TOP HEADER */}
      <DashboardHeader
        userProfile={userProfile}
        researchMode={isResearchMode}
        onToggleResearchMode={handleToggleResearchMode}
        onSignOut={handleSignOut}
        onReconfigureRole={handleReconfigureRole}
        onSwitchAccount={handleSwitchAccount}
      />

      {/* 2. PERSISTENT TWO-REGION WORKSPACE SHELL + DOCKED COPILOT PANEL */}
      <div className="flex-1 flex flex-row overflow-hidden relative pb-14 lg:pb-0">
        <DashboardSidebar
          currentScope={currentScope}
          onSelectScope={handleSelectScope}
          userRole={userProfile.role}
        />

        {/* 3. DYNAMIC MAIN CONTENT REGION */}
        <main className="flex-1 h-full flex flex-col overflow-hidden bg-background min-w-0">
          {children}
        </main>

        {/* 4. PERSISTENT DOCKED COPILOT PANEL ACROSS EVERY SECTION (Requirement 1) */}
        <DockedCopilotPanel
          userProfile={userProfile}
          currentScope={currentScope}
          isResearchMode={isResearchMode}
          isOpen={isCopilotOpen}
          onToggleOpen={() => setIsCopilotOpen((prev) => !prev)}
        />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs font-medium text-dark-muted">
              Loading TIDAL Marine Decision Workspace...
            </p>
          </div>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
