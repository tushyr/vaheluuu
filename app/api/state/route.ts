import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CHAPTER_SCHEDULE: { key: string; date: string }[] = [
  { key: "sweet",   date: "2026-09-20" },
  { key: "wild",    date: "2026-09-21" },
  { key: "fierce",  date: "2026-09-22" },
  { key: "forever", date: "2026-09-23" },
];

function getActiveChapterKey(effectiveDateStr: string): string {
  let active = "sweet";
  for (const ch of CHAPTER_SCHEDULE) {
    if (effectiveDateStr >= ch.date) active = ch.key;
  }
  return active;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionToken = searchParams.get("session") || "default_guest";
    const simDateCookie = req.cookies.get("p23_simulated_date")?.value;
    const simDateParam = searchParams.get("simDate");
    const simulatedDate = simDateParam || simDateCookie || null;

    const effectiveDateObj = simulatedDate ? new Date(simulatedDate) : new Date();

    const effectiveDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(effectiveDateObj);

    const isPrelude = effectiveDateStr < "2026-09-20";
    const activeChapterKey = isPrelude ? "prelude" : getActiveChapterKey(effectiveDateStr);

    return NextResponse.json({
      success: true,
      isPrelude,
      effectiveDate: effectiveDateObj.toISOString(),
      effectiveDateFormatted: effectiveDateStr,
      simulatedDate,
      activeChapterKey,
      session: {
        id: sessionToken,
        token: sessionToken,
        responses: [],
        rewards: [],
      },
      rewards: [],
      responses: [],
      sweetReward: null,
      experience: {
        title: "Project 23",
        recipientName: "Zaara",
        recipientNickname: "My Love",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
