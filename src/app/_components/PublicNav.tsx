"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

const sections = ["hero", "how-it-works"];

export function PublicNav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -50% 0px" }
    );
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  if (session?.user) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow] duration-200 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-navy">
          Alum<span className="text-gold">Now</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <button
            onClick={() => jump("how-it-works")}
            className={`${
              active === "how-it-works"
                ? "text-navy border-b-2 border-gold"
                : "text-navy/50 hover:text-navy"
            }`}
          >
            How it works
          </button>
          <Link href="/about" className="text-navy/50 hover:text-navy">
            About
          </Link>
          <Link href="/apply" className="text-navy/50 hover:text-navy">
            For alumni
          </Link>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-navy/70 hover:text-navy"
          >
            Log in
          </Link>
          <Link href="/register">
            <Button variant="accent">Find your mentor</Button>
          </Link>
        </div>
        <button
          className="rounded-md p-2 text-navy/50 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-cream/98 backdrop-blur-md px-6 py-4 space-y-3">
          <button
            onClick={() => jump("how-it-works")}
            className="block w-full text-left text-sm text-navy/60 hover:text-navy py-2"
          >
            How it works
          </button>
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="block text-sm text-navy/60 hover:text-navy py-2"
          >
            About
          </Link>
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="block text-sm text-navy/60 hover:text-navy py-2"
          >
            For alumni
          </Link>
          <hr className="border-border" />
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="block text-sm font-semibold text-navy/70 py-2"
          >
            Log in
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="block text-sm font-semibold text-navy py-2"
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}
