import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// These values come from Firebase Console → Project Settings → Your Apps.
// They are public identifiers (not secrets) — safe to store in the frontend .env.
// import.meta.env is how Vite exposes .env variables to the browser at build time.
// Only variables prefixed with VITE_ are exposed.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// initializeApp connects the JS SDK to your Firebase project.
// Must be called once before using any Firebase service.
const app = initializeApp(firebaseConfig);

// getAuth returns the Auth service for this app.
// Exported so any file can import { auth } and call auth.currentUser, getIdToken(), etc.
export const auth = getAuth(app);
