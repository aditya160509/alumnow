import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Creates a Supabase client for browser-side use.
 * Must be called from a useEffect or event handler, not at module level.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
