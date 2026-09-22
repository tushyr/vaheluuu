"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";


import { Q4_OPTIONS, getCaseOutcome } from "@/lib/case-data";
import { useThemeColor } from "@/lib/use-theme-color";

/* ─────── Types ─────── */
interface HandcraftedChapter04Props {
  initialSessionId: string;
  initialCompleted?: boolean;
  onRefreshState?: () => void;
}
type Stage = "opening" | "question" | "sentence-reveal" | "love-reveal" | "final" | "secret" | "done";

/* ─────── Sentence fragment — Word 4 of 4 ─────── */
const ANSWERS = Q4_OPTIONS;

const ANSWER_ECHOES: Record<string, string> = Object.fromEntries(
  Q4_OPTIONS.map(o => [o.id, o.echo])
);

/* ─────── Opening frames — tap anywhere to advance ─────── */
// Each frame bg echoes a previous chapter, then warms toward Ch1 by the end
const FRAMES = [
  {
    bg: "#000000",
    lines: [
      { text: "happy birthday.", variant: "birthday" },
    ],
    hint: "tap anywhere",
  },
  {
    bg: "#060B18",
    lines: [
      { text: "you thought i was just being", variant: "body" },
      { text: "chaotic with the gifts.", variant: "body" },
      { text: "", variant: "gap" },
      { text: "you weren't paying attention.", variant: "accent" },
    ],
    hint: "tap anywhere",
  },
  {
    bg: "#0E0B09",
    lines: [
      { text: "four days.", variant: "body" },
      { text: "four gifts.", variant: "body" },
      { text: "", variant: "gap" },
      { text: "not random.", variant: "accent" },
      { text: "never random.", variant: "accent" },
    ],
    hint: "tap anywhere",
  },
  {
    bg: "#1C1410",
    lines: [
      { text: "one last question.", variant: "body" },
      { text: "then everything", variant: "body" },
      { text: "makes sense.", variant: "accent" },
    ],
    hint: "tap to begin",
  },
];

/* ─────── LOVE YOU gifts ─────── */
// Order: L(indor) → p(O)wer bank → (VE)getable → (YOU)tube = LOVE YOU
const LOVE_GIFTS = [
  { prefix: "Wede",      highlight: "l",   suffix: "'s Chocolates", plain: "wedel's chocolates."  },
  { prefix: "p",         highlight: "O",   suffix: "wer bank",        plain: "a power bank."         },
  { prefix: "a random ", highlight: "VE",  suffix: "getable.",        plain: "a random vegetable."   },
  { prefix: "",          highlight: "YOU", suffix: "tube premium",    plain: "youtube premium."      },
];

const LOVE_LETTERS = ["L", "O", "V", "E", "Y", "O", "U"];

/* ─────── Helpers ─────── */
const haptic = (pattern: number | number[] = 50) => {
  try { if (typeof navigator !== "undefined") navigator.vibrate?.(pattern); } catch (_) {}
};

/* ─────── Sub-components ─────── */

function GoldLine({ margin = "clamp(1.2rem,4vh,2rem) 0" }: { width?: string; margin?: string }) {
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
}

function Screen({ bg = "#0E0B09", visible, scroll = false, center = false, children }: {
  bg?: string; visible: boolean; scroll?: boolean; center?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      width: "100vw",
      background: bg,
      display: "flex", flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "clamp(1.5rem,5vh,3.5rem) clamp(1.2rem,6vw,2.5rem)",
      overflowY: scroll ? "auto" : "hidden",
      overflowX: "hidden",
      overscrollBehavior: "none",
      touchAction: scroll ? "pan-y" : "none",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
      opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
      pointerEvents: visible ? "auto" : "none",
      boxSizing: "border-box",
    } as React.CSSProperties}>
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: center ? "center" : "flex-start",
        justifyContent: "center",
        minHeight: "100%", width: "100%",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─────── Tap-through opening ─────── */
function BirthdayOpening({ visible, onComplete }: { visible: boolean; onComplete: () => void }) {
  const [frame, setFrame] = useState(0);
  const [frameVis, setFrameVis] = useState(true);
  const [linesShown, setLinesShown] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Reveal lines one by one on frame change
  useEffect(() => {
    setLinesShown(0);
    setShowHint(false);
    const current = FRAMES[frame];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let total = 300;
    current.lines.forEach((_, i) => {
      total += _.variant === "gap" ? 200 : 550;
      timers.push(setTimeout(() => setLinesShown(i + 1), total));
    });
    timers.push(setTimeout(() => setShowHint(true), total + 800));
    return () => timers.forEach(clearTimeout);
  }, [frame]);

  const advance = useCallback(() => {
    const current = FRAMES[frame];
    if (!showHint) {
      setLinesShown(current.lines.length);
      setShowHint(true);
      return;
    }
    if (frame >= FRAMES.length - 1) {
      onComplete();
      return;
    }
    setFrameVis(false);
    setTimeout(() => {
      setFrame(f => f + 1);
      setFrameVis(true);
    }, 380);
  }, [frame, showHint, onComplete]);

  const current = FRAMES[frame];

  const lineStyle = (variant: string): React.CSSProperties => {
    switch (variant) {
      case "birthday":
        return {
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.9rem, 6.5vw, 3rem)",
          fontStyle: "italic", fontWeight: 400,
          color: "#C9974A", margin: 0, lineHeight: 1.1,
        };
      case "body":
        return {
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(0.94rem, 3.2vw, 1.1rem)",
          fontStyle: "italic", fontWeight: 400,
          color: "#7A6858", margin: 0, lineHeight: 1.75,
        };
      case "accent":
        return {
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(0.94rem, 3.2vw, 1.1rem)",
          fontStyle: "italic", fontWeight: 400,
          color: "#F5EFE6", margin: 0, lineHeight: 1.75,
        };
      default:
        return { height: "0.5rem", display: "block" };
    }
  };

  useThemeColor(current.bg ?? "#0E0B09");

  return (
    <div
      onClick={advance}
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        minHeight: "-webkit-fill-available",
        width: "100vw",
        background: current.bg ?? "#0E0B09",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "clamp(2rem,6vh,4rem) clamp(1.5rem,7vw,3.5rem)",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
        cursor: "pointer",
        opacity: visible ? 1 : 0, transition: "opacity 0.6s ease, background 0.8s ease",
        boxSizing: "border-box",
      } as React.CSSProperties}
    >
      <div
        style={{
          maxWidth: "30rem", width: "100%",
          opacity: frameVis ? 1 : 0,
          transition: "opacity 0.38s ease",
        }}
      >
        {current.lines.slice(0, linesShown).map((line, i) => (
          line.variant === "gap"
            ? <div key={i} style={{ height: "1.2rem" }} />
            : <p key={i} className="fade-up" style={lineStyle(line.variant)}>{line.text}</p>
        ))}

        {showHint && (
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)",
            fontStyle: "italic",
            letterSpacing: "0.08em",
            color: "rgba(122,104,88,0.7)",
            marginTop: "clamp(2rem,6vh,3.5rem)",
            opacity: 1,
            transition: "opacity 0.6s ease",
          }}>
            {current.hint}
          </p>
        )}
      </div>

      {/* Frame dots */}
      <div style={{
        position: "absolute", bottom: "clamp(1.5rem,4vh,2.5rem)",
        display: "flex", gap: "0.4rem", alignItems: "center",
      }}>
        {FRAMES.map((_, i) => (
          <div key={i} style={{
            width: i === frame ? "1.2rem" : "0.35rem",
            height: "0.35rem",
            borderRadius: "9999px",
            background: i === frame ? "#C9974A" : "rgba(122,104,88,0.3)",
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─────── Case File Reveal (Complete 81-State System) ─────── */
function CaseReveal({
  visible,
  q1Val,
  q2Val,
  q3Val,
  q4Val,
  onDone,
}: {
  visible: boolean;
  q1Val?: string | null;
  q2Val?: string | null;
  q3Val?: string | null;
  q4Val?: string | null;
  onDone: () => void;
}) {
  useThemeColor("#F5EFE6");
  const [phase, setPhase] = useState(0);
  const [showCta, setShowCta] = useState(false);

  const { q1, q2, q3, q4, outcome } = useMemo(() => {
    return getCaseOutcome(q1Val, q2Val, q3Val, q4Val);
  }, [q1Val, q2Val, q3Val, q4Val]);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    const s = (delay: number, p: number) => t.push(setTimeout(() => setPhase(p), delay));

    s(300,  1);   // CASE FILE: US
    s(900,  2);   // STATUS: deeply suspicious
    s(1600, 3);   // Divider 1
    s(2200, 4);   // Evidence 01
    s(2900, 5);   // Evidence 02
    s(3600, 6);   // Evidence 03
    s(4300, 7);   // Evidence 04
    s(5100, 8);   // Divider 2
    s(5700, 9);   // "after reviewing the evidence..."
    s(6700, 10);  // outcome.setup
    s(8100, 11);  // outcome.punchline
    s(9500, 12);  // Divider 3
    s(10200, 13); // "hmm. after four days of evidence, we are absolutely ridiculous."
    s(12000, 14); // "objectively, we're a terrible idea. personally, i think you're the best one i ever had."
    t.push(setTimeout(() => setShowCta(true), 13800));

    return () => t.forEach(clearTimeout);
  }, []);

  const serif = (extra?: React.CSSProperties): React.CSSProperties => ({
    fontFamily: "'Playfair Display', serif", ...extra,
  });

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      background: "#F5EFE6",
      display: "flex", flexDirection: "column",
      alignItems: "flex-start", justifyContent: "center",
      padding: "clamp(1.5rem, 4vh, 3rem) clamp(1.2rem, 5vw, 2.5rem)",
      overflow: "hidden",
      overscrollBehavior: "none",
      touchAction: "none",
      opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "34rem", width: "100%" }}>

        {/* 1. Header */}
        {phase >= 1 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "#8C7A68", margin: 0 })}>
            case file: us
          </p>
        )}
        {phase >= 2 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9974A", margin: "0.2rem 0 0" })}>
            status: deeply suspicious
          </p>
        )}

        {/* Divider 1 */}
        {phase >= 3 && <div style={{ height: "clamp(0.4rem, 1.2vh, 0.7rem)" }} />}

        {/* 2. Selected Evidence */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.22rem" }}>
          {phase >= 4 && (
            <p className="fade-up" style={serif({ fontSize: "clamp(0.78rem, 2.4vw, 0.9rem)", fontStyle: "italic", color: "#1C1510", margin: 0, lineHeight: 1.35 })}>
              <span style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8C7A68", fontStyle: "normal", marginRight: "0.4rem" }}>01 ·</span>
              &ldquo;{q1.label}&rdquo;
            </p>
          )}

          {phase >= 5 && (
            <p className="fade-up" style={serif({ fontSize: "clamp(0.78rem, 2.4vw, 0.9rem)", fontStyle: "italic", color: "#1C1510", margin: 0, lineHeight: 1.35 })}>
              <span style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8C7A68", fontStyle: "normal", marginRight: "0.4rem" }}>02 ·</span>
              &ldquo;{q2.label}&rdquo;
            </p>
          )}

          {phase >= 6 && (
            <p className="fade-up" style={serif({ fontSize: "clamp(0.78rem, 2.4vw, 0.9rem)", fontStyle: "italic", color: "#1C1510", margin: 0, lineHeight: 1.35 })}>
              <span style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8C7A68", fontStyle: "normal", marginRight: "0.4rem" }}>03 ·</span>
              &ldquo;{q3.label}&rdquo;
            </p>
          )}

          {phase >= 7 && (
            <p className="fade-up" style={serif({ fontSize: "clamp(0.78rem, 2.4vw, 0.9rem)", fontStyle: "italic", color: "#1C1510", margin: 0, lineHeight: 1.35 })}>
              <span style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.68rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8C7A68", fontStyle: "normal", marginRight: "0.4rem" }}>04 ·</span>
              &ldquo;{q4.label}&rdquo;
            </p>
          )}
        </div>

        {/* Divider 2 */}
        {phase >= 8 && <div style={{ height: "clamp(0.4rem, 1.2vh, 0.7rem)" }} />}

        {/* 3. 81-State Outcome Interpretation */}
        {phase >= 9 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.62rem, 1.8vw, 0.7rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9974A", margin: "0 0 0.25rem" })}>
            after reviewing the evidence...
          </p>
        )}

        {phase >= 10 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.8rem, 2.5vw, 0.92rem)", fontStyle: "italic", color: "#3A2C22", margin: "0 0 0.2rem", lineHeight: 1.35 })}>
            {outcome.setup}
          </p>
        )}

        {phase >= 11 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.92rem, 2.8vw, 1.08rem)", fontWeight: 600, fontStyle: "italic", color: "#1C1510", margin: "0.15rem 0 0", lineHeight: 1.35 })}>
            {outcome.punchline}
          </p>
        )}

        {/* Divider 3 */}
        {phase >= 12 && <div style={{ height: "clamp(0.4rem, 1.2vh, 0.7rem)" }} />}

        {/* 4. Emotional Turn (Option D - 'very you') */}
        {phase >= 13 && (
          <div className="fade-up" style={{ margin: "0.3rem 0 0.15rem" }}>
            <p style={serif({ fontSize: "clamp(0.8rem, 2.5vw, 0.92rem)", fontStyle: "italic", color: "#3A2C22", margin: 0, lineHeight: 1.4 })}>
              after four days of evidence, i think we&apos;ve established one thing:<br />
              <strong style={{ fontWeight: 600, color: "#1C1510" }}>we are absolutely ridiculous.</strong>
            </p>
          </div>
        )}

        {phase >= 14 && (
          <div className="fade-up" style={{ margin: "0.35rem 0 0" }}>
            <p style={serif({ fontSize: "clamp(0.82rem, 2.6vw, 0.95rem)", fontStyle: "italic", color: "#1C1510", margin: "0 0 0.15rem", lineHeight: 1.35 })}>
              objectively, we&apos;re a terrible idea.
            </p>
            <p style={serif({ fontSize: "clamp(0.92rem, 2.8vw, 1.1rem)", fontStyle: "italic", fontWeight: 600, color: "#C9974A", margin: 0, lineHeight: 1.35 })}>
              personally, i think you&apos;re the best one i ever had.
            </p>
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: "clamp(0.8rem, 2.2vh, 1.4rem)",
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
            there&apos;s one more thing &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────── L O V E Y O U reveal ─────── */
function LoveReveal({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  /*
    Phase map:
    0  → nothing
    1  → "you thought the gifts were just... things."
    2  → "they weren't."
    3  → "each one was a letter."
    4  → plain: a lindor box.
    5  → plain: a power bank.
    6  → plain: a random vegetable.      ← the line that makes her laugh
    7  → plain: youtube premium.
    8  → "look at the first letters."   (replaces plain list)
    9  → highlighted: Lindor
    10 → highlighted: pOwer bank
    11 → highlighted: VEgetable
    12 → highlighted: YOUtube
    13 → L·O·V·E·Y·O·U assembles via activeLetters
    14 → "love you." + confetti
    15 → "always been the point."
    16 → CTA
  */
  const [phase, setPhase] = useState(0);
  const [showAlways, setShowAlways] = useState(false);
  // Each letter: "idle" | "flash" | "gold"
  const [letterStates, setLetterStates] = useState<("idle" | "flash" | "gold")[]>(new Array(7).fill("idle"));
  const [showLoveWord, setShowLoveWord] = useState(false);
  const [showJoke, setShowJoke] = useState(false);
  const [showCta, setShowCta] = useState(false);

  // Colors each letter flashes BEFORE settling to gold — echoing its chapter's identity
  const LETTER_FLASH_COLORS = [
    "#C4687A",  // L → Ch1 rose (The Incident)
    "#4ECDC4",  // O → Ch2 teal (The Sleepy)
    "#FFFFFF",  // V → Ch3 white (The Interrupter)
    "#FFFFFF",  // E → Ch3 white (The Interrupter)
    "#C9974A",  // Y → Ch4 gold (The Cover-Up — already home)
    "#C9974A",  // O → Ch4 gold
    "#C9974A",  // U → Ch4 gold
  ];

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    const s = (ms: number, fn: () => void) => t.push(setTimeout(fn, ms));

    // Intro — intimate, spoken
    s(500,  () => setPhase(1));   // "you thought the gifts were just... things."
    s(1500, () => setPhase(2));   // "they weren't."
    s(2500, () => setPhase(3));   // "each one was a letter."

    // Plain gift list — no highlights, just sitting there
    s(3700, () => setPhase(4));   // a lindor box.
    s(4500, () => setPhase(5));   // a power bank.
    s(5300, () => setPhase(6));   // a random vegetable.
    s(6200, () => setPhase(7));   // youtube premium.

    // Transition line — then gifts swap to highlighted version
    s(7200, () => setPhase(8));   // "look at the first letters."
    s(8000, () => setPhase(9));   // highlighted: Lindor
    s(8600, () => setPhase(10));  // highlighted: pOwer
    s(9200, () => setPhase(11));  // highlighted: VEgetable
    s(9900, () => setPhase(12));  // highlighted: YOUtube

    // L·O·V·E·Y·O·U — each letter flashes its chapter color then settles gold
    const base = 10700;
    LOVE_LETTERS.forEach((_, i) => {
      s(base + i * 320, () => {
        setLetterStates(prev => { const n = [...prev]; n[i] = "flash"; return n; });
        haptic(20);
      });
      // Settle to gold after 600ms
      s(base + i * 320 + 600, () => {
        setLetterStates(prev => { const n = [...prev]; n[i] = "gold"; return n; });
      });
    });

    // "yeah okay i made this up but still" — appears, then fades, then love you
    s(base + 7 * 320 + 450, () => {
      setShowJoke(true);
      confetti({
        particleCount: 95,
        spread: 72,
        origin: { y: 0.6 },
        colors: ["#C9974A", "#E3BE7E", "#F5EFE6", "#C4687A", "#DDD5C8"],
        scalar: 0.9,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      haptic([30, 40, 100, 40, 120]);
    });
    // Joke fades out after comfortable reading time
    s(base + 7 * 320 + 4500, () => setShowJoke(false));
    // "love you." — cursive, permanent
    s(base + 7 * 320 + 5200, () => setShowLoveWord(true));

    // "always been the plan." — quiet, below
    s(base + 7 * 320 + 6300, () => setShowAlways(true));

    // CTA
    s(base + 7 * 320 + 7300, () => setShowCta(true));

    return () => t.forEach(clearTimeout);
  }, []);

  useThemeColor("#0E0B09");

  // Helpers for rendering
  const serif = (extra?: React.CSSProperties): React.CSSProperties => ({
    fontFamily: "'Playfair Display', serif", ...extra,
  });

  const plainGiftEl = (text: string, key: number) => (
    <p key={key} className="fade-up" style={serif({ fontSize: "clamp(0.82rem, 2.6vw, 0.94rem)", fontStyle: "italic", color: "#3A2C22", margin: 0, lineHeight: 1.4 })}>
      {text}
    </p>
  );

  const highlightGiftEl = (g: typeof LOVE_GIFTS[0], key: number) => (
    <p key={key} className="fade-up" style={serif({ fontSize: "clamp(0.82rem, 2.6vw, 0.94rem)", fontStyle: "italic", color: "#7A6858", margin: 0, lineHeight: 1.4 })}>
      {g.prefix}
      <span style={{ color: "#C9974A", fontStyle: "normal", letterSpacing: "0.02em" }}>{g.highlight}</span>
      {g.suffix}
    </p>
  );

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      background: "#0E0B09",
      display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center",
      padding: "clamp(1.5rem, 4vh, 3rem) clamp(1.2rem, 5vw, 2.5rem)",
      overflow: "hidden",
      overscrollBehavior: "none",
      touchAction: "none",
      opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
      boxSizing: "border-box",
    }}>
      <div style={{ maxWidth: "34rem", width: "100%" }}>

        {/* Intro — spoken directly to her */}
        {phase >= 1 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.82rem, 2.6vw, 0.94rem)", fontStyle: "italic", color: "#46392C", margin: 0, lineHeight: 1.4 })}>
            you thought i was just being chaotic.
          </p>
        )}
        {phase >= 2 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.82rem, 2.6vw, 0.94rem)", fontStyle: "italic", color: "#F5EFE6", margin: "0.15rem 0 0", lineHeight: 1.4 })}>
            classic.
          </p>
        )}
        {phase >= 3 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.85rem, 2.7vw, 1rem)", fontStyle: "italic", color: "#C9974A", margin: "clamp(0.3rem, 1vh, 0.6rem) 0 clamp(0.5rem, 1.5vh, 1rem)", lineHeight: 1.35 })}>
            each one hid something.
          </p>
        )}

        {/* Plain gifts — no highlights, just sitting there (phases 4-7) */}
        {phase >= 4 && phase < 9 && plainGiftEl("wedel's chocolates.", 0)}
        {phase >= 5 && phase < 9 && plainGiftEl("a power bank.", 1)}
        {phase >= 6 && phase < 9 && plainGiftEl("a random vegetable.", 2)}
        {phase >= 7 && phase < 9 && plainGiftEl("youtube premium.", 3)}

        {/* Transition: "look at the first letters." */}
        {phase === 8 && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.85rem, 2.7vw, 1rem)", fontStyle: "italic", color: "#C9974A", margin: "clamp(0.5rem, 1.5vh, 1rem) 0 0", lineHeight: 1.35 })}>
            look at the first letters.
          </p>
        )}

        {/* Highlighted gifts (phases 9-12) */}
        {phase >= 9 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            {phase >= 9  && highlightGiftEl(LOVE_GIFTS[0], 0)}
            {phase >= 10 && highlightGiftEl(LOVE_GIFTS[1], 1)}
            {phase >= 11 && highlightGiftEl(LOVE_GIFTS[2], 2)}
            {phase >= 12 && highlightGiftEl(LOVE_GIFTS[3], 3)}
          </div>
        )}

        {/* L · O · V · E · Y · O · U — each letter flashes its chapter color then settles gold */}
        {phase >= 12 && (
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.25rem, 1.2vw, 0.5rem)", flexWrap: "wrap", marginTop: "clamp(0.8rem, 2.5vh, 1.4rem)" }}>
            {LOVE_LETTERS.map((letter, i) => {
              const state = letterStates[i];
              const color = state === "idle"
                ? "rgba(70,57,44,0.1)"
                : state === "flash"
                ? LETTER_FLASH_COLORS[i]
                : "#C9974A";
              return (
                <React.Fragment key={i}>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)",
                    fontWeight: 400,
                    color,
                    transition: "color 0.45s ease",
                    lineHeight: 1,
                  }}>
                    {letter}
                  </span>
                  {i < LOVE_LETTERS.length - 1 && (
                    <span style={{ color: "rgba(70,57,44,0.12)", fontSize: "clamp(0.65rem, 1.8vw, 0.8rem)" }}>·</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* "yeah okay i made this up but still" — flashes then fades */}
        <p className="font-hand" style={{
          fontSize: "clamp(0.95rem, 3vw, 1.2rem)",
          color: "#C9974A",
          margin: "clamp(0.4rem, 1.5vh, 0.8rem) 0 0",
          lineHeight: 1.2,
          opacity: showJoke ? 1 : 0,
          transition: showJoke ? "opacity 0.5s ease" : "opacity 0.6s ease",
          pointerEvents: "none",
        }}>
          yeah okay i made this up but still
        </p>

        {/* love you. */}
        {showLoveWord && (
          <p className="font-hand fade-up" style={{ fontSize: "clamp(1.5rem, 5vw, 2.2rem)", color: "#C4687A", margin: "clamp(0.4rem, 1.5vh, 0.8rem) 0 0", lineHeight: 1.15 }}>
            love you.
          </p>
        )}

        {/* always been the plan. catch up. */}
        {showAlways && (
          <p className="fade-up" style={serif({ fontSize: "clamp(0.75rem, 2vw, 0.85rem)", fontStyle: "italic", color: "#46392C", margin: "clamp(0.3rem, 1vh, 0.6rem) 0 0", lineHeight: 1.4 })}>
            always been the plan. catch up.
          </p>
        )}

        {/* CTA */}
        <div style={{
          marginTop: "clamp(0.8rem, 2.2vh, 1.4rem)",
          opacity: showCta ? 1 : 0,
          transform: showCta ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          pointerEvents: showCta ? "auto" : "none",
        }}>
          <button onClick={onDone}
            className="cta-link"
            style={{
              fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
              color: "#C9974A",
            }}
          >
            and then some →
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─────── Final screen — Urdu reveal then English sign-off ─────── */
type FinalEntry =
  | { gap: true }
  | { text: string; italic?: boolean; bold?: boolean; size?: string; color?: string; urdu?: boolean };

// Urdu block — lines revealed staggered
const URDU_LINES: FinalEntry[] = [
  { text: "اچھا۔ ایک آخری بات۔",                          bold: true,   color: "#1C1510", size: "clamp(1.02rem, 3.2vw, 1.22rem)", urdu: true },
  { gap: true },
  { text: "اب تک تم نے کافی تعاون کیا ہے۔",              color: "#3A2C22", urdu: true },
  { gap: true },
  { text: "کچھ زیادہ ہی۔ مشکوک حد تک۔",                 bold: true,   color: "#1C1510", urdu: true },
  { gap: true },
  { text: "تم نے میری ہر بات کا جواب دیا،",              color: "#3A2C22", urdu: true },
  { text: "ہر مشکوک تحفہ بھی قبول کر لیا،",              color: "#3A2C22", urdu: true },
  { text: "اور ابھی تک یہ سمجھ نہیں پائی",               color: "#3A2C22", urdu: true },
  { text: "کہ میں آخر یہ سب کر کیا رہا ہوں۔",            color: "#3A2C22", urdu: true },
  { gap: true },
  { text: "اچھا ہے۔",                                     bold: true,   color: "#1C1510", urdu: true },
  { gap: true },
  { text: "باقی سب کچھ",                                  color: "#3A2C22", urdu: true },
  { text: "میں تمہیں خود مل کر دکھانا چاہتا ہوں۔",       bold: true,   color: "#1C1510", size: "clamp(1.02rem, 3.2vw, 1.22rem)", urdu: true },
  { gap: true },
  { text: "اکتوبر۔",                                       bold: true,   color: "#1C1510", size: "clamp(1.12rem, 3.4vw, 1.35rem)", urdu: true },
  { gap: true },
  { text: "بس یہی واحد اسپائلر ملے گا۔",                 color: "#3A2C22", urdu: true },
  { gap: true },
  { text: "فی الحال۔",                                     italic: true, color: "#8C7A68", urdu: true },
];

const URDU_DELAYS = [800, 200, 850, 200, 900, 200, 800, 780, 780, 800, 200, 900, 200, 850, 950, 200, 1100, 200, 900, 200, 1200];

const NAMES = ["zaara", "मन्नू", "واہیلا"];
const GLITCH_CHARS = "zaaraमन्नूواہیلا!#@$%*^~/\\<>{}[]0123";

function getRandomScramble(target: string) {
  const len = target.length;
  let out = "";
  for (let i = 0; i < len; i++) {
    out += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  }
  return out;
}

/* ─────── Secret post-credits ending ─────── */
const VIDEO_SRC = "/assets/secret-ending.mp4";
const MUSIC_SRC = "/assets/secret-music.mp3";

type SecretPhase = "hook" | "error" | "video";

function SecretEnding({ onBack }: { onBack: () => void }) {
  useThemeColor("#0A0805");
  const [phase, setPhase] = useState<SecretPhase>("hook");
  const [hookLine, setHookLine] = useState(0);
  const [errorVisible, setErrorVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start music on mount, fade in
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0;
    musicRef.current = audio;
    audio.play().catch(() => {});
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol = Math.min(vol + 0.04, 0.6);
      audio.volume = vol;
      if (vol >= 0.6) clearInterval(fadeIn);
    }, 80);
    return () => {
      clearInterval(fadeIn);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Phase 1 → error auto-advance
  useEffect(() => {
    if (phase !== "hook") return;
    const t1 = setTimeout(() => setHookLine(1), 900);
    const t2 = setTimeout(() => setHookLine(2), 3400);
    const t3 = setTimeout(() => {
      setPhase("error");
      setTimeout(() => setErrorVisible(true), 350);
    }, 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  // Fade out music + start video when entering video phase
  useEffect(() => {
    if (phase !== "video") return;
    const audio = musicRef.current;
    if (audio) {
      let vol = audio.volume;
      const fadeOut = setInterval(() => {
        vol = Math.max(vol - 0.05, 0);
        audio.volume = vol;
        if (vol <= 0) { clearInterval(fadeOut); audio.pause(); }
      }, 60);
      fadeIntervalRef.current = fadeOut;
    }
    const vid = videoRef.current;
    if (vid) {
      vid.muted = false;
      vid.play().catch(() => {
        // iOS blocked unmuted autoplay — fall back to muted
        vid.muted = true;
        setMuted(true);
        vid.play().catch(() => {});
      });
    }
  }, [phase]);

  const handleErrorClick = () => { setPhase("video"); setVideoReady(true); };
  const handleUnmute = () => {
    setMuted(false);
    if (videoRef.current) videoRef.current.muted = false;
  };

  /* ── Hook phase — warm dark, Playfair italic, matches site ── */
  if (phase === "hook") {
    return (
      <div style={{
        position: "fixed", inset: 0, height: "100dvh", width: "100vw",
        background: "#0A0805",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "clamp(2rem,6vw,4rem)",
        overflowX: "hidden", overflowY: "hidden",
        overscrollBehavior: "none", touchAction: "none",
        boxSizing: "border-box",
      }}>
        {/* Vignette — same as Ch4 opening frames */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }} />
        <div style={{ textAlign: "center", maxWidth: "26rem", width: "100%", position: "relative" }}>
          {hookLine >= 1 && (
            <p className="fade-up" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem,5.5vw,2.5rem)",
              fontStyle: "italic", fontWeight: 400,
              color: "#F5EFE6",
              margin: "0 0 clamp(1.4rem,4.5vh,2.4rem) 0",
              letterSpacing: "0.01em", lineHeight: 1.2,
            }}>
              hold on.
            </p>
          )}
          {hookLine >= 2 && (
            <p className="fade-up" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.9rem,2.8vw,1.15rem)",
              fontStyle: "italic", fontWeight: 400,
              color: "#8C7A68",
              margin: 0, letterSpacing: "0.05em", lineHeight: 1.6,
            }}>
              do you think that&apos;s everything?
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ── Error phase — intentional contrast: amber-on-dark terminal ── */
  if (phase === "error") {
    return (
      <div style={{
        position: "fixed", inset: 0, height: "100dvh", width: "100vw",
        background: "#000000",
        overflowX: "hidden", overflowY: "hidden",
        overscrollBehavior: "none", touchAction: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(1.2rem,4vw,2rem)", boxSizing: "border-box",
      }}>
        {/* Scanlines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,151,74,0.02) 2px, rgba(201,151,74,0.02) 4px)",
        }} />
        {/* Moving beam */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "60px", zIndex: 2,
          background: "linear-gradient(to bottom, transparent, rgba(201,151,74,0.04), transparent)",
          animation: "scanline 5s linear infinite",
          pointerEvents: "none",
        }} />

        {/* Error card */}
        <div
          className={errorVisible ? "fade-up" : ""}
          style={{
            position: "relative", zIndex: 3,
            border: "1px solid rgba(201,151,74,0.3)",
            background: "rgba(10,8,5,0.98)",
            padding: "clamp(1.4rem,5vw,2.2rem) clamp(1.2rem,4vw,1.8rem)",
            maxWidth: "32rem", width: "100%",
            boxShadow: "0 0 40px rgba(201,151,74,0.07), inset 0 0 30px rgba(201,151,74,0.03)",
            fontFamily: "'Courier New', monospace",
          }}
        >
          {/* macOS traffic lights */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.45rem",
            marginBottom: "1.1rem",
            borderBottom: "1px solid rgba(201,151,74,0.15)",
            paddingBottom: "0.7rem",
          }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f56", opacity: 0.7 }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e", opacity: 0.7 }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#27c93f", opacity: 0.4 }} />
            <span style={{
              marginLeft: "0.4rem",
              fontSize: "clamp(0.55rem,1.6vw,0.65rem)",
              color: "rgba(201,151,74,0.28)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              project_23 — terminal
            </span>
          </div>

          <p className="error-flicker" style={{
            fontSize: "clamp(0.62rem,1.8vw,0.72rem)",
            color: "#C4687A",
            letterSpacing: "0.15em", textTransform: "uppercase",
            margin: "0 0 0.7rem 0", fontWeight: 600,
          }}>
            !! critical error !!
          </p>

          <div style={{ borderTop: "1px solid rgba(201,151,74,0.12)", margin: "0 0 0.9rem 0" }} />

          <p style={{ fontSize: "clamp(0.68rem,2vw,0.8rem)", color: "rgba(201,151,74,0.75)", margin: "0 0 0.35rem 0", letterSpacing: "0.04em" }}>
            {"> ERR_0x23 · memory_overflow"}
          </p>
          <p style={{ fontSize: "clamp(0.68rem,2vw,0.8rem)", color: "rgba(245,239,230,0.4)", margin: "0 0 0.18rem 0", letterSpacing: "0.03em" }}>
            {"  process: project_23.exe"}
          </p>
          <p style={{ fontSize: "clamp(0.68rem,2vw,0.8rem)", color: "rgba(245,239,230,0.4)", margin: "0 0 0.18rem 0", letterSpacing: "0.03em" }}>
            {"  cause:   too_much_love_stored"}
          </p>
          <p style={{ fontSize: "clamp(0.68rem,2vw,0.8rem)", color: "rgba(245,239,230,0.22)", margin: "0 0 1.4rem 0", letterSpacing: "0.03em" }}>
            {"  core:    p23_zavama.log · 0x23092026"}
          </p>

          <button
            onClick={handleErrorClick}
            style={{
              display: "block", width: "100%",
              border: "1px solid rgba(201,151,74,0.4)",
              background: "rgba(201,151,74,0.04)",
              color: "rgba(201,151,74,0.82)",
              fontFamily: "'Courier New', monospace",
              fontSize: "clamp(0.7rem,2vw,0.82rem)",
              letterSpacing: "0.18em",
              padding: "clamp(0.75rem,2.2vh,1.1rem)",
              cursor: "pointer",
              animation: "terminalCursor 1.5s step-end infinite",
              WebkitTapHighlightColor: "transparent",
              minHeight: "44px",
            }}
          >
            [ continue ]
          </button>

          <p style={{
            marginTop: "0.85rem",
            fontSize: "clamp(0.5rem,1.4vw,0.6rem)",
            color: "rgba(201,151,74,0.14)",
            letterSpacing: "0.08em",
            textAlign: "center",
          }}>
            {"this was always going to happen"}
            <span className="terminal-cursor"> _</span>
          </p>
        </div>
      </div>
    );
  }

  /* ── Video phase ── */
  return (
    <div style={{
      position: "fixed", inset: 0, height: "100dvh", width: "100vw",
      background: "#000000",
      overflowX: "hidden", overflowY: "hidden",
      overscrollBehavior: "none", touchAction: "none",
    }}>
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted={muted}
        playsInline
        preload="auto"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
        }}
        onEnded={onBack}
      />
      {videoReady && muted && (
        <button
          onClick={handleUnmute}
          className="fade-up"
          style={{
            position: "absolute",
            bottom: "max(env(safe-area-inset-bottom, 0px), 2.2rem)",
            left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(245,239,230,0.25)",
            color: "rgba(245,239,230,0.75)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.72rem,2vw,0.82rem)",
            fontStyle: "italic",
            letterSpacing: "0.08em",
            padding: "0.6rem 1.4rem",
            borderRadius: "2rem",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            zIndex: 10,
            minHeight: "44px",
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          tap for sound ♪
        </button>
      )}
    </div>
  );
}

/* ─────── Final screen - Urdu reveal then English sign-off ─────── */
function FinalScreen({
  visible,
  evidenceValues,
  q4Val,
  onReplay,
  onSecret,
}: {
  visible: boolean;
  evidenceValues: { q1: string; q2: string; q3: string };
  q4Val: string | null;
  onReplay: () => void;
  onSecret: () => void;
}) {
  useThemeColor("#F5EFE6");
  const [urduShown, setUrduShown] = useState(0);
  const [urduVisible, setUrduVisible] = useState(true);
  const [urduRemoved, setUrduRemoved] = useState(false);
  const [englishShown, setEnglishShown] = useState(0);
  const [displayText, setDisplayText] = useState("zaara");
  const [isGlitching, setIsGlitching] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showCaseSummary, setShowCaseSummary] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const [starTaps, setStarTaps] = useState(0);
  const [starPulse, setStarPulse] = useState(false);
  const starTapsRef = useRef(0);
  const activeNameRef = useRef("zaara");

  const caseOutcome = useMemo(() => {
    return getCaseOutcome(evidenceValues.q1, evidenceValues.q2, evidenceValues.q3, q4Val);
  }, [evidenceValues, q4Val]);

  const handleStarTap = () => {
    const next = starTapsRef.current + 1;
    starTapsRef.current = next;
    setStarTaps(next);
    setStarPulse(true);
    setTimeout(() => setStarPulse(false), 220);

    if (next >= 5) {
      // 5th tap → secret ending
      haptic([30, 50, 80, 50, 150]);
      starTapsRef.current = 0;
      setStarTaps(0);
      setEasterEgg(false);
      onSecret();
    } else if (next === 3) {
      // 3rd tap exactly → show easter egg message + confetti, but keep counting
      haptic([30, 40, 50, 60, 100]);
      setEasterEgg(true);
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.82 },
        colors: ["#C9974A", "#E3BE7E", "#C4687A", "#DDD5C8"],
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
    } else {
      haptic(25);
    }
  };

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    const s = (ms: number, fn: () => void) => t.push(setTimeout(fn, ms));

    // Reveal Urdu lines one by one
    let total = 600;
    URDU_LINES.forEach((_, i) => {
      total += URDU_DELAYS[i] ?? 800;
      s(total, () => setUrduShown(i + 1));
    });

    // Pause, then fade out entire Urdu block (giving ample time to read)
    const urduDone = total + 4500;
    s(urduDone, () => setUrduVisible(false));
    s(urduDone + 850, () => setUrduRemoved(true));

    // Then reveal English lines staggered:
    // 1: happy birthday, kid. | 2: gap | 3: i love you my [name] | 4: gap | 5: see you in october.
    const englishDelays = [700, 200, 900, 200, 1000];
    let eng = urduDone + 900;
    englishDelays.forEach((delay, i) => {
      eng += delay;
      s(eng, () => setEnglishShown(i + 1));
    });

    // Confetti on "i love you my [name]"
    s(urduDone + 900 + 700 + 200 + 900 + 200, () => {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#C9974A", "#E3BE7E", "#F5EFE6", "#C4687A"],
        scalar: 0.85,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      haptic([20, 30, 80, 30, 100, 30, 150]);
    });

    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (englishShown >= 5) {
      const t = setTimeout(() => setShowActions(true), 2500);
      return () => clearTimeout(t);
    }
  }, [englishShown]);


  // Sync theme-color when case summary modal opens/closes
  useEffect(() => {
    if (showCaseSummary) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", "#0E0B09");
      document.documentElement.style.backgroundColor = "#0E0B09";
      document.body.style.backgroundColor = "#0E0B09";
      return () => {
        if (meta) meta.setAttribute("content", "#F5EFE6");
        document.documentElement.style.backgroundColor = "#F5EFE6";
        document.body.style.backgroundColor = "#F5EFE6";
      };
    }
  }, [showCaseSummary]);

  // Continuous glitching every 2s once the name line is visible
  const shouldGlitchName = englishShown >= 3;
  useEffect(() => {
    if (!shouldGlitchName) return;

    let timeoutId: NodeJS.Timeout;
    let glitchIntervalId: NodeJS.Timeout;
    let stepTimeoutId: NodeJS.Timeout;

    const queueNextGlitch = (delay: number) => {
      timeoutId = setTimeout(() => {
        const candidates = NAMES.filter((n) => n !== activeNameRef.current);
        const nextTarget = candidates[Math.floor(Math.random() * candidates.length)];

        setIsGlitching(true);

        let frame = 0;
        glitchIntervalId = setInterval(() => {
          frame++;
          if (frame < 4) {
            setDisplayText(getRandomScramble(nextTarget));
          } else {
            clearInterval(glitchIntervalId);
            setDisplayText(nextTarget);
            activeNameRef.current = nextTarget;
            stepTimeoutId = setTimeout(() => {
              setIsGlitching(false);
              queueNextGlitch(2000);
            }, 60);
          }
        }, 60);
      }, delay);
    };

    queueNextGlitch(2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(glitchIntervalId);
      clearTimeout(stepTimeoutId);
    };
  }, [shouldGlitchName]);

  const renderLines = (lines: FinalEntry[], shown: number) =>
    lines.slice(0, shown).map((line, i) => {
      if ("gap" in line) return <div key={i} style={{ height: "0.3rem" }} />;
      return (
        <p key={i} className="fade-up" style={{
          fontFamily: line.urdu ? "'Noto Nastaliq Urdu', serif" : "'Playfair Display', serif",
          fontSize: line.size ?? "clamp(0.85rem, 2.6vw, 0.98rem)",
          fontStyle: line.italic ? "italic" : "normal",
          fontWeight: line.bold ? 600 : 400,
          color: line.color ?? "#1C1510",
          margin: 0,
          lineHeight: line.urdu ? 1.75 : 1.5,
          direction: line.urdu ? "rtl" : "ltr",
          textAlign: line.urdu ? "right" : "center",
          width: "100%",
        }}>
          {line.text}
        </p>
      );
    });

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      height: "100dvh",
      minHeight: "-webkit-fill-available",
      width: "100vw",
      background: "#F5EFE6",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "clamp(1.5rem, 4vh, 3rem) clamp(1.2rem, 5vw, 2.5rem)",
      overflow: "hidden",
      overscrollBehavior: "none",
      touchAction: "none",
      opacity: visible ? 1 : 0, transition: "opacity 0.6s ease",
      boxSizing: "border-box",
    }}>
      <div style={{
        maxWidth: "34rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}>

        {/* Urdu block — fades out as a unit, then removed from layout */}
        {!urduRemoved && (
          <div style={{
            width: "100%",
            opacity: urduVisible ? 1 : 0,
            transition: "opacity 0.9s ease",
            pointerEvents: "none",
          }}>
            {renderLines(URDU_LINES, urduShown)}
          </div>
        )}

        {/* English sign-off — appears dead center with glitching name */}
        {englishShown > 0 && (
          <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}>
            <p className="fade-up" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.1rem, 3.5vw, 1.4rem)",
              fontWeight: 400,
              color: "#1C1510",
              margin: 0, lineHeight: 1.5,
              textAlign: "center",
              width: "100%",
            }}>
              happy birthday, kid.
            </p>

            {englishShown >= 2 && <div style={{ height: "0.5rem" }} />}

            {englishShown >= 3 && (
              <p className="fade-up" style={{
                fontFamily: "'Playfair Display', 'Noto Serif Devanagari', 'Noto Nastaliq Urdu', serif",
                fontSize: "clamp(1.05rem, 3.2vw, 1.35rem)",
                fontWeight: 400,
                color: "#1C1510",
                margin: 0, lineHeight: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.45rem",
                minHeight: "1.5em",
                textAlign: "center",
                width: "100%",
              }}>
                <span>i love you my</span>
                <span
                  className={isGlitching ? "envelope-glitch" : ""}
                  data-text={displayText}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    unicodeBidi: "isolate",
                    color: "#C9974A",
                    letterSpacing: displayText === "zaara" ? "0.14em" : "0.02em",
                    transform: isGlitching ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.1s ease",
                  }}
                >
                  {displayText}
                </span>
              </p>
            )}

            {englishShown >= 4 && <div style={{ height: "0.5rem" }} />}

            {englishShown >= 5 && (
              <p className="fade-up" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(0.85rem, 2.5vw, 0.98rem)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#8C7A68",
                margin: 0, lineHeight: 1.5,
                textAlign: "center",
                width: "100%",
              }}>
                see you in october.
              </p>
            )}

            {/* End actions: View Case File & Relive the Story */}
            {showActions && (
              <div className="fade-up" style={{
                marginTop: "clamp(1.2rem, 3vh, 2rem)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.8rem",
              }}>
                <button
                  onClick={() => setShowCaseSummary(true)}
                  className="cta-link"
                  style={{
                    fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
                    color: "#C9974A",
                  }}
                >
                  view your case file ✦
                </button>

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
                      ? `rgba(201,151,74,${0.25 + starTaps * 0.16})`
                      : "rgba(140,122,104,0.35)",
                    fontSize: "1.15rem",
                    minWidth: "44px",
                    minHeight: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    transform: starPulse ? "scale(1.4)" : "scale(1)",
                    transition: "transform 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease",
                    marginBottom: easterEgg ? "0.3rem" : "0",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  ✦
                </button>

                {easterEgg && (
                  <p className="font-hand fade-up" style={{
                    fontSize: "clamp(0.95rem,2.8vw,1.12rem)",
                    color: "#C4687A", lineHeight: 1.45,
                    margin: "0 0 0.5rem 0",
                    whiteSpace: "pre-line",
                    textAlign: "center",
                  }}>
                    {"you found every single secret.\nhappy 23rd birthday, my zaara.\nevery day with you is my favorite case."}
                  </p>
                )}

                <button
                  onClick={onReplay}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(140,122,104,0.6)",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                    fontStyle: "italic",
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    minHeight: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ↺ relive the story
                </button>
              </div>
            )}
          </div>
        )}

        {/* Keepsake Case Summary Modal */}
        {showCaseSummary && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#0E0B09",
            color: "#F5EFE6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "clamp(2rem,6vh,4rem) clamp(1.5rem,6vw,3rem)",
            overflowY: "auto",
            overscrollBehavior: "none",
            touchAction: "pan-y",
            boxSizing: "border-box",
          }}>
            <div style={{ maxWidth: "34rem", width: "100%", textAlign: "left" }}>
              <div className="label-accent" style={{ marginBottom: "1.5rem" }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(0.62rem, 2vw, 0.72rem)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#C9974A",
                  margin: 0,
                }}>
                  case file: us · summary
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.8rem" }}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "#8C7A68", textTransform: "uppercase", margin: "0 0 0.2rem" }}>
                    day 01 · the defense
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.98rem", fontStyle: "italic", color: "#F5EFE6", margin: 0 }}>
                    "{caseOutcome.q1.label}"
                  </p>
                </div>

                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "#8C7A68", textTransform: "uppercase", margin: "0 0 0.2rem" }}>
                    day 02 · sleep timeline
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.98rem", fontStyle: "italic", color: "#F5EFE6", margin: 0 }}>
                    "{caseOutcome.q2.label}"
                  </p>
                </div>

                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "#8C7A68", textTransform: "uppercase", margin: "0 0 0.2rem" }}>
                    day 03 · sentence completion
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.98rem", fontStyle: "italic", color: "#F5EFE6", margin: 0 }}>
                    "{caseOutcome.q3.label}"
                  </p>
                </div>

                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "#8C7A68", textTransform: "uppercase", margin: "0 0 0.2rem" }}>
                    day 04 · suspicious factor
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.98rem", fontStyle: "italic", color: "#F5EFE6", margin: 0 }}>
                    "{caseOutcome.q4.label}"
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(201,151,74,0.25)", padding: "1.2rem 0", marginBottom: "1.2rem" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "#DDD5C8", lineHeight: 1.65, margin: "0 0 0.6rem" }}>
                  {caseOutcome.outcome.setup}
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontStyle: "italic", fontWeight: 600, color: "#C9974A", lineHeight: 1.5, margin: 0 }}>
                  {caseOutcome.outcome.punchline}
                </p>
              </div>

              <p className="font-hand" style={{ fontSize: "1.6rem", color: "#C4687A", margin: "1.5rem 0", textAlign: "center" }}>
                L · O · V · E · Y · O · U
              </p>

              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  onClick={() => setShowCaseSummary(false)}
                  className="cta-link"
                  style={{ fontSize: "0.85rem", color: "#C9974A" }}
                >
                  close case file ×
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─────── End screen — shown after the secret video finishes ─────── */
function EndScreen() {
  useThemeColor("#0A0805");
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 600); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, height: "100dvh", width: "100vw",
      background: "#0A0805",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "clamp(2rem,6vw,4rem)",
      overflowX: "hidden", overflowY: "hidden",
      overscrollBehavior: "none", touchAction: "none",
      boxSizing: "border-box",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)",
      }} />
      {shown && (
        <div style={{ textAlign: "center", maxWidth: "26rem", width: "100%", position: "relative" }}>
          <p className="fade-up" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.85rem,2.8vw,1.1rem)",
            fontStyle: "italic", fontWeight: 400,
            color: "#8C7A68",
            margin: "0 0 clamp(0.6rem,2vh,1rem) 0",
            letterSpacing: "0.08em",
          }}>
            fin.
          </p>
          <p className="fade-up" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.1rem,3.5vw,1.5rem)",
            fontStyle: "italic", fontWeight: 400,
            color: "#F5EFE6",
            margin: "0 0 clamp(1.2rem,4vh,2rem) 0",
            letterSpacing: "0.02em", lineHeight: 1.4,
            animationDelay: "0.8s",
          }}>
            happy birthday, zaara.
          </p>
          <p className="fade-up" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.78rem,2.4vw,0.92rem)",
            fontStyle: "italic", fontWeight: 400,
            color: "rgba(140,122,104,0.6)",
            margin: 0,
            letterSpacing: "0.05em",
            animationDelay: "1.8s",
          }}>
            see you in october. ✦
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────── Main ─────── */
export default function HandcraftedChapter04({
  initialSessionId,
  initialCompleted = false,
  onRefreshState,
}: HandcraftedChapter04Props) {
  const [stage, setStage] = useState<Stage>(() => {
    if (initialCompleted) return "final";
    return "opening";
  });
  useThemeColor(stage === "sentence-reveal" || stage === "final" ? "#F5EFE6" : "#0E0B09");
  const [visible, setVisible] = useState(true);
  const [chosen, setChosen] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("p23_q4_id") || null;
    }
    return null;
  });
  const [hoveredAnswer, setHoveredAnswer] = useState<string | null>(null);
  const [evidenceValues, setEvidenceValues] = useState({
    q1: "A1",
    q2: "B1",
    q3: "C3",
  });
  const sessionId = useRef(initialSessionId);
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEvidenceValues({
        q1: localStorage.getItem("p23_q1_id") || localStorage.getItem("p23_word_ch1") || "A1",
        q2: localStorage.getItem("p23_q2_id") || localStorage.getItem("p23_word_ch2") || "B1",
        q3: localStorage.getItem("p23_q3_id") || localStorage.getItem("p23_word_ch3") || "C3",
      });
    }
  }, []);

  const goTo = useCallback((next: Stage) => {
    setVisible(false);
    setTimeout(() => { setStage(next); setVisible(true); }, 620);
  }, []);

  const handleReplay = useCallback(() => {
    setChosen(null);
    goTo("opening");
  }, [goTo]);

  const proceedFromAnswer = useCallback(async () => {
    if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    try {
      const response = await fetch("/api/chapter/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, chapterKey: "forever", preferredRewardIndex: 0 }),
      });
      if (!response.ok) throw new Error(`Unable to save chapter completion (${response.status}).`);
      if (typeof window !== "undefined") {
        localStorage.setItem("p23_ch4_done", "true");
      }
    } catch (e) { console.error(e); }
    onRefreshState?.();
    goTo("sentence-reveal");
  }, [goTo, onRefreshState]);

  const handleAnswer = useCallback(async (id: string) => {
    if (chosen) return;
    setChosen(id);
    const answer = ANSWERS.find(a => a.id === id);
    if (typeof window !== "undefined" && answer) {
      localStorage.setItem("p23_word_ch4", answer.label);
      localStorage.setItem("p23_q4_id", answer.id);
    }
    haptic(40);
    // stamp sound removed
    try {
      await fetch("/api/chapter/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          chapterKey: "cover-up",
          moduleId: "question_01",
          questionKey: "fragment_04",
          questionText: "what's the most suspicious thing about us?",
          chosenAnswer: id,
        }),
      });
    } catch (e) { console.error(e); }

    answerTimerRef.current = setTimeout(proceedFromAnswer, 5000);
  }, [chosen, proceedFromAnswer]);

  return (
    <>
      {/* 1 — OPENING: tap-through frames */}
      {stage === "opening" && (
        <BirthdayOpening visible={visible} onComplete={() => goTo("question")} />
      )}

      {/* 2 — QUESTION */}
      {stage === "question" && (
        <Screen visible={visible}>
          <div style={{ width: "100%", maxWidth: "34rem" }}>
            <Label>chapter four · the cover-up</Label>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.2rem, 3.8vw, 1.8rem)",
              fontStyle: "italic", fontWeight: 400,
              color: "#F5EFE6", lineHeight: 1.45, margin: 0,
            }}>
              what's the most suspicious<br />
              thing about us?
            </h2>

            <GoldLine margin="clamp(1rem,3.5vh,2rem) 0" width="100%" />

            {chosen ? (
              <div className="fade-up">
                <p className="font-hand" style={{
                  fontSize: "clamp(1.12rem, 3.5vw, 1.4rem)",
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
                        padding: "clamp(0.85rem, 2.5vh, 1.15rem) 0",
                        background: "none", border: "none",
                        borderBottom: "1px solid rgba(70,57,44,0.5)",
                        cursor: "pointer", textAlign: "left", width: "100%",
                        minHeight: "56px",
                      }}
                    >
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.72rem, 2vw, 0.8rem)", letterSpacing: "0.1em", color: "#46392C", minWidth: "1.4rem", flexShrink: 0 }}>
                        {`0${i + 1}`}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        <span style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "clamp(0.94rem, 3vw, 1.08rem)",
                          fontStyle: isHovered ? "italic" : "normal",
                          color: isHovered ? "#F5EFE6" : "#C9974A",
                          lineHeight: 1.4, transition: "color 0.2s",
                        }}>
                          {a.label}
                        </span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.78rem, 2.2vw, 0.88rem)", fontStyle: "italic", color: "#7A6858", lineHeight: 1.35 }}>
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

      {/* 3 — CASE FILE REVEAL */}
      {stage === "sentence-reveal" && (
        <CaseReveal
          visible={visible}
          q1Val={evidenceValues.q1}
          q2Val={evidenceValues.q2}
          q3Val={evidenceValues.q3}
          q4Val={chosen || (typeof window !== "undefined" ? localStorage.getItem("p23_q4_id") : null) || "D1"}
          onDone={() => goTo("love-reveal")}
        />
      )}

      {/* 4 — L O V E Y O U */}
      {stage === "love-reveal" && (
        <LoveReveal visible={visible} onDone={() => goTo("final")} />
      )}

      {/* 5 — FINAL */}
      {stage === "final" && (
        <FinalScreen
          visible={visible}
          evidenceValues={evidenceValues}
          q4Val={chosen || (typeof window !== "undefined" ? localStorage.getItem("p23_q4_id") : null) || "D1"}
          onReplay={handleReplay}
          onSecret={() => goTo("secret")}
        />
      )}

      {/* 6 — SECRET ENDING */}
      {stage === "secret" && (
        <SecretEnding onBack={() => goTo("done")} />
      )}

      {/* 7 — END SCREEN */}
      {stage === "done" && <EndScreen />}
    </>
  );
}
