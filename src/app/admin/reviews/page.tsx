import { getPendingReviews } from "@/actions/admin.actions";
import { AdminReviewModeration } from "@/components/AdminReviewModeration";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default async function AdminReviewsPage() {
  const reviews = await getPendingReviews();
  return (
    <div>
      <Breadcrumbs items={[{ label: "Reviews" }]} />
      <h1 className="text-3xl font-semibold text-primary">Review moderation</h1>
      <p className="mt-2 text-sm text-muted-foreground">Approve useful, safe feedback before it appears publicly.</p>
      <div className="mt-8">
        <AdminReviewModeration reviews={reviews as any} />
      </div>
    </div>
  );
}
