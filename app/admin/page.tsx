"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  Gift,
  MessageSquare,
  Sparkles,
  RefreshCw,
  CheckCircle,
  ArrowLeft,
  Sliders,
} from "lucide-react";

interface AdminReward {
  id: string;
  chapterKey: string;
  rewardTitle: string;
  physicalGiftDescription: string | null;
  fulfillmentStatus: string;
  creatorNotes: string | null;
  wonAt: string;
}

interface AdminResponse {
  id: string;
  chapterKey: string;
  moduleId: string;
  questionText: string;
  chosenAnswer: string;
  createdAt: string;
}

interface AdminFragment {
  id: string;
  key: string;
  title: string;
  isRecovered: boolean;
}

interface AdminChapter {
  id: string;
  title: string;
  subtitle: string;
  unlockDate: string;
  isCompleted: boolean;
}

interface AdminData {
  simulatedDate: string | null;
  rewards: AdminReward[];
  responses: AdminResponse[];
  fragments: AdminFragment[];
  chapters: AdminChapter[];
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchAdminData = useCallback(async (showError = true) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminData(data);
        setIsAuthenticated(true);
      } else {
        if (showError) setErrorMsg(data.error || "Your admin session has expired.");
        setIsAuthenticated(false);
      }
    } catch {
      setErrorMsg("Network error fetching admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData(false);
  }, [fetchAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMsg(data.error || "Unable to authenticate.");
        return;
      }
      setSecret("");
      await fetchAdminData();
    } catch {
      setErrorMsg("Network error while authenticating.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAdminData(null);
    setIsAuthenticated(false);
  };

  const handleSimulateDate = async (isoDate: string | null) => {
    try {
      const res = await fetch("/api/admin/override-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateString: isoDate }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(
          isoDate
            ? `Active date simulated to: ${isoDate.split("T")[0]}`
            : "Reset to actual real-time date."
        );
        fetchAdminData();
        setTimeout(() => setStatusMessage(""), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateFulfillment = async (
    recordId: string,
    newStatus: string
  ) => {
    try {
      const res = await fetch("/api/admin/update-gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId,
          fulfillmentStatus: newStatus,
        }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Login Gate View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel-gold border border-caramel-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amberGold-500/10 border border-amberGold-400/40 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-amberGold-400" />
          </div>

          <div>
            <span className="text-[10px] font-mono-code uppercase tracking-widest text-caramel-400">
              Project 23 • Private Portal
            </span>
            <h1 className="text-2xl font-serif-title font-bold text-cream-50 mt-1">
              Creator Dashboard
            </h1>
            <p className="text-xs text-cream-200/70 mt-1">
              Enter the admin secret configured for this deployment.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Admin secret"
                className="w-full text-center px-4 py-3.5 rounded-2xl bg-black/50 border border-white/15 text-cream-50 font-mono-code text-lg tracking-[0.3em] focus:border-amberGold-400 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rosewood-400 font-mono-code">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !secret}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-caramel-500 via-amberGold-500 to-caramel-600 text-noir-950 font-cinzel font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-cream-200/50 hover:text-cream-50 font-mono-code transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Recipient View</span>
          </Link>
        </div>
      </div>
    );
  }

  const simulatedDateFormatted = adminData?.simulatedDate
    ? adminData.simulatedDate.split("T")[0]
    : "Real-Time (Default)";

  return (
    <div className="min-h-screen w-full px-4 sm:px-8 py-10 max-w-6xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            <span className="text-[11px] font-mono-code uppercase tracking-widest text-caramel-400">
              Live Command Center
            </span>
          </div>
          <h1 className="text-3xl font-serif-title font-bold text-cream-50 mt-1">
            Project 23 — Creator Dashboard
          </h1>
          <p className="text-xs text-cream-200/70 font-mono-code mt-0.5">
            Monitoring progress, responses & physical gift fulfillment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl glass-panel border border-white/10 hover:border-caramel-400/40 text-xs font-mono-code text-cream-100 transition-colors"
          >
            Open Recipient View ↗
          </Link>
          <button
            onClick={() => fetchAdminData()}
            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-caramel-400/40 text-cream-100 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl glass-panel border border-white/10 hover:border-rosewood-400/40 text-xs text-cream-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-2xl bg-amberGold-500/10 border border-amberGold-400/30 text-amberGold-400 text-xs font-mono-code flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* SECTION 1: TIME TRAVEL / DATE SIMULATOR */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold border border-amberGold-400/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-amberGold-400" />
            <div>
              <h3 className="text-base font-serif font-bold text-cream-50">
                Time Machine / Date Simulator
              </h3>
              <p className="text-xs text-cream-200/70 font-mono-code">
                Simulate the website on specific dates to preview the Prelude or Chapter unlocks.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-black/50 border border-amberGold-400/40 text-xs font-mono-code text-amberGold-400">
            Current Simulated Date: {simulatedDateFormatted}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {[
            { label: "19 Sep (Teaser)", date: "2026-09-19T12:00:00.000Z" },
            { label: "20 Sep (Ch 1 Incident)", date: "2026-09-20T12:00:00.000Z" },
            { label: "21 Sep (Ch 2 Sleepy)", date: "2026-09-21T12:00:00.000Z" },
            { label: "22 Sep (Ch 3 Interrupter)", date: "2026-09-22T12:00:00.000Z" },
            { label: "23 Sep (Ch 4 Birthday)", date: "2026-09-23T12:00:00.000Z" },
            { label: "↺ Reset Real-Time", date: null },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulateDate(preset.date)}
              className="px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-amberGold-400/50 text-[11px] font-mono-code text-cream-200 hover:text-amberGold-400 transition-all text-center"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: PHYSICAL GIFT FULFILLMENT DECK */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Gift className="w-5 h-5 text-amberGold-400" />
          <div>
            <h3 className="text-lg font-serif font-bold text-cream-50">
              Gift Fulfillment Tracker
            </h3>
            <p className="text-xs text-cream-200/70 font-mono-code">
              What did she win? Track purchase and delivery status for physical gifts.
            </p>
          </div>
        </div>

        {adminData?.rewards?.length === 0 ? (
          <p className="text-xs font-mono-code text-white/40 italic py-4">
            No rewards won yet. Once she spins the Sweet Machine, the result will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {adminData?.rewards?.map((rew) => (
              <div
                key={rew.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-caramel-500/20 text-caramel-400 text-[10px] font-mono-code uppercase">
                      {rew.chapterKey}
                    </span>
                    <h4 className="text-sm sm:text-base font-serif font-bold text-cream-50">
                      {rew.physicalGiftDescription || rew.rewardTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-cream-200/60 font-mono-code">
                    Won on: {new Date(rew.wonAt).toLocaleString()}
                  </p>
                  {rew.creatorNotes && (
                    <p className="text-xs text-cream-100 font-serif italic">
                      Note: {rew.creatorNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {["PENDING", "ORDERED", "READY", "DELIVERED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateFulfillment(rew.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono-code font-bold uppercase transition-all ${
                        rew.fulfillmentStatus === st
                          ? st === "DELIVERED"
                            ? "bg-green-500 text-noir-950 shadow"
                            : "bg-amberGold-400 text-noir-950 shadow"
                          : "bg-white/5 text-white/40 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: RECIPIENT ANSWERS & CHOICES */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <MessageSquare className="w-5 h-5 text-rosewood-400" />
          <div>
            <h3 className="text-lg font-serif font-bold text-cream-50">
              Recipient Responses & Interaction Log
            </h3>
            <p className="text-xs text-cream-200/70 font-mono-code">
              Exact answers she chose during the experience.
            </p>
          </div>
        </div>

        {adminData?.responses?.length === 0 ? (
          <p className="text-xs font-mono-code text-white/40 italic py-4">
            No question responses recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {adminData?.responses?.map((resp) => (
              <div
                key={resp.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code uppercase text-caramel-400">
                    {resp.chapterKey} • {resp.moduleId}
                  </span>
                  <span className="text-[10px] font-mono-code text-white/40">
                    {new Date(resp.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs font-serif text-cream-200/80">
                  Q: {resp.questionText}
                </p>
                <p className="text-sm font-serif font-bold text-amberGold-400">
                  Chosen Answer: Option {resp.chosenAnswer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: FRAGMENTS & CHAPTERS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fragments */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h4 className="text-sm font-cinzel font-bold text-cream-50 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amberGold-400" />
            <span>Fragments Archive State</span>
          </h4>
          <div className="space-y-2">
            {adminData?.fragments?.map((fr) => (
              <div
                key={fr.id}
                className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-serif font-semibold text-cream-100 block">
                    {fr.title}
                  </span>
                  <span className="text-[10px] font-mono-code text-white/40">
                    Key: {fr.key}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                    fr.isRecovered
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {fr.isRecovered ? "✓ Recovered" : "Locked"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h4 className="text-sm font-cinzel font-bold text-cream-50 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-caramel-400" />
            <span>Chapters Timeline</span>
          </h4>
          <div className="space-y-2">
            {adminData?.chapters?.map((ch) => (
              <div
                key={ch.id}
                className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-serif font-semibold text-cream-100 block">
                    {ch.title} — {ch.subtitle}
                  </span>
                  <span className="text-[10px] font-mono-code text-caramel-400/80">
                    Unlocks: {ch.unlockDate?.split("T")[0]}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase ${
                    ch.isCompleted
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  {ch.isCompleted ? "Completed" : "Scheduled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
