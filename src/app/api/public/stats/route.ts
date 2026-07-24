import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  try {
    const stats = await prisma.platformStat.findMany({ where: { key: { in: ["alumni_count", "universities_count", "sessions_completed"] } }, orderBy: { key: "asc" } });
    const ratingAgg = await prisma.alumniProfile.aggregate({ _avg: { ratingAvg: true }, where: { verificationStatus: "approved" } });
    const alumniCount = Number(stats.find((s) => s.key === "alumni_count")?.value ?? 0);
    const sessionsCompleted = Number(stats.find((s) => s.key === "sessions_completed")?.value ?? 0);
    const universitiesCount = Number(stats.find((s) => s.key === "universities_count")?.value ?? 0);
    const avgRating = ratingAgg._avg.ratingAvg ?? null;
    return NextResponse.json({ alumniCount, sessionsCompleted, universitiesCount, avgRating }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch (e) {
    console.error("Stats API error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
