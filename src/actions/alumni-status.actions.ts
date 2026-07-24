"use server";

import { getServerSession } from "@/lib/supabase-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type AlumniReviewStatus = {
  status: "missing" | "pending" | "approved" | "rejected";
  redirectTo: string;
};

function restHeaders(): HeadersInit {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export async function getCurrentAlumniReviewStatus(): Promise<AlumniReviewStatus> {
  const session = await getServerSession();
  if (!session?.user?.id || session.user.role !== "alumnus") {
    return { status: "missing", redirectTo: "/login" };
  }

  const params = new URLSearchParams({
    select: "verificationStatus",
    userId: `eq.${session.user.id}`,
    limit: "1",
  });
  const res = await fetch(`${supabaseUrl}/rest/v1/AlumniProfile?${params.toString()}`, {
    headers: restHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("getCurrentAlumniReviewStatus failed:", res.status, await res.text());
    return { status: "missing", redirectTo: "/alumni/application-under-review" };
  }

  const rows = await res.json() as { verificationStatus: string | null }[];
  const status = rows[0]?.verificationStatus?.toLowerCase();
  if (status === "approved") return { status, redirectTo: "/alumni/dashboard" };
  if (status === "rejected") return { status, redirectTo: "/alumni/application-under-review" };
  return { status: "pending", redirectTo: "/alumni/application-under-review" };
}
