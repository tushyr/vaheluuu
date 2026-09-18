"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

import { Q3_OPTIONS } from "@/lib/case-data";
import { useThemeColor } from "@/lib/use-theme-color";

/* ─────── Types ─────── */
interface HandcraftedChapter03Props {
  initialSessionId: string;
  initialCompleted?: boolean;
  onRefreshState?: () => void;
  replayMode?: boolean;
}
type Stage = "opening" | "question" | "reflection" | "gift-reveal" | "horizon";

/* ─────── Chapter 3 identity ─────── */
const BG = "#000000"; // pure black — no warmth, no tint

/* ─────── Sentence fragment (Word 3 of 4) ─────── */
const ANSWERS = Q3_OPTIONS;

/* ─────── Opening — monumental, weighted, sparse ─────── */
type OpeningEntry =
  | { gap: true; pause: number }
  | { text: string; variant: "label" | "title" | "hero" | "body" | "accent" | "closing"; pause: number };

const OPENING: OpeningEntry[] = [
  { text: "chapter three",                                        variant: "label",   pause: 450  },
  { text: "the interrupter.",                                     variant: "title",   pause: 1000 },
  { gap: true,                                                    pause: 1800 },
  { text: "yes. you are.",                                        variant: "hero",    pause: 2000 },
  { gap: true,                                                    pause: 1400 },
  { text: "not a single conversation survives you.",             variant: "body",    pause: 750  },
  { gap: true,                                                    pause: 700  },
  { text: "if it's not you interrupting me,",                    variant: "body",    pause: 680  },
  { text: "it's someone in your family.",                        variant: "body",    pause: 800  },
  { gap: true,                                                    pause: 900  },
  { text: "honestly,",                                            variant: "body",    pause: 560  },
  { text: "I don't remember the last time",                      variant: "body",    pause: 680  },
  { text: "I finished a sentence uninterrupted.",                variant: "body",    pause: 1000 },
  { gap: true,                                                    pause: 1400 },
  { text: "I used to complain.",                                 variant: "body",    pause: 700  },
  { gap: true,                                                    pause: 800  },
  { text: "now I think it's just part of the experience.",       variant: "accent",  pause: 900  },
  { gap: true,                                                    pause: 1000 },
  { text: "I don't just get you.",                               variant: "accent",  pause: 800  },
  { text: "I get to know about the entire ujjain.",              variant: "closing", pause: 850  },
];

/* ─────── Gift reveal lines ─────── */
type RevealEntry = { gap: true } | { text: string; italic?: boolean; size?: string; color?: string };

const GIFT_LINES: RevealEntry[] = [
  { text: "when midnight comes and sleep is near,",          italic: true,  color: "#8C7A68" },
  { text: "and yet thou art still watching here,",           italic: true,  color: "#8C7A68" },
  { text: "through every video, strange and new,",           italic: true,  color: "#8C7A68" },
  { text: "I found one little thing to give to you.",        italic: true,  color: "#8C7A68" },
  { gap: true },
  { text: "let nothing interrupt thy view,",                 italic: true,  color: "#8C7A68" },
  { text: "no pointless ad, no \"buy this shoe.\"",           italic: true,  color: "#8C7A68" },
  { gap: true },
  { text: "yeah, i love you",                                size: "clamp(1.2rem,3.8vw,1.45rem)", color: "#1C1510" },
  { text: "tube i meant, youtube.",                          size: "clamp(1.2rem,3.8vw,1.45rem)", color: "#C9974A" },
  { gap: true },
  { text: "for one small year, this gift is thine.",         color: "#3A2C22" },
  { gap: true },
  { text: "I'd give thee ten, but google declined.",         italic: true,  color: "#8C7A68" },
];

const GIFT_DELAYS = [780, 780, 780, 820, 280, 780, 820, 280, 1100, 1200, 280, 850, 280, 950];

/* ─────── Reflection lines ─────── */
const REFLECTION_LINES: Record<string, string[]> = {
  C1: [
    "me.",
    "when has that ever happened?",
    "in the history of us.",
    "i have 47 unfinished sentences\nstill pending your approval from last week.",
    "generous of you to pretend though.",
  ],
  C2: [
    "you.",
    "optimistic.",
    "completely ungrounded in reality.",
    "you think you get the last word?\nyou don't even finish your own sentence\nbefore your phone dies or you fall asleep.",
    "love the ambition though.",
  ],
  C3: [
    "nobody.",
    "accurate.",
    "the only correct answer.",
    "either you interrupt,\nor your family interrupts,\nor both of us forget what we were saying.",
    "perfection.",
  ],
};

/* ─────── Helpers ─────── */
const haptic = (pattern: number | number[] = 50) => {
  try { if (typeof navigator !== "undefined") navigator.vibrate?.(pattern); } catch (_) {}
};

function useCountdown(target: Date) {
  const [display, setDisplay] = useState("");
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setExpired(true); setDisplay(""); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setDisplay(h > 0 ? `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s` : `${m}m ${String(s).padStart(2, "0")}s`);
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [target]);
  return { display, expired };
}

/* ─────── Monumental opening ─────── */
function FierceOpening({ visible, onContinue }: { visible: boolean; onContinue: () => void }) {
  const [shown, setShown] = useState(0);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let total = 400;
    OPENING.forEach((entry, i) => {
      total += (entry as any).pause ?? 700;
      timers.push(setTimeout(() => setShown(i + 1), total));
    });
    timers.push(setTimeout(() => setShowCta(true), total + 1300));
    return () => timers.forEach(clearTimeout);
  }, []);

  const variantStyle = (variant: string): React.CSSProperties => {
    switch (variant) {
      case "label":
        return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)", margin: "0 0 0.2rem", lineHeight: 1.4 };
      case "title":
        return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.15 };
      case "hero":
        return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 5.5vw, 2.2rem)", fontStyle: "italic", fontWeight: 400, color: "#C9974A", margin: 0, lineHeight: 1.1, letterSpacing: "-0.01em" };
      case "body":
        return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.8rem, 2.5vw, 0.92rem)", color: "rgba(255,255,255,0.6)", fontStyle: "italic", margin: 0, lineHeight: 1.4 };
      case "accent":
        return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.8rem, 2.5vw, 0.92rem)", color: "rgba(255,255,255,0.8)", fontStyle: "italic", margin: 0, lineHeight: 1.4 };
      case "closing":
        return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.95rem, 3vw, 1.15rem)", fontStyle: "italic", color: "#C9974A", margin: 0, lineHeight: 1.35 };
      default:
        return {};
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      background: BG,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "clamp(1.5rem, 4vh, 3rem) clamp(1.2rem, 5vw, 2.5rem)",
      overflow: "hidden",
      overscrollBehavior: "none",
      touchAction: "none",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "30rem", width: "100%" }}>
        {OPENING.slice(0, shown).map((entry, i) => {
          if ("gap" in entry) return <div key={i} style={{ height: "clamp(0.25rem, 0.8vh, 0.45rem)" }} />;
          const animClass = ("variant" in entry && entry.variant === "hero") ? "scale-in" : "fade-up";
          return <p key={i} className={animClass} style={variantStyle(entry.variant)}>{entry.text}</p>;
        })}
        <div style={{ marginTop: "clamp(0.9rem, 2.5vh, 1.6rem)", opacity: showCta ? 1 : 0, transition: "opacity 1.2s ease", pointerEvents: showCta ? "auto" : "none" }}>
          <button onClick={onContinue}
            className="cta-link"
            style={{
              fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            continue →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────── Staggered question — words arrive one at a time, large ─────── */
function StaggeredQuestion({ visible, onAnswer }: { visible: boolean; onAnswer: (id: string) => void }) {
  const [shown, setShown] = useState(0);    // 0 = none, 1 = first word, 2 = first+second, 3 = all
  const [showPrompt, setShowPrompt] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [settling, setSettling] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const pickTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShown(1), 700);
    const t2 = setTimeout(() => setShown(2), 2200);
    const t3 = setTimeout(() => setShown(3), 4200);
    const t4 = setTimeout(() => setShowPrompt(true), 5200);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const proceed = useCallback((id: string) => {
    if (pickTimerRef.current) clearTimeout(pickTimerRef.current);
    onAnswer(id);
  }, [onAnswer]);

  const handlePick = (id: string) => {
    if (chosen || settling) return;
    setSettling(true);
    setChosen(id);
    haptic(40);
    setTimeout(() => setShowContinue(true), 300);
    pickTimerRef.current = setTimeout(() => proceed(id), 4000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, height: "100dvh", width: "100vw", background: BG, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", padding: "clamp(1.5rem,5vh,3.5rem) clamp(1.5rem,7vw,3.5rem)", overflow: "hidden", overscrollBehavior: "none", touchAction: "none", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease", boxSizing: "border-box", pointerEvents: visible ? "auto" : "none" } as React.CSSProperties}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100%", width: "100%", maxWidth: "34rem" }}>
        <div className="label-accent" style={{ marginBottom: "clamp(1.5rem,4vh,2.5rem)" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 2vw, 0.72rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", margin: 0 }}>chapter three · the interrupter</p>
        </div>

        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 3.8vw, 1.8rem)", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.9)", margin: "0 0 clamp(1.5rem,4vh,2.5rem)", lineHeight: 1.3 }}>
          who gets to finish the sentence?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem,3.5vh,2.2rem)" }}>
          {ANSWERS.map((a, i) => {
            const isVisible = shown > i;
            const isChosen = chosen === a.id;
            const isDimmed = chosen !== null && !isChosen;
            return (
              <button key={a.id} onClick={() => isVisible && !chosen ? handlePick(a.id) : undefined} style={{ background: "none", border: "none", textAlign: "left", cursor: isVisible && !chosen ? "pointer" : "default", padding: "clamp(0.5rem,1.5vh,1rem) 0", minHeight: "48px", opacity: isVisible ? (isDimmed ? 0 : 1) : 0, transform: isVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)", fontStyle: "italic", fontWeight: 400, color: isChosen ? "#C9974A" : "rgba(255,255,255,0.88)", lineHeight: 1.05, display: "block", transition: "color 0.5s ease" }}>{a.label}</span>
              </button>
            );
          })}
        </div>

        {chosen ? (
          <div style={{ marginTop: "clamp(1.5rem,4vh,2.5rem)", opacity: showContinue ? 1 : 0, transition: "opacity 0.4s ease" }}>
            <button
              onClick={() => proceed(chosen)}
              className="cta-link"
              style={{
                fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
                color: "#C9974A",
              }}
            >
              continue →
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "clamp(2rem,5vh,4rem)", opacity: showPrompt ? 0.6 : 0, transition: "opacity 0.8s ease" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", margin: 0 }}>tap yours</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────── Gift reveal (warm ivory) ─────── */
function GiftReveal({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  useThemeColor("#F5EFE6");
  const [shown, setShown] = useState(0);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let total = 600;
    GIFT_LINES.forEach((_, i) => { total += GIFT_DELAYS[i] ?? 800; timers.push(setTimeout(() => setShown(i + 1), total)); });
    timers.push(setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.65 },
        colors: ["#C9974A", "#E3BE7E", "#F5EFE6", "#C4687A"],
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      haptic([40, 60, 120]);
    }, total + 700));
    timers.push(setTimeout(() => setShowCta(true), total + 1400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      background: "#F5EFE6",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "clamp(1.5rem, 4vh, 3rem) clamp(1.2rem, 5vw, 2.5rem)",
      overflow: "hidden",
      overscrollBehavior: "none",
      touchAction: "none",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "34rem", width: "100%" }}>
        {GIFT_LINES.slice(0, shown).map((line, i) => {
          if ("gap" in line) return <div key={i} style={{ height: "0.4rem" }} />;
          return <p key={i} className="fade-up" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: (line as any).size ?? "clamp(0.82rem, 2.6vw, 0.94rem)",
            fontStyle: (line as any).italic ? "italic" : "normal",
            fontWeight: 400,
            color: (line as any).color ?? "#1C1510",
            margin: 0,
            lineHeight: 1.45,
            wordBreak: "break-word",
          }}>{(line as any).text}</p>;
        })}
        <div style={{ marginTop: "clamp(1rem, 2.5vh, 1.8rem)", opacity: showCta ? 1 : 0, transform: showCta ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.7s ease, transform 0.7s ease", pointerEvents: showCta ? "auto" : "none" }}>
          <button onClick={onDone}
            className="cta-link"
            style={{
              fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
              color: "#1C1510",
            }}
          >
            continue →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────── Reflection (pure black, minimal, white text) ─────── */
function FierceReflection({ visible, word, onContinue }: { visible: boolean; word: string; onContinue: () => void }) {
  const [shown, setShown] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const lines = REFLECTION_LINES[word] ?? REFLECTION_LINES.fierce;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [0, 600, 500, 1200, 1400, 1400];
    let acc = 500;
    lines.forEach((_, i) => { acc += delays[i] ?? 900; timers.push(setTimeout(() => setShown(i + 1), acc)); });
    timers.push(setTimeout(() => setShowCta(true), acc + 1400));
    return () => timers.forEach(clearTimeout);
  }, [lines]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      background: BG,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "clamp(1.5rem, 4vh, 3rem) clamp(1.2rem, 5vw, 2.5rem)",
      overflow: "hidden",
      overscrollBehavior: "none",
      touchAction: "none",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "28rem", width: "100%" }}>
        {lines.slice(0, shown).map((line, i) => (
          <p key={i} className="fade-up" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: i === 0 ? "clamp(1.4rem, 4.8vw, 2rem)" : i <= 2 ? "clamp(0.92rem, 2.8vw, 1.1rem)" : "clamp(0.82rem, 2.6vw, 0.96rem)",
            fontStyle: i >= 3 ? "italic" : "normal",
            fontWeight: 400,
            color: i === 0 ? "#C9974A" : i <= 2 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)",
            margin: 0,
            lineHeight: 1.55,
            marginBottom: i === 0 ? "clamp(0.8rem, 2vh, 1.2rem)" : "0.25rem",
            whiteSpace: "pre-line",
          }}>{line}</p>
        ))}
        <div style={{ marginTop: "clamp(1rem, 2.8vh, 1.8rem)", opacity: showCta ? 1 : 0, transform: showCta ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.8s ease, transform 0.8s ease", pointerEvents: showCta ? "auto" : "none" }}>
          <button onClick={onContinue}
            className="cta-link"
            style={{
              fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
              color: "#C9974A",
            }}
          >
            your gift →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────── Chapter 4 unlock ─────── */
const CHAPTER_4_UNLOCK = new Date("2026-09-23T00:00:00+05:30");

/* ─────── Main ─────── */
export default function HandcraftedChapter03({ initialSessionId, initialCompleted = false, onRefreshState, replayMode = false }: HandcraftedChapter03Props) {
  const [stage, setStage] = useState<Stage>(() => {
    if (initialCompleted) return "horizon";
    return "opening";
  });
  useThemeColor(stage === "gift-reveal" ? "#F5EFE6" : BG);

  const [visible, setVisible] = useState(true);
  const [chosen, setChosen] = useState<string | null>(null);
  const [easterEgg, setEasterEgg] = useState(false);
  const [starTaps, setStarTaps] = useState(0);
  const [starPulse, setStarPulse] = useState(false);
  const starTapsRef = useRef(0);
  const sessionId = useRef(initialSessionId);
  const { display: countdownDisplay, expired: countdownExpired } = useCountdown(CHAPTER_4_UNLOCK);

  const goTo = useCallback((next: Stage) => {
    setVisible(false);
    setTimeout(() => { setStage(next); setVisible(true); }, 620);
  }, []);

  const handleReadAgain = useCallback(() => {
    setChosen(null);
    setEasterEgg(false);
    setStarTaps(0);
    starTapsRef.current = 0;
    goTo("opening");
  }, [goTo]);

  const handleStarTap = () => {
    if (easterEgg) return;
    const next = starTapsRef.current + 1;
    starTapsRef.current = next;
    setStarTaps(next);
    setStarPulse(true);
    setTimeout(() => setStarPulse(false), 220);

    if (next >= 5) {
      haptic([30, 40, 50, 60, 100]);
      setEasterEgg(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.82 },
        colors: ["#E06E8A", "#C9974A", "#F5EFE6"],
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      starTapsRef.current = 0;
    } else {
      haptic(25);
    }
  };

  const isCh4Done = typeof window !== "undefined" && localStorage.getItem("p23_ch4_done") === "true";

  const chapterTimeline = useMemo(() => [
    { n: 1, title: "The Incident", date: "sept 20", done: true },
    { n: 2, title: "The Sleepy", date: "sept 21", done: true },
    { n: 3, title: "The Interrupter", date: "sept 22", done: true },
    { n: 4, title: "The Cover-Up", date: "sept 23", done: replayMode || isCh4Done },
  ], [isCh4Done, replayMode]);

  const handleAnswer = useCallback(async (id: string) => {
    if (chosen) return;
    setChosen(id);
    const answer = ANSWERS.find(a => a.id === id);
    if (typeof window !== "undefined" && answer) {
      localStorage.setItem("p23_word_ch3", answer.label);
      localStorage.setItem("p23_q3_id", answer.id);
    }
    try {
      await fetch("/api/chapter/response", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: sessionId.current, chapterKey: "interrupter", moduleId: "question_01", questionKey: "fragment_03", questionText: "who gets to finish the sentence?", chosenAnswer: id }) });
    } catch (e) { console.error(e); }
    try {
      const response = await fetch("/api/chapter/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, chapterKey: "fierce" }),
      });
      if (!response.ok) throw new Error(`Unable to save chapter completion (${response.status}).`);
      if (typeof window !== "undefined") {
        localStorage.setItem("p23_ch3_done", "true");
      }
    } catch (e) { console.error(e); }
    onRefreshState?.();
    goTo("reflection");
  }, [chosen, goTo, onRefreshState]);

  return (
    <>
      {stage === "opening" && <FierceOpening visible={visible} onContinue={() => goTo("question")} />}
      {stage === "question" && <StaggeredQuestion visible={visible} onAnswer={handleAnswer} />}
      {stage === "reflection" && <FierceReflection visible={visible} word={chosen ?? "fierce"} onContinue={() => goTo("gift-reveal")} />}
      {stage === "gift-reveal" && <GiftReveal visible={visible} onDone={() => goTo("horizon")} />}

      {stage === "horizon" && (
        <div style={{ position: "fixed", inset: 0, height: "100dvh", minHeight: "-webkit-fill-available", width: "100vw", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(1.2rem, 3.5vh, 2.2rem) clamp(1.2rem, 5vw, 2.2rem)", overflow: "hidden", overscrollBehavior: "none", touchAction: "none", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease", pointerEvents: visible ? "auto" : "none", boxSizing: "border-box" }}>
          <div style={{ width: "100%", maxWidth: "34rem", textAlign: "center" }}>
            <p className="font-display fade-up" style={{ fontSize: "clamp(0.92rem, 2.8vw, 1.15rem)", fontStyle: "italic", fontWeight: 400, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>
              {replayMode ? (
                <>still interrupting.<br />still unforgettable.<br />pick another whenever.</>
              ) : (
                <>three down.<br />one more.<br />sept 23. tomorrow.</>
              )}
            </p>
            <div style={{ margin: "clamp(0.8rem, 2.5vh, 1.4rem) auto" }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 1.8vw, 0.7rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "clamp(0.5rem, 1.8vh, 0.9rem)" }}>{replayMode ? "four chapters · forever yours" : "four chapters · four days"}</p>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "clamp(0.6rem, 2.2vh, 1.2rem)" }}>
              {chapterTimeline.map(ch => (
                <div key={ch.n} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "clamp(0.32rem, 1.2vh, 0.5rem) 0", borderBottom: "1px solid rgba(255,255,255,0.06)", opacity: ch.done ? 1 : 0.22 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.72rem, 2vw, 0.8rem)", letterSpacing: "0.12em", color: ch.done ? "#C9974A" : "rgba(255,255,255,0.2)", minWidth: "1.4rem" }}>{ch.done ? "✓" : String(ch.n).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.85rem, 2.5vw, 0.98rem)", fontStyle: ch.done ? "italic" : "normal", color: ch.done ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.18)", flex: 1, textAlign: "left" }}>{ch.title}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 1.8vw, 0.7rem)", letterSpacing: "0.16em", color: ch.done ? "#C9974A" : "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>{ch.date}</span>
                </div>
              ))}
            </div>
            {!replayMode && !countdownExpired && countdownDisplay && (
              <div className="fade-up" style={{ marginBottom: "clamp(0.6rem, 2vh, 1.2rem)" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 1.8vw, 0.7rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.3rem" }}>chapter four opens in</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.1rem, 3.4vw, 1.45rem)", fontStyle: "italic", color: "#C9974A", letterSpacing: "0.06em", margin: 0 }}>{countdownDisplay}</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.75rem, 2.2vw, 0.85rem)", fontStyle: "italic", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>go eat your vegetable.</p>
              </div>
            )}
            {!replayMode && countdownExpired && (
              <div className="fade-up" style={{ marginBottom: "clamp(0.8rem, 2vh, 1.4rem)" }}>
                <p className="font-hand" style={{
                  fontSize: "clamp(0.95rem, 2.8vw, 1.15rem)",
                  color: "#C9974A",
                  marginBottom: "0.5rem",
                }}>
                  happy birthday. chapter four is yours. ✦
                </p>
                <button
                  onClick={() => { onRefreshState?.(); window.location.reload(); }}
                  className="cta-link"
                  style={{
                    fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
                    color: "#F5EFE6",
                  }}
                >
                  enter chapter four →
                </button>
              </div>
            )}

            {/* Easter egg ✦ */}
            <button
              onClick={handleStarTap}
              aria-label="secret star"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: easterEgg
                  ? "#C9974A"
                  : starTaps > 0
                  ? `rgba(201,151,74,${0.2 + starTaps * 0.16})`
                  : "rgba(255,255,255,0.15)",
                fontSize: "1.15rem",
                minWidth: "44px",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                transform: starPulse ? "scale(1.4)" : "scale(1)",
                transition: "transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease",
                marginBottom: easterEgg ? "0.3rem" : "clamp(0.4rem,1.5vh,0.8rem)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ✦
            </button>

            {easterEgg && (
              <p className="font-hand fade-up" style={{
                fontSize: "clamp(0.95rem,2.8vw,1.12rem)",
                color: "#E06E8A", lineHeight: 1.45,
                marginBottom: "clamp(0.5rem,1.8vh,1rem)",
                whiteSpace: "pre-line",
              }}>
                {"secret no. 3:\nyou never really interrupt me.\nyou just make whatever i was thinking\na hundred times better."}
              </p>
            )}

            <div>
              <button onClick={handleReadAgain}
                className="cta-link"
                style={{
                  fontSize: "clamp(0.75rem, 2vw, 0.82rem)",
                  color: "rgba(255,255,255,0.45)",
                  marginTop: "clamp(0.3rem, 1.5vh, 0.8rem)",
                }}
              >
                ↺ read again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
