import { KawasakiCriterion } from "../types";

export const INITIAL_MOTHER_SPEECH =
  "すみません、1歳6か月の息子なんですが、4日前から熱が続いていて、昨日くらいから目も赤くて、体に発疹も出てきたんです。いつもの風邪と違う気がして心配で……。";

export const PHASE_1_SUGGESTIONS = [
  { label: "熱の経過・解熱剤", prompt: "お熱は何日頃から続いていますか？解熱剤を使っても下がりにくかったでしょうか？" },
  { label: "水分・おしっこ", prompt: "水分やおっぱいは摂れていますか？おむつのおしっこの回数や量はいかがですか？" },
  { label: "目やにの有無", prompt: "目が充血しているとのことですが、目やには出ていますか？" },
  { label: "唇・舌の様子", prompt: "唇の赤みや乾燥、舌がイチゴのようにブツブツ赤くなったりはしていませんか？" },
  { label: "手足の腫れ・赤み", prompt: "手足の先が赤くなったり、パンパンにむくんだりしていませんか？" },
  { label: "BCG接種の跡", prompt: "腕にあるBCGのハンコ注射の跡が赤く腫れたりしていませんか？" },
  { label: "首の腫れ・痛がり", prompt: "首のあたりにしこりや腫れがあったり、触られるのを嫌がったりしませんか？" },
  { label: "機嫌・全身状態", prompt: "普段と比べて機嫌や活気、あやした時の反応はいかがでしょうか？" },
];

export const PHASE_2_ASSESSMENT_CATEGORIES = [
  {
    category: "バイタルサイン",
    icon: "Activity",
    items: [
      { label: "全バイタルサイン測定", prompt: "体温、脈拍数、呼吸数、SpO2、血圧、体重を測定・確認します。" },
      { label: "体温とSpO2", prompt: "現在の体温とSpO2（経皮的動脈血酸素飽和度）を測定します。" },
      { label: "脈拍と呼吸数", prompt: "心拍数（脈拍）と呼吸数を測定します。" },
    ],
  },
  {
    category: "全身・皮膚・BCG",
    icon: "ShieldAlert",
    items: [
      { label: "全身皮膚・発疹の観察", prompt: "体幹を中心とした発疹の性状・広がりを観察します。" },
      { label: "BCG接種部位の確認", prompt: "左上腕のBCG接種部位の発赤・腫脹の有無を確認します。" },
      { label: "意識状態・機嫌", prompt: "意識レベルおよび機嫌・あやした時の活気状態を観察します。" },
    ],
  },
  {
    category: "眼・口腔・粘膜",
    icon: "Eye",
    items: [
      { label: "両眼球結膜・眼脂", prompt: "両眼球結膜の充血状態と、眼脂（目やに）の有無を観察します。" },
      { label: "口唇・舌・咽頭所見", prompt: "口唇の発赤・乾燥・亀裂、舌の表面（いちご舌）、咽頭粘膜を観察します。" },
    ],
  },
  {
    category: "四肢・リンパ節・水分",
    icon: "HeartPulse",
    items: [
      { label: "四肢末端（手足の紅斑・浮腫）", prompt: "両手・両足の末梢の発赤（紅斑）や硬性浮腫の有無を観察・触診します。" },
      { label: "頸部リンパ節触診", prompt: "頸部リンパ節の腫脹・圧痛の有無を左右触診します。" },
      { label: "水分出納・脱水徴候", prompt: "口腔粘膜の湿潤度、涙の有無、尿排泄状況をアセスメントします。" },
    ],
  },
];

export const INITIAL_KAWASAKI_CRITERIA: KawasakiCriterion[] = [
  {
    id: "fever",
    title: "5日以上続く発熱",
    description: "4日前からの高熱が持続（現在 39.1℃）",
    found: false,
    findingDetail: "体温 39.1℃、4日前から解熱傾向なし",
  },
  {
    id: "conjunctivitis",
    title: "両側眼球結膜の充血",
    description: "眼脂（目やに）を伴わない両眼の結膜充血",
    found: false,
    findingDetail: "両眼球結膜充血あり、眼脂なし",
  },
  {
    id: "oral",
    title: "口唇・口腔粘膜の変化",
    description: "口唇の発赤・乾燥・亀裂、いちご舌",
    found: false,
    findingDetail: "口唇発赤・乾燥・亀裂、いちご舌様所見あり",
  },
  {
    id: "rash",
    title: "不定形発疹",
    description: "体幹中心の紅斑様発疹、BCG接種部位の発赤",
    found: false,
    findingDetail: "体幹中心の紅斑様発疹、BCG接種部位の発赤あり",
  },
  {
    id: "extremities",
    title: "四肢末端の変化（急性期）",
    description: "手足の紅斑・硬性浮腫",
    found: false,
    findingDetail: "手足の紅斑・浮腫あり",
  },
  {
    id: "lymph",
    title: "急性期非化膿性頸部リンパ節腫脹",
    description: "径1.5cm以上の頸部リンパ節腫脹（多くは片側性）",
    found: false,
    findingDetail: "右頸部リンパ節腫脹疑いあり",
  },
];
