import { NextRequest, NextResponse } from "next/server";

const CHAPTER_GIFTS: Record<string, { id: string; label: string; isPhysical: boolean; physicalGiftName: string }> = {
  sweet:   { id: "lindor",    label: "Lindor",           isPhysical: true, physicalGiftName: "Lindor chocolate box" },
  wild:    { id: "powerbank", label: "Power Bank",        isPhysical: true, physicalGiftName: "Power bank" },
  fierce:  { id: "youtube",   label: "YouTube Premium",   isPhysical: false, physicalGiftName: "YouTube Premium 1yr" },
  forever: { id: "mystery",   label: "Mystery Gift",      isPhysical: true, physicalGiftName: "In-person mystery gift" },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chapterKey = "sweet" } = body;
    const gift = CHAPTER_GIFTS[chapterKey] ?? CHAPTER_GIFTS.sweet;

    return NextResponse.json({
      success: true,
      reward: gift,
      recordId: "gift_" + Date.now(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/chapter/spin:", msg);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

