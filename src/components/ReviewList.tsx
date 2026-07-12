"use client";
import { useState, useCallback } from "react";
import { ReviewCard } from "./ReviewCard";
import { Button } from "@/components/ui/Button";
import { getReviews } from "@/actions/review.actions";

type ReviewItem = { id?: string; rating: number; text: string | null; reviewerName: string; createdAt: string };

export function ReviewList({
  reviews: initialReviews,
  totalPages: initialTotalPages,
  alumniId,
}: {
  reviews: ReviewItem[];
  totalPages: number;
  alumniId: string;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const hasMore = page < totalPages;

  const handleLoadMore = useCallback(async () => {
    setLoading(true);
    const nextPage = page + 1;
    const res = await getReviews(alumniId, nextPage);
    setReviews((prev) => [...prev, ...res.items]);
    setPage(nextPage);
    setTotalPages(res.totalPages);
    setLoading(false);
  }, [page, alumniId]);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-primary">What students say</h2>
      {reviews.length ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review, i) => (
              <ReviewCard key={review.id ?? `${review.reviewerName}-${review.createdAt}-${i}`} review={review} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" disabled={loading} onClick={handleLoadMore}>
                {loading ? "Loading\u2026" : "Show more"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No published reviews yet.
        </p>
      )}
    </section>
  );
}
