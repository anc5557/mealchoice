// src/firebase/firebaseAdmin.ts

import * as admin from "firebase-admin";

var serviceAccount = require("../../mealchoice-6e41a-firebase-adminsdk-a7n7p-484eb8973e.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
