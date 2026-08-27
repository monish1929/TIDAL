"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Columns,
  ArrowRight,
  Info,
  X,
  ChevronRight,
  Eye,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SAMPLE_CSV_CONTENT,
  SAMPLE_USER_DATASET,
  UserDataset,
} from "@/mocks/researchMocks";
import {
  getStoredUserDatasets,
  saveStoredUserDatasets,
} from "@/lib/storage";

interface MyDataProps {
  datasets: UserDataset[];
  onDatasetsChange: (datasets: UserDataset[]) => void;
}

type UploadStep = "idle" | "validating" | "mapping" | "success" | "error";

interface ColumnMapping {
  date: string;
  latitude: string;
  longitude: string;
  value: string;
}

export const MyData: React.FC<MyDataProps> = ({ datasets, onDatasetsChange }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStep, setUploadStep] = useState<UploadStep>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingFileName, setPendingFileName] = useState("");
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    date: "",
    latitude: "",
    longitude: "",
    value: "",
  });

  // Sync with stored datasets on initial load if present
  useEffect(() => {
    const stored = getStoredUserDatasets();
    if (stored && stored.length > 0 && datasets.length <= 1) {
      onDatasetsChange(stored);
    }
  }, []);

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tidal_sample_format.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ── VALIDATION PATH A: Structural rejection (deterministic, no AI) ──
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "xlsx") {
      setUploadStep("error");
      setErrorMessage(
        `Invalid file type ".${ext}". Only CSV (.csv) and Excel (.xlsx) files are accepted. This file was rejected without processing.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size === 0) {
      setUploadStep("error");
      setErrorMessage(
        "The selected file is empty (0 bytes). Please choose a file with data."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStep("error");
      setErrorMessage(
        "File exceeds the 10 MB limit. Please reduce the file size or split the data."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setPendingFileName(file.name);
    setUploadStep("validating");

    // Simulate parsing to detect columns
    setTimeout(() => {
      // ── VALIDATION PATH B: Column detection ──
      // Simulate reading headers from the file
      const simulatedHeaders = ["date", "lat", "lon", "sst_value", "station"];
      const knownDateHeaders = ["date", "datetime", "timestamp", "time", "observation_date"];
      const knownLatHeaders = ["latitude", "lat", "y"];
      const knownLonHeaders = ["longitude", "lon", "lng", "x"];
      const knownValueHeaders = ["value", "measurement", "reading", "sst", "temperature"];

      const autoDate = simulatedHeaders.find((h) =>
        knownDateHeaders.includes(h.toLowerCase())
      );
      const autoLat = simulatedHeaders.find((h) =>
        knownLatHeaders.includes(h.toLowerCase())
      );
      const autoLon = simulatedHeaders.find((h) =>
        knownLonHeaders.includes(h.toLowerCase())
      );
      const autoValue = simulatedHeaders.find((h) =>
        knownValueHeaders.some((kv) => h.toLowerCase().includes(kv))
      );

      setDetectedColumns(simulatedHeaders);

      const confident = !!(autoDate && autoLat && autoLon && autoValue);

      if (confident) {
        setColumnMapping({
          date: autoDate!,
          latitude: autoLat!,
          longitude: autoLon!,
          value: autoValue!,
        });
        // Auto-detected with confidence → add directly
        const newDataset: UserDataset = {
          id: "user_ds_" + Date.now(),
          name: file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
          fileName: file.name,
          rowCount: Math.floor(Math.random() * 200) + 50,
          dateRange: "Auto-detected",
          variableName: `Custom: ${autoValue}`,
          status: "ready",
          uploadedAt: new Date().toISOString(),
          columns: simulatedHeaders,
        };
        const updated = [...datasets, newDataset];
        onDatasetsChange(updated);
        saveStoredUserDatasets(updated);
        setUploadStep("success");
      } else {
        // Not confident → show manual mapping UI
        setColumnMapping({
          date: autoDate || "",
          latitude: autoLat || "",
          longitude: autoLon || "",
          value: autoValue || "",
        });
        setUploadStep("mapping");
      }
    }, 800);
  };

  const handleConfirmMapping = () => {
    if (
      !columnMapping.date ||
      !columnMapping.latitude ||
      !columnMapping.longitude ||
      !columnMapping.value
    ) {
      return;
    }

    const newDataset: UserDataset = {
      id: "user_ds_" + Date.now(),
      name: pendingFileName.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "),
      fileName: pendingFileName,
      rowCount: Math.floor(Math.random() * 200) + 50,
      dateRange: "User-mapped",
      variableName: `Custom: ${columnMapping.value}`,
      status: "ready",
      uploadedAt: new Date().toISOString(),
      columns: detectedColumns,
    };
    const updated = [...datasets, newDataset];
    onDatasetsChange(updated);
    saveStoredUserDatasets(updated);
    setUploadStep("success");
  };

  const handleRemoveDataset = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = datasets.filter((d) => d.id !== id);
    onDatasetsChange(updated);
    saveStoredUserDatasets(updated);
  };

  const handleReset = () => {
    setUploadStep("idle");
    setErrorMessage("");
    setPendingFileName("");
    setDetectedColumns([]);
    setColumnMapping({ date: "", latitude: "", longitude: "", value: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── HEADER ── */}
      <div className="px-4 py-3 bg-gray-50/50 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-dark-text">My Data</h3>
            <p className="text-[11px] text-dark-muted mt-0.5">
              Upload your own datasets to use as variables in Data Explorer and
              Statistical Analysis.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSample}
            className="text-xs h-8 gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample Format</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ── UPLOAD AREA ── */}
        <div className="bg-white border border-border rounded-xl shadow-subtle p-5 space-y-4">
          <div className="text-xs font-semibold text-dark-text flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-primary" />
            Upload New Dataset
          </div>

          <p className="text-[11px] text-dark-muted">
            Accepts <strong>CSV</strong> or <strong>Excel (.xlsx)</strong> files
            only. Each file should have columns for date, location (lat/lon),
            and at least one measured value.
          </p>

          {/* Upload State Machine */}
          {uploadStep === "idle" && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border hover:border-primary rounded-xl p-8 cursor-pointer transition-colors text-center space-y-2 hover:bg-blue-50/30"
            >
              <FileSpreadsheet className="w-8 h-8 text-dark-muted mx-auto" />
              <p className="text-xs font-semibold text-dark-text">
                Click to select a file
              </p>
              <p className="text-[10px] text-dark-muted">
                .csv or .xlsx only — max 10 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {uploadStep === "validating" && (
            <div className="border border-border rounded-xl p-6 text-center space-y-2">
              <div className="w-5 h-5 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-xs font-medium text-dark-text">
                Validating <strong>{pendingFileName}</strong>...
              </p>
              <p className="text-[10px] text-dark-muted">
                Checking structure and detecting columns
              </p>
            </div>
          )}

          {uploadStep === "error" && (
            <div className="border border-amber-300 bg-amber-50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-amber-900">
                      File Validation &amp; Ingestion Advisory
                    </p>
                    <span className="text-[10px] font-mono font-medium text-amber-800 bg-amber-100/80 border border-amber-300 px-2 py-0.5 rounded">
                      Last known good: {new Date().toISOString().slice(0, 16).replace("T", " ")} UTC
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {errorMessage}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs h-7 bg-white hover:bg-amber-100/50 border-amber-300 text-amber-900"
              >
                Try Again
              </Button>
            </div>
          )}

          {uploadStep === "mapping" && (
            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Columns className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">
                    Column Mapping Required
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Auto-detection could not confidently identify all required
                    columns in <strong>{pendingFileName}</strong>. Please map
                    them manually.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { key: "date", label: "Date Column" },
                    { key: "latitude", label: "Latitude Column" },
                    { key: "longitude", label: "Longitude Column" },
                    { key: "value", label: "Value Column" },
                  ] as const
                ).map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[10px] font-bold text-dark-muted uppercase tracking-wider">
                      {field.label}
                    </label>
                    <select
                      value={columnMapping[field.key]}
                      onChange={(e) =>
                        setColumnMapping((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="w-full h-8 px-2 text-xs rounded-lg border border-border bg-white"
                    >
                      <option value="">Select column...</option>
                      {detectedColumns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleConfirmMapping}
                  disabled={
                    !columnMapping.date ||
                    !columnMapping.latitude ||
                    !columnMapping.longitude ||
                    !columnMapping.value
                  }
                  className="text-xs h-8 gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm Mapping
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {uploadStep === "success" && (
            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900">
                    Dataset Ingested &amp; Verified: {pendingFileName}
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    <strong>{pendingFileName}</strong> successfully bound to <strong>Sea Surface Temperature</strong>. 365 telemetry observations now accessible in Data Explorer &amp; Statistical Analysis.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs h-7 bg-white hover:bg-emerald-100/50 border-emerald-300 text-emerald-900"
              >
                Upload Another Dataset
              </Button>
            </div>
          )}
        </div>

        {/* ── MY DATASETS LIST ── */}
        <div className="bg-white border border-border rounded-xl shadow-subtle overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-border flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">
              My Datasets ({datasets.length})
            </span>
          </div>

          {datasets.length === 0 ? (
            <div className="p-6 sm:p-8 text-center space-y-3 bg-white select-none">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary mx-auto">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-xs font-bold text-dark-text">No Custom Survey Datasets Uploaded</h4>
                <p className="text-[11px] text-dark-muted leading-relaxed">
                  Upload CSV or Excel field data above to cross-reference with INCOIS/ISRO satellite series, or load the pre-formatted in-situ benchmark survey.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDatasetsChange([SAMPLE_USER_DATASET])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-primary text-xs font-semibold shadow-subtle transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Load Sample In-Situ Dataset (Palk Bay)</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {datasets.map((ds) => (
                <div
                  key={ds.id}
                  onClick={() => router.push(`/dashboard/research/dataset/${ds.id}`)}
                  className="px-4 py-3 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  title={`Click to view dataset detail for ${ds.name}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-primary group-hover:bg-blue-100/70 transition-colors shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-dark-text group-hover:text-primary transition-colors truncate">
                        {ds.name}
                      </div>
                      <div className="text-[10px] text-dark-muted mt-0.5">
                        {ds.fileName} • {ds.rowCount} rows • {ds.dateRange}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        ds.status === "ready"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : ds.status === "mapping_required"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {ds.status === "ready"
                        ? "Ready"
                        : ds.status === "mapping_required"
                        ? "Mapping Required"
                        : "Error"}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleRemoveDataset(ds.id, e)}
                      className="p-1 text-dark-muted hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Remove dataset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="p-1 text-dark-muted group-hover:text-primary transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sample Format Preview */}
        <div className="bg-white border border-border rounded-xl shadow-subtle p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-dark-muted">
            <Info className="w-3.5 h-3.5" />
            Expected Column Structure
          </div>
          <div className="overflow-x-auto">
            <table className="text-[11px] w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50/80">
                  <th className="px-2.5 py-1.5 text-left font-bold text-dark-muted">
                    date
                  </th>
                  <th className="px-2.5 py-1.5 text-left font-bold text-dark-muted">
                    latitude
                  </th>
                  <th className="px-2.5 py-1.5 text-left font-bold text-dark-muted">
                    longitude
                  </th>
                  <th className="px-2.5 py-1.5 text-left font-bold text-dark-muted">
                    value
                  </th>
                  <th className="px-2.5 py-1.5 text-left font-bold text-dark-muted">
                    variable_name
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["2024-07-01", "9.15", "79.10", "28.4", "SST"],
                  ["2024-07-01", "9.16", "79.11", "28.5", "SST"],
                  ["2024-07-02", "9.15", "79.10", "28.3", "SST"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {row.map((cell, j) => (
                      <td key={j} className="px-2.5 py-1 font-mono text-dark-text">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
