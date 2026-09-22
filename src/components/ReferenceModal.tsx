import React from "react";
import { X, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { INITIAL_KAWASAKI_CRITERIA } from "../data/simulatorData";

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                川崎病 診断の手引き（改訂第6版・参考資料）
              </h3>
              <p className="text-xs text-slate-500">
                実習・臨床推論のための参考知識です（チャット問診で自ら情報収集してください）
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-xl text-xs text-teal-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p>
              <strong>診断基準の概要：</strong>
              主要6症状のうち<strong>5症状以上</strong>を満たす場合、または4症状＋冠動脈病変（心エコー所見）が認められる場合に川崎病と診断されます。早期発見と迅速な小児科医への報告が冠動脈瘤などの重篤な合併症を防ぎます。
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              主要6症状一覧
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INITIAL_KAWASAKI_CRITERIA.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60"
                >
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px]">
                      症状 {index + 1}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">小児看護・問診のポイント</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                川崎病の初期は通常の感冒様症状と類似します。発熱の日数、解熱剤への反応、BCG接種痕の発赤、両眼球結膜の充血（目やにを伴わないこと）、口唇の乾燥やいちご舌、手足の硬性浮腫、不機嫌さ、水分摂取の低下などに着目して、母親へ丁寧に尋ねるとともに患児の全身状態を観察します。
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
