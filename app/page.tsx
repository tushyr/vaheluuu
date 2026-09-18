"use client";

import React, { Component, ErrorInfo, ReactNode, useCallback, useEffect, useState } from "react";
import HandcraftedChapter01 from "@/components/chapters/chapter01/HandcraftedChapter01";
import HandcraftedChapter02 from "@/components/chapters/chapter02/HandcraftedChapter02";
import HandcraftedChapter03 from "@/components/chapters/chapter03/HandcraftedChapter03";
import HandcraftedChapter04 from "@/components/chapters/chapter04/HandcraftedChapter04";
import { isReplayMode } from "@/lib/chapters";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface RewardState {
  chapterKey: string;
}

interface ResponseState {
  chapterKey: string;
  chosenAnswer: string;
}

interface ExperienceState {
  success: boolean;
  isPrelude: boolean;
  effectiveDateFormatted: string;
  activeChapterKey: string;
  replayMode: boolean;
  responses: ResponseState[];
  rewards: RewardState[];
  sweetReward: RewardState | null;
}

type ReplayChapter = "1" | "2" | "3" | "4";

const REPLAY_CHAPTERS: Array<{
  id: ReplayChapter;
  numeral: string;
  title: string;
  subtitle: string;
  date: string;
  accent: string;
}> = [
  { id: "1", numeral: "01", title: "the incident", subtitle: "the one with the lindor", date: "20 sept", accent: "#C4687A" },
  { id: "2", numeral: "02", title: "the sleepy", subtitle: "the one with the power bank", date: "21 sept", accent: "#4ECDC4" },
  { id: "3", numeral: "03", title: "the interrupter", subtitle: "the one with youtube", date: "22 sept", accent: "#DDD5C8" },
  { id: "4", numeral: "04", title: "the cover-up", subtitle: "the birthday grand finale", date: "23 sept", accent: "#C9974A" },
];

function ReplayLibrary({
  onSelect,
}: {
  onSelect: (chapter: ReplayChapter) => void;
}) {
  return (
    <section
      className="replay-library"
      aria-labelledby="replay-library-title"
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
        background: "#0E0B09",
        padding: "max(2.2rem, env(safe-area-inset-top)) clamp(1.35rem, 7vw, 3.5rem) max(2rem, env(safe-area-inset-bottom))",
        boxSizing: "border-box",
      }}
    >
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "34rem",
        minHeight: "calc(100dvh - 4.4rem)",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(0.62rem, 2vw, 0.72rem)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#C9974A",
          margin: "0 0 clamp(1.4rem, 4vh, 2.2rem)",
        }}>
          case file: us · after the four days
        </p>
        <h1 id="replay-library-title" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 8.5vw, 3.2rem)",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.12,
          color: "#F5EFE6",
          margin: 0,
        }}>
          four days.<br />still ours.
        </h1>
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "clamp(1.2rem, 5vw, 1.55rem)",
          lineHeight: 1.35,
          color: "#C4687A",
          margin: "0.65rem 0 clamp(1.5rem, 4vh, 2.3rem)",
          maxWidth: "27rem",
        }}>
          nothing expires here. pick a day and begin again.
        </p>

        <div style={{ borderTop: "1px solid rgba(201,151,74,0.3)" }}>
          {REPLAY_CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              className="replay-card"
              onClick={() => onSelect(chapter.id)}
              aria-label={`Replay chapter ${chapter.numeral}: ${chapter.title}`}
              style={{
                display: "grid",
                gridTemplateColumns: "2.35rem 1fr auto",
                alignItems: "center",
                gap: "clamp(0.6rem, 3vw, 1rem)",
                width: "100%",
                minHeight: "76px",
                padding: "0.8rem 0",
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(70,57,44,0.72)",
                color: "#F5EFE6",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span aria-hidden="true" style={{
                color: chapter.accent,
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(0.72rem, 2vw, 0.8rem)",
                letterSpacing: "0.12em",
              }}>
                {chapter.numeral}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{
                  display: "block",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1rem, 3.6vw, 1.15rem)",
                  fontStyle: "italic",
                  lineHeight: 1.25,
                  color: chapter.accent,
                }}>
                  {chapter.title}
                </span>
                <span style={{
                  display: "block",
                  marginTop: "0.2rem",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(0.75rem, 2.5vw, 0.84rem)",
                  fontStyle: "italic",
                  lineHeight: 1.35,
                  color: "#9B8978",
                }}>
                  {chapter.subtitle}
                </span>
              </span>
              <span style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "0.2rem",
                color: "#8C7A68",
                fontFamily: "'Playfair Display', serif",
              }}>
                <span style={{ fontSize: "clamp(0.62rem, 2vw, 0.7rem)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  {chapter.date}
                </span>
                <span aria-hidden="true" style={{ fontSize: "0.78rem", color: chapter.accent }}>
                  relive →
                </span>
              </span>
            </button>
          ))}
        </div>

        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "clamp(1.15rem, 4.5vw, 1.4rem)",
          color: "#8C7A68",
          lineHeight: 1.35,
          margin: "clamp(1.2rem, 3vh, 1.8rem) 0 0",
        }}>
          made for zaara. kept for always.
        </p>
      </div>
    </section>
  );
}

function getFallbackState(): ExperienceState {
  let nowIST = "2026-09-18";
  try {
    nowIST = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {}

  const isPrelude = nowIST < "2026-09-20";
  let activeChapterKey = "sweet";
  if (isPrelude) activeChapterKey = "prelude";
  else if (nowIST >= "2026-09-23") activeChapterKey = "forever";
  else if (nowIST >= "2026-09-22") activeChapterKey = "fierce";
  else if (nowIST >= "2026-09-21") activeChapterKey = "wild";

  return {
    success: true,
    isPrelude,
    effectiveDateFormatted: nowIST,
    activeChapterKey,
    replayMode: isReplayMode(nowIST),
    responses: [],
    rewards: [],
    sweetReward: null,
  };
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#FAF7F2] text-[#342229]">
          <div className="paper-warm max-w-md p-8 rounded-3xl border border-[#D97D92]/40 text-center space-y-4 shadow-xl">
            <span className="text-3xl">💌</span>
            <h3 className="font-serif font-bold text-xl text-[#342229]">
              Something softly went wrong
            </h3>
            <p className="font-hand text-sm text-[#7D5363]">
              tap below to refresh your keepsake
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-rose px-6 py-2 text-sm shadow-md"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HomePage() {
  const [state, setState] = useState<ExperienceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingFadeOut, setLoadingFadeOut] = useState(false);
  const [token, setToken] = useState("");
  const [chapOverride, setChapOverride] = useState<string | null>(null);
  const [replayChapter, setReplayChapter] = useState<ReplayChapter | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("chap");
      if (process.env.NODE_ENV !== "production" && c && ["1", "2", "3", "4"].includes(c)) {
        setChapOverride(c);
      }
    }
  }, []);

  const loadState = useCallback(async (sessionToken: string) => {
    const startTime = Date.now();
    try {
      const res = await fetch(`/api/state?session=${encodeURIComponent(sessionToken)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.success) {
        setState(data);
        if (typeof window !== "undefined") {
          if (data.responses && Array.isArray(data.responses)) {
            for (const resp of data.responses) {
              if (resp.chapterKey === "incident" || resp.chapterKey === "sweet") {
                localStorage.setItem("p23_q1_id", resp.chosenAnswer);
                localStorage.setItem("p23_ch1_done", "true");
              } else if (resp.chapterKey === "sleepy" || resp.chapterKey === "wild") {
                localStorage.setItem("p23_q2_id", resp.chosenAnswer);
                localStorage.setItem("p23_ch2_done", "true");
              } else if (resp.chapterKey === "interrupter" || resp.chapterKey === "fierce") {
                localStorage.setItem("p23_q3_id", resp.chosenAnswer);
                localStorage.setItem("p23_ch3_done", "true");
              } else if (resp.chapterKey === "cover-up" || resp.chapterKey === "forever") {
                localStorage.setItem("p23_q4_id", resp.chosenAnswer);
                localStorage.setItem("p23_ch4_done", "true");
              }
            }
          }
          if (data.rewards && Array.isArray(data.rewards)) {
            for (const rew of data.rewards) {
              if (rew.chapterKey === "sweet") localStorage.setItem("p23_ch1_done", "true");
              if (rew.chapterKey === "wild") localStorage.setItem("p23_ch2_done", "true");
              if (rew.chapterKey === "fierce") localStorage.setItem("p23_ch3_done", "true");
              if (rew.chapterKey === "forever") localStorage.setItem("p23_ch4_done", "true");
            }
          }
        }
      } else {
        setState(getFallbackState());
      }
    } catch (e) {
      console.warn("Failed to load backend state, using fallback:", e);
      setState(getFallbackState());
    } finally {
      // Ensure the pew pew gif has enough time to show (~1.6s) then crossfade smoothly
      const elapsed = Date.now() - startTime;
      const minDuration = 1600;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(() => {
        setLoadingFadeOut(true);
        setTimeout(() => setLoading(false), 550);
      }, remaining);
    }
  }, []);

  useEffect(() => {
    let t = "";
    try {
      t = localStorage.getItem("p23_recipient_session") || "";
    } catch (e) {
      console.warn("Storage warning:", e);
    }

    if (!t) {
      t = `s_${crypto.randomUUID().replaceAll("-", "")}`;
      try {
        localStorage.setItem("p23_recipient_session", t);
      } catch {}
    }

    setToken(t);
    loadState(t);

    // Safety timeout
    const timer = setTimeout(() => {
      setState((prev) => prev || getFallbackState());
      setLoadingFadeOut(true);
      setTimeout(() => setLoading(false), 550);
    }, 2400);

    return () => clearTimeout(timer);
  }, [loadState]);

  const activeState = state || getFallbackState();

  const isCh1Done = Boolean(
    activeState.rewards.some((reward) => reward.chapterKey === "sweet")
  );
  const isCh2Done = Boolean(
    activeState.rewards.some((reward) => reward.chapterKey === "wild")
  );
  const isCh3Done = Boolean(
    activeState.rewards.some((reward) => reward.chapterKey === "fierce")
  );
  const isCh4Done = Boolean(
    activeState.rewards.some((reward) => reward.chapterKey === "forever")
  );

  const replayUnlocked = Boolean(
    activeState.replayMode || isReplayMode(activeState.effectiveDateFormatted)
  );
  const requestedChapter = chapOverride ?? replayChapter;
  const isLockedBeforeSept20 = Boolean(!requestedChapter && activeState?.isPrelude);

  let experienceContent: ReactNode = null;
  if (token && replayUnlocked && !requestedChapter) {
    experienceContent = (
      <ReplayLibrary
        onSelect={setReplayChapter}
      />
    );
  } else if (token && isLockedBeforeSept20) {
    experienceContent = (
      <HandcraftedChapter01
        initialSessionId={token}
        initialCompleted={false}
        isLocked={true}
        onRefreshState={() => loadState(token)}
      />
    );
  } else if (token && !requestedChapter && !isCh1Done) {
    experienceContent = (
      <HandcraftedChapter01
        initialSessionId={token}
        initialCompleted={false}
        isLocked={false}
        onRefreshState={() => loadState(token)}
      />
    );
  } else if (token && (requestedChapter === "4" || (!requestedChapter && activeState.activeChapterKey === "forever" && isCh3Done))) {
    experienceContent = (
      <HandcraftedChapter04
        key={`chapter-4-${requestedChapter ? "replay" : "scheduled"}`}
        initialSessionId={token}
        initialCompleted={requestedChapter ? false : isCh4Done}
        onRefreshState={() => loadState(token)}
      />
    );
  } else if (token && (requestedChapter === "3" || (!requestedChapter && (activeState.activeChapterKey === "fierce" || activeState.activeChapterKey === "forever") && isCh2Done))) {
    experienceContent = (
      <HandcraftedChapter03
        key={`chapter-3-${requestedChapter ? "replay" : "scheduled"}`}
        initialSessionId={token}
        initialCompleted={requestedChapter ? false : isCh3Done}
        replayMode={replayUnlocked}
        onRefreshState={() => loadState(token)}
      />
    );
  } else if (token && (requestedChapter === "2" || (!requestedChapter && (activeState.activeChapterKey === "wild" || activeState.activeChapterKey === "fierce" || activeState.activeChapterKey === "forever") && isCh1Done))) {
    experienceContent = (
      <HandcraftedChapter02
        key={`chapter-2-${requestedChapter ? "replay" : "scheduled"}`}
        initialSessionId={token}
        initialCompleted={requestedChapter ? false : isCh2Done}
        replayMode={replayUnlocked}
        onRefreshState={() => loadState(token)}
      />
    );
  } else if (token) {
    experienceContent = (
      <HandcraftedChapter01
        key={`chapter-1-${requestedChapter ? "replay" : "scheduled"}`}
        initialSessionId={token}
        initialCompleted={requestedChapter ? false : isCh1Done}
        isLocked={false}
        replayMode={replayUnlocked}
        onRefreshState={() => loadState(token)}
      />
    );
  }

  return (
    <ErrorBoundary>
      <main className="recipient-experience" style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: replayUnlocked && !requestedChapter ? "pan-y" : "none",
        background: "transparent",
      }}>
        {experienceContent}

        {replayUnlocked && replayChapter && !chapOverride && (
          <button
            type="button"
            className="chapter-library-back"
            onClick={() => setReplayChapter(null)}
            aria-label="Back to all chapters"
            style={{
              position: "fixed",
              top: "max(env(safe-area-inset-top, 0px), 0.65rem)",
              left: "max(env(safe-area-inset-left, 0px), 0.65rem)",
              zIndex: 9000,
              minWidth: "44px",
              minHeight: "44px",
              padding: "0.55rem 0.8rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              border: "1px solid rgba(201,151,74,0.4)",
              borderRadius: "9999px",
              background: "rgba(14,11,9,0.82)",
              backdropFilter: "blur(8px)",
              color: "#E3BE7E",
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.78rem",
              fontStyle: "italic",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            }}
          >
            <span aria-hidden="true">←</span>
            chapters
          </button>
        )}
      </main>

      {/* Cinematic loading overlay with smooth crossfade */}
      {loading && (
        <div style={{
          position: "fixed",
          inset: 0,
          height: "100dvh",
          width: "100vw",
          overflow: "hidden",
          overscrollBehavior: "none",
          touchAction: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E0B09",
          padding: "1.5rem",
          boxSizing: "border-box",
          zIndex: 9999,
          opacity: loadingFadeOut ? 0 : 1,
          transition: "opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: loadingFadeOut ? "none" : "auto",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}>
            {/* Boa Hancock pew pew gif */}
            <img
              src="/assets/loading-pew-pew.gif"
              alt="loading pew pew"
              style={{
                width: "clamp(200px, 48vw, 290px)",
                height: "auto",
                borderRadius: "16px",
                marginBottom: "1.2rem",
                objectFit: "contain",
                filter: "drop-shadow(0 6px 24px rgba(201,151,74,0.15))",
              }}
            />
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.75rem, 2vw, 0.92rem)",
              letterSpacing: "0.15em",
              fontStyle: "italic",
              color: "#C9974A",
              margin: 0,
              animation: "gentlePulse 2s ease-in-out infinite",
            }}>
              loading pew pew.....
            </p>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
