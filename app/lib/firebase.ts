import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqD885ynXEUxJYlWAazowQu8Obfl6WNnE",
  authDomain: "orgainc-1fe1d.firebaseapp.com",
  databaseURL: "https://orgainc-1fe1d-default-rtdb.firebaseio.com",
  projectId: "orgainc-1fe1d",
  storageBucket: "orgainc-1fe1d.firebasestorage.app",
  messagingSenderId: "430981227000",
  appId: "1:430981227000:web:8809687c90e712f776360d",
  measurementId: "G-N5C4P9S7MS"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
