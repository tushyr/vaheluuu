// Complete 81-State Map and Question System for Project 23

export interface QuestionOption {
  id: string;
  label: string;
  sub?: string;
  echo: string;
}

export const Q1_OPTIONS: QuestionOption[] = [
  {
    id: "A1",
    label: "he means well.",
    sub: "bold. technically defensible.",
    echo: "he means well.\nthe court is unconvinced.\nbut points for confidence.",
  },
  {
    id: "A2",
    label: "he's mostly harmless.",
    sub: "mostly is doing a lot of work here.",
    echo: "mostly harmless.\nthat's a very low bar.\nyou cleared it.",
  },
  {
    id: "A3",
    label: "i can explain.",
    sub: "the correct vibe honestly.",
    echo: "i can explain.\nno further questions.\n",
  },
];

export const Q2_OPTIONS: QuestionOption[] = [
  {
    id: "B1",
    label: "one more message.",
    sub: "a bold lie.",
    echo: "one more message.\nstatistically, that's never been true.",
  },
  {
    id: "B2",
    label: "mid-conversation.",
    sub: "typing... then gone.",
    echo: "mid-conversation.\nphone on the face. classic.",
  },
  {
    id: "B3",
    label: "you already lost me.",
    sub: "asleep before you hit send.",
    echo: "you already lost me.\ni'm talking to a wall. wonderful.",
  },
];

export const Q3_OPTIONS: QuestionOption[] = [
  {
    id: "C1",
    label: "me.",
    echo: "me.\nwhen has that ever happened in the history of us?",
  },
  {
    id: "C2",
    label: "you.",
    echo: "you.\noptimistic. completely ungrounded in reality.",
  },
  {
    id: "C3",
    label: "nobody.",
    echo: "nobody.\naccurate. the only correct answer.",
  },
];

export const Q4_OPTIONS: QuestionOption[] = [
  {
    id: "D1",
    label: "how well we get along.",
    sub: "deeply suspicious.",
    echo: "how well we get along.\nyeah.\nsuspicious.\nright?",
  },
  {
    id: "D2",
    label: "how badly we enable each other.",
    sub: "clinically concerning.",
    echo: "how badly we enable each other.\ncorrect.\nclinically.\nno notes.",
  },
  {
    id: "D3",
    label: "that this somehow works.",
    sub: "the most suspicious one.",
    echo: "that this somehow works.\n...\nyeah.\nyeah.",
  },
];

export interface CaseOutcome {
  setup: string;
  punchline: string;
}

export const CASE_81_MAP: Record<string, CaseOutcome> = {
  "A1_B1_C1_D1": {
    "setup": "you defended me, gave me one more message, and apparently still let me finish a sentence.",
    "punchline": "somehow, we even get along."
  },
  "A1_B1_C1_D2": {
    "setup": "you defended me, stayed for one more message, and somehow we both got a turn to speak.",
    "punchline": "clearly we're enabling each other."
  },
  "A1_B1_C1_D3": {
    "setup": "you defended me, stayed for one more message, and somehow I actually got to finish a sentence.",
    "punchline": "that's already suspicious enough."
  },
  "A1_B1_C2_D1": {
    "setup": "you defended me, stayed for one more message, and apparently let me have the last word.",
    "punchline": "and somehow we get along."
  },
  "A1_B1_C2_D2": {
    "setup": "you defended me, stayed for one more message, and somehow let me win the conversation.",
    "punchline": "terrible judgment."
  },
  "A1_B1_C2_D3": {
    "setup": "you defended me, stayed for one more message, and somehow let me finish.",
    "punchline": "this relationship really shouldn't work this well."
  },
  "A1_B1_C3_D1": {
    "setup": "you defended me, stayed for one more message, and neither of us finished a sentence.",
    "punchline": "and somehow we still get along."
  },
  "A1_B1_C3_D2": {
    "setup": "you defended me, stayed for one more message, and nobody got the last word.",
    "punchline": "perfect. we've enabled each other."
  },
  "A1_B1_C3_D3": {
    "setup": "you defended me, stayed for one more message, and nobody even finished talking.",
    "punchline": "and somehow this is working."
  },
  "A1_B2_C1_D1": {
    "setup": "you defended me, fell asleep mid-conversation, and somehow still think we get along.",
    "punchline": "fair enough."
  },
  "A1_B2_C1_D2": {
    "setup": "you defended me, fell asleep mid-conversation, and somehow I still got the last word.",
    "punchline": "we're both enabling this."
  },
  "A1_B2_C1_D3": {
    "setup": "you defended me, fell asleep mid-conversation, and somehow I got to finish the sentence.",
    "punchline": "suspicious."
  },
  "A1_B2_C2_D1": {
    "setup": "you defended me, fell asleep mid-conversation, and somehow let me have the last word.",
    "punchline": "still a surprisingly good match."
  },
  "A1_B2_C2_D2": {
    "setup": "you defended me, fell asleep mid-conversation, and somehow we both think this is normal.",
    "punchline": "concerning."
  },
  "A1_B2_C2_D3": {
    "setup": "you defended me, fell asleep mid-conversation, and somehow this still works.",
    "punchline": "I have questions."
  },
  "A1_B2_C3_D1": {
    "setup": "you defended me, fell asleep mid-conversation, nobody finished the sentence, and somehow we're still good.",
    "punchline": "strange."
  },
  "A1_B2_C3_D2": {
    "setup": "you defended me, fell asleep mid-conversation, nobody finished anything, and somehow we're both responsible.",
    "punchline": "excellent."
  },
  "A1_B2_C3_D3": {
    "setup": "you defended me, fell asleep mid-conversation, nobody finished a sentence, and somehow this became a relationship that works.",
    "punchline": "unexplained."
  },
  "A1_B3_C1_D1": {
    "setup": "you defended me, disappeared before the conversation was over, and somehow we're still ridiculously good together.",
    "punchline": "interesting."
  },
  "A1_B3_C1_D2": {
    "setup": "you defended me, disappeared before the conversation was over, and somehow still let me have the last word.",
    "punchline": "we make questionable choices."
  },
  "A1_B3_C1_D3": {
    "setup": "you defended me, disappeared halfway through, and somehow this still works.",
    "punchline": "suspicious."
  },
  "A1_B3_C2_D1": {
    "setup": "you defended me, disappeared before I could finish, and somehow we still get along.",
    "punchline": "I'll take it."
  },
  "A1_B3_C2_D2": {
    "setup": "you defended me, disappeared halfway through, and somehow we're both still here making things worse.",
    "punchline": "classic."
  },
  "A1_B3_C2_D3": {
    "setup": "you defended me, disappeared halfway through, and somehow this still works.",
    "punchline": "honestly impressive."
  },
  "A1_B3_C3_D1": {
    "setup": "you defended me, disappeared before anyone finished talking, and somehow we're still good.",
    "punchline": "make it make sense."
  },
  "A1_B3_C3_D2": {
    "setup": "you defended me, disappeared before anyone finished talking, and somehow we're both enabling this.",
    "punchline": "excellent decision-making."
  },
  "A1_B3_C3_D3": {
    "setup": "you defended me, disappeared before the conversation was over, and somehow this still became something that works.",
    "punchline": "case unresolved."
  },
  "A2_B1_C1_D1": {
    "setup": "you called me mostly harmless, stayed for one more message, and somehow still let me finish.",
    "punchline": "and we actually get along."
  },
  "A2_B1_C1_D2": {
    "setup": "you called me mostly harmless, stayed for one more message, and somehow gave me the last word.",
    "punchline": "we enable each other beautifully."
  },
  "A2_B1_C1_D3": {
    "setup": "you called me mostly harmless, stayed for one more message, and somehow let me finish.",
    "punchline": "already suspicious."
  },
  "A2_B1_C2_D1": {
    "setup": "you called me mostly harmless, stayed for one more message, and somehow let yourself win the conversation.",
    "punchline": "still works."
  },
  "A2_B1_C2_D2": {
    "setup": "you called me mostly harmless, stayed for one more message, and somehow we're both making each other worse.",
    "punchline": "great."
  },
  "A2_B1_C2_D3": {
    "setup": "you called me mostly harmless, stayed for one more message, and somehow this still works.",
    "punchline": "questionable judgment."
  },
  "A2_B1_C3_D1": {
    "setup": "you called me mostly harmless, stayed for one more message, and nobody finished a sentence.",
    "punchline": "somehow we're still good together."
  },
  "A2_B1_C3_D2": {
    "setup": "you called me mostly harmless, stayed for one more message, and nobody got the last word.",
    "punchline": "we're both guilty."
  },
  "A2_B1_C3_D3": {
    "setup": "you called me mostly harmless, stayed for one more message, and nobody finished talking.",
    "punchline": "somehow this works anyway."
  },
  "A2_B2_C1_D1": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, and somehow we still get along.",
    "punchline": "remarkable."
  },
  "A2_B2_C1_D2": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, and somehow I still got the last word.",
    "punchline": "we enable this nonsense."
  },
  "A2_B2_C1_D3": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, and somehow I got to finish.",
    "punchline": "this is getting suspicious."
  },
  "A2_B2_C2_D1": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, and somehow still think we're compatible.",
    "punchline": "fair."
  },
  "A2_B2_C2_D2": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, and somehow we're both responsible for this.",
    "punchline": "as expected."
  },
  "A2_B2_C2_D3": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, and somehow this relationship survived.",
    "punchline": "impressive."
  },
  "A2_B2_C3_D1": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, nobody finished anything, and somehow we're still good.",
    "punchline": "how."
  },
  "A2_B2_C3_D2": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, nobody finished a sentence, and somehow we're both enabling it.",
    "punchline": "perfect."
  },
  "A2_B2_C3_D3": {
    "setup": "you called me mostly harmless, fell asleep mid-conversation, nobody finished a sentence, and somehow this works.",
    "punchline": "case getting stranger."
  },
  "A2_B3_C1_D1": {
    "setup": "you called me mostly harmless, disappeared before the conversation ended, and somehow we still get along.",
    "punchline": "reasonable."
  },
  "A2_B3_C1_D2": {
    "setup": "you called me mostly harmless, disappeared halfway through, and somehow I still got the last word.",
    "punchline": "we're enabling this."
  },
  "A2_B3_C1_D3": {
    "setup": "you called me mostly harmless, disappeared halfway through, and somehow this still works.",
    "punchline": "suspicious."
  },
  "A2_B3_C2_D1": {
    "setup": "you called me mostly harmless, disappeared before I finished, and somehow we're still a good match.",
    "punchline": "fair enough."
  },
  "A2_B3_C2_D2": {
    "setup": "you called me mostly harmless, disappeared halfway through, and somehow we're both responsible for the chaos.",
    "punchline": "obviously."
  },
  "A2_B3_C2_D3": {
    "setup": "you called me mostly harmless, disappeared halfway through, and somehow this is still working.",
    "punchline": "unfortunate."
  },
  "A2_B3_C3_D1": {
    "setup": "you called me mostly harmless, disappeared before anyone finished, and somehow we still get along.",
    "punchline": "make it make sense."
  },
  "A2_B3_C3_D2": {
    "setup": "you called me mostly harmless, disappeared before anyone finished, and somehow we're both enabling this disaster.",
    "punchline": "excellent."
  },
  "A2_B3_C3_D3": {
    "setup": "you called me mostly harmless, disappeared before anyone finished talking, and somehow this became something that works.",
    "punchline": "deeply suspicious."
  },
  "A3_B1_C1_D1": {
    "setup": "you said you could explain, stayed for one more message, and somehow we still get along.",
    "punchline": "convincing enough."
  },
  "A3_B1_C1_D2": {
    "setup": "you said you could explain, stayed for one more message, and somehow we're still enabling each other.",
    "punchline": "strong defence."
  },
  "A3_B1_C1_D3": {
    "setup": "you said you could explain, stayed for one more message, and somehow I still got to finish.",
    "punchline": "suspiciously functional."
  },
  "A3_B1_C2_D1": {
    "setup": "you said you could explain, stayed for one more message, and somehow let me have the last word.",
    "punchline": "and we still get along."
  },
  "A3_B1_C2_D2": {
    "setup": "you said you could explain, stayed for one more message, and somehow helped make the situation worse.",
    "punchline": "classic us."
  },
  "A3_B1_C2_D3": {
    "setup": "you said you could explain, stayed for one more message, and somehow this works.",
    "punchline": "I don't have an explanation either."
  },
  "A3_B1_C3_D1": {
    "setup": "you said you could explain, stayed for one more message, and nobody finished the sentence.",
    "punchline": "somehow we still get along."
  },
  "A3_B1_C3_D2": {
    "setup": "you said you could explain, stayed for one more message, and nobody got the last word.",
    "punchline": "we're both accomplices."
  },
  "A3_B1_C3_D3": {
    "setup": "you said you could explain, stayed for one more message, and nobody even finished talking.",
    "punchline": "somehow this works."
  },
  "A3_B2_C1_D1": {
    "setup": "you said you could explain, fell asleep mid-conversation, and somehow we still get along.",
    "punchline": "excellent explanation."
  },
  "A3_B2_C1_D2": {
    "setup": "you said you could explain, fell asleep mid-conversation, and somehow I still got the last word.",
    "punchline": "we're both enabling this."
  },
  "A3_B2_C1_D3": {
    "setup": "you said you could explain, fell asleep mid-conversation, and somehow I got to finish.",
    "punchline": "this is suspicious."
  },
  "A3_B2_C2_D1": {
    "setup": "you said you could explain, fell asleep mid-conversation, and somehow we still work surprisingly well together.",
    "punchline": "fair."
  },
  "A3_B2_C2_D2": {
    "setup": "you said you could explain, fell asleep mid-conversation, and somehow we're both responsible for how this turned out.",
    "punchline": "obviously."
  },
  "A3_B2_C2_D3": {
    "setup": "you said you could explain, fell asleep mid-conversation, and somehow this still works.",
    "punchline": "I remain confused."
  },
  "A3_B2_C3_D1": {
    "setup": "you said you could explain, fell asleep mid-conversation, nobody finished a sentence, and somehow we're still good.",
    "punchline": "remarkable."
  },
  "A3_B2_C3_D2": {
    "setup": "you said you could explain, fell asleep mid-conversation, nobody finished anything, and somehow we're both enabling it.",
    "punchline": "beautifully dysfunctional."
  },
  "A3_B2_C3_D3": {
    "setup": "you said you could explain, fell asleep mid-conversation, nobody finished a sentence, and somehow this became something that works.",
    "punchline": "case unresolved."
  },
  "A3_B3_C1_D1": {
    "setup": "you said you could explain, disappeared halfway through, and somehow we're still ridiculously good together.",
    "punchline": "I'll allow it."
  },
  "A3_B3_C1_D2": {
    "setup": "you said you could explain, disappeared halfway through, and somehow I still got the last word.",
    "punchline": "we're clearly enabling each other."
  },
  "A3_B3_C1_D3": {
    "setup": "you said you could explain, disappeared halfway through, and somehow this still works.",
    "punchline": "ridiculous."
  },
  "A3_B3_C2_D1": {
    "setup": "you said you could explain, disappeared before I finished, and somehow we still get along.",
    "punchline": "somehow that's enough."
  },
  "A3_B3_C2_D2": {
    "setup": "you said you could explain, disappeared halfway through, and somehow we're both still making this worse.",
    "punchline": "very on-brand."
  },
  "A3_B3_C2_D3": {
    "setup": "you said you could explain, disappeared halfway through, and somehow this still works.",
    "punchline": "I give up."
  },
  "A3_B3_C3_D1": {
    "setup": "you said you could explain, disappeared before anyone finished, and somehow we still get along.",
    "punchline": "make it make sense."
  },
  "A3_B3_C3_D2": {
    "setup": "you said you could explain, disappeared before anyone finished, and somehow we're both guilty here.",
    "punchline": "case getting worse."
  },
  "A3_B3_C3_D3": {
    "setup": "you said you could explain, disappeared before anyone finished talking, and somehow this became the thing that works.",
    "punchline": "deeply suspicious."
  }
};

export function resolveQ1(val?: string | null): QuestionOption {
  if (!val) return Q1_OPTIONS[0];
  const found = Q1_OPTIONS.find(o => o.id === val || o.label === val || val.includes("means well"));
  if (found) return found;
  if (val.includes("mostly") || val.includes("harmless") || val === "A2") return Q1_OPTIONS[1];
  if (val.includes("explain") || val === "A3") return Q1_OPTIONS[2];
  return Q1_OPTIONS[0];
}

export function resolveQ2(val?: string | null): QuestionOption {
  if (!val) return Q2_OPTIONS[0];
  const found = Q2_OPTIONS.find(o => o.id === val || o.label === val || val.includes("one more"));
  if (found) return found;
  if (val.includes("mid") || val.includes("conversation") || val === "B2") return Q2_OPTIONS[1];
  if (val.includes("lost") || val.includes("already") || val === "B3") return Q2_OPTIONS[2];
  return Q2_OPTIONS[0];
}

export function resolveQ3(val?: string | null): QuestionOption {
  if (!val) return Q3_OPTIONS[2]; // Default "nobody."
  const found = Q3_OPTIONS.find(o => o.id === val || o.label === val);
  if (found) return found;
  if (val === "me" || val === "me." || val === "C1") return Q3_OPTIONS[0];
  if (val === "you" || val === "you." || val === "C2") return Q3_OPTIONS[1];
  return Q3_OPTIONS[2];
}

export function resolveQ4(val?: string | null): QuestionOption {
  if (!val) return Q4_OPTIONS[2]; // Default "that this somehow works."
  const found = Q4_OPTIONS.find(o => o.id === val || o.label === val || val.includes("somehow works"));
  if (found) return found;
  if (val.includes("get along") || val === "D1") return Q4_OPTIONS[0];
  if (val.includes("enable") || val === "D2") return Q4_OPTIONS[1];
  return Q4_OPTIONS[2];
}

export function getCaseOutcome(q1Val?: string | null, q2Val?: string | null, q3Val?: string | null, q4Val?: string | null): {
  q1: QuestionOption;
  q2: QuestionOption;
  q3: QuestionOption;
  q4: QuestionOption;
  outcome: CaseOutcome;
} {
  const q1 = resolveQ1(q1Val);
  const q2 = resolveQ2(q2Val);
  const q3 = resolveQ3(q3Val);
  const q4 = resolveQ4(q4Val);
  const key = `${q1.id}_${q2.id}_${q3.id}_${q4.id}`;
  const outcome = CASE_81_MAP[key] ?? {
    setup: "you defended me, we enabled each other, and somehow this relationship works.",
    punchline: "case unresolved.",
  };
  return { q1, q2, q3, q4, outcome };
}
