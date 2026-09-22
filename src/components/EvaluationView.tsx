import React, { useState } from "react";
import Markdown from "react-markdown";
import {
  Award,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  RotateCcw,
  Edit3,
  BookOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface EvaluationViewProps {
  evaluationMarkdown: string;
  onRestart: () => void;
  onEditSbar: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  evaluationMarkdown,
  onRestart,
  onEditSbar,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(evaluationMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Detect grade from markdown (A, B, C, D)
  const gradeMatch = evaluationMarkdown.match(/総合評価.*?([A-D])\s*判定/i) ||
    evaluationMarkdown.match(/判定[：:\s]*([A-D])/i) ||
    evaluationMarkdown.match(/\b([A-D])\s*判定/);
  const grade = gradeMatch ? gradeMatch[1].toUpperCase() : null;

  // Detect total score out of 44
  const scoreMatch = evaluationMarkdown.match(/(\d{1,2})\s*[\/／]\s*44/);
  const score = scoreMatch ? scoreMatch[1] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Phase 4: LCJR-J 多面臨床判断評価 ＆ 教育的フィードバック
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                ラスター臨床判断ルーブリック日本版（LCJR-J）に基づく4領域・11観点の多面的評価結果
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            id="copy-evaluation-btn"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>レポートをコピー</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="print-evaluation-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>印刷 / 保存</span>
          </button>

          <button
            type="button"
            id="edit-sbar-again-btn"
            onClick={onEditSbar}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>SBAR再編集</span>
          </button>

          <button
            type="button"
            id="restart-sim-btn"
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>新しいセッション</span>
          </button>
        </div>
      </div>

      {/* Score Summary Spotlight (if detected) */}
      {(grade || score) && (
        <div className="px-4 sm:px-6 py-4 bg-slate-50/70 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {grade && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-xs ${
                  grade === "A"
                    ? "bg-emerald-600 text-white"
                    : grade === "B"
                    ? "bg-blue-600 text-white"
                    : grade === "C"
                    ? "bg-amber-600 text-white"
                    : "bg-rose-600 text-white"
                }`}
              >
                {grade}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Overall Grade
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {grade === "A"
                    ? "卓越 (Exemplary)"
                    : grade === "B"
                    ? "有能 (Accomplished)"
                    : grade === "C"
                    ? "開発途上 (Developing)"
                    : "初期的 (Beginning)"}
                </p>
              </div>
            </div>
          )}

          {score && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-lg">
                {score}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  LCJR-J Total Score
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {score} / 44 点満点
                </p>
              </div>
            </div>
          )}

          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs col-span-1 sm:col-span-2 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-teal-600 shrink-0" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">ルーブリック4領域: </span>
              ①効果的な気づき（Noticing） ②効果的な解釈（Interpreting） ③効果的な反応（Responding） ④効果的な省察（Reflecting）
            </div>
          </div>
        </div>
      )}

      {/* Rendered Markdown Body */}
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="evaluation-markdown prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-4">
          <Markdown>{evaluationMarkdown}</Markdown>
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-xs text-slate-500">
          評価結果を実習記録やポートフォリオに反映させて、次の看護臨床判断学習に役立ててください。
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEditSbar}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs"
          >
            SBAR報告原稿を修正して再提出する
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-xl transition-colors shadow-xs"
          >
            最初からもう一度シミュレーションを行う
          </button>
        </div>
      </div>
    </div>
  );
};
