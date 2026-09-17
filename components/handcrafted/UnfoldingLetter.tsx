"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useThemeColor } from "@/lib/use-theme-color";

interface UnfoldingLetterProps {
  onProceedToQuestion: () => void;
}

type LetterSegment =
  | { k: "text"; words: string[]; italic?: boolean; size?: string; color?: string }
  | { k: "gap"; size?: number };

const LETTER: LetterSegment[] = [
  { k: "text", words: ["Sup,", "ZAAAAAAAAAAAAAAAAAAAAAHELI,"], size: "clamp(1.18rem, 4.4vw, 1.55rem)", color: "#1C1510" },
  { k: "gap", size: 9 },
  { k: "text", words: ["You", "my", "friend,"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["Yes", "you", "are", "going", "to", "be", "23", "now", "in", "next", "3", "days,"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["That", "is", "my", "prediction."], size: "clamp(0.7rem, 2.1vw, 0.8rem)", italic: true, color: "#8C7A68" },
  { k: "gap", size: 9 },
  { k: "text", words: ["Jokes", "aside,"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["it", "took", "some", "serious", "efforts", "to", "make", "this,"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["And", "why", "not,"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["You", "deserve", "the", "best."], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "gap", size: 9 },
  { k: "text", words: ["so", ",", "this", "is", "my", "best", "attempt."], size: "clamp(0.7rem, 2.1vw, 0.8rem)", italic: true, color: "#8C7A68" },
  { k: "gap", size: 9 },
  { k: "text", words: ["I", "built", "this", "little", "shit", "for", "you."], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["May", "look", "weird", "at", "first,"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["But", "it", "will", "be", "worse", "by", "the", "end"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "gap", size: 9 },
  { k: "text", words: ["Broke", "this", "motherfucking", "site", "into"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["4", "chapters,"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["Each", "one", "of", "your", "personalities"], size: "clamp(0.74rem, 2.3vw, 0.85rem)", color: "#3A2C22" },
  { k: "text", words: ["And", "now", "you", "are", "gonna", "witness", "one", "of", "them."], size: "clamp(0.7rem, 2.1vw, 0.8rem)", italic: true, color: "#8C7A68" },
];

type Token =
  | { type: "word"; segIdx: number; wordIdx: number; word: string }
  | { type: "gap"; size: number };

function buildTokens(): Token[] {
  const tokens: Token[] = [];
  LETTER.forEach((seg, si) => {
    if (seg.k === "gap") { tokens.push({ type: "gap", size: seg.size ?? 10 }); return; }
    seg.words.forEach((w, wi) => tokens.push({ type: "word", segIdx: si, wordIdx: wi, word: w }));
  });
  return tokens;
}
const TOKENS = buildTokens();

function tokenDelay(token: Token): number {
  if (token.type !== "word") return 0;
  const w = token.word;
  if (w.endsWith("—") || w.endsWith(".") || w.endsWith(",")) return 440;
  if (["okay.", "so.", "lot.", "care.", "it.", "fine.", "to.", "that.", "actually.", "that.", "credit.", "anyway.", "random.", "see.)"].includes(w)) return 400;
  if (Math.random() < 0.07) return 240;
  return 85 + Math.random() * 55;
}

export function UnfoldingLetter({ onProceedToQuestion }: UnfoldingLetterProps) {
  useThemeColor("#F5EFE6");

  const [revealed, setRevealed] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [cursor, setCursor] = useState<{ segIdx: number; wordIdx: number } | null>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tokenIdxRef = useRef(0);

  // Blink cursor
  useEffect(() => {
    const t = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  const tick = useCallback(() => {
    const idx = tokenIdxRef.current;
    if (idx >= TOKENS.length) { setDone(true); setCursor(null); return; }
    const token = TOKENS[idx];
    tokenIdxRef.current = idx + 1;

    if (token.type === "gap") {
      timerRef.current = setTimeout(tick, 130);
      return;
    }

    const { segIdx, wordIdx } = token;
    setCursor({ segIdx, wordIdx });
    setRevealed(prev => ({ ...prev, [segIdx]: Math.max(prev[segIdx] ?? 0, wordIdx + 1) }));

    const delay = tokenDelay(token);
    const seg = LETTER[segIdx];
    const isLast = seg && seg.k === "text" && wordIdx === seg.words.length - 1;
    timerRef.current = setTimeout(tick, isLast ? delay + 140 : delay);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(tick, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [tick]);

  const skipAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const all: Record<number, number> = {};
    LETTER.forEach((seg, si) => { if (seg.k === "text") all[si] = seg.words.length; });
    setRevealed(all);
    setCursor(null);
    setDone(true);
  };

  const proceed = () => {
    setLeaving(true);
    setTimeout(onProceedToQuestion, 600);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        minHeight: "-webkit-fill-available",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
        background: "#F5EFE6",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.6s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "max(env(safe-area-inset-top, 0px), 1.2rem)",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)",
        paddingLeft: "clamp(1.2rem, 5vw, 2.5rem)",
        paddingRight: "clamp(1.2rem, 5vw, 2.5rem)",
        boxSizing: "border-box",
      }}
    >
      {/* Skip button — fixed to top right, always visible until complete */}
      {!done && (
        <button
          onClick={skipAll}
          style={{
            position: "absolute",
            top: "max(env(safe-area-inset-top, 0px), 1.2rem)",
            right: "clamp(1.2rem, 5vw, 2.5rem)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(0.7rem, 2vw, 0.78rem)",
            fontStyle: "italic",
            letterSpacing: "0.06em",
            color: "#8C7A68",
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 50,
            padding: "4px 8px",
          }}
        >
          skip →
        </button>
      )}

      {/* Main Letter Content — zero scroll, perfectly fitted */}
      <div
        style={{
          maxWidth: "34rem",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <div>
          {LETTER.map((seg, si) => {
            if (seg.k === "gap") return <div key={si} style={{ height: `${seg.size ?? 9}px` }} />;

            const wordsVisible = revealed[si] ?? 0;
            if (wordsVisible === 0) return null;
            const isCurrentLine = !done && cursor?.segIdx === si;
            const isSalutation = si === 0;

            return (
              <p
                key={si}
                style={{
                  fontFamily: isSalutation
                    ? "'Caveat', cursive"
                    : "'Playfair Display', Georgia, serif",
                  fontSize: seg.size ?? "clamp(0.74rem, 2.3vw, 0.85rem)",
                  fontStyle: seg.italic ? "italic" : "normal",
                  fontWeight: isSalutation ? 600 : 400,
                  color: seg.color ?? "#1C1510",
                  margin: 0,
                  lineHeight: isSalutation ? 1.18 : 1.4,
                  letterSpacing: isSalutation ? "0.01em" : "inherit",
                }}
              >
                {seg.words.slice(0, wordsVisible).map((w, wi) => {
                  const isCursorHere = isCurrentLine && cursor?.wordIdx === wi;
                  return (
                    <React.Fragment key={wi}>
                      <span style={{ animation: wi === wordsVisible - 1 ? "fadeUp 0.28s ease-out both" : "none" }}>
                        {w}
                      </span>
                      {isCursorHere && (
                        <span style={{
                          display: "inline-block", width: "2px", height: "0.9em",
                          background: "#C9974A", marginLeft: "2px", verticalAlign: "middle",
                          opacity: cursorVisible ? 0.9 : 0, transition: "opacity 0.1s", borderRadius: "1px",
                        }} />
                      )}
                      {(wi < wordsVisible - 1 || isCursorHere) ? " " : ""}
                    </React.Fragment>
                  );
                })}
              </p>
            );
          })}
        </div>

        {/* CTA Section — sits compactly right under the text */}
        <div style={{
          marginTop: "clamp(0.6rem, 1.8vh, 1.2rem)",
          opacity: done ? 1 : 0,
          transform: done ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          pointerEvents: done ? "auto" : "none",
        }}>
          <div style={{
            width: "2rem",
            height: "1px",
            background: "rgba(201,151,74,0.4)",
            marginBottom: "clamp(0.5rem, 1.4vh, 0.8rem)",
          }} />
          <button
            onClick={proceed}
            className="cta-link"
            style={{
              fontSize: "clamp(0.82rem, 2.4vw, 0.9rem)",
              color: "#1C1510",
            }}
          >
            read on →
          </button>
        </div>
      </div>
    </div>
  );
}
