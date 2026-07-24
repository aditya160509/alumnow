"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionData = {
  user: {
    id: string;
    email: string;
    role: string;
    name: string | null;
  };
} | null;

type SupabaseContext = {
  session: SessionData;
  status: SessionStatus;
  supabase: ReturnType<typeof createBrowserClient>;
};

const Context = createContext<SupabaseContext | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [supabase] = useState(() => createBrowserClient(supabaseUrl, supabaseKey));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s?.user) {
        setSession({
          user: {
            id: s.user.id,
            email: s.user.email ?? "",
            role: (s.user.user_metadata?.role as string) ?? "student",
            name: (s.user.user_metadata?.full_name as string) ?? s.user.email ?? null,
          },
        });
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.user) {
        setSession({
          user: {
            id: s.user.id,
            email: s.user.email ?? "",
            role: (s.user.user_metadata?.role as string) ?? "student",
            name: (s.user.user_metadata?.full_name as string) ?? s.user.email ?? null,
          },
        });
        setStatus("authenticated");
      } else {
        setSession(null);
        setStatus("unauthenticated");
      }
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return <Context.Provider value={{ session, status, supabase }}>{children}</Context.Provider>;
}

export function useSupabase() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useSupabase must be used within SupabaseProvider");
  return ctx;
}
