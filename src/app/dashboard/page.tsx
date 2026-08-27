"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  getStoredUserProfile,
  DEFAULT_DEMO_PROFILE,
} from "@/lib/storage";
import { UserProfile } from "@/types/user";
import { TopicScope, DecisionResponse } from "@/types/decision";
import {
  ROLE_HOME_BRIEFINGS,
  FLAGSHIP_TRIP_SAFETY_MOCK,
} from "@/mocks/decisionMocks";

// Lightweight Workspace Loading Skeleton
const WorkspaceSkeleton = () => (
  <div className="flex h-full w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-xs font-medium text-dark-muted">
        Loading workspace view...
      </p>
    </div>
  </div>
);

// Dynamic Code-Splitting for Heavy Workspaces
const HomeWorkspace = dynamic(
  () => import("@/components/dashboard/home-workspace").then((m) => m.HomeWorkspace),
  { ssr: false, loading: () => <WorkspaceSkeleton /> }
);
const ChatWorkspace = dynamic(
  () => import("@/components/dashboard/chat-workspace").then((m) => m.ChatWorkspace),
  { ssr: false, loading: () => <WorkspaceSkeleton /> }
);
const ResearchWorkspace = dynamic(
  () => import("@/components/research/research-workspace").then((m) => m.ResearchWorkspace),
  { ssr: false, loading: () => <WorkspaceSkeleton /> }
);
const FishingLandingView = dynamic(
  () => import("@/components/fishing/fishing-landing-view").then((m) => m.FishingLandingView),
  { ssr: false, loading: () => <WorkspaceSkeleton /> }
);
const CoastalAuthorityLanding = dynamic(
  () => import("@/components/coastal-authority/coastal-authority-landing").then((m) => m.CoastalAuthorityLanding),
  { ssr: false, loading: () => <WorkspaceSkeleton /> }
);
const DisasterManagementLanding = dynamic(
  () => import("@/components/disaster-management/disaster-management-landing").then((m) => m.DisasterManagementLanding),
  { ssr: false, loading: () => <WorkspaceSkeleton /> }
);
const CopilotWorkspace = dynamic(
  () => import("@/components/dashboard/copilot-workspace").then((m) => m.CopilotWorkspace),
  { ssr: false, loading: () => <WorkspaceSkeleton /> }
);

function MainDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_DEMO_PROFILE);

  const scopeParam = (searchParams.get("scope") as TopicScope) || "home";
  const [activeDecision, setActiveDecision] = useState<DecisionResponse>(
    FLAGSHIP_TRIP_SAFETY_MOCK
  );

  useEffect(() => {
    const profile = getStoredUserProfile();
    if (profile) {
      setUserProfile(profile);
      const initialBriefing =
        ROLE_HOME_BRIEFINGS[profile.role] || ROLE_HOME_BRIEFINGS.GENERAL;
      setActiveDecision(initialBriefing);
    }
  }, []);

  const handleNavigateToChat = () => {
    router.push("/dashboard?scope=chat");
  };

  return (
    <div className="h-full w-full overflow-hidden bg-background">
      {scopeParam === "home" && (
        <HomeWorkspace
          userProfile={userProfile}
          onNavigateToChat={handleNavigateToChat}
        />
      )}

      {scopeParam === "chat" && (
        <ChatWorkspace
          userProfile={userProfile}
          researchMode={false}
          activeDecision={activeDecision}
        />
      )}

      {scopeParam === "research" && <ResearchWorkspace />}

      {scopeParam === "fishing" && <FishingLandingView />}

      {scopeParam === "coastal-authority" && <CoastalAuthorityLanding />}

      {scopeParam === "disaster-management" && <DisasterManagementLanding />}

      {scopeParam !== "home" &&
        scopeParam !== "chat" &&
        scopeParam !== "research" &&
        scopeParam !== "fishing" &&
        scopeParam !== "coastal-authority" &&
        scopeParam !== "disaster-management" && (
          <CopilotWorkspace
            currentScope={scopeParam}
            userProfile={userProfile}
            researchMode={false}
            onDecisionActivated={(decision) => setActiveDecision(decision)}
          />
        )}
    </div>
  );
}

export default function MainDashboardPage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <MainDashboardContent />
    </Suspense>
  );
}
