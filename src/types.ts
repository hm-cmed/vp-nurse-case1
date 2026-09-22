export type SimulationPhase = 1 | 2 | 3 | 4;

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  senderName: string;
  content: string;
  timestamp: string;
  phase?: SimulationPhase;
}

export interface KawasakiCriterion {
  id: string;
  title: string;
  description: string;
  found: boolean;
  findingDetail?: string;
}

export interface SbarReportInput {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  reflection: string;
}

export interface LCJRItem {
  domain: string; // 領域 (効果的な気づき, 効果的な解釈, etc.)
  aspect: string; // 観点
  score: number; // 0 - 4
  comment: string;
}

export interface EvaluationResult {
  grade: "A" | "B" | "C" | "D";
  gradeReason: string;
  totalScore: number;
  maxScore: number;
  lcjrItems: LCJRItem[];
  goodPoints: string[];
  improvementPoints: string[];
  missingInfo: {
    urgent: string[];
    recommended: string[];
    optional: string[];
  };
  modelSbar: string;
  learningGoals: string[];
  rawMarkdown: string;
}
