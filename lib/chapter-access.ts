import "server-only";

import type { NextRequest } from "next/server";
import { readDateOverride } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api-validation";
import {
  formatIndiaDate,
  getActiveChapterKey,
  isChapterAvailable,
  previousChapterKey,
  type ChapterKey,
} from "@/lib/chapters";
import { prisma } from "@/lib/db";

export function effectiveDateForRequest(request: NextRequest): Date {
  const override = readDateOverride(request);
  if (!override) return new Date();
  const date = new Date(override);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export async function assertChapterAccess(
  request: NextRequest,
  sessionId: string,
  chapterKey: ChapterKey,
): Promise<void> {
  const active = getActiveChapterKey(formatIndiaDate(effectiveDateForRequest(request)));
  if (!isChapterAvailable(chapterKey, active)) {
    throw new ApiError("This chapter is not available yet.", 403);
  }

  const previous = previousChapterKey(chapterKey);
  if (!previous) return;

  const priorReward = await prisma.rewardRecord.findUnique({
    where: { sessionId_chapterKey: { sessionId, chapterKey: previous } },
    select: { id: true },
  });
  if (!priorReward) throw new ApiError("Complete the previous chapter first.", 409);
}
