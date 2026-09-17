"use client";

import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from "react";
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
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [chapOverride, setChapOverride] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("chap");
      if (c) setChapOverride(c);
    }
  }, []);

  const getFallbackState = () => {
    let nowIST = "2026-09-18";
    try {
      nowIST = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
    } catch (_) {}

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
      recoveredKeys: [],
      sweetReward: null,
    };
  };

  const loadState = async (sessionToken: string) => {
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
      // Ensure the pew pew gif has enough time to show (~1.6s)
      const elapsed = Date.now() - startTime;
      const minDuration = 1600;
      if (elapsed < minDuration) {
        setTimeout(() => setLoading(false), minDuration - elapsed);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let t = "";
    try {
      t = localStorage.getItem("p23_recipient_session") || "";
    } catch (e) {
      console.warn("Storage warning:", e);
    }

    if (!t) {
      t = "s_" + Math.random().toString(36).slice(2, 10);
      try {
        localStorage.setItem("p23_recipient_session", t);
      } catch (e) {}
    }

    setToken(t);
    loadState(t);

    // Safety timeout
    const timer = setTimeout(() => {
      setLoading(false);
      setState((prev: any) => prev || getFallbackState());
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !state) {
    return (
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
    );
  }

  const isCh1Done = Boolean(
    state?.rewards?.some((r: any) => r.chapterKey === "sweet") ||
    (typeof window !== "undefined" && localStorage.getItem("p23_ch1_done") === "true")
  );
  const isCh2Done = Boolean(
    state?.rewards?.some((r: any) => r.chapterKey === "wild") ||
    (typeof window !== "undefined" && localStorage.getItem("p23_ch2_done") === "true")
  );
  const isCh3Done = Boolean(
    state?.rewards?.some((r: any) => r.chapterKey === "fierce") ||
    (typeof window !== "undefined" && localStorage.getItem("p23_ch3_done") === "true")
  );
  const isCh4Done = Boolean(
    state?.rewards?.some((r: any) => r.chapterKey === "forever") ||
    (typeof window !== "undefined" && localStorage.getItem("p23_ch4_done") === "true")
  );

  const isLockedBeforeSept20 = Boolean(!chapOverride && state?.isPrelude);

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
        {(!chapOverride && isLockedBeforeSept20) ? (
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
            initialReward={state?.sweetReward}
            isLocked={false}
            onRefreshState={() => loadState(token)}
          />
        ) : (chapOverride === "4" || (state?.activeChapterKey === "forever" && isCh3Done)) ? (
          <HandcraftedChapter04
            initialSessionId={token}
            initialCompleted={isCh4Done}
            onRefreshState={() => loadState(token)}
          />
        ) : (chapOverride === "3" || ((state?.activeChapterKey === "fierce" || state?.activeChapterKey === "forever") && isCh2Done)) ? (
          <HandcraftedChapter03
            initialSessionId={token}
            initialCompleted={isCh3Done}
            onRefreshState={() => loadState(token)}
          />
        ) : (chapOverride === "2" || ((state?.activeChapterKey === "wild" || state?.activeChapterKey === "fierce" || state?.activeChapterKey === "forever") && isCh1Done)) ? (
          <HandcraftedChapter02
            initialSessionId={token}
            initialCompleted={isCh2Done}
            onRefreshState={() => loadState(token)}
          />
        ) : (
          <HandcraftedChapter01
            initialSessionId={token}
            initialCompleted={isCh1Done}
            initialReward={state?.sweetReward}
            isLocked={false}
            onRefreshState={() => loadState(token)}
          />
        )}
      </main>
    </ErrorBoundary>
  );
}
