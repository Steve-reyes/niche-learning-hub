import { PrismaClient } from "@prisma/client";
import { niches } from "./src/lib/data";
import crypto from "node:crypto";

function hash(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const count = await prisma.niche.count();
  if (count > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  await prisma.admin.create({
    data: { username: "admin", password: hash("admin123") },
  });
  console.log("  Admin created: admin");

  await prisma.user.create({
    data: { username: "demo", email: "demo@example.com", password: hash("demo123") },
  });
  console.log("  Demo user created: demo");

  for (const niche of niches) {
    const created = await prisma.niche.create({
      data: {
        id: niche.id,
        name: niche.n,
        icon: niche.icon,
        color: niche.c,
        tag: niche.tag,
        resources: {
          create: niche.res.map((r: any) => ({
            title: r.t,
            platform: r.p,
            duration: r.d,
            category: r.cat,
            level: r.lv,
            url: r.u,
            description: r.desc,
            cost: r.cost ?? "",
            bestPick: r.bp ?? 0,
          })),
        },
      },
    });
    console.log(`  Niche "${created.name}" → ${niche.res.length} resources`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
