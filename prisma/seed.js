const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Project 23 Experience Data...");

  // Seed Experience
  const exp = await prisma.experience.upsert({
    where: { slug: "september23" },
    update: {},
    create: {
      slug: "september23",
      title: "Project 23 — The Five Fragments",
      recipientName: "Her",
      recipientNickname: "My Love",
      preludeStartDate: new Date("2026-09-15T00:00:00.000Z"),
      birthdayDate: new Date("2026-09-23T00:00:00.000Z"),
      simulatedDate: null,
      status: "ACTIVE",
    },
  });

  // Seed Chapters
  const chapters = [
    {
      chapterNumber: 1,
      key: "sweet",
      title: "Chapter 01",
      subtitle: "The Sweet Machine",
      persona: "The Sweet",
      unlockDate: new Date("2026-09-19T00:00:00.000Z"),
      themeColor: "#C4975D",
      summary: "Warmth, tenderness & the gentle spark",
    },
    {
      chapterNumber: 2,
      key: "wild",
      title: "Chapter 02",
      subtitle: "The Untamed Flame",
      persona: "The Wild",
      unlockDate: new Date("2026-09-20T00:00:00.000Z"),
      themeColor: "#E28B96",
      summary: "Unfiltered fire & spirited laughter",
    },
    {
      chapterNumber: 3,
      key: "curious",
      title: "Chapter 03",
      subtitle: "The Hidden Map",
      persona: "The Mind",
      unlockDate: new Date("2026-09-21T00:00:00.000Z"),
      themeColor: "#7AA2F7",
      summary: "Inside thoughts & unspoken secrets",
    },
    {
      chapterNumber: 4,
      key: "anchor",
      title: "Chapter 04",
      subtitle: "The Safe Sanctuary",
      persona: "The Safe Haven",
      unlockDate: new Date("2026-09-22T00:00:00.000Z"),
      themeColor: "#9ECE6A",
      summary: "Stillness & the comfort of home",
    },
    {
      chapterNumber: 5,
      key: "finale",
      title: "Chapter 05",
      subtitle: "The Whole Story",
      persona: "The Whole",
      unlockDate: new Date("2026-09-23T00:00:00.000Z"),
      themeColor: "#D4AF37",
      summary: "Convergence of all five fragments",
    },
  ];

  for (const ch of chapters) {
    await prisma.chapter.upsert({
      where: { key: ch.key },
      update: ch,
      create: ch,
    });
  }

  // Seed Fragments
  const fragments = [
    {
      fragmentNumber: 1,
      key: "sweet",
      name: "The Sweet",
      title: "Fragment I — The Sweet",
      quote: "Something sweet for someone sweeter.",
      symbolIcon: "Sparkles",
      accentColor: "#C4975D",
      isRecovered: false,
    },
    {
      fragmentNumber: 2,
      key: "wild",
      name: "The Wild",
      title: "Fragment II — The Wild",
      quote: "The flame that makes the world vivid.",
      symbolIcon: "Flame",
      accentColor: "#E28B96",
      isRecovered: false,
    },
    {
      fragmentNumber: 3,
      key: "curious",
      name: "The Mind",
      title: "Fragment III — The Mind",
      quote: "The quiet depth behind every glance.",
      symbolIcon: "Compass",
      accentColor: "#7AA2F7",
      isRecovered: false,
    },
    {
      fragmentNumber: 4,
      key: "anchor",
      name: "The Safe Haven",
      title: "Fragment IV — The Safe Haven",
      quote: "Home is not a place. It is a presence.",
      symbolIcon: "Anchor",
      accentColor: "#9ECE6A",
      isRecovered: false,
    },
    {
      fragmentNumber: 5,
      key: "finale",
      name: "The Whole",
      title: "Fragment V — The Whole",
      quote: "It was never about the game. It was always how I see you.",
      symbolIcon: "Crown",
      accentColor: "#D4AF37",
      isRecovered: false,
    },
  ];

  for (const fr of fragments) {
    await prisma.fragment.upsert({
      where: { key: fr.key },
      update: fr,
      create: fr,
    });
  }

  // Seed Settings
  await prisma.systemSetting.upsert({
    where: { key: "CREATOR_PIN" },
    update: {},
    create: {
      key: "CREATOR_PIN",
      value: "2309",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
