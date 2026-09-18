import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest, readDateOverride } from "@/lib/admin-auth";
import { CHAPTERS } from "@/lib/chapters";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const simDate = readDateOverride(req);
    const [sessions, rewards, responses] = await prisma.$transaction([
      prisma.recipientSession.findMany({
        select: { id: true, createdAt: true, lastActiveAt: true },
        orderBy: { lastActiveAt: "desc" },
      }),
      prisma.rewardRecord.findMany({ orderBy: { wonAt: "desc" } }),
      prisma.recipientResponse.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    const recovered = new Set(rewards.map((reward) => reward.chapterKey));
    const chapters = CHAPTERS.map((chapter) => ({
      id: `ch${chapter.chapterNumber}`,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      subtitle: chapter.subtitle,
      unlockDate: `${chapter.unlockDate}T00:00:00.000Z`,
      isCompleted: recovered.has(chapter.key),
    }));
    const fragments = CHAPTERS.map((chapter) => ({
      id: `fr${chapter.chapterNumber}`,
      fragmentNumber: chapter.chapterNumber,
      key: `fragment_${chapter.chapterNumber}`,
      title: `Fragment ${String(chapter.chapterNumber).padStart(2, "0")}: ${chapter.subtitle}`,
      isRecovered: recovered.has(chapter.key),
    }));

    return NextResponse.json({
      success: true,
      experience: { slug: "september23", title: "Project 23" },
      simulatedDate: simDate,
      chapters,
      fragments,
      sessions,
      rewards,
      responses,
    });
  } catch (error: unknown) {
    console.error("Error in /api/admin/data:", error);
    return NextResponse.json(
      { success: false, error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
