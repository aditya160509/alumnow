"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function RouteFooter() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return null;
  return <Footer />;
}
