import type { NextAuthConfig } from "next-auth";
const isSecure = process.env.NODE_ENV === "production";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: isSecure ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isSecure,
      },
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const loggedIn = Boolean(auth?.user);
      const protectedPath = ["/browse","/bookings","/dashboard","/profile","/alumni","/apply","/account"].some((p) => nextUrl.pathname.startsWith(p));
      if (nextUrl.pathname.startsWith("/admin")) return auth?.user?.role === "admin";
      return !protectedPath || loggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "student";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "student";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
