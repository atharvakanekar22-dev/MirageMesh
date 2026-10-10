import React from 'react'
import { CheckCircle2, HelpCircle, Layers, ShieldCheck, AlertCircle } from 'lucide-react'
import type { RiskFactor, IncidentAnalysis } from '@/types/incident'

interface RiskBreakdownProps {
  score: number
  factors?: RiskFactor[]
  analysis?: IncidentAnalysis
}

export const RiskBreakdown: React.FC<RiskBreakdownProps> = ({
  score,
  factors = [],
  analysis,
}) => {
  return (
    <div className="space-y-5">
      {/* 1. Score Summary Banner */}
      <div className="p-4.5 rounded-2xl bg-[#FAFBF9] border border-[#E5E9E5] flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-[#77847C]">
            Deterministic Composite Risk Score
          </div>
          <div className="text-3xl font-bold font-mono text-[#17251F] mt-1 tabular-nums">
            {score} <span className="text-xs font-normal text-[#77847C]">/ 100</span>
          </div>
          <p className="text-[11px] text-[#77847C] mt-1">
            Calculated strictly from verified canary trips and telemetry frequency
          </p>
        </div>

        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              score >= 75
                ? 'bg-[#FDF2F2] text-[#C74646] border-[#F7D4D4]'
                : score >= 50
                ? 'bg-[#FFF8EE] text-[#C47B24] border-[#FCE6C9]'
                : 'bg-[#FEFCE8] text-[#A8861B] border-[#FEF08A]'
            }`}
          >
            {score >= 75 ? 'CRITICAL RISK BAND' : score >= 50 ? 'HIGH RISK BAND' : 'GUARDED RISK BAND'}
          </span>
        </div>
      </div>

      {/* 2. Observed Facts (Empirical Evidence) */}
      <div className="rounded-2xl border border-[#C8DFD4] bg-[#E8F2EC]/30 p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#C8DFD4]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#176B4D]" />
            <h4 className="text-xs font-bold text-[#17251F]">
              1. Observed Empirical Facts (Sensor Ground Truth)
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#176B4D] border border-[#C8DFD4]">
            Zero False-Positive Baseline
          </span>
        </div>

        {analysis?.observedFacts && analysis.observedFacts.length > 0 ? (
          <ul className="space-y-1.5 text-xs text-[#17251F] list-disc list-inside">
            {analysis.observedFacts.map((fact, idx) => (
              <li key={idx} className="leading-relaxed">
                {fact}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#77847C]">Awaiting verified telemetry ingestion records.</p>
        )}
      </div>

      {/* 3. Deterministic Risk Calculation & Contributing Factors */}
      <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E9E5]">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#176B4D]" />
            <h4 className="text-xs font-bold text-[#17251F]">
              2. Risk Calculation & Contributing Factors
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#77847C]">
            Deterministic Weights Ledger
          </span>
        </div>

        <div className="space-y-2.5">
          {factors.map((factor, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17251F]">{factor.dimension}</span>
                <span className="font-mono text-[#176B4D] font-bold">
                  +{factor.scoreWeight} pts
                </span>
              </div>
              <p className="text-[11px] text-[#77847C]">{factor.justification}</p>
              <div className="pt-1 flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    factor.isObservedFact
                      ? 'bg-[#E8F5EE] text-[#267B58] border-[#C3E6D5]'
                      : 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]'
                  }`}
                >
                  {factor.isObservedFact ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Empirical Observation</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="h-3 w-3" />
                      <span>Heuristic Rule Evaluation</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Possible Interpretation & Uncertainty Statement */}
      <div className="rounded-2xl border border-[#E5E9E5] bg-[#FAFBF9] p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E5E9E5]">
          <AlertCircle className="h-4 w-4 text-[#A8861B]" />
          <h4 className="text-xs font-bold text-[#17251F]">
            3. Possible Interpretation & Uncertainty Bounds
          </h4>
        </div>

        <div className="space-y-2 text-xs text-[#77847C] leading-relaxed">
          <p>
            <strong className="text-[#17251F]">High-Confidence Security Signal: </strong>
            Interaction with a synthetic canary honeytoken carries high statistical confidence because zero business applications reference this resource.
          </p>
          <div className="p-3 rounded-xl bg-white border border-[#E5E9E5] text-[11px] text-[#77847C]">
            <span className="font-semibold text-[#17251F]">Uncertainty Note: </span>
            A confirmed decoy trip does <em>not</em> prove definitive malicious intent. Observed probes may originate from:
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Leaked synthetic credentials committed to development repositories</li>
              <li>Automated security scanner or discovery crawl executing unauthorized route traversal</li>
              <li>Internal operator or engineer probing undocumented application endpoints</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Recommended Next Steps */}
      {analysis?.recommendedMitigations && analysis.recommendedMitigations.length > 0 && (
        <div className="rounded-2xl border border-[#E5E9E5] bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E5E9E5]">
            <ShieldCheck className="h-4 w-4 text-[#176B4D]" />
            <h4 className="text-xs font-bold text-[#17251F]">
              4. Recommended Containment Next Steps
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {analysis.recommendedMitigations.map((action, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E5E9E5] text-xs flex items-start gap-2"
              >
                <span className="font-mono text-[#176B4D] font-bold mt-0.5 shrink-0">
                  {idx + 1}.
                </span>
                <span className="text-[#17251F] leading-snug">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
