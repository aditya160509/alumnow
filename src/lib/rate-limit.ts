const limits = new Map<string, { count: number; resetAt: number }>();
if (typeof setInterval !== "undefined") setInterval(() => { const now = Date.now(); for (const [key, entry] of limits) if (entry.resetAt <= now) limits.delete(key); }, 60000).unref?.();
export function rateLimit(key: string, options: { max: number; windowMs: number }) { const now = Date.now(); const current = limits.get(key); if (!current || current.resetAt <= now) { limits.set(key, { count: 1, resetAt: now + options.windowMs }); return true; } if (current.count >= options.max) return false; current.count += 1; return true; }
export function getRateLimitRemaining(key: string) { const current = limits.get(key); return !current || current.resetAt <= Date.now() ? 0 : current.resetAt - Date.now(); }
