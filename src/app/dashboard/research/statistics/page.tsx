"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ResearchNavHeader } from "@/components/research/research-nav-header";
import { ResearchChartSkeleton } from "@/components/research/research-chart-skeleton";
import { getStoredUserDatasets } from "@/lib/storage";
import { SAMPLE_USER_DATASET, UserDataset } from "@/mocks/researchMocks";

const StatisticalAnalysis = dynamic(
  () => import("@/components/research/statistical-analysis").then((m) => m.StatisticalAnalysis),
  {
    ssr: false,
    loading: () => <ResearchChartSkeleton title="Loading anomaly detection models, lag correlation & scan tables..." />,
  }
);

export default function StatisticalAnalysisPage() {
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
        activeTab="statistics"
        title="Statistical Analysis Workspace"
        subtitle="Trend/anomaly baseline deviations, lag correlation computing & multi-zone scan."
        showBackButton={true}
        backHref="/dashboard/research"
        datasetCount={userDatasets.length}
      />
      <div className="flex-1 overflow-hidden">
        <StatisticalAnalysis userDatasets={userDatasets} />
      </div>
    </div>
  );
}
