/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PhaseStepper } from "./components/PhaseStepper";
import { ReferenceModal } from "./components/ReferenceModal";
import { ChatView } from "./components/ChatView";
import { SbarForm } from "./components/SbarForm";
import { EvaluationView } from "./components/EvaluationView";
import { ChatMessage, SimulationPhase } from "./types";
import { INITIAL_MOTHER_SPEECH } from "./data/simulatorData";
import { AlertCircle, MessageSquare } from "lucide-react";

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<SimulationPhase>(1);
  const [maxReachedPhase, setMaxReachedPhase] = useState<SimulationPhase>(1);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [evaluationMarkdown, setEvaluationMarkdown] = useState<string>("");

  const initialMessage: ChatMessage = {
    id: "init-1",
    role: "model",
    senderName: "母親（野原さん）",
    content: INITIAL_MOTHER_SPEECH,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    phase: 1,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  // Advance maxReachedPhase when currentPhase increases
  useEffect(() => {
    if (currentPhase > maxReachedPhase) {
      setMaxReachedPhase(currentPhase);
    }
  }, [currentPhase, maxReachedPhase]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setErrorMessage(null);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      senderName: "看護学生（あなた）",
      content: text,
      timestamp: now,
      phase: currentPhase,
    };

    // Detect phase transition intent in chat
    const lowerText = text.toLowerCase();
    let targetPhase = currentPhase;
    if (
      currentPhase === 1 &&
      (lowerText.includes("問診を終わ") ||
        lowerText.includes("診察に移") ||
        lowerText.includes("フィジカルアセスメント") ||
        lowerText.includes("身体診察") ||
        lowerText.includes("医師に報告"))
    ) {
      targetPhase = 2;
      setCurrentPhase(2);
    }

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `通信エラーが発生しました (${response.status})`);
      }

      const data = await response.json();
      const reply = data.reply || "";

      // Determine sender title
      let senderName = "母親（野原さん）＆ ひろしちゃん";
      if (targetPhase === 2 || reply.includes("臨床トレーナー") || reply.includes("フィジカルアセスメント所見")) {
        senderName = "臨床トレーナー";
        if (targetPhase < 2) {
          targetPhase = 2;
          setCurrentPhase(2);
        }
      } else if (targetPhase >= 3 || reply.includes("LCJR-J") || reply.includes("指導者報告")) {
        senderName = "実習指導者（教育的評価）";
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        senderName,
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        phase: targetPhase,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const msg = err instanceof Error ? err.message : "サーバーとの通信に失敗しました。もう一度お試しください。";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransitionToPhase2 = () => {
    handleSendMessage(
      "お母さん、お話しいただきありがとうございます。それではこれより、ひろしちゃんの身体の診察（フィジカルアセスメント）を始めさせていただきますね。"
    );
  };

  const handleTransitionToPhase3 = () => {
    setCurrentPhase(3);
  };

  const handleSubmitSbar = async (reportText: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentPhase(4);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      senderName: "看護学生（あなた）",
      content: reportText,
      timestamp: now,
      phase: 3,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `評価生成エラーが発生しました (${response.status})`);
      }

      const data = await response.json();
      const reply = data.reply || "";

      setEvaluationMarkdown(reply);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        senderName: "実習指導者（教育的評価）",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        phase: 4,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: unknown) {
      console.error("Evaluation error:", err);
      const msg = err instanceof Error ? err.message : "評価の取得に失敗しました。";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("シミュレーションを初期状態に戻しますか？現在の対話と評価はリセットされます。")) {
      setCurrentPhase(1);
      setMaxReachedPhase(1);
      setEvaluationMarkdown("");
      setErrorMessage(null);
      setMessages([
        {
          id: "init-1",
          role: "model",
          senderName: "母親（野原さん）",
          content: INITIAL_MOTHER_SPEECH,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          phase: 1,
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        currentPhase={currentPhase}
        onReset={handleReset}
        onOpenReference={() => setIsReferenceModalOpen(true)}
      />

      <PhaseStepper
        currentPhase={currentPhase}
        onSelectPhase={(phase) => setCurrentPhase(phase)}
        maxReachedPhase={maxReachedPhase}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">通信エラー</p>
              <p className="mt-0.5 text-xs text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Active Phase Content: Focus directly on Chat for Phase 1 & 2 */}
        {currentPhase === 1 || currentPhase === 2 ? (
          <ChatView
            messages={messages}
            currentPhase={currentPhase}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onTransitionToPhase2={handleTransitionToPhase2}
            onTransitionToPhase3={handleTransitionToPhase3}
          />
        ) : currentPhase === 3 ? (
          <div className="space-y-4">
            <SbarForm
              onSubmitReport={handleSubmitSbar}
              isLoading={isLoading}
              onBackToAssessment={() => setCurrentPhase(2)}
            />

            {/* Previous dialogue summary drawer */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-teal-700" />
                <span>これまでの問診・所見履歴の確認</span>
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2 text-xs text-slate-700 p-2 bg-slate-50 rounded-xl border border-slate-200">
                {messages.map((m) => (
                  <div key={m.id} className="border-b border-slate-200/60 pb-1.5 last:border-b-0">
                    <span className="font-semibold text-slate-900">{m.senderName}: </span>
                    <span className="text-slate-700">{m.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EvaluationView
            evaluationMarkdown={evaluationMarkdown || "評価結果を生成中..."}
            onRestart={handleReset}
            onEditSbar={() => setCurrentPhase(3)}
          />
        )}
      </main>

      {/* Reference Guide Modal (Read-only knowledge reference) */}
      <ReferenceModal
        isOpen={isReferenceModalOpen}
        onClose={() => setIsReferenceModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 text-center text-xs text-slate-500 print:hidden">
        <p>高度看護臨床判断シミュレーター（川崎病疑い児アセスメント＆指導者報告評価）</p>
      </footer>
    </div>
  );
}
