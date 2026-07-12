import type { Metadata } from "next";
import { Inter, Instrument_Serif, Marck_Script } from "next/font/google";
import { SessionProvider } from "./SessionProvider";
import { RouteNav } from "@/components/RouteNav";
import { RouteFooter } from "@/components/RouteFooter";
import { Toaster } from "@/components/ui/Toaster";
import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const marckScript = Marck_Script({ subsets: ["latin"], weight: "400", variable: "--font-marck" });

export const metadata: Metadata = {
  title: "AlumNow — Talk to JBCN Alumni",
  description: "Book video-call sessions with verified JBCN alumni for personalised guidance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://db.onlinewebfonts.com/c/e66905e07608167a84e6ad52f638c3c6?family=Helvetica+Now+Var" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${instrumentSerif.variable} ${marckScript.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <QueryProvider>
            <div className="flex min-h-[100dvh] flex-col">
              <RouteNav />
              <main className="flex-1">{children}</main>
              <RouteFooter />
            </div>
            <Toaster />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
