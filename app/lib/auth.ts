import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { isAllowedLogin } from "./adminEnv";

// Admin sign-in only (GitHub, allowlist from ADMIN_GITHUB_LOGINS). JWT sessions with no database adapter,
// so signing in writes nothing to MongoDB. Reads AUTH_SECRET, AUTH_GITHUB_ID and AUTH_GITHUB_SECRET from env.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/sign-in", error: "/admin/sign-in" },
  callbacks: {
    signIn({ account, profile }) {
      return (
        account?.provider === "github" &&
        typeof profile?.login === "string" &&
        isAllowedLogin(profile.login)
      );
    },
    jwt({ token, account, profile, trigger }) {
      // The login comes only from GitHub at sign-in. Data a client sends with a session update
      // (trigger "update") is never read, so it cannot change the login.
      if (
        trigger === "signIn" &&
        account?.provider === "github" &&
        typeof profile?.login === "string"
      ) {
        return {
          ...token,
          login: profile.login,
          name: typeof profile.name === "string" ? profile.name : profile.login,
        };
      }
      return token;
    },
    session({ session, token }) {
      // Only the login and the name reach the session: no email, image or token.
      return {
        expires: session.expires,
        user: {
          login: typeof token.login === "string" ? token.login : undefined,
          name: typeof token.name === "string" ? token.name : undefined,
        },
      };
    },
  },
});
