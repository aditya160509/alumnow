import { Skeleton } from "@/components/ui/Skeleton";

export default function AlumniProfileLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Skeleton className="h-52 w-full rounded-xl" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-20 w-full max-w-[65ch]" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-7 w-40" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          </div>
        </div>
        <aside>
          <div className="space-y-3">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </aside>
      </div>
    </main>
  );
}
