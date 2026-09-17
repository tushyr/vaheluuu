const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function reset() {
  console.log("Resetting database state for fresh testing...");
  
  // 1. Delete all rewards, responses, sessions
  await prisma.rewardRecord.deleteMany({});
  await prisma.recipientResponse.deleteMany({});
  await prisma.recipientSession.deleteMany({});

  // 2. Reset fragment recovery states
  await prisma.fragment.updateMany({
    data: {
      isRecovered: false,
      recoveredAt: null,
    },
  });

  // 3. Reset chapter completion states
  await prisma.chapter.updateMany({
    data: {
      isCompleted: false,
      completedAt: null,
    },
  });

  console.log("Database successfully reset to pristine fresh state!");
}

reset()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
