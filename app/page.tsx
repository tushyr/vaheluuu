"use client";

import React, { Component, ErrorInfo, ReactNode, useCallback, useEffect, useState } from "react";
import HandcraftedChapter01 from "@/components/chapters/chapter01/HandcraftedChapter01";
import HandcraftedChapter02 from "@/components/chapters/chapter02/HandcraftedChapter02";
import HandcraftedChapter03 from "@/components/chapters/chapter03/HandcraftedChapter03";
import HandcraftedChapter04 from "@/components/chapters/chapter04/HandcraftedChapter04";

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
  responses: ResponseState[];
  rewards: RewardState[];
  sweetReward: RewardState | null;
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

  const isLockedBeforeSept20 = Boolean(!chapOverride && activeState?.isPrelude);

  return (
    <ErrorBoundary>
      <main style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        width: "100vw",
        overflow: "hidden",
        overscrollBehavior: "none",
        touchAction: "none",
        background: "transparent",
      }}>
        {token && ((!chapOverride && isLockedBeforeSept20) ? (
          <HandcraftedChapter01
            initialSessionId={token}
            initialCompleted={false}
            isLocked={true}
            onRefreshState={() => loadState(token)}
          />
        ) : (!chapOverride && !isCh1Done) ? (
          <HandcraftedChapter01
            initialSessionId={token}
            initialCompleted={isCh1Done}
            isLocked={false}
            onRefreshState={() => loadState(token)}
          />
        ) : (chapOverride === "4" || (activeState?.activeChapterKey === "forever" && isCh3Done)) ? (
          <HandcraftedChapter04
            initialSessionId={token}
            initialCompleted={isCh4Done}
            onRefreshState={() => loadState(token)}
          />
        ) : (chapOverride === "3" || ((activeState?.activeChapterKey === "fierce" || activeState?.activeChapterKey === "forever") && isCh2Done)) ? (
          <HandcraftedChapter03
            initialSessionId={token}
            initialCompleted={isCh3Done}
            onRefreshState={() => loadState(token)}
          />
        ) : (chapOverride === "2" || ((activeState?.activeChapterKey === "wild" || activeState?.activeChapterKey === "fierce" || activeState?.activeChapterKey === "forever") && isCh1Done)) ? (
          <HandcraftedChapter02
            initialSessionId={token}
            initialCompleted={isCh2Done}
            onRefreshState={() => loadState(token)}
          />
        ) : (
          <HandcraftedChapter01
            initialSessionId={token}
            initialCompleted={isCh1Done}
            isLocked={false}
            onRefreshState={() => loadState(token)}
          />
        ))}
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
