// path : mealchoice/src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubAuthProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    GithubAuthProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
    }),
  ],
};

export default NextAuth(authOptions);
