import React from "react";
import { MessageSquare, Activity, FileText, Award, Check } from "lucide-react";
import { SimulationPhase } from "../types";

interface PhaseStepperProps {
  currentPhase: SimulationPhase;
  onSelectPhase?: (phase: SimulationPhase) => void;
  maxReachedPhase: SimulationPhase;
}

export const PhaseStepper: React.FC<PhaseStepperProps> = ({
  currentPhase,
  onSelectPhase,
  maxReachedPhase,
}) => {
  const steps = [
    {
      phase: 1 as SimulationPhase,
      title: "Phase 1: 母親問診",
      description: "SP母親との対話・情報収集",
      icon: MessageSquare,
    },
    {
      phase: 2 as SimulationPhase,
      title: "Phase 2: アセスメント",
      description: "バイタル＆身体所見の確認",
      icon: Activity,
    },
    {
      phase: 3 as SimulationPhase,
      title: "Phase 3: SBAR報告作成",
      description: "指導者への報告と振り返り",
      icon: FileText,
    },
    {
      phase: 4 as SimulationPhase,
      title: "Phase 4: LCJR-J評価",
      description: "44点満点多面臨床判断評価",
      icon: Award,
    },
  ];

  return (
    <nav aria-label="シミュレーション進行フェーズ" className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {steps.map((step) => {
            const isActive = currentPhase === step.phase;
            const isCompleted = currentPhase > step.phase;
            const isSelectable = step.phase <= maxReachedPhase;
            const Icon = step.icon;

            return (
              <li key={step.phase}>
                <button
                  id={`step-phase-${step.phase}-btn`}
                  type="button"
                  disabled={!isSelectable}
                  onClick={() => onSelectPhase?.(step.phase)}
                  className={`w-full text-left p-2 sm:p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                    isActive
                      ? "border-teal-600 bg-teal-50/70 text-teal-950 shadow-xs ring-1 ring-teal-500/20"
                      : isCompleted
                      ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer"
                      : "border-slate-200/60 bg-white text-slate-400 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-snug truncate ${isActive ? "text-teal-900" : "text-slate-800"}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
