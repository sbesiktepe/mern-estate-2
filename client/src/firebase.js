// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-myself.firebaseapp.com",
  projectId: "mern-estate-myself",
  storageBucket: "mern-estate-myself.appspot.com",
  messagingSenderId: "1079527296687",
  appId: "1:1079527296687:web:c03b0e83e5f22ac010ce5a",
  measurementId: "G-RH9GKQ8P7P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
