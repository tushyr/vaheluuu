-- CreateTable
CREATE TABLE "RecipientSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lastActiveAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RecipientResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "chapterKey" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "chosenAnswer" TEXT NOT NULL,
    "score" INTEGER DEFAULT 0,
    "metadataJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RecipientResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RecipientSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RewardRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "chapterKey" TEXT NOT NULL,
    "rewardKey" TEXT NOT NULL,
    "rewardTitle" TEXT NOT NULL,
    "rewardType" TEXT NOT NULL DEFAULT 'PHYSICAL',
    "isPhysicalGift" BOOLEAN NOT NULL DEFAULT true,
    "physicalGiftDescription" TEXT,
    "fulfillmentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "creatorNotes" TEXT,
    "wonAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RewardRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RecipientSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipientSession_sessionToken_key" ON "RecipientSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "RecipientResponse_sessionId_chapterKey_questionKey_key" ON "RecipientResponse"("sessionId", "chapterKey", "questionKey");

-- CreateIndex
CREATE UNIQUE INDEX "RewardRecord_sessionId_chapterKey_key" ON "RewardRecord"("sessionId", "chapterKey");
