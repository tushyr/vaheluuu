const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function reset() {
  console.log("Resetting database state for fresh testing...");
  
  // Delete children before their parent sessions.
  await prisma.rewardRecord.deleteMany({});
  await prisma.recipientResponse.deleteMany({});
  await prisma.recipientSession.deleteMany({});

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
