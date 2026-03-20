import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    // ✅ Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // ✅ Authentik Login
    {
      id: "authentik",
      name: "Authentik",
      type: "oauth",
      wellKnown:
        "http://localhost:9000/application/o/nextjs-app/.well-known/openid-configuration",
      clientId: process.env.AUTHENTIK_CLIENT_ID as string,
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET as string,
      authorization: {
        params: { scope: "openid email profile" },
      },
      idToken: true,
      checks: ["pkce", "state"],

      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: profile.groups?.includes("admin") ? "admin" : "user",
        };
      },
    },
  ],

  pages: {
    signIn: "/auth/login", // ✅ make sure this matches your actual login page
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.provider = account.provider;
      }

      if (profile && (profile as any).groups) {
        token.role = (profile as any).groups.includes("admin")
          ? "admin"
          : "user";
      }

      if (user && (user as any).role) {
        token.role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider;
        (session.user as any).role = token.role || "user";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };