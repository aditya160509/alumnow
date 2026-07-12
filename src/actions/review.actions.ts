"use server";
import { prisma } from "@/lib/prisma";
export async function getReviews(alumniId: string, page = 1, pageSize = 6) {
  const where = { alumnusId: alumniId, moderationStatus: "approved" };
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({ where, include: { booking: { include: { student: { include: { studentProfile: true } } } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.review.count({ where }),
  ]);
  return { items: reviews.map((review) => ({ id: review.id, rating: review.rating, text: review.text, createdAt: review.createdAt.toISOString(), reviewerName: review.booking.student.studentProfile?.fullName?.split(" ")[0] ?? "Student" })), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
