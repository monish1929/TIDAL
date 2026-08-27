"use client";

import React from "react";
import { ResearchLandingView } from "./research-landing-view";

interface ResearchWorkspaceProps {
  onNavigateToMainChat?: (initialQuery?: string) => void;
}

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = () => {
  return <ResearchLandingView />;
};

