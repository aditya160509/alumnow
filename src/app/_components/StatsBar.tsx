"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/Skeleton";

type StatsResponse = { alumniCount: number; sessionsCompleted: number; universitiesCount: number; avgRating: number | null };

function Count({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{new Intl.NumberFormat("en-IN").format(count)}</>;
}

export function StatsBar() {
  const { data, isPending, isError, refetch } = useQuery<StatsResponse>({
    queryKey: ["public", "stats"],
    queryFn: async () => {
      const response = await fetch("/api/public/stats");
      if (!response.ok) throw new Error("Could not load stats");
      return response.json() as Promise<StatsResponse>;
    },
    staleTime: 300000,
  });

  const items = data
    ? [
        { value: data.alumniCount, label: "verified alumni" },
        { value: data.universitiesCount, label: "universities represented" },
        { value: data.sessionsCompleted, label: "conversations completed" },
      ]
    : [];

  return (
    <section className="bg-primary-dark px-6 py-24 text-white sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[.7fr_1.3fr] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-accent">A network with lived experience</p>
          <h2 className="mt-4 max-w-sm font-serif text-4xl leading-none sm:text-5xl">The numbers behind the conversations.</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {isPending
            ? [1, 2, 3].map((item) => <Skeleton key={item} className="h-20 bg-white/10" />)
            : isError
              ? <div className="border-l border-white/20 pl-5 text-sm text-white/65 sm:col-span-3">Unable to load the latest numbers. <button onClick={() => refetch()} className="ml-1 text-accent hover:underline">Try again</button></div>
              : items.map((item) => (
                <div key={item.label} className="border-l border-white/20 pl-5">
                  <p className="font-mono text-4xl tracking-tight text-white"><Count value={item.value} /></p>
                  <p className="mt-2 text-sm text-white/55">{item.label}</p>
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}
