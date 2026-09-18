"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { Q2_OPTIONS } from "@/lib/case-data";
import { useThemeColor } from "@/lib/use-theme-color";

/* ─────── Types ─────── */
interface HandcraftedChapter02Props {
  initialSessionId: string;
  initialCompleted?: boolean;
  onRefreshState?: () => void;
  replayMode?: boolean;
}
type Stage = "opening" | "question" | "reflection" | "gift-reveal" | "horizon";

/* ─────── Chapter 2 identity ─────── */
const BG       = "#060B18";   // midnight navy — unique to this chapter
const ELECTRIC = "#4ECDC4";   // teal — appears nowhere else in the experience

/* ─────── Sentence fragment (Word 2 of 4) ─────── */
const ANSWERS = Q2_OPTIONS;

const ANSWER_ECHOES: Record<string, string> = Object.fromEntries(
  Q2_OPTIONS.map(o => [o.id, o.echo])
);

/* ─────── Opening — kinetic, electric, faster than Ch1 ─────── */
type OpeningEntry =
  | { gap: true; pause: number }
  | { text: string; variant: "label" | "title" | "body" | "accent" | "electric"; pause: number };

const OPENING: OpeningEntry[] = [
  { text: "chapter two",                                              variant: "label",    pause: 300  },
  { text: "the sleepy.",                                             variant: "title",    pause: 750  },
  { gap: true,                                                        pause: 800  },
  { text: "one thing about you:",                                    variant: "body",     pause: 600  },
  { gap: true,                                                        pause: 650  },
  { text: "you will fall asleep.",                                   variant: "electric", pause: 650  },
  { gap: true,                                                        pause: 500  },
  { text: "doesn't matter where.",                                   variant: "body",     pause: 560  },
  { text: "doesn't matter when.",                                    variant: "body",     pause: 560  },
  { gap: true,                                                        pause: 650  },
  { text: "eventually, the twink must sleep.",                       variant: "accent",   pause: 800  },
];

/* ─────── Gift reveal lines ─────── */
type RevealEntry =
  | { gap: true }
  | { text: string; italic?: boolean; size?: string; color?: string };

const GIFT_LINES: RevealEntry[] = [
  { text: "okay so.",                                         italic: true, color: "#8C7A68" },
  { text: "you already knew.",                               color: "#3A2C22" },
  { gap: true },
  { text: "you're a drained twink",                          color: "#3A2C22" },
  { text: "and i can't do anything about that.",             color: "#3A2C22" },
  { gap: true },
  { text: "but your iphone can be saved.",                   color: "#3A2C22" },
  { gap: true },
  { text: "check your door.",                                italic: true, color: "#8C7A68" },
];

const GIFT_DELAYS = [750, 800, 250, 800, 800, 250, 850, 250, 900];

/* ─────── Reflection lines ─────── */
const REFLECTION_LINES: Record<string, string[]> = {
  B1: [
    "one more message.",
    "a bold lie.",
    "statistically never happened.",
    "you type 'just 5 mins'\nand wake up 8 hours later\nwith your phone on your chest.",
    "i'm used to it now.",
  ],
  B2: [
    "mid-conversation.",
    "typing... then silence.",
    "phone on the face. classic.",
    "i'm sitting there waiting for a reply\nmeanwhile you're already in REM sleep\nlike a kitten.",
    "predictable. kind of cute.",
  ],
  B3: [
    "you already lost me.",
    "well at least you are being honest.",
    "sometimes i really talk to a wall.",
    "and in fact you might be sleepy at this exact moment,",
    "but guess i will never know.",
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
      setDisplay(h > 0
        ? `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`
        : `${m}m ${String(s).padStart(2, "0")}s`
      );
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [target]);
  return { display, expired };
}

/* ─────── Wild opening ─────── */
function WildOpening({ visible, onContinue }: { visible: boolean; onContinue: () => void }) {
  const [shown, setShown] = useState(0);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let total = 280;
    OPENING.forEach((_, i) => {
      total += OPENING[i] && "pause" in OPENING[i] ? (OPENING[i] as any).pause : 580;
      timers.push(setTimeout(() => setShown(i + 1), total));
    });
    timers.push(setTimeout(() => setShowCta(true), total + 850));
    return () => timers.forEach(clearTimeout);
  }, []);

  const variantStyle = (variant: string): React.CSSProperties => {
    switch (variant) {
      case "label":    return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: ELECTRIC, margin: "0 0 0.2rem", lineHeight: 1.4 };
      case "title":    return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 5vw, 2.2rem)", fontStyle: "italic", fontWeight: 400, color: "#E8F8F7", margin: 0, lineHeight: 1.15 };
      case "body":     return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.82rem, 2.6vw, 0.95rem)", color: "rgba(120,160,165,0.75)", fontStyle: "italic", margin: 0, lineHeight: 1.45 };
      case "accent":   return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.82rem, 2.6vw, 0.95rem)", color: "rgba(78,205,196,0.65)", fontStyle: "italic", margin: 0, lineHeight: 1.45 };
      case "electric": return { fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.85rem, 2.7vw, 1rem)", color: ELECTRIC, fontStyle: "italic", margin: 0, lineHeight: 1.45 };
      default: return {};
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
        {OPENING.slice(0, shown).map((entry, i) => {
          if ("gap" in entry) return <div key={i} style={{ height: "clamp(0.35rem, 1.2vh, 0.65rem)" }} />;
          const animCls = ("variant" in entry && (entry.variant === "electric" || entry.variant === "accent")) ? "letter-expand" : "fade-up";
          return <p key={i} className={animCls} style={variantStyle(entry.variant)}>{entry.text}</p>;
        })}
        <div style={{ marginTop: "clamp(1rem, 2.8vh, 1.8rem)", opacity: showCta ? 1 : 0, transform: showCta ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.8s ease, transform 0.8s ease", pointerEvents: showCta ? "auto" : "none" }}>
          <button onClick={onContinue}
            className="cta-link"
            style={{
              fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
              color: ELECTRIC,
            }}
          >
            read on →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────── Gift reveal (warm ivory — the gift is warmth) ─────── */
function GiftReveal({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  useThemeColor("#F5EFE6");
  const [shown, setShown] = useState(0);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let total = 600;
    GIFT_LINES.forEach((_, i) => {
      total += GIFT_DELAYS[i] ?? 800;
      timers.push(setTimeout(() => setShown(i + 1), total));
    });
    timers.push(setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 50,
        origin: { y: 0.65 },
        colors: ["#C9974A", "#E3BE7E", "#F5EFE6", "#C4687A"],
        scalar: 0.8,
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
          if ("gap" in line) return <div key={i} style={{ height: "0.5rem" }} />;
          return <p key={i} className="fade-up" style={{ fontFamily: "'Playfair Display', serif", fontSize: (line as any).size ?? "clamp(0.82rem, 2.6vw, 0.96rem)", fontStyle: (line as any).italic ? "italic" : "normal", fontWeight: 400, color: (line as any).color ?? "#1C1510", margin: 0, lineHeight: 1.55 }}>{(line as any).text}</p>;
        })}
        <div style={{ marginTop: "clamp(1rem, 2.8vh, 1.8rem)", opacity: showCta ? 1 : 0, transform: showCta ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.7s ease, transform 0.7s ease", pointerEvents: showCta ? "auto" : "none" }}>
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

/* ─────── Reflection screen (navy, teal palette) ─────── */
function WildReflection({ visible, word, onContinue }: { visible: boolean; word: string; onContinue: () => void }) {
  const [shown, setShown] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const lines = REFLECTION_LINES[word] ?? REFLECTION_LINES.wild;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const delays = [0, 700, 500, 1100, 1300, 1400];
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
      <div style={{ maxWidth: "32rem", width: "100%" }}>
        {lines.slice(0, shown).map((line, i) => (
          <p key={i} className="fade-up" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: i === 0 ? "clamp(1.4rem, 4.8vw, 2rem)" : i <= 2 ? "clamp(0.92rem, 2.8vw, 1.1rem)" : "clamp(0.82rem, 2.6vw, 0.96rem)",
            fontStyle: i >= 3 ? "italic" : "normal",
            fontWeight: 400,
            color: i === 0 ? ELECTRIC : i <= 2 ? "#E8F8F7" : "rgba(78,205,196,0.65)",
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
              color: ELECTRIC,
            }}
          >
            your gift →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────── Chapter 3 unlock ─────── */
const CHAPTER_3_UNLOCK = new Date("2026-09-22T00:00:00+05:30");

/* ─────── Main ─────── */
export default function HandcraftedChapter02({ initialSessionId, initialCompleted = false, onRefreshState, replayMode = false }: HandcraftedChapter02Props) {
  const [stage, setStage] = useState<Stage>(() => {
    if (initialCompleted) return "horizon";
    return "opening";
  });
  useThemeColor(stage === "gift-reveal" ? "#F5EFE6" : BG);

  const [visible, setVisible] = useState(true);
  const [chosen, setChosen] = useState<string | null>(null);
  const [hoveredAnswer, setHoveredAnswer] = useState<string | null>(null);
  const [easterEgg, setEasterEgg] = useState(false);
  const [starTaps, setStarTaps] = useState(0);
  const [starPulse, setStarPulse] = useState(false);
  const starTapsRef = useRef(0);
  const sessionId = useRef(initialSessionId);
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { display: countdownDisplay, expired: countdownExpired } = useCountdown(CHAPTER_3_UNLOCK);

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
        colors: ["#4ECDC4", "#C9974A", "#E8F8F7"],
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      starTapsRef.current = 0;
    } else {
      haptic(25);
    }
  };

  const isCh3Done = typeof window !== "undefined" && localStorage.getItem("p23_ch3_done") === "true";
  const isCh4Done = typeof window !== "undefined" && localStorage.getItem("p23_ch4_done") === "true";

  const chapterTimeline = useMemo(() => [
    { n: 1, title: "The Incident", date: "sept 20", done: true },
    { n: 2, title: "The Sleepy", date: "sept 21", done: true },
    { n: 3, title: "The Interrupter", date: "sept 22", done: replayMode || isCh3Done },
    { n: 4, title: "The Cover-Up", date: "sept 23", done: replayMode || isCh4Done },
  ], [isCh3Done, isCh4Done, replayMode]);

  const proceedFromAnswer = useCallback(async () => {
    if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    try {
      const response = await fetch("/api/chapter/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, chapterKey: "wild" }),
      });
      if (!response.ok) throw new Error(`Unable to save chapter completion (${response.status}).`);
      if (typeof window !== "undefined") {
        localStorage.setItem("p23_ch2_done", "true");
      }
    } catch (e) { console.error(e); }
    onRefreshState?.();
    goTo("reflection");
  }, [goTo, onRefreshState]);

  const handleAnswer = useCallback(async (id: string) => {
    if (chosen) return;
    setChosen(id);
    const answer = ANSWERS.find(a => a.id === id);
    if (typeof window !== "undefined" && answer) {
      localStorage.setItem("p23_word_ch2", answer.label);
      localStorage.setItem("p23_q2_id", answer.id);
    }
    haptic(40);
    try {
      await fetch("/api/chapter/response", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: sessionId.current, chapterKey: "sleepy", moduleId: "question_01", questionKey: "fragment_02", questionText: "you said \"i'm not sleepy.\" how long until you're unconscious?", chosenAnswer: id }) });
    } catch (e) { console.error(e); }
    answerTimerRef.current = setTimeout(proceedFromAnswer, 5000);
  }, [chosen, proceedFromAnswer]);

  return (
    <>
      {stage === "opening" && <WildOpening visible={visible} onContinue={() => goTo("question")} />}

      {stage === "question" && (
        <div style={{ position: "fixed", inset: 0, height: "100dvh", minHeight: "-webkit-fill-available", width: "100vw", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "clamp(1.5rem,5vh,3.5rem) clamp(1.2rem,6vw,2.5rem)", overflow: "hidden", overscrollBehavior: "none", touchAction: "none", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease", pointerEvents: visible ? "auto" : "none", boxSizing: "border-box" } as React.CSSProperties}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", width: "100%" }}>
            <div style={{ width: "100%", maxWidth: "34rem" }}>
            <div className="label-accent" style={{ marginBottom: "clamp(1rem,3vh,2rem)" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 2vw, 0.72rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: ELECTRIC, margin: 0 }}>chapter two · the sleepy</p>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.2rem, 3.8vw, 1.8rem)", fontStyle: "italic", fontWeight: 400, color: "#E8F8F7", lineHeight: 1.45, margin: 0 }}>
              you said &quot;i&apos;m not sleepy.&quot;<br /><br />how long until you&apos;re unconscious?
            </h2>
            <div style={{ margin: "clamp(1rem,3.5vh,2rem) 0" }} />
            {chosen ? (
              <div className="fade-up">
                <p className="font-hand" style={{ fontSize: "clamp(1.15rem, 3.6vw, 1.45rem)", color: ELECTRIC, whiteSpace: "pre-line", lineHeight: 1.6 }}>{ANSWER_ECHOES[chosen]}</p>
                <div style={{ marginTop: "clamp(1rem, 2.5vh, 1.8rem)" }}>
                  <button
                    onClick={proceedFromAnswer}
                    className="cta-link"
                    style={{
                      fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
                      color: ELECTRIC,
                    }}
                  >
                    continue →
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {ANSWERS.map((a, i) => {
                  const isHovered = hoveredAnswer === a.id;
                  return (
                    <button key={a.id} onClick={() => handleAnswer(a.id)} onMouseEnter={() => setHoveredAnswer(a.id)} onMouseLeave={() => setHoveredAnswer(null)} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "clamp(0.85rem,2.5vh,1.15rem) 0", background: "none", border: "none", borderBottom: "1px solid rgba(78,205,196,0.18)", cursor: "pointer", textAlign: "left", width: "100%", minHeight: "56px" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.72rem, 2vw, 0.8rem)", letterSpacing: "0.1em", color: "rgba(78,205,196,0.5)", minWidth: "1.8rem", flexShrink: 0 }}>{`0${i + 1}`}</span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "0.18rem" }}>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.94rem, 3vw, 1.08rem)", fontStyle: isHovered ? "italic" : "normal", color: isHovered ? "#E8F8F7" : ELECTRIC, lineHeight: 1.4, transition: "color 0.2s" }}>{a.label}</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.78rem, 2.2vw, 0.88rem)", fontStyle: "italic", color: "rgba(78,205,196,0.6)", lineHeight: 1.35 }}>{a.sub}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {stage === "reflection" && <WildReflection visible={visible} word={chosen ?? "wild"} onContinue={() => goTo("gift-reveal")} />}
      {stage === "gift-reveal" && <GiftReveal visible={visible} onDone={() => goTo("horizon")} />}

      {stage === "horizon" && (
        <div style={{ position: "fixed", inset: 0, height: "100dvh", minHeight: "-webkit-fill-available", width: "100vw", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(1.2rem, 3.5vh, 2.2rem) clamp(1.2rem, 5vw, 2.2rem)", overflow: "hidden", overscrollBehavior: "none", touchAction: "none", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease", pointerEvents: visible ? "auto" : "none", boxSizing: "border-box" }}>
          <div style={{ width: "100%", maxWidth: "34rem", textAlign: "center" }}>
            <div className="label-accent" style={{ justifyContent: "center", marginBottom: "clamp(0.6rem, 2vh, 1.2rem)" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: ELECTRIC, margin: 0 }}>chapter two · the sleepy</p>
            </div>
            <p className="font-display fade-up" style={{ fontSize: "clamp(0.92rem, 2.8vw, 1.15rem)", fontStyle: "italic", fontWeight: 400, color: "rgba(78,205,196,0.6)", lineHeight: 1.6, margin: 0 }}>
              {replayMode ? (
                <>still sleepy.<br />still chaotic.<br />pick another whenever.</>
              ) : (
                <>two down.<br />charge your phone.<br />come back tomorrow.</>
              )}
            </p>
            <div style={{ margin: "clamp(0.8rem, 2.5vh, 1.4rem) auto" }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 1.8vw, 0.7rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(78,205,196,0.3)", marginBottom: "clamp(0.5rem, 1.8vh, 0.9rem)" }}>{replayMode ? "four chapters · forever yours" : "four chapters · four days"}</p>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "clamp(0.6rem, 2.2vh, 1.2rem)" }}>
              {chapterTimeline.map(ch => (
                <div key={ch.n} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "clamp(0.35rem, 1.2vh, 0.55rem) 0", borderBottom: "1px solid rgba(78,205,196,0.1)", opacity: ch.done ? 1 : 0.22 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.72rem", letterSpacing: "0.12em", color: ch.done ? ELECTRIC : "rgba(78,205,196,0.4)", minWidth: "1.6rem" }}>{ch.done ? "✓" : String(ch.n).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.85rem, 2.5vw, 0.98rem)", fontStyle: ch.done ? "italic" : "normal", color: ch.done ? "#E8F8F7" : "rgba(78,205,196,0.35)", flex: 1, textAlign: "left" }}>{ch.title}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 1.8vw, 0.7rem)", letterSpacing: "0.16em", color: ch.done ? ELECTRIC : "rgba(78,205,196,0.25)", textTransform: "uppercase" }}>{ch.date}</span>
                </div>
              ))}
            </div>
            {!replayMode && !countdownExpired && countdownDisplay && (
              <div className="fade-up" style={{ marginBottom: "clamp(0.6rem, 2vh, 1.2rem)" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.62rem, 1.8vw, 0.7rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(78,205,196,0.45)", marginBottom: "0.3rem" }}>chapter three opens in</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.1rem, 3.4vw, 1.45rem)", fontStyle: "italic", color: ELECTRIC, letterSpacing: "0.06em", margin: 0 }}>{countdownDisplay}</p>
              </div>
            )}
            {!replayMode && countdownExpired && (
              <div className="fade-up" style={{ marginBottom: "clamp(0.8rem, 2vh, 1.4rem)" }}>
                <p className="font-hand" style={{
                  fontSize: "clamp(0.95rem, 2.8vw, 1.15rem)",
                  color: ELECTRIC,
                  marginBottom: "0.5rem",
                }}>
                  chapter three is waiting for you ✦
                </p>
                <button
                  onClick={() => { onRefreshState?.(); window.location.reload(); }}
                  className="cta-link"
                  style={{
                    fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
                    color: "#E8F8F7",
                  }}
                >
                  enter chapter three →
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
                  ? ELECTRIC
                  : starTaps > 0
                  ? `rgba(78,205,196,${0.2 + starTaps * 0.16})`
                  : "rgba(78,205,196,0.15)",
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
                color: ELECTRIC, lineHeight: 1.45,
                marginBottom: "clamp(0.5rem,1.8vh,1rem)",
                whiteSpace: "pre-line",
              }}>
                {"secret no. 2:\neven when you fall asleep mid-sentence,\nyou're still the only person\ni want to stay awake for."}
              </p>
            )}

            <div>
              <button onClick={handleReadAgain}
                className="cta-link"
                style={{
                  fontSize: "clamp(0.75rem, 2vw, 0.82rem)",
                  color: "rgba(78,205,196,0.6)",
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
