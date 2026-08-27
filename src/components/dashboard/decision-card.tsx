"use client";

import React, { useState } from "react";
import {
  Clock,
  Sparkles,
  TrendingUp,
  Layers,
  Lock,
  Unlock,
  Info,
  ChevronDown,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecisionResponse, RiskTier, ApprovalStatus } from "@/types/decision";

interface DecisionCardProps {
  decision: DecisionResponse;
  onApproveAdvisory?: (decisionId: string) => void;
  onSelectCounterfactual?: (scenarioId: string) => void;
  selectedCounterfactualId?: string;
}

const DecisionCardComponent: React.FC<DecisionCardProps> = ({
  decision,
  onApproveAdvisory,
  onSelectCounterfactual,
  selectedCounterfactualId,
}) => {
  const [isApprovedLocal, setIsApprovedLocal] = useState(
    decision.approvalStatus === "APPROVED_BY_USER" ||
      decision.approvalStatus === "APPROVED_AUTONOMOUS"
  );

  // Progressive Disclosure States (All COLLAPSED by default per user requirement)
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isCausalOpen, setIsCausalOpen] = useState(false);
  const [isCounterfactualsOpen, setIsCounterfactualsOpen] = useState(false);

  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    selectedCounterfactualId ||
      decision.counterfactuals.find((c) => c.recommended)?.id ||
      decision.counterfactuals[0]?.id ||
      ""
  );

  const isPendingApproval =
    decision.approvalStatus === "PENDING_APPROVAL" && !isApprovedLocal;

  const handleApprove = () => {
    setIsApprovedLocal(true);
    if (onApproveAdvisory) {
      onApproveAdvisory(decision.id);
    }
  };

  const getRiskBadge = (tier: RiskTier) => {
    switch (tier) {
      case "LOW":
        return <Badge variant="safe">Low Hazard</Badge>;
      case "MEDIUM":
        return <Badge variant="caution">Cautionary Risk</Badge>;
      case "HIGH":
        return <Badge variant="hazard">Critical Hazard</Badge>;
      default:
        return <Badge variant="secondary">Monitored</Badge>;
    }
  };

  return (
    <div
      className={`bg-surface border rounded-xl shadow-card transition-all duration-200 overflow-hidden ${
        isPendingApproval
          ? "border-amber-300 ring-1 ring-amber-200"
          : "border-border hover:border-gray-300"
      }`}
    >
      {/* 1. GATED AUTONOMY GOVERNANCE BANNER (IF PENDING APPROVAL) */}
      {isPendingApproval && (
        <div className="bg-amber-500/10 border-b border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Pillar 6 Autonomy Governance
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                  High-Risk Decision Gate
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Automated broadcast held. Requires authorized human sign-off before dispatch.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleApprove}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold gap-1.5 h-8 shrink-0 shadow-sm"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Authorize &amp; Issue Advisory</span>
          </Button>
        </div>
      )}

      {/* SPECIFIC NAMED CONFIRMATION MESSAGE (Requirement 4) */}
      {isApprovedLocal && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold text-emerald-900">
              Advisory Authorized &amp; Dispatched to Rameswaram Fishery Operations (Sector: Gulf of Mannar • Ref #{decision.id.slice(-6).toUpperCase()})
            </span>
          </div>
          <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded">
            Broadcast Active
          </span>
        </div>
      )}

      {/* 2. ALWAYS-VISIBLE CONTENT: HAZARD BADGE, CONFIDENCE, VALIDITY, HEADLINE, & SHORT REASON */}
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {getRiskBadge(decision.riskTier)}
            <span className="text-xs text-dark-muted font-medium">
              Confidence:{" "}
              <strong className="text-dark-text font-bold">
                {decision.confidenceScore}%
              </strong>
            </span>
          </div>

          {/* Validity Badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-dark-muted bg-gray-50 px-2.5 py-1 rounded-md border border-border shrink-0">
            <Clock className="w-3 h-3 text-dark-light" />
            <span>
              Valid: <strong>{decision.validityPeriod.validUntil}</strong>
            </span>
          </div>
        </div>

        {/* Headline Recommendation */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-dark-text tracking-tight leading-snug break-words">
            {decision.recommendation}
          </h2>
          {/* Short Reason Sentence */}
          <p className="text-xs sm:text-sm text-dark-muted mt-1.5 leading-relaxed break-words">
            {decision.summaryRationale}
          </p>
        </div>
      </div>

      {/* 3. PROGRESSIVE DISCLOSURE ACCORDIONS (COLLAPSED BY DEFAULT) */}
      <div className="border-t border-border divide-y divide-border/60 bg-gray-50/30">
        {/* SECTION A: DECISION-CRITICAL EVIDENCE (EMPIRICAL OBSERVATIONS) */}
        <div>
          <button
            type="button"
            onClick={() => setIsEvidenceOpen(!isEvidenceOpen)}
            className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-dark-text min-w-0">
              <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="break-words">
                Supporting Empirical Observations ({decision.keyEvidence.length} in-situ data points)
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase hidden sm:inline">
                Empirical
              </span>
              <ChevronDown
                className={`w-4 h-4 text-dark-muted transition-transform duration-200 ${
                  isEvidenceOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </div>
          </button>

          {isEvidenceOpen && (
            <div className="px-5 pb-4 pt-1 bg-gray-50/60 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {decision.keyEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 bg-white border border-border rounded-lg shadow-subtle flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] text-dark-muted font-medium break-words">
                          {ev.label}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded shrink-0">
                          Empirical
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-sm font-bold text-dark-text">
                          {String(ev.value)}
                        </span>
                        {ev.unit && (
                          <span className="text-[10px] font-medium text-dark-muted">
                            {ev.unit}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100 text-[10px] flex-wrap gap-1">
                      <span className="font-semibold text-primary/90">
                        {ev.source.replace(/_/g, " ")}
                      </span>
                      <span className="text-emerald-700 font-medium">
                        {Math.round(ev.confidence * 100)}% conf
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: CAUSAL EXPLANATION (HYPOTHESIZED / MODEL INFERRED) */}
        <div>
          <button
            type="button"
            onClick={() => setIsCausalOpen(!isCausalOpen)}
            className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors group"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-dark-text min-w-0">
              <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="break-words">Why TIDAL Recommends This (Causal &amp; Inferred Reasoning)</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase hidden sm:inline">
                Hypothesized
              </span>
              <ChevronDown
                className={`w-4 h-4 text-dark-muted transition-transform duration-200 ${
                  isCausalOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </div>
          </button>

          {isCausalOpen && (
            <div className="px-5 pb-4 pt-1 bg-gray-50/60 border-t border-gray-100">
              {/* Distinct Hypothesized Treatment with Dashed Border (Requirement 5) */}
              <div className="p-3.5 bg-blue-50/50 border border-dashed border-blue-300 rounded-lg text-xs text-blue-950 leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Hypothesized Causal Model Chain</span>
                </div>
                <p className="font-normal break-words">{decision.causalExplanation.narrative}</p>

                <div className="mt-2.5 pt-2 border-t border-blue-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                    Inferred Physical Drivers:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-900/90">
                    {decision.causalExplanation.primaryDrivers.map((driver, i) => (
                      <li key={i} className="break-words">{driver}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION C: COUNTERFACTUAL SCENARIOS (WHAT-IF) */}
        {decision.counterfactuals && decision.counterfactuals.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setIsCounterfactualsOpen(!isCounterfactualsOpen)}
              className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-dark-text min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="break-words">
                  Alternative Scenarios ("What-If" • {decision.counterfactuals.length} evaluated)
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-dark-muted transition-transform duration-200 ${
                  isCounterfactualsOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>

            {isCounterfactualsOpen && (
              <div className="px-5 pb-4 pt-1 bg-gray-50/60 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {decision.counterfactuals.map((cf) => {
                    const isSelected = activeScenarioId === cf.id;
                    return (
                      <button
                        key={cf.id}
                        type="button"
                        onClick={() => {
                          setActiveScenarioId(cf.id);
                          if (onSelectCounterfactual) onSelectCounterfactual(cf.id);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-blue-50/90 border-primary ring-1 ring-primary shadow-subtle"
                            : "bg-white border-border hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-dark-text break-words">
                              {cf.scenarioName}
                            </span>
                            {cf.recommended && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                                Best
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-dark-muted break-words">
                            {cf.predictedOutcome}
                          </p>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] flex-wrap gap-1">
                          <span className="text-dark-muted">Risk Score:</span>
                          <span
                            className={`font-bold ${
                              cf.riskScore < 30
                                ? "text-emerald-700"
                                : cf.riskScore < 70
                                ? "text-amber-700"
                                : "text-rose-700"
                            }`}
                          >
                            {cf.riskScore}/100 ({cf.riskTier})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. COMPACT CRITICAL UNCERTAINTY FOOTER (HYPOTHESIZED TRIGGER) */}
      <div className="p-3.5 bg-gray-50 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-start sm:items-center gap-1.5 text-[11px] min-w-0">
          <Info className="w-3.5 h-3.5 text-dark-muted shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-dark-muted break-words">
            Critical Uncertainty:{" "}
            <strong className="text-dark-text">
              {decision.criticalUncertainty.variable}
            </strong>{" "}
            (Trigger: {decision.criticalUncertainty.threshold})
          </span>
        </div>

        <div className="text-[11px] text-dark-muted shrink-0">
          Recheck: <strong>{decision.validityPeriod.recheckRecommendedAt}</strong>
        </div>
      </div>
    </div>
  );
};

export const DecisionCard = React.memo(DecisionCardComponent);
