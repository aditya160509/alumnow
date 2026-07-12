import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const configuredDatabaseUrl = process.env.DATABASE_URL;
const databaseUrl = process.env.VERCEL && (!configuredDatabaseUrl || configuredDatabaseUrl.startsWith("file:"))
  ? "file:/tmp/alumnow.db"
  : configuredDatabaseUrl ?? "file:./prisma/dev.db";

function sqlitePathFromUrl(url: string) {
  if (!url.startsWith("file:")) return null;
  const filePath = url.slice("file:".length);
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}

function bootstrapSqliteSchema(url: string) {
  const dbPath = sqlitePathFromUrl(url);
  if (!dbPath) return;

  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  try {
    const hasUserTable = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'User'").get();
    if (!hasUserTable) {
      const migrationPath = path.join(process.cwd(), "prisma", "migrations", "0001_foundation", "migration.sql");
      const migration = fs.readFileSync(migrationPath, "utf8");
      db.exec(migration);
    }
    ensureSqliteSchemaCompatibility(db);
    seedDemoAlumni(db);
  } finally {
    db.close();
  }
}

function ensureSqliteSchemaCompatibility(db: Database.Database) {
  const alumniColumns = db.prepare("PRAGMA table_info('AlumniProfile')").all() as { name: string }[];
  if (!alumniColumns.some((column) => column.name === "isActive")) {
    db.exec('ALTER TABLE "AlumniProfile" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true');
  }
}

function seedDemoAlumni(db: Database.Database) {
  const alumniCount = db.prepare('SELECT COUNT(*) as count FROM "AlumniProfile"').get() as { count: number };
  if (alumniCount.count > 0) return;

  const now = new Date().toISOString();
  const userId = "demo_alumni_aanya_user";
  const alumniId = "cmrhkuiqs00muoauf2f4v84rx";

  db.prepare(`
    INSERT INTO "User" ("id", "role", "email", "createdAt", "updatedAt", "emailVerifiedAt")
    VALUES (?, 'alumnus', 'aanya.das@alumnow.com', ?, ?, ?)
  `).run(userId, now, now, now);

  db.prepare(`
    INSERT INTO "AlumniProfile" (
      "id", "userId", "fullName", "profilePhotoUrl", "universityName", "course", "country",
      "graduationYearJbcn", "currentStudyLevel", "qsRankingTier", "bio", "languages",
      "verificationStatus", "avgResponseTimeHours", "isVerifiedJbcnAlumnus", "isActive",
      "ratingAvg", "ratingCount", "createdAt", "updatedAt"
    )
    VALUES (?, ?, 'Aanya Das', NULL, 'Columbia University', 'B.E. Civil Engineering', 'Sweden',
      2022, 'undergraduate', 'top50', 'JBCN alum helping students choose courses, applications, and student-life tradeoffs.',
      ?, 'approved', 2, true, true, 4.8, 18, ?, ?)
  `).run(alumniId, userId, JSON.stringify(["English", "Hindi"]), now, now);

  const insertOffering = db.prepare(`
    INSERT INTO "SessionTypeOffering" ("id", "alumniId", "type", "pricePaise", "maxParticipants", "descriptionOneLiner")
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  [
    ["demo_call_30_aanya", "call_30", 25791, 1, "In-depth conversation about your future"],
    ["demo_call_45_aanya", "call_45", 43693, 1, "In-depth conversation about your future"],
    ["demo_call_60_aanya", "call_60", 62939, 1, "In-depth conversation about your future"],
    ["demo_group_40_aanya", "group_40", 111357, 6, "Deep dive - comprehensive guidance"],
  ].forEach(([id, type, pricePaise, maxParticipants, description]) => {
    insertOffering.run(id, alumniId, type, pricePaise, maxParticipants, description);
  });

  const insertAvailability = db.prepare(`
    INSERT INTO "AlumniAvailability" ("id", "alumniId", "dayOfWeek", "startTime", "endTime", "isRecurring")
    VALUES (?, ?, ?, ?, ?, true)
  `);
  [
    [0, "13:00", "14:00"], [0, "14:00", "15:00"], [0, "15:00", "16:00"], [0, "16:00", "17:00"],
    [1, "08:00", "09:00"], [1, "09:00", "10:00"], [1, "10:00", "11:00"],
    [2, "13:00", "14:00"], [2, "14:00", "15:00"], [2, "15:00", "16:00"],
    [3, "08:00", "09:00"], [3, "09:00", "10:00"], [3, "10:00", "11:00"],
  ].forEach(([day, start, end], index) => {
    insertAvailability.run(`demo_aanya_availability_${index}`, alumniId, day, start, end);
  });
}

function createPrismaClient() {
  bootstrapSqliteSchema(databaseUrl);
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: databaseUrl }) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
