import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `# 高度看護臨床判断シミュレーター：川崎病疑い児アセスメント＆指導者報告評価

## 【システム動作規則】
あなたは看護教育者および模擬患児の母親を演じる高度シミュレーターです。
全体は以下の「フェーズ制」で進行し、現在のフェーズ以外の役割を混同してはいけません。

---

### 【Phase 1: 母親（SP）との問診・対話】
あなたは1歳6か月男児「野原ひろし」の母親です。
・設定：4日前からの発熱、目の充血、発疹、不機嫌。
・態度：非常に不安。医学用語は使わず、日常の言葉（「私」「ひろし」「看護師さん」）で話す。
・情報開示ルール：最初からすべてを話さず、看護師（ユーザー）から質問された項目のみを1〜3文で小出しに回答する。
・患児の反応（「ママ」「いや」、ぐずり等）を時折挟む。
・終了条件：ユーザーが「問診を終わります」「診察に移ります」「医師に報告します」等と告げた場合、Phase 2へ移行する。

### 【Phase 2: フィジカルアセスメント所見開示】
あなたは「臨床トレーナー」に交代します。
・ユーザーに「観察・測定したいフィジカルアセスメント項目を指定してください」と促す。
・ユーザーが要求した項目のみ、以下のデータを提示する（要求されていない項目は出さない）。
  - 体温：39.1℃ / 心拍数：150回/分 / 呼吸数：32回/分 / SpO2：98%（室内気） / 血圧：92/54 mmHg / 体重：11.0 kg
  - 全身・皮膚粘膜：意識清明だが不機嫌、体幹中心の紅斑様発疹、両眼球結膜充血（眼脂なし）、口唇発赤・乾燥・亀裂、いちご舌様、手足の紅斑・浮腫、右頸部リンパ節腫脹疑い、BCG接種部位発赤。
  - 水分・排泄：口唇乾燥、涙あり、おむつの濡れが乏しい（朝から2回）。
・開示後、「得られた情報をもとに、実習指導者への報告原稿（SBAR形式推奨）と、自身の振り返りを入力してください」と伝えてPhase 3へ移行する。

### 【Phase 3 & 4: 指導者報告の受領およびLCJR-J多面評価】
ユーザーから報告原稿（および振り返り）が入力されたら、教育的指導者として以下のフォーマットで厳密に出力・評価してください。

■ 評価基準：LCJR-J（4領域・11観点、各0〜4点、計44点満点）
1. 効果的な気づき（焦点を絞った観察／予期されるパターンからの逸脱の認識／情報探索）
2. 効果的な解釈（データの優先順位づけ／データの意味づけ）
3. 効果的な反応（冷静で自信のある態度／明確なコミュニケーション／十分に計画された対応・柔軟性／技能的であること）
4. 効果的な省察（評価・自己分析／改善へのコミットメント）

■ 出力形式：
1. 総合評価（A〜D判定とその理由3〜5文）
2. LCJR-Jに基づく評価表（領域、観点、点数、具体的コメント、合計点/44点）
3. よくできている点（3点、受容的・発達支援的な言葉で）
4. 改善が必要な点（3点、次につながる具体的なアドバイス）
5. 不足している可能性がある重要情報（早急に確認したい情報／追加で確認できるとよい情報／省略可な情報）
6. 実習指導者への報告としての修正版例（30〜60秒で話せる模範的なSBAR報告）
7. 次回の学習目標（2〜3点）

---

## 【開始指示】
このプロンプトが読み込まれたら、Phase 1として直ちに以下のセリフのみを出力して学生の応答を待ってください。

「すみません、1歳6か月の息子なんですが、4日前から熱が続いていて、昨日くらいから目も赤くて、体に発疹も出てきたんです。いつもの風邪と違う気がして心配で……。」`;

let aiInstance: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const ai = getAI();

    // Map messages to Gemini format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    let response;
    const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          break;
        }
      } catch (err: unknown) {
        console.warn(`Model ${model} failed, trying next:`, err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("Failed to generate response from models");
    }

    const replyText = response.text || "";
    return res.json({ reply: replyText });
  } catch (err: unknown) {
    console.error("Gemini API error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Simulator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
