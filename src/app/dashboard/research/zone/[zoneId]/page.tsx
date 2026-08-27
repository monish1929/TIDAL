"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ResearchChartSkeleton } from "@/components/research/research-chart-skeleton";

const ZoneDetailView = dynamic(
  () => import("@/components/research/zone-detail-view").then((m) => m.ZoneDetailView),
  {
    ssr: false,
    loading: () => <ResearchChartSkeleton title="Loading zone telemetry series, anomaly baseline & ocean metrics..." />,
  }
);

export default function ZoneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = (params?.zoneId as string) || "gulf_mannar";

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-background">
      <ZoneDetailView
        zoneId={zoneId}
        onBack={() => router.push("/dashboard/research/statistics")}
      />
    </div>
  );
}
