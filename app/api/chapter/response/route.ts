import { NextRequest, NextResponse } from "next/server";
import { asObject, ApiError, requiredString, safeErrorResponse, validSessionToken } from "@/lib/api-validation";
import { assertChapterAccess } from "@/lib/chapter-access";
import { isValidAnswer, normalizeChapterKey } from "@/lib/chapters";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = asObject(await req.json());
    const sessionToken = validSessionToken(body.sessionId);
    const chapterKey = normalizeChapterKey(body.chapterKey);
    if (!chapterKey) throw new ApiError("Invalid chapterKey.", 400);

    const moduleId = requiredString(body, "moduleId", 64);
    const questionKey = requiredString(body, "questionKey", 64);
    const questionText = requiredString(body, "questionText", 500);
    const chosenAnswer = requiredString(body, "chosenAnswer", 16);
    if (!isValidAnswer(chapterKey, chosenAnswer)) throw new ApiError("Invalid chosenAnswer.", 400);

    const session = await prisma.recipientSession.upsert({
      where: { sessionToken },
      update: { lastActiveAt: new Date() },
      create: { sessionToken },
    });
    await assertChapterAccess(req, session.id, chapterKey);

    const response = await prisma.recipientResponse.upsert({
      where: {
        sessionId_chapterKey_questionKey: {
          sessionId: session.id,
          chapterKey,
          questionKey,
        },
      },
      update: { moduleId, questionText, chosenAnswer },
      create: {
        sessionId: session.id,
        chapterKey,
        moduleId,
        questionKey,
        questionText,
        chosenAnswer,
      },
    });

    return NextResponse.json({ success: true, response });
  } catch (error: unknown) {
    const result = safeErrorResponse(error);
    return NextResponse.json(
      { success: false, error: result.message },
      { status: result.status },
    );
  }
}
