"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThemeColor } from "@/lib/use-theme-color";

interface LuxuryEnvelopeProps {
  onUnseal: () => void;
  disabled?: boolean;
}

type Phase = "enter" | "ready" | "leaving";

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

export function LuxuryEnvelope({ onUnseal, disabled = false }: LuxuryEnvelopeProps) {
  useThemeColor("#0E0B09");
  const [phase, setPhase] = useState<Phase>("enter");
  const [displayText, setDisplayText] = useState("zaara");
  const [isGlitching, setIsGlitching] = useState(false);
  const activeNameRef = useRef("zaara");
  const isLeavingRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "leaving") return;

    let timeoutId: NodeJS.Timeout;
    let glitchIntervalId: NodeJS.Timeout;
    let stepTimeoutId: NodeJS.Timeout;

    const queueNextGlitch = (delay: number) => {
      timeoutId = setTimeout(() => {
        if (isLeavingRef.current) return;

        // Choose next name in random order (different from active)
        const candidates = NAMES.filter((n) => n !== activeNameRef.current);
        const nextTarget = candidates[Math.floor(Math.random() * candidates.length)];

        setIsGlitching(true);


        // 4 rapid scramble frames over ~240ms
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
              // Each name stays solid for 2000ms before next glitch
              queueNextGlitch(2000);
            }, 60);
          }
        }, 60);
      }, delay);
    };

    // First switch happens 2 seconds after ready
    const initialDelay = phase === "ready" ? 2000 : 2600;
    queueNextGlitch(initialDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(glitchIntervalId);
      clearTimeout(stepTimeoutId);
    };
  }, [phase]);

  const begin = () => {
    if (phase !== "ready" || disabled) return;
    isLeavingRef.current = true;
    setPhase("leaving");
    setTimeout(onUnseal, 650);
  };

  const show = phase !== "enter";
  const hide = phase === "leaving";

  return (
    <div
      onClick={begin}
      role="button"
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        background: "#0E0B09",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
        padding: "0 clamp(1rem, 5vw, 3rem)",
      }}
    >
      {/* ✦ star */}
      <span
        style={{
          fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
          color: "#C9974A",
          letterSpacing: "0.6em",
          marginBottom: "clamp(1.5rem, 5vw, 2.5rem)",
          opacity: show && !hide ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 1s ease 0.1s, transform 1s ease 0.1s",
          display: "block",
          animation: phase === "ready" ? "gentlePulse 3s ease-in-out infinite" : "none",
        }}
      >
        ✦
      </span>

      {/* Main title */}
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.6rem, 10vw, 6rem)",
          fontStyle: "italic",
          fontWeight: 400,
          color: "#F5EFE6",
          textAlign: "center",
          lineHeight: 1.1,
          margin: 0,
          opacity: show && !hide ? 1 : 0,
          transform: show && !hide ? "translateY(0)" : hide ? "translateY(-14px)" : "translateY(18px)",
          transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s",
        }}
      >
        a letter
      </h1>

      {/* "for her" — glitching between zaara / मन्नू / واہیلا */}
      <p
        style={{
          fontFamily: "'Playfair Display', 'Noto Serif Devanagari', 'Noto Nastaliq Urdu', Georgia, serif",
          fontSize: "clamp(0.9rem, 2.8vw, 1.1rem)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#C9974A",
          marginTop: "0.6rem",
          marginBottom: 0,
          opacity: show && !hide ? 1 : 0,
          transition: "opacity 0.9s ease 0.4s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          minHeight: "1.8em",
          lineHeight: 1.2,
        }}
      >
        <span style={{ letterSpacing: "0.06em", opacity: 0.85 }}>for</span>
        <span
          className={isGlitching ? "envelope-glitch" : ""}
          data-text={displayText}
          style={{
            display: "inline-block",
            position: "relative",
            unicodeBidi: "isolate",
            letterSpacing: displayText === "zaara" ? "0.08em" : "0.02em",
            transform: isGlitching ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.1s ease",
          }}
        >
          {displayText}
        </span>
      </p>

      <div style={{ height: "clamp(1.2rem, 4vw, 2.2rem)" }} />

      {/* Date */}
      <p
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(0.58rem, 1.8vw, 0.68rem)",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(74,60,48,0.7)",
          opacity: show && !hide ? 1 : 0,
          transition: "opacity 0.9s ease 0.7s",
          textAlign: "center",
        }}
      >
        twenty-third · september · twenty twenty-six
      </p>

      {/* Touch prompt */}
      <p
        style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 5vh, 3rem)",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(0.68rem, 2vw, 0.76rem)",
          fontStyle: "italic",
          letterSpacing: "0.08em",
          color: "rgba(70,57,44,0.75)",
          opacity: phase === "ready" ? 1 : 0,
          transition: "opacity 0.9s ease 0.2s",
          animation: phase === "ready" ? "gentlePulse 2.8s ease-in-out infinite" : "none",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        touch to begin
      </p>
    </div>
  );
}
