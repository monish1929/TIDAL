"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DatasetDetailView } from "@/components/research/dataset-detail-view";

export default function DatasetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = (params?.datasetId as string) || "user_ds_001";

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-background">
      <DatasetDetailView
        datasetId={datasetId}
        onBack={() => router.push("/dashboard/research/data")}
      />
    </div>
  );
}
