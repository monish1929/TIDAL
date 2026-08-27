"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ResearchNavHeader } from "@/components/research/research-nav-header";
import { ResearchChartSkeleton } from "@/components/research/research-chart-skeleton";
import { getStoredUserDatasets } from "@/lib/storage";
import { SAMPLE_USER_DATASET, UserDataset } from "@/mocks/researchMocks";

const DataExplorer = dynamic(
  () => import("@/components/research/data-explorer").then((m) => m.DataExplorer),
  {
    ssr: false,
    loading: () => <ResearchChartSkeleton title="Loading multi-variable telemetry and time series charts..." />,
  }
);

export default function DataExplorerPage() {
  const [userDatasets, setUserDatasets] = useState<UserDataset[]>([SAMPLE_USER_DATASET]);

  useEffect(() => {
    const stored = getStoredUserDatasets();
    if (stored && stored.length > 0) {
      setUserDatasets(stored);
    }
  }, []);

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-background">
      <ResearchNavHeader
        activeTab="explorer"
        title="Data Explorer Workspace"
        subtitle="Single, Overlay & Compare multi-source raw oceanographic metrics with explicit timestamp & source attribution."
        showBackButton={true}
        backHref="/dashboard/research"
        datasetCount={userDatasets.length}
      />
      <div className="flex-1 overflow-hidden">
        <DataExplorer userDatasets={userDatasets} />
      </div>
    </div>
  );
}
