import { NextRequest, NextResponse } from "next/server";
import { asObject, ApiError, safeErrorResponse, validSessionToken } from "@/lib/api-validation";
import { assertChapterAccess } from "@/lib/chapter-access";
import { CHAPTER_GIFTS, normalizeChapterKey } from "@/lib/chapters";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = asObject(await req.json());
    const sessionToken = validSessionToken(body.sessionId);
    const chapterKey = normalizeChapterKey(body.chapterKey);
    if (!chapterKey) throw new ApiError("Invalid chapterKey.", 400);

    const session = await prisma.recipientSession.upsert({
      where: { sessionToken },
      update: { lastActiveAt: new Date() },
      create: { sessionToken },
    });
    await assertChapterAccess(req, session.id, chapterKey);

    const recordedAnswer = await prisma.recipientResponse.findFirst({
      where: { sessionId: session.id, chapterKey },
      select: { id: true },
    });
    if (!recordedAnswer) throw new ApiError("Answer the chapter question before completing it.", 409);

    const gift = CHAPTER_GIFTS[chapterKey];
    const rewardRecord = await prisma.rewardRecord.upsert({
      where: { sessionId_chapterKey: { sessionId: session.id, chapterKey } },
      update: {},
      create: {
        sessionId: session.id,
        chapterKey,
        rewardKey: gift.id,
        rewardTitle: gift.label,
        rewardType: gift.isPhysical ? "PHYSICAL" : "DIGITAL",
        isPhysicalGift: gift.isPhysical,
        physicalGiftDescription: gift.physicalGiftName,
      },
    });

    return NextResponse.json({
      success: true,
      reward: gift,
      recordId: rewardRecord.id,
    });
  } catch (error: unknown) {
    const result = safeErrorResponse(error);
    return NextResponse.json(
      { success: false, error: result.message },
      { status: result.status },
    );
  }
}
