import React, { useState } from "react";
import { Send, FileText, Sparkles, AlertCircle, HelpCircle, RotateCcw } from "lucide-react";
import { SbarReportInput } from "../types";

interface SbarFormProps {
  onSubmitReport: (reportText: string) => void;
  isLoading: boolean;
  onBackToAssessment: () => void;
}

export const SbarForm: React.FC<SbarFormProps> = ({
  onSubmitReport,
  isLoading,
  onBackToAssessment,
}) => {
  const [formData, setFormData] = useState<SbarReportInput>({
    situation: "",
    background: "",
    assessment: "",
    recommendation: "",
    reflection: "",
  });

  const handleInsertTemplate = () => {
    setFormData({
      situation:
        "【Situation（状況）】\n指導者さん、ただいま小児科外来にて野原ひろしちゃん（1歳6か月、男児、体重11.0kg）の問診とフィジカルアセスメントを実施しました。4日目となる39℃台の高熱に加え、川崎病を疑う身体所見が多数出現しているため、至急医師への報告・診察が必要と判断し報告いたします。",
      background:
        "【Background（背景）】\n4日前から39℃前後の発熱が持続し、解熱薬でも解熱傾向が乏しい状況です。昨日より両眼の充血と体幹の発疹が出現しました。哺乳・水分摂取が減少し、おむつの濡れは今朝から2回のみと乏しく、不機嫌が続いています。",
      assessment:
        "【Assessment（アセスメント）】\n・バイタルサイン: 体温 39.1℃、心拍数 150回/分、呼吸数 32回/分、SpO2 98%(RA)、血圧 92/54 mmHg。\n・主要所見: 両眼球結膜充血（眼脂なし）、口唇発赤・乾燥・亀裂、いちご舌様、体幹の紅斑様発疹、BCG接種部位の発赤、手足の紅斑・浮腫、右頸部リンパ節腫脹疑いを認め、川崎病主要6症状のうち5項目を満たしています。\n・脱水所見: 口唇乾燥、尿量低下（乏尿傾向）を認め、脱水の進行にも注意が必要です。",
      recommendation:
        "【Recommendation（提案・要請）】\n小児科担当医へ至急コールし診察を依頼するとともに、川崎病確定診断および冠動脈病変評価のための心エコー検査・12誘導心電図、血液検査の準備を提案いたします。また、脱水補正の点滴ルート確保の準備と、強い不安を抱えるお母さんへの付き添い・心理的支援を継続してよろしいでしょうか。",
      reflection:
        "【自身の振り返り】\nお母さんが非常に不安を抱えておられたため、傾聴と共感を意識して質問を小出しにしながら対話を進めました。所見の確認では、川崎病の鑑別を意識して眼・口腔・四肢・BCG接種痕まで系統的に観察できたと思います。一方、脱水の程度（皮膚ツルゴールや正確な尿量など）の深掘りや、医師への急変リスク伝達の簡潔さについて、より迅速かつ的確に伝えられるよう改善したいです。",
    });
  };

  const handleClear = () => {
    if (confirm("入力内容をリセットしますか？")) {
      setFormData({
        situation: "",
        background: "",
        assessment: "",
        recommendation: "",
        reflection: "",
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullReport = `【実習指導者へのSBAR報告原稿】
${formData.situation.trim()}

${formData.background.trim()}

${formData.assessment.trim()}

${formData.recommendation.trim()}

【自身の振り返り】
${formData.reflection.trim()}`;

    onSubmitReport(fullReport);
  };

  const isFormValid =
    formData.situation.trim().length > 0 &&
    formData.background.trim().length > 0 &&
    formData.assessment.trim().length > 0 &&
    formData.recommendation.trim().length > 0 &&
    formData.reflection.trim().length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Phase 3: 実習指導者へのSBAR報告作成 ＆ 自身の振り返り
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            収集した問診および身体所見に基づき、実習指導者への報告（SBAR形式推奨）と看護実践の自己振り返りを入力してください。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="insert-sbar-template-btn"
            onClick={handleInsertTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>模範構成テンプレート挿入</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="入力をクリア"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-5">
        {/* SBAR Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Situation */}
          <div className="space-y-1.5">
            <label
              htmlFor="sbar-situation"
              className="block text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">
                  S
                </span>
                <span>Situation（現在の状況・緊急報告の要点）</span>
              </span>
              <span className="text-[10px] text-slate-400">対象児・用件・緊急度</span>
            </label>
            <textarea
              id="sbar-situation"
              rows={3}
              required
              value={formData.situation}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              placeholder="例: 指導者さん、野原ひろしちゃん（1歳6か月）について至急医師報告が必要と判断し報告いたします..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
            />
          </div>

          {/* Background */}
          <div className="space-y-1.5">
            <label
              htmlFor="sbar-background"
              className="block text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-amber-600 text-white flex items-center justify-center text-[10px]">
                  B
                </span>
                <span>Background（臨床経過・来院の背景）</span>
              </span>
              <span className="text-[10px] text-slate-400">経過・発熱期間・既往</span>
            </label>
            <textarea
              id="sbar-background"
              rows={3}
              required
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              placeholder="例: 4日前から39℃台の熱が続き、昨日から目の充血と発疹が出現しました..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
            />
          </div>

          {/* Assessment */}
          <div className="space-y-1.5">
            <label
              htmlFor="sbar-assessment"
              className="block text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-rose-600 text-white flex items-center justify-center text-[10px]">
                  A
                </span>
                <span>Assessment（看護所見・臨床判断・疑われる病態）</span>
              </span>
              <span className="text-[10px] text-slate-400">バイタル・主要症状・脱水</span>
            </label>
            <textarea
              id="sbar-assessment"
              rows={4}
              required
              value={formData.assessment}
              onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
              placeholder="例: バイタルサインは体温39.1℃、心拍150。眼球結膜充血、いちご舌、BCG発赤、手足浮腫など川崎病症状を5項目満たしており..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
            />
          </div>

          {/* Recommendation */}
          <div className="space-y-1.5">
            <label
              htmlFor="sbar-recommendation"
              className="block text-xs font-bold text-slate-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  R
                </span>
                <span>Recommendation（具体的な提案・要請・看護計画）</span>
              </span>
              <span className="text-[10px] text-slate-400">医師診察・検査・点滴・家族ケア</span>
            </label>
            <textarea
              id="sbar-recommendation"
              rows={4}
              required
              value={formData.recommendation}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              placeholder="例: 直ちに小児科医へ診察依頼し、心エコーや心電図の検査準備を提案します。また不安なお母さんへの声かけ..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Self-Reflection section */}
        <div className="pt-2 border-t border-slate-200">
          <label
            htmlFor="sbar-reflection"
            className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center text-[10px]">
                反
              </span>
              <span>自身の振り返り（コミュニケーション、臨床判断の思考プロセス、今後の課題）</span>
            </span>
            <span className="text-[10px] text-purple-700 font-semibold">LCJR-Jの「効果的な省察」の評価対象</span>
          </label>
          <textarea
            id="sbar-reflection"
            rows={3}
            required
            value={formData.reflection}
            onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
            placeholder="例: 不安なお母さんの心理に配慮しながら話を聞けました。一方で、川崎病の冠動脈病変のリスクに関する緊急度をさらに迅速に伝えるべきだったと感じています..."
            className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-3 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-hidden bg-purple-50/20"
          />
        </div>

        {/* Footer controls */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToAssessment}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            ← 前の対話・アセスメントに戻る
          </button>

          <button
            type="submit"
            id="submit-sbar-report-btn"
            disabled={!isFormValid || isLoading}
            className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>指導者に提出し、LCJR-J多面評価を受ける（Phase 4へ）</span>
          </button>
        </div>
      </form>
    </div>
  );
};
