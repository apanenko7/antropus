"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Firebase web config. These values identify the project and are public by design
 * (they ship in the browser bundle); access is protected by Firestore rules and
 * the authorized domains list in Firebase Authentication. Env vars can override them.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDN_qELXPM9Nt1fDhkL7DdlWfoQcPoc5z0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "antropus-52cbe.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "antropus-52cbe",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "antropus-52cbe.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "846851547595",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:846851547595:web:ef0facd70f846f8e59564e",
};

let cached: { app: FirebaseApp; auth: Auth; db: Firestore } | null = null;

/** Lazily initialised so nothing runs during server prerendering. */
export function getFirebase() {
  if (!cached) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    cached = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return cached;
}
