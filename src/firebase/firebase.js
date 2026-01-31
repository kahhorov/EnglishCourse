// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxw0K0y5B9na1_laujCpaOzUGSWV0ydU4",
  authDomain: "english-71f5a.firebaseapp.com",
  projectId: "english-71f5a",
  storageBucket: "english-71f5a.firebasestorage.app",
  messagingSenderId: "284920573966",
  appId: "1:284920573966:web:e531b3dfa73be0a7afcc5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);