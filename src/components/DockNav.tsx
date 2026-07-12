"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, UserRound, Menu, X, Sun, Moon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function DockNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const links = [
    { href: "/browse", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 dark:bg-[#0A0A0B]/95 backdrop-blur-md border-b border-black/8 dark:border-white/8 shadow-[0_1px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
          : "bg-white/85 dark:bg-[#0A0A0B]/85 backdrop-blur-sm border-b border-black/5 dark:border-white/5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-[17px] font-bold tracking-[-0.03em] text-[#0F0F10] dark:text-white shrink-0">
          Alum<span className="text-[#5B4FE9]">Now</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-[#5B4FE9] bg-[#5B4FE9]/8"
                  : "text-[#6E6E76] dark:text-white/60 hover:text-[#0F0F10] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
              {(pathname === link.href || pathname.startsWith(link.href + "/")) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-[#5B4FE9]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle pill — always visible, clearly labeled */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 border ${
                isDark
                  ? "bg-white/[0.08] border-white/[0.12] text-white/70 hover:bg-white/[0.14] hover:text-white"
                  : "bg-black/[0.04] border-black/[0.08] text-[#6E6E76] hover:bg-black/[0.08] hover:text-[#0F0F10]"
              }`}
            >
              {isDark
                ? <><Sun size={12} className="text-amber-400" /> Light</>
                : <><Moon size={12} className="text-indigo-500" /> Dark</>
              }
            </button>
          )}

          {session?.user ? (
            <>
              <span className="text-sm text-[#9A9AA2] dark:text-white/50 flex items-center gap-1.5">
                <UserRound size={14} />
                {session.user.name ?? "Account"}
              </span>
              {(session.user as any).role === "admin" && (
                <Link href="/admin" className="text-sm text-[#9A9AA2] dark:text-white/50 hover:text-[#0F0F10] dark:hover:text-white transition-colors">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ redirectTo: "/" })}
                className="p-1.5 rounded-lg text-[#9A9AA2] dark:text-white/50 hover:text-[#0F0F10] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-[#0F0F10] dark:text-white/80 hover:text-[#5B4FE9] dark:hover:text-[#5B4FE9] transition-colors">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-[#5B4FE9] px-4 py-2 rounded-lg hover:bg-[#4A3FD6] transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-[#9A9AA2] dark:text-white/50 hover:text-[#0F0F10] dark:hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-black/5 dark:border-white/5 bg-white/98 dark:bg-[#0A0A0B]/98 backdrop-blur-md"
          >
            <div className="px-6 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? "text-[#5B4FE9] bg-[#5B4FE9]/8"
                      : "text-[#6E6E76] dark:text-white/60 hover:text-[#0F0F10] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-black/5 dark:border-white/5" />

              {mounted && (
                <button
                  onClick={() => { setTheme(isDark ? "light" : "dark"); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-sm text-[#6E6E76] dark:text-white/60 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] flex items-center gap-2"
                >
                  {isDark
                    ? <><Sun size={14} className="text-amber-400" /> Switch to Light mode</>
                    : <><Moon size={14} className="text-indigo-500" /> Switch to Dark mode</>
                  }
                </button>
              )}

              {session?.user ? (
                <>
                  <div className="px-3 py-2 text-sm text-[#9A9AA2] dark:text-white/50 flex items-center gap-2">
                    <UserRound size={14} /> {session.user.name ?? "Account"}
                  </div>
                  {(session.user as any).role === "admin" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-[#6E6E76] dark:text-white/60 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut({ redirectTo: "/" }); setMobileOpen(false); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-[#6E6E76] dark:text-white/60 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] flex items-center gap-2"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold text-[#0F0F10] dark:text-white py-2.5 rounded-lg border border-black/10 dark:border-white/10">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold text-white bg-[#5B4FE9] py-2.5 rounded-lg hover:bg-[#4A3FD6]">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
