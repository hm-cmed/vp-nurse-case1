import React from "react";
import { Stethoscope, Baby, RotateCcw, AlertTriangle, BookOpen } from "lucide-react";
import { SimulationPhase } from "../types";

interface HeaderProps {
  currentPhase: SimulationPhase;
  onReset: () => void;
  onOpenReference: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPhase, onReset, onOpenReference }) => {
  const getPhaseBadge = () => {
    switch (currentPhase) {
      case 1:
        return { label: "Phase 1: 母親(SP)問診", color: "bg-amber-100 text-amber-900 border-amber-300" };
      case 2:
        return { label: "Phase 2: 診察（フィジカルアセスメント）", color: "bg-blue-100 text-blue-900 border-blue-300" };
      case 3:
        return { label: "Phase 3: SBAR報告作成", color: "bg-indigo-100 text-indigo-900 border-indigo-300" };
      case 4:
        return { label: "Phase 4: LCJR-J総合評価", color: "bg-emerald-100 text-emerald-900 border-emerald-300" };
    }
  };

  const badge = getPhaseBadge();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Primary bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                高度看護臨床判断シミュレーター
              </h1>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              小児看護実習対話シミュレーション（患児・母親への問診＆アセスメント）
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="open-reference-guide-btn"
            onClick={onOpenReference}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
            title="診断の手引き（参考資料）を確認"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>川崎病の手引き（参考）</span>
          </button>

          <button
            type="button"
            id="reset-simulation-btn"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
            title="最初からやり直す"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>やり直し</span>
          </button>
        </div>
      </div>

      {/* Patient info strip */}
      <div className="bg-slate-50/90 border-t border-slate-200/80 px-4 sm:px-6 py-2 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="font-bold text-slate-900">野原 ひろしちゃん</span>
            <span className="text-slate-600">（1歳6か月 / 男児 / 体重 11.0 kg）</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">母親（野原さん・20代後半）同伴</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <span><strong>受診状況:</strong> 4日前からの発熱（最高39℃台）、両眼充血、発疹、不機嫌</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-amber-800 font-medium bg-amber-100/70 px-2 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              水分摂取減少・解熱薬無効
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
