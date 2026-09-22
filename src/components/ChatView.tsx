import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Heart,
  Baby,
  Stethoscope,
  ArrowRight,
  Loader2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChatMessage, SimulationPhase } from "../types";

interface ChatViewProps {
  messages: ChatMessage[];
  currentPhase: SimulationPhase;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onTransitionToPhase2: () => void;
  onTransitionToPhase3: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  currentPhase,
  isLoading,
  onSendMessage,
  onTransitionToPhase2,
  onTransitionToPhase3,
}) => {
  const [inputText, setInputText] = useState("");
  const [showHints, setShowHints] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;
    onSendMessage(text);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  /**
   * Parses message content to render child dialogue/crying with distinct styling
   * if child's voice or actions are present.
   */
  const renderMessageContent = (content: string, isModel: boolean) => {
    if (!isModel) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // Check if the content contains child reactions (e.g., ひろし：「...」 or ひろし:「...」)
    const childMatch = content.match(/(?:ひろし(?:ちゃん)?\s*[：:]\s*)([「『][^」』]*[」』]|[^\n]+)/);

    if (childMatch && childMatch[0]) {
      const parts = content.split(childMatch[0]);
      const childSpeech = childMatch[1] ? childMatch[1].trim() : childMatch[0].trim();
      return (
        <div className="space-y-2">
          {parts[0] && <div className="whitespace-pre-wrap">{parts[0].trim()}</div>}
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5 shadow-2xs">
            <Baby className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-medium">
              <span className="font-bold text-amber-900 block text-[11px] mb-0.5">
                患児 ひろしちゃん（1歳6か月）の様子・発声:
              </span>
              <span className="text-amber-950 italic">{childSpeech}</span>
            </div>
          </div>
          {parts[1] && <div className="whitespace-pre-wrap">{parts[1].trim()}</div>}
        </div>
      );
    }

    return <div className="whitespace-pre-wrap">{content}</div>;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] min-h-[580px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Simulation phase banner */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {currentPhase === 1 ? (
            <div className="flex items-center gap-2 text-xs text-amber-950 font-medium bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <div className="flex -space-x-1">
                <span className="w-5 h-5 rounded-full bg-rose-200 border border-white flex items-center justify-center text-[10px]">
                  👩
                </span>
                <span className="w-5 h-5 rounded-full bg-amber-200 border border-white flex items-center justify-center text-[10px]">
                  👶
                </span>
              </div>
              <span>
                対話相手: <strong>母親（野原さん）＆ 患児（ひろしちゃん）</strong>
                <span className="hidden md:inline text-slate-500 ml-1.5">
                  — 気になる症状や状態をチャットで質問してください
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-blue-950 font-medium bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
              <Stethoscope className="w-4 h-4 text-blue-700" />
              <span>
                対話相手: <strong>臨床トレーナー（身体診察・所見開示）</strong>
                <span className="hidden md:inline text-slate-500 ml-1.5">
                  — 測定・観察したいアセスメント項目をチャットで指定してください
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Phase Action CTA */}
        <div className="flex items-center gap-2">
          {currentPhase === 1 && (
            <button
              type="button"
              id="finish-interview-btn"
              onClick={onTransitionToPhase2}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-xl shadow-xs transition-colors"
            >
              <span>問診を終え、診察（アセスメント）へ進む</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentPhase === 2 && (
            <button
              type="button"
              id="proceed-to-sbar-btn"
              onClick={onTransitionToPhase3}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 rounded-xl shadow-xs transition-colors"
            >
              <span>診察完了：SBAR指導者報告作成へ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const isTrainer = !isUser && (msg.phase === 2 || msg.senderName.includes("トレーナー"));
          const isMother = !isUser && !isTrainer;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  isUser
                    ? "bg-teal-700 text-white"
                    : isTrainer
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : isTrainer ? (
                  <Stethoscope className="w-4 h-4 text-blue-700" />
                ) : (
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-teal-700 text-white rounded-tr-xs"
                    : isTrainer
                    ? "bg-blue-50/90 border border-blue-200 text-slate-900 rounded-tl-xs"
                    : "bg-white border border-slate-200 text-slate-900 rounded-tl-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 border-b border-black/5 pb-1">
                  <span
                    className={`text-xs font-bold ${
                      isUser
                        ? "text-teal-100"
                        : isTrainer
                        ? "text-blue-900"
                        : "text-amber-900"
                    }`}
                  >
                    {isUser
                      ? "看護学生（あなた）"
                      : isTrainer
                      ? "臨床トレーナー"
                      : "母親（野原さん）＆ ひろしちゃん"}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isUser ? "text-teal-200" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {renderMessageContent(msg.content, !isUser)}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>
                {currentPhase === 1
                  ? "お母さん・ひろしちゃんが応答しています..."
                  : "アセスメント所見を確認中..."}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Hints dropdown (Educational reference for students who are stuck, but non-intrusive) */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 text-xs text-slate-600">
        <button
          type="button"
          onClick={() => setShowHints(!showHints)}
          className="flex items-center justify-between w-full text-left font-medium text-slate-700 hover:text-teal-800 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
            <span>
              {currentPhase === 1
                ? "💡 問診の着眼点・ヒント（何を聞くべきか迷った時はここをクリック）"
                : "💡 フィジカルアセスメント測定の着眼点"}
            </span>
          </div>
          {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showHints && (
          <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
            {currentPhase === 1 ? (
              <>
                <p className="text-slate-500 text-[11px]">
                  ※ 選択ボタンではなく、看護師としての自分の言葉で下の入力欄に入力してみましょう：
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>発熱の経過と解熱薬</strong>：いつから熱が始まり、解熱薬を使ったか・効果はあったか？</li>
                  <li><strong>目の充血・目やに</strong>：充血は両眼か、目やに（眼脂）は出ているか？</li>
                  <li><strong>口や舌の様子</strong>：唇の乾燥や赤み、出血、舌がイチゴのように赤くなっていないか？</li>
                  <li><strong>手足の赤みやむくみ</strong>：手足の先がパンパンに腫れたり赤くなったりしていないか？</li>
                  <li><strong>BCGの跡</strong>：左腕のBCG接種痕が赤く腫れ上がっていないか？</li>
                  <li><strong>水分とおしっこ</strong>：水分は飲めているか、おむつは濡れているか、機嫌やぐずりはどうか？</li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-slate-500 text-[11px]">
                  ※ 観察・測定したい項目を下の入力欄に入力してください：
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>「バイタルサイン（体温・脈拍・呼吸・SpO2・血圧）を測定します」</li>
                  <li>「体幹の発疹とBCG接種部位の皮膚を観察します」</li>
                  <li>「両目の結膜と、口唇・舌・口腔内を観察します」</li>
                  <li>「手足の末梢（紅斑・浮腫）と頸部リンパ節を触診します」</li>
                  <li>「口唇乾燥や涙の有無、脱水兆候を確認します」</li>
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      {/* Primary Chat Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex flex-col gap-2"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span>
              {currentPhase === 1
                ? "看護学生として、お母さんやひろしちゃんに尋ねたい質問や声かけを入力してください"
                : "観察・測定したいアセスメント項目を入力してください"}
            </span>
          </span>
          <span className="hidden sm:inline text-slate-400">Enterで送信 / Shift+Enterで改行</span>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              id="chat-input-textarea"
              rows={2}
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={
                currentPhase === 1
                  ? "例：お母さん、お熱は何日前からですか？解熱剤は効きましたか？ひろしちゃん、痛いところはあるかな？"
                  : "例：体温と脈拍、血圧を測ります。BCG接種の跡と両眼の様子を確認させてください。"
              }
              className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50/70 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-700 focus:ring-1 focus:ring-teal-700 focus:outline-hidden leading-relaxed shadow-2xs"
            />
          </div>

          <button
            type="submit"
            id="chat-submit-btn"
            disabled={!inputText.trim() || isLoading}
            className="h-11 px-5 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span className="text-xs sm:text-sm">送信</span>
          </button>
        </div>
      </form>
    </div>
  );
};
