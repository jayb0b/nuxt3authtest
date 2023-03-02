import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */

export default NuxtAuthHandler({
  // secret needed to run nuxt-auth in production mode (used to encrypt data)
  secret: process.env.NUXT_OAUTH_SECRET,

  providers: [
    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      name: 'Credentials',
      id:'credentials',
      credentials: {},
      async authorize (credentials:any, req:any) {
        console.log("CRED");
        console.log(credentials);
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {

  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT");
      if (account && user) {
        console.warn("JWT callback", { token, user, account });
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session");
      console.warn("Calling async session", session, token);
      session.user = {
        ...session.user,
        ...token,
      };

      return session;
    },
  },
});
