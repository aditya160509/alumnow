"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function getSavedAlumni() {
  const session = await auth();
  if (!session?.user?.id) return [];
  const saved = await prisma.savedAlumni.findMany({
    where: { studentId: session.user.id },
    include: { alumni: { include: { sessionTypes: true, availability: true } } },
    orderBy: { createdAt: "desc" },
  });
  return saved.map((s) => ({
    ...s,
    alumni: {
      ...s.alumni,
      isSaved: true,
      languages: typeof s.alumni.languages === "string"
        ? JSON.parse(s.alumni.languages) as string[]
        : s.alumni.languages as string[],
    },
  }));
}
