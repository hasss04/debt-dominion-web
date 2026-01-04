import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxH8yp7vBAKRcHR6deq0pF5m4o0uQdlxI",
  authDomain: "studio-592737534-5754c.firebaseapp.com",
  databaseURL: "https://studio-5927375734-5754c-default-rtdb.firebaseio.com",
  projectId: "studio-592737534-5754c",
  storageBucket: "studio-592737534-5754c.appspot.com",
  messagingSenderId: "228039712999",
  appId: "1:228039712999:web:0e9ac687dd8bd77c78c242",
};

// Initialize Firebase only if no apps exist
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const rtdb = getDatabase(app);
export const auth = getAuth(app);
