import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CHAPTERS = [
  { id: "ch1", chapterNumber: 1, title: "Chapter I", subtitle: "The Incident at 02:47", unlockDate: "2026-09-20T00:00:00.000Z", isCompleted: false },
  { id: "ch2", chapterNumber: 2, title: "Chapter II", subtitle: "The Case of the Sleepy Accomplice", unlockDate: "2026-09-21T00:00:00.000Z", isCompleted: false },
  { id: "ch3", chapterNumber: 3, title: "Chapter III", subtitle: "The Master Interrupter", unlockDate: "2026-09-22T00:00:00.000Z", isCompleted: false },
  { id: "ch4", chapterNumber: 4, title: "Chapter IV", subtitle: "The Birthday Grand Finale", unlockDate: "2026-09-23T00:00:00.000Z", isCompleted: false },
];

const FRAGMENTS = [
  { id: "fr1", fragmentNumber: 1, key: "fragment_1", title: "Fragment 01: Midnight Echo", isRecovered: true },
  { id: "fr2", fragmentNumber: 2, key: "fragment_2", title: "Fragment 02: Sleep Whispers", isRecovered: true },
  { id: "fr3", fragmentNumber: 3, key: "fragment_3", title: "Fragment 03: The Stolen Laughter", isRecovered: true },
  { id: "fr4", fragmentNumber: 4, key: "fragment_4", title: "Fragment 04: Golden Thread", isRecovered: true },
];

export async function GET(req: NextRequest) {
  try {
    const pin = req.headers.get("x-creator-pin");
    const expectedPin = "2309";
    if (pin !== expectedPin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid Passkey" },
        { status: 401 }
      );
    }

    const simDate = req.cookies.get("p23_simulated_date")?.value || null;

    return NextResponse.json({
      success: true,
      experience: { slug: "september23", title: "Project 23" },
      simulatedDate: simDate,
      chapters: CHAPTERS,
      fragments: FRAGMENTS,
      sessions: [],
      rewards: [],
      responses: [],
    });
  } catch (error: any) {
    console.error("Error in /api/admin/data:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
