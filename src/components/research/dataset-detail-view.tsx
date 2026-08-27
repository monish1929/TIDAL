"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileSpreadsheet,
  Download,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Columns,
  Layers,
  Database,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  Save,
  X,
  Info,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDatasetDetailData,
  DatasetDetailData,
  DatasetColumnMapping,
  UserDataset,
} from "@/mocks/researchMocks";
import {
  getStoredUserDatasets,
  saveStoredUserDatasets,
  deleteStoredUserDataset,
} from "@/lib/storage";

interface DatasetDetailViewProps {
  datasetId: string;
  onBack?: () => void;
}

export const DatasetDetailView: React.FC<DatasetDetailViewProps> = ({
  datasetId,
  onBack,
}) => {
  const router = useRouter();
  const [isEditingMapping, setIsEditingMapping] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load custom datasets from storage
  const [customDatasets, setCustomDatasets] = useState<UserDataset[]>([]);

  useEffect(() => {
    const stored = getStoredUserDatasets();
    if (stored && stored.length > 0) {
      setCustomDatasets(stored);
    }
  }, []);

  const datasetData: DatasetDetailData = useMemo(() => {
    return getDatasetDetailData(datasetId, customDatasets);
  }, [datasetId, customDatasets]);

  const [mappingState, setMappingState] = useState<DatasetColumnMapping>({
    date: datasetData.columnMapping.date,
    latitude: datasetData.columnMapping.latitude,
    longitude: datasetData.columnMapping.longitude,
    value: datasetData.columnMapping.value,
    stationId: datasetData.columnMapping.stationId || "",
  });

  useEffect(() => {
    setMappingState({
      date: datasetData.columnMapping.date,
      latitude: datasetData.columnMapping.latitude,
      longitude: datasetData.columnMapping.longitude,
      value: datasetData.columnMapping.value,
      stationId: datasetData.columnMapping.stationId || "",
    });
  }, [datasetData]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/dashboard/research/data");
    }
  };

  const handleDownloadCsv = () => {
    const blob = new Blob([datasetData.rawCsvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = datasetData.fileName || `dataset_${datasetData.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveMapping = () => {
    // Update mapping in custom datasets
    const stored = getStoredUserDatasets();
    const updated = stored.map((d: UserDataset) => {
      if (d.id === datasetId) {
        return {
          ...d,
          variableName: `Custom: ${mappingState.value}`,
          status: "ready" as const,
        };
      }
      return d;
    });

    saveStoredUserDatasets(updated);
    setCustomDatasets(updated);
    setIsEditingMapping(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = () => {
    deleteStoredUserDataset(datasetId);
    handleBack();
  };

  const statusBadge =
    datasetData.status === "ready"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : datasetData.status === "mapping_required"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background p-4 lg:p-6 space-y-6">
      {/* ── TOP BREADCRUMB & BACK NAVIGATION ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-dark-text hover:bg-gray-50 hover:text-primary transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-4 h-4 text-dark-muted" />
          <span>Back to My Data</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingMapping(!isEditingMapping)}
            className="text-xs h-8 gap-1.5 bg-white"
          >
            <Edit3 className="w-3.5 h-3.5 text-primary" />
            <span>{isEditingMapping ? "Close Editor" : "Edit Column Mapping"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="text-xs h-8 gap-1.5 bg-white"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Download Raw File</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs h-8 gap-1.5 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Dataset</span>
          </Button>
        </div>
      </div>

      {/* Save Notification */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Column mapping configuration saved successfully. Dataset is ready for use across Research workspaces.</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-border rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-dark-text">Delete Dataset?</h4>
                <p className="text-xs text-dark-muted">
                  Are you sure you want to delete <strong>{datasetData.name}</strong>? This dataset will no longer be available in Data Explorer or Statistical Analysis.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── DATASET HEADER CARD ── */}
      <div className="bg-white border border-border rounded-xl shadow-subtle p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-primary shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-text tracking-tight">
                  {datasetData.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-dark-muted">
                    {datasetData.fileName}
                  </span>
                  <span className="text-dark-muted">•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                    {datasetData.status === "ready"
                      ? "Ready for Analysis"
                      : datasetData.status === "mapping_required"
                      ? "Mapping Incomplete"
                      : "Ingestion Error"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-dark-muted pt-1">
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>{datasetData.rowCount} Observations</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Date Range: <strong>{datasetData.dateRange}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Uploaded: {datasetData.uploadedAt.slice(0, 10)}</span>
              </span>
            </div>
          </div>

          {/* Quick Stat Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50/80 p-3 rounded-xl border border-border shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                Total Columns
              </div>
              <div className="text-sm font-bold text-dark-text mt-0.5">
                {datasetData.columns.length} columns
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                Variable Alias
              </div>
              <div className="text-sm font-bold text-indigo-700 truncate max-w-[130px] mt-0.5">
                {datasetData.variableName}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
                Format
              </div>
              <div className="text-sm font-bold text-dark-text mt-0.5">
                CSV / Tabular
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: COLUMN MAPPING SUMMARY CARD ── */}
      <div className="bg-white border border-border rounded-xl shadow-subtle p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-dark-text flex items-center gap-2">
              <Columns className="w-4 h-4 text-primary" />
              Column Mapping Configuration
            </h2>
            <p className="text-xs text-dark-muted mt-0.5">
              Specifies how the raw tabular fields are mapped to temporal, spatial, and numeric observation channels.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingMapping(!isEditingMapping)}
            className="text-xs h-7 gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingMapping ? "Cancel" : "Edit Mapping"}</span>
          </Button>
        </div>

        {isEditingMapping ? (
          /* Inline Mapping Editor */
          <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 space-y-4">
            <div className="text-xs font-semibold text-blue-950 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-primary" />
              Modify Column Bindings
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                  Date Column
                </label>
                <select
                  value={mappingState.date}
                  onChange={(e) => setMappingState((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-white"
                >
                  {datasetData.columns.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                  Latitude Column
                </label>
                <select
                  value={mappingState.latitude}
                  onChange={(e) => setMappingState((prev) => ({ ...prev, latitude: e.target.value }))}
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-white"
                >
                  {datasetData.columns.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                  Longitude Column
                </label>
                <select
                  value={mappingState.longitude}
                  onChange={(e) => setMappingState((prev) => ({ ...prev, longitude: e.target.value }))}
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-white"
                >
                  {datasetData.columns.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block">
                  Measured Value Column
                </label>
                <select
                  value={mappingState.value}
                  onChange={(e) => setMappingState((prev) => ({ ...prev, value: e.target.value }))}
                  className="w-full h-8 px-2.5 text-xs rounded-lg border border-border bg-white"
                >
                  {datasetData.columns.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button size="sm" onClick={handleSaveMapping} className="text-xs h-8 gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>Save Mapping</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingMapping(false)}
                className="text-xs h-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          /* Mapping Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50/80 rounded-xl border border-border/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted flex items-center justify-between">
                <span>Date Channel</span>
                <Calendar className="w-3 h-3 text-primary" />
              </div>
              <div className="font-mono text-xs font-bold text-dark-text">
                {datasetData.columnMapping.date}
              </div>
              <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> Validated (ISO/Date)
              </div>
            </div>

            <div className="p-3 bg-gray-50/80 rounded-xl border border-border/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted flex items-center justify-between">
                <span>Latitude Channel</span>
                <MapPin className="w-3 h-3 text-primary" />
              </div>
              <div className="font-mono text-xs font-bold text-dark-text">
                {datasetData.columnMapping.latitude}
              </div>
              <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> Validated ([-90 to +90])
              </div>
            </div>

            <div className="p-3 bg-gray-50/80 rounded-xl border border-border/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted flex items-center justify-between">
                <span>Longitude Channel</span>
                <MapPin className="w-3 h-3 text-primary" />
              </div>
              <div className="font-mono text-xs font-bold text-dark-text">
                {datasetData.columnMapping.longitude}
              </div>
              <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> Validated ([-180 to +180])
              </div>
            </div>

            <div className="p-3 bg-gray-50/80 rounded-xl border border-border/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-dark-muted flex items-center justify-between">
                <span>Observation Value</span>
                <BarChart3 className="w-3 h-3 text-primary" />
              </div>
              <div className="font-mono text-xs font-bold text-dark-text">
                {datasetData.columnMapping.value}
              </div>
              <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> Numeric Float
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: "USED IN" INTEGRATION SECTION ── */}
      <div className="bg-white border border-border rounded-xl shadow-subtle p-5 space-y-3">
        <div>
          <h2 className="text-sm font-bold text-dark-text flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Active Platform Integration ("Used In")
          </h2>
          <p className="text-xs text-dark-muted mt-0.5">
            This dataset is automatically registered and directly available in the following analytical modules:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Data Explorer</span>
            </div>
            <p className="text-[11px] text-indigo-900/80">
              Available as custom variable in Single, Overlay, and Compare modes alongside satellite streams.
            </p>
            <div className="text-[10px] font-mono text-indigo-700 bg-white/80 px-2 py-0.5 rounded border border-indigo-200/60 inline-block">
              Var: {datasetData.variableName}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-950">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span>Statistical Analysis</span>
            </div>
            <p className="text-[11px] text-blue-900/80">
              Selectable as primary or secondary variable for baseline anomaly computation and cross-variable lag correlation.
            </p>
            <div className="text-[10px] font-mono text-blue-700 bg-white/80 px-2 py-0.5 rounded border border-blue-200/60 inline-block">
              Lag &amp; Baseline Ready
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Blended Export Engine</span>
            </div>
            <p className="text-[11px] text-emerald-900/80">
              Included when exporting synchronized multi-variable datasets for external R, Python, and GIS workflows.
            </p>
            <div className="text-[10px] font-mono text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-200/60 inline-block">
              CSV / GeoJSON Export
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: RAW DATA PREVIEW TABLE (FIRST 20 ROWS) ── */}
      <div className="bg-white border border-border rounded-xl shadow-subtle overflow-hidden space-y-0">
        <div className="px-5 py-3.5 bg-gray-50 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-dark-text uppercase tracking-wider">
              Data Preview (First 20 Observations)
            </h3>
            <p className="text-[11px] text-dark-muted mt-0.5">
              Inspecting raw tabular rows parsed from {datasetData.fileName}.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="text-xs h-8 gap-1.5 bg-white"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Download Full CSV</span>
          </Button>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10">
              <tr className="border-b border-border text-dark-muted font-bold text-[11px]">
                <th className="px-3.5 py-2.5 text-left w-12">#</th>
                {datasetData.columns.map((col) => (
                  <th key={col} className="px-3.5 py-2.5 text-left font-mono">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-[11px]">
              {datasetData.previewRows.map((row) => (
                <tr key={row.row} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-3.5 py-2 text-dark-muted">{row.row}</td>
                  {datasetData.columns.map((col) => (
                    <td key={col} className="px-3.5 py-2 text-dark-text">
                      {row[col] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-gray-50 border-t border-border flex items-center justify-between text-[11px] text-dark-muted">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Displaying initial 20 records. Total dataset contains {datasetData.rowCount} observations.</span>
          </div>
          <span>Showing 20 of {datasetData.rowCount} rows</span>
        </div>
      </div>
    </div>
  );
};
