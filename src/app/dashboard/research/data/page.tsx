"use client";

import React, { useEffect, useState } from "react";
import { ResearchNavHeader } from "@/components/research/research-nav-header";
import { MyData } from "@/components/research/my-data";
import {
  getStoredUserDatasets,
  saveStoredUserDatasets,
} from "@/lib/storage";
import { SAMPLE_USER_DATASET, UserDataset } from "@/mocks/researchMocks";

export default function MyDataPage() {
  const [userDatasets, setUserDatasets] = useState<UserDataset[]>([SAMPLE_USER_DATASET]);

  useEffect(() => {
    const stored = getStoredUserDatasets();
    if (stored && stored.length > 0) {
      setUserDatasets(stored);
    }
  }, []);

  const handleDatasetsChange = (updated: UserDataset[]) => {
    setUserDatasets(updated);
    saveStoredUserDatasets(updated);
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-background">
      <ResearchNavHeader
        activeTab="data"
        title="My Data Workspace"
        subtitle="Ingest, validate, and bind custom research surveys for cross-workspace analysis."
        showBackButton={true}
        backHref="/dashboard/research"
        datasetCount={userDatasets.length}
      />
      <div className="flex-1 overflow-hidden">
        <MyData
          datasets={userDatasets}
          onDatasetsChange={handleDatasetsChange}
        />
      </div>
    </div>
  );
}
