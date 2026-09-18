"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

import { LuxuryEnvelope } from "@/components/handcrafted/LuxuryEnvelope";
import { UnfoldingLetter } from "@/components/handcrafted/UnfoldingLetter";
import { Q1_OPTIONS } from "@/lib/case-data";
import { useThemeColor } from "@/lib/use-theme-color";

/* ─────── Types ─────── */
interface HandcraftedChapter01Props {
  initialSessionId: string;
  initialCompleted?: boolean;
  onRefreshState?: () => void;
  isLocked?: boolean;
  replayMode?: boolean;
}
type Stage = "opening" | "letter" | "question" | "gift" | "gift-reveal" | "horizon";

/* ─────── Static data ─────── */
const ANSWERS = Q1_OPTIONS;
const ANSWER_ECHOES: Record<string, string> = Object.fromEntries(
  Q1_OPTIONS.map(o => [o.id, o.echo])
);

const CHAPTER_2_UNLOCK = new Date("2026-09-21T00:00:00+05:30");

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

/* ─────── Shared viewport screen (dark) ─────── */
function Screen({ bg = "#0E0B09", visible, scroll = false, children }: {
  bg?: string; visible: boolean; scroll?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      width: "100vw",
      minHeight: "-webkit-fill-available",
      background: bg,
      display: "flex", flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(1.2rem,3.5vh,2.5rem) clamp(1.2rem,5vw,2.5rem)",
      overflowY: scroll ? "auto" : "hidden",
      overflowX: "hidden",
      overscrollBehavior: "none",
      touchAction: scroll ? "pan-y" : "none",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
      pointerEvents: visible ? "auto" : "none",
      boxSizing: "border-box",
    } as React.CSSProperties}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center",
        width: "100%", maxWidth: "34rem",
      }}>
        {children}
      </div>
    </div>
  );
}

function GoldLine({ margin = "clamp(1.2rem,4vh,2rem) auto" }: { width?: string; margin?: string }) {
  return <div style={{ margin, flexShrink: 0 }} />;
}

function Label({ children, color = "#C9974A" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="label-accent" style={{ marginBottom: "clamp(1rem,3vh,2rem)", flexShrink: 0 }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(0.62rem, 2vw, 0.72rem)",
        letterSpacing: "0.22em", textTransform: "uppercase",
        color, margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}/* Two options — it's still lindor either way lol */
const MOODS = [
  { id: "sweet",   label: "hah.",    sub: "you got me." },
  { id: "nosweet", label: "nah.",    sub: "lies." },
];

/* Reveal lines — personalised by her pick */
type RevealEntry =
  | { gap: true }
  | { text: string; italic?: boolean; size?: string; color?: string };

function getRevealLines(_moodId: string): RevealEntry[] {
  return [
    { text: "it's inevitable bitch.", italic: true, color: "#8C7A68" },
    { text: "you can't escape lindor.", italic: true, color: "#8C7A68" },
    { gap: true },
    { text: "not until you are with me.", color: "#3A2C22" },
    { text: "even if you keep me aside,", color: "#3A2C22" },
    { text: "this year you got introduced to lindorrrrrrrrrrr.", color: "#3A2C22" },
    { text: "which itself is a milestone for many.", italic: true, color: "#8C7A68" },
    { gap: true },
    { text: "if i am dead whenever you see lindor you will miss me,", color: "#3A2C22" },
    { text: "wouldn't you?", color: "#3A2C22" },
    { gap: true },
    { text: "anyway bakchodi aside.", italic: true, color: "#8C7A68" },
    { gap: true },
    { text: "you will receive your first gift anytime today.", size: "clamp(1.05rem,3.4vw,1.25rem)", color: "#1C1510" },
  ];
}

// Delay (ms) after each of the entries
const REVEAL_DELAYS = [780, 700, 240, 840, 840, 840, 840, 240, 880, 780, 240, 950, 240, 880];


/* ─────── Gift Reveal component ─────── */
function GiftReveal({ visible, moodId, onDone }: {
  visible: boolean;
  moodId: string;
  onDone: () => void;
}) {
  useThemeColor("#F5EFE6");
  const lines = getRevealLines(moodId);
  const [shown, setShown] = useState(0);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let total = 600;
    lines.forEach((_, i) => {
      total += REVEAL_DELAYS[i] ?? 800;
      timers.push(setTimeout(() => setShown(i + 1), total));
    });
    timers.push(setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 55,
        origin: { y: 0.65 },
        colors: ["#C9974A", "#E3BE7E", "#F5EFE6", "#DDD5C8", "#C4687A"],
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      haptic([40, 60, 120]);
    }, total + 700));
    timers.push(setTimeout(() => setShowCta(true), total + 1400));
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodId]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      width: "100vw",
      minHeight: "-webkit-fill-available",
      background: "#F5EFE6",
      display: "flex", flexDirection: "column",
      alignItems: "flex-start", justifyContent: "center",
      padding: "clamp(1.5rem,4vh,3rem) clamp(1.2rem,5vw,2.5rem)",
      overflow: "hidden",
      overscrollBehavior: "none",
      touchAction: "none",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "34rem", width: "100%" }}>
        {lines.slice(0, shown).map((line, i) => {
          if ("gap" in line) return <div key={i} style={{ height: "0.5rem" }} />;
          return (
            <p key={i} className="fade-up" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: line.size ?? "clamp(0.82rem, 2.6vw, 0.96rem)",
              fontStyle: line.italic ? "italic" : "normal",
              fontWeight: 400,
              color: line.color ?? "#1C1510",
              margin: 0, lineHeight: 1.55,
            }}>
              {line.text}
            </p>
          );
        })}

        <div style={{
          marginTop: "clamp(1rem,2.8vh,1.8rem)",
          opacity: showCta ? 1 : 0,
          transform: showCta ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          pointerEvents: showCta ? "auto" : "none",
        }}>
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



/* ─────── Main ─────── */
export default function HandcraftedChapter01({
  initialSessionId,
  initialCompleted = false,
  onRefreshState,
  isLocked = false,
  replayMode = false,
}: HandcraftedChapter01Props) {
  const [stage, setStage] = useState<Stage>(() => {
    if (initialCompleted) return "horizon";
    return "opening";
  });
  const [visible, setVisible] = useState(true);
  const [chosen, setChosen] = useState<string | null>(null);
  const [hoveredAnswer, setHoveredAnswer] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [moodPicked, setMoodPicked] = useState(false);
  const [pickedMoodId, setPickedMoodId] = useState<string>("sweet");
  const [easterEgg, setEasterEgg] = useState(false);
  const [starTaps, setStarTaps] = useState(0);
  const [starPulse, setStarPulse] = useState(false);
  const starTapsRef = useRef(0);
  const sessionId = useRef(initialSessionId);

  const { display: countdownDisplay, expired: countdownExpired } = useCountdown(CHAPTER_2_UNLOCK);

  const goTo = useCallback((next: Stage) => {
    setVisible(false);
    setTimeout(() => { setStage(next); setVisible(true); }, 620);
  }, []);

  const answerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moodTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleReadAgain = useCallback(() => {
    setChosen(null);
    setMoodPicked(false);
    setEasterEgg(false);
    setStarTaps(0);
    starTapsRef.current = 0;
    goTo("opening");
  }, [goTo]);

  const isCh2Done = typeof window !== "undefined" && localStorage.getItem("p23_ch2_done") === "true";
  const isCh3Done = typeof window !== "undefined" && localStorage.getItem("p23_ch3_done") === "true";
  const isCh4Done = typeof window !== "undefined" && localStorage.getItem("p23_ch4_done") === "true";

  const chapterTimeline = useMemo(() => [
    { n: 1, title: "The Incident", date: "sept 20", unlocked: true },
    { n: 2, title: "The Sleepy", date: "sept 21", unlocked: replayMode || isCh2Done },
    { n: 3, title: "The Interrupter", date: "sept 22", unlocked: replayMode || isCh3Done },
    { n: 4, title: "The Cover-Up", date: "sept 23", unlocked: replayMode || isCh4Done },
  ], [isCh2Done, isCh3Done, isCh4Done, replayMode]);

  const proceedFromAnswer = useCallback(() => {
    if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    goTo("gift");
  }, [goTo]);

  const handleAnswer = useCallback(async (id: string) => {
    if (chosen) return;
    setChosen(id);
    const answer = ANSWERS.find(a => a.id === id);
    if (typeof window !== "undefined" && answer) {
      localStorage.setItem("p23_word_ch1", answer.label);
      localStorage.setItem("p23_q1_id", answer.id);
    }
    haptic(40);
    try {
      await fetch("/api/chapter/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          chapterKey: "incident",
          moduleId: "question_01",
          questionKey: "fragment_01",
          questionText: "you have 30 seconds to defend me in court. what's your opening statement?",
          chosenAnswer: id,
        }),
      });
    } catch (e) { console.error(e); }
    answerTimerRef.current = setTimeout(proceedFromAnswer, 5000);
  }, [chosen, proceedFromAnswer]);

  const proceedFromMood = useCallback(() => {
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    onRefreshState?.();
    goTo("gift-reveal");
  }, [onRefreshState, goTo]);

  /* Mood pick → triggers reveal */
  const handleMoodPick = useCallback(async (id: string) => {
    if (moodPicked) return;
    setMoodPicked(true);
    setPickedMoodId(id);
    haptic(40);
    // stamp sound removed
    // Fire the spin API (gift is always the Lindor box)
    try {
      const response = await fetch("/api/chapter/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          chapterKey: "sweet",
          preferredRewardIndex: 0,
        }),
      });
      if (!response.ok) throw new Error(`Unable to save chapter completion (${response.status}).`);
      if (typeof window !== "undefined") {
        localStorage.setItem("p23_ch1_done", "true");
      }
    } catch (e) { console.error(e); }
    moodTimerRef.current = setTimeout(proceedFromMood, 4000);
  }, [moodPicked, proceedFromMood]);

  /* Easter egg */
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
        colors: ["#C9974A", "#E3BE7E", "#C4687A", "#F5EFE6"],
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      starTapsRef.current = 0;
    } else {
      haptic(25);
    }
  };

  /* ──────────── Render ──────────── */
  return (
    <>
      {/* 1 — OPENING */}
      {stage === "opening" && <LuxuryEnvelope onUnseal={() => goTo("letter")} disabled={isLocked} />}

      {/* 2 — LETTER */}
      {stage === "letter" && <UnfoldingLetter onProceedToQuestion={() => goTo("question")} />}

      {/* 3 — QUESTION */}
      {stage === "question" && (
        <Screen visible={visible}>
          <div style={{ width: "100%", maxWidth: "34rem" }}>
            <Label>chapter one · the incident</Label>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.2rem, 3.8vw, 1.8rem)",
              fontStyle: "italic", fontWeight: 400,
              color: "#F5EFE6", lineHeight: 1.45, margin: 0,
            }}>
              you have 30 seconds<br />
              to defend me in court.<br />
              <br />
              what's your opening statement?
            </h2>

            <GoldLine margin="clamp(1rem,3.5vh,2rem) 0" width="100%" />

            {chosen ? (
              <div className="fade-up">
                <p className="font-hand" style={{
                  fontSize: "clamp(1.15rem, 3.6vw, 1.45rem)",
                  color: "#C9974A", whiteSpace: "pre-line", lineHeight: 1.6,
                }}>
                  {ANSWER_ECHOES[chosen]}
                </p>
                <div style={{ marginTop: "clamp(1rem, 2.5vh, 1.8rem)" }}>
                  <button
                    onClick={proceedFromAnswer}
                    className="cta-link"
                    style={{
                      fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
                      color: "#C9974A",
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
                    <button key={a.id}
                      onClick={() => handleAnswer(a.id)}
                      onMouseEnter={() => setHoveredAnswer(a.id)}
                      onMouseLeave={() => setHoveredAnswer(null)}
                      style={{
                        display: "flex", alignItems: "center", gap: "1rem",
                        padding: "clamp(0.85rem,2.5vh,1.15rem) 0",
                        paddingLeft: isHovered ? "0.6rem" : "0",
                        background: isHovered ? "rgba(201,151,74,0.04)" : "none",
                        border: "none",
                        borderBottom: "1px solid rgba(70,57,44,0.5)",
                        borderLeft: isHovered ? "2px solid rgba(201,151,74,0.6)" : "2px solid transparent",
                        cursor: "pointer", textAlign: "left", width: "100%",
                        minHeight: "56px",
                        transition: "padding-left 0.2s ease, border-left-color 0.2s ease, background 0.2s ease",
                      }}
                    >
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(0.72rem, 2vw, 0.8rem)", letterSpacing: "0.1em",
                        color: "#46392C", minWidth: "1.8rem", flexShrink: 0,
                      }}>
                        {`0${i + 1}`}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "0.18rem" }}>
                        <span style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(0.94rem, 3vw, 1.08rem)",
                          fontStyle: isHovered ? "italic" : "normal",
                          color: isHovered ? "#F5EFE6" : "#C9974A",
                          lineHeight: 1.4, transition: "color 0.2s",
                        }}>
                          {a.label}
                        </span>
                        <span style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(0.78rem, 2.2vw, 0.88rem)",
                          fontStyle: "italic",
                          color: "#7A6858",
                          lineHeight: 1.35,
                        }}>
                          {a.sub}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Screen>
      )}

      {/* 4 — GIFT MOOD PICKER */}
      {stage === "gift" && (
        <Screen visible={visible}>
          <div style={{ width: "100%", maxWidth: "34rem" }}>
            <Label>real talk.</Label>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.25rem, 3.8vw, 1.8rem)",
              fontStyle: "italic", fontWeight: 400,
              color: "#F5EFE6", lineHeight: 1.4, margin: 0,
            }}>
              the lindor situation.<br />
              <br />
              where are you with it?
            </h2>

            <GoldLine margin="clamp(1rem,3.5vh,2rem) 0" width="100%" />

            {moodPicked ? (
              <div className="fade-up">
                <p className="font-hand" style={{
                  fontSize: "clamp(1.12rem, 3.5vw, 1.35rem)",
                  color: "#C9974A", lineHeight: 1.6,
                }}>
                  yeah. that&apos;s what i thought.
                </p>
                <div style={{ marginTop: "clamp(1rem, 2.5vh, 1.8rem)" }}>
                  <button
                    onClick={proceedFromMood}
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
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {MOODS.map((m, i) => {
                  const isHovered = hoveredMood === m.id;
                  return (
                    <button key={m.id}
                      onClick={() => handleMoodPick(m.id)}
                      onMouseEnter={() => setHoveredMood(m.id)}
                      onMouseLeave={() => setHoveredMood(null)}
                      style={{
                        display: "flex", alignItems: "center", gap: "1rem",
                        padding: "clamp(0.85rem,2.5vh,1.15rem) 0",
                        background: "none", border: "none",
                        borderBottom: "1px solid rgba(70,57,44,0.5)",
                        cursor: "pointer", textAlign: "left", width: "100%",
                        minHeight: "56px",
                      }}
                    >
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(0.72rem, 2vw, 0.8rem)", letterSpacing: "0.1em",
                        color: "#46392C", minWidth: "1.8rem", flexShrink: 0,
                      }}>
                        {`0${i + 1}`}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                        <span style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(0.94rem, 3vw, 1.08rem)",
                          fontStyle: isHovered ? "italic" : "normal",
                          color: isHovered ? "#F5EFE6" : "#C9974A",
                          lineHeight: 1.4, transition: "color 0.2s",
                        }}>
                          {m.label}
                        </span>
                        <span style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(0.78rem, 2.2vw, 0.88rem)",
                          fontStyle: "italic",
                          color: "#46392C",
                          lineHeight: 1.35,
                        }}>
                          {m.sub}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Screen>
      )}

      {/* 5 — GIFT REVEAL (ivory, line-by-line) */}
      {stage === "gift-reveal" && (
        <GiftReveal visible={visible} moodId={pickedMoodId} onDone={() => goTo("horizon")} />
      )}

      {/* 6 — HORIZON */}
      {stage === "horizon" && (
        <Screen visible={visible} scroll={false}>
          <div style={{ width: "100%", maxWidth: "34rem", textAlign: "center" }}>
            <Label>{replayMode ? "chapter one · relived." : "chapter one · done."}</Label>

            <p className="font-display fade-up" style={{
              fontSize: "clamp(0.92rem,2.8vw,1.15rem)",
              fontStyle: "italic", fontWeight: 400,
              color: "#7A6858", lineHeight: 1.45, margin: 0,
            }}>
              {replayMode ? (
                <>still sweet.<br />still yours.<br />pick another whenever.</>
              ) : (
                <>one down.<br />three to go.<br />come back tomorrow.</>
              )}
            </p>

            <GoldLine width="3rem" margin="clamp(0.6rem,1.8vh,1rem) auto" />

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.65rem,2vw,0.72rem)",
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: "#3A2C22", marginBottom: "clamp(0.5rem,1.4vh,0.8rem)",
            }}>
              {replayMode ? "four chapters · forever yours" : "four chapters · four days"}
            </p>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: "clamp(0.6rem,1.8vh,1rem)" }}>
              {chapterTimeline.map(ch => (
                <div key={ch.n} style={{
                  display: "flex", alignItems: "center", gap: "0.7rem",
                  padding: "clamp(0.35rem,1vh,0.5rem) 0",
                  borderBottom: "1px solid rgba(58,44,34,0.25)",
                  opacity: ch.unlocked ? 1 : 0.32,
                }}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.7rem", letterSpacing: "0.12em",
                    color: ch.unlocked ? "#C9974A" : "#3A2C22", minWidth: "1.5rem",
                  }}>
                    {ch.unlocked ? "✓" : String(ch.n).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(0.85rem,2.4vw,0.98rem)",
                    fontStyle: ch.unlocked ? "italic" : "normal",
                    color: ch.unlocked ? "#F5EFE6" : "#4A3830",
                    flex: 1, textAlign: "left",
                  }}>
                    {ch.title}
                  </span>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(0.62rem,1.8vw,0.7rem)", letterSpacing: "0.14em",
                    color: ch.unlocked ? "#C9974A" : "#2E2318",
                    textTransform: "uppercase",
                  }}>
                    {ch.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Countdown to chapter 2 */}
            {!replayMode && !countdownExpired && countdownDisplay && (
              <div className="fade-up" style={{ marginBottom: "clamp(0.6rem,1.8vh,1rem)" }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(0.64rem,1.8vw,0.72rem)",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#3A2C22", marginBottom: "0.3rem",
                }}>
                  chapter two opens in
                </p>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.1rem,3.4vw,1.45rem)",
                  fontStyle: "italic", color: "#C9974A", letterSpacing: "0.06em",
                  margin: 0,
                }}>
                  {countdownDisplay}
                </p>
              </div>
            )}
            {!replayMode && countdownExpired && (
              <div className="fade-up" style={{ marginBottom: "clamp(0.6rem,1.8vh,1rem)" }}>
                <p className="font-hand" style={{
                  fontSize: "clamp(0.95rem,2.8vw,1.15rem)",
                  color: "#C9974A", marginBottom: "0.5rem",
                }}>
                  chapter two is waiting for you ✦
                </p>
                <button
                  onClick={() => { onRefreshState?.(); window.location.reload(); }}
                  className="cta-link"
                  style={{
                    fontSize: "clamp(0.82rem, 2.4vw, 0.92rem)",
                    color: "#F5EFE6",
                  }}
                >
                  enter chapter two →
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
                  : "#2E2318",
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
                color: "#C4687A", lineHeight: 1.45,
                marginBottom: "clamp(0.5rem,1.8vh,1rem)",
                whiteSpace: "pre-line",
              }}>
                {"you found it.\ni built a secret into everything i made for you.\nbecause you notice the small things.\nthat's one of the reasons i love you."}
              </p>
            )}

            <div>
              <button onClick={handleReadAgain}
                className="cta-link"
                style={{
                  fontSize: "clamp(0.75rem, 2vw, 0.84rem)",
                  color: "#7A6858",
                }}
              >
                ↺ read again
              </button>
            </div>
          </div>
        </Screen>
      )}
    </>
  );
}
