export const CHAPTERS = [
  {
    key: "sweet",
    responseKey: "incident",
    chapterNumber: 1,
    title: "Chapter I",
    subtitle: "The Incident at 02:47",
    unlockDate: "2026-09-20",
    answerPattern: /^A[1-3]$/,
  },
  {
    key: "wild",
    responseKey: "sleepy",
    chapterNumber: 2,
    title: "Chapter II",
    subtitle: "The Case of the Sleepy Accomplice",
    unlockDate: "2026-09-21",
    answerPattern: /^B[1-3]$/,
  },
  {
    key: "fierce",
    responseKey: "interrupter",
    chapterNumber: 3,
    title: "Chapter III",
    subtitle: "The Master Interrupter",
    unlockDate: "2026-09-22",
    answerPattern: /^C[1-3]$/,
  },
  {
    key: "forever",
    responseKey: "cover-up",
    chapterNumber: 4,
    title: "Chapter IV",
    subtitle: "The Birthday Grand Finale",
    unlockDate: "2026-09-23",
    answerPattern: /^D[1-3]$/,
  },
] as const;

export type ChapterKey = (typeof CHAPTERS)[number]["key"];

export const REPLAY_UNLOCK_DATE = "2026-09-24";

export const CHAPTER_GIFTS: Record<ChapterKey, {
  id: string;
  label: string;
  isPhysical: boolean;
  physicalGiftName: string;
}> = {
  sweet: { id: "lindor", label: "Lindor", isPhysical: true, physicalGiftName: "Lindor chocolate box" },
  wild: { id: "powerbank", label: "Power Bank", isPhysical: true, physicalGiftName: "Power bank" },
  fierce: { id: "youtube", label: "YouTube Premium", isPhysical: false, physicalGiftName: "YouTube Premium 1yr" },
  forever: { id: "mystery", label: "Mystery Gift", isPhysical: true, physicalGiftName: "In-person mystery gift" },
};

export function normalizeChapterKey(value: unknown): ChapterKey | null {
  if (typeof value !== "string") return null;
  const chapter = CHAPTERS.find((item) => item.key === value || item.responseKey === value);
  return chapter?.key ?? null;
}

export function getChapter(key: ChapterKey) {
  return CHAPTERS.find((chapter) => chapter.key === key)!;
}

export function formatIndiaDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getActiveChapterKey(effectiveDate: string): ChapterKey | "prelude" {
  let active: ChapterKey | "prelude" = "prelude";
  for (const chapter of CHAPTERS) {
    if (effectiveDate >= chapter.unlockDate) active = chapter.key;
  }
  return active;
}

export function isReplayMode(effectiveDate: string): boolean {
  return effectiveDate >= REPLAY_UNLOCK_DATE;
}

export function isChapterAvailable(target: ChapterKey, active: ChapterKey | "prelude"): boolean {
  if (active === "prelude") return false;
  return getChapter(target).chapterNumber <= getChapter(active).chapterNumber;
}

export function isValidAnswer(chapterKey: ChapterKey, answer: string): boolean {
  return getChapter(chapterKey).answerPattern.test(answer);
}

export function previousChapterKey(chapterKey: ChapterKey): ChapterKey | null {
  const chapter = getChapter(chapterKey);
  return CHAPTERS.find((candidate) => candidate.chapterNumber === chapter.chapterNumber - 1)?.key ?? null;
}
