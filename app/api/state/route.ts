import { NextRequest, NextResponse } from "next/server";
import { safeErrorResponse, validSessionToken } from "@/lib/api-validation";
import { readDateOverride } from "@/lib/admin-auth";
import { effectiveDateForRequest } from "@/lib/chapter-access";
import { formatIndiaDate, getActiveChapterKey } from "@/lib/chapters";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionToken = validSessionToken(searchParams.get("session"));
    const effectiveDateObj = effectiveDateForRequest(req);
    const effectiveDateStr = formatIndiaDate(effectiveDateObj);
    const simulatedDate = readDateOverride(req);

    const activeChapterKey = getActiveChapterKey(effectiveDateStr);
    const isPrelude = activeChapterKey === "prelude";
    const session = await prisma.recipientSession.upsert({
      where: { sessionToken },
      update: { lastActiveAt: new Date() },
      create: { sessionToken },
      include: {
        responses: { orderBy: { createdAt: "asc" } },
        rewards: { orderBy: { wonAt: "asc" } },
      },
    });

    return NextResponse.json({
      success: true,
      isPrelude,
      effectiveDate: effectiveDateObj.toISOString(),
      effectiveDateFormatted: effectiveDateStr,
      simulatedDate,
      activeChapterKey,
      session: { id: session.id, token: session.sessionToken },
      rewards: session.rewards,
      responses: session.responses,
      sweetReward: session.rewards.find((reward) => reward.chapterKey === "sweet") ?? null,
      experience: {
        title: "Project 23",
        recipientName: "Zaara",
        recipientNickname: "My Love",
      },
    });
  } catch (error: unknown) {
    const result = safeErrorResponse(error);
    return NextResponse.json({ success: false, error: result.message }, { status: result.status });
  }
}
