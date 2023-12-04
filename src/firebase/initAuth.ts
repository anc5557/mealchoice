// path : src/firebase/initAuth.ts

import { init } from "next-firebase-auth";

const initAuth = () => {
  init({
    authPageURL: "/",
    appPageURL: "/home",
    loginAPIEndpoint: "/api/login",
    logoutAPIEndpoint: "/api/logout",

    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY!,
      },
      databaseURL: "process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL",
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!, // required
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: "Meal Choice",
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // set this to false in local (non-HTTPS) development
      signed: true,
    },
  });
};

export default initAuth;
