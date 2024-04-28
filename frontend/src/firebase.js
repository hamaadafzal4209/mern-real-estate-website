// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-be5ba.firebaseapp.com",
  projectId: "mern-real-estate-be5ba",
  storageBucket: "mern-real-estate-be5ba.appspot.com",
  messagingSenderId: "799400149501",
  appId: "1:799400149501:web:f3d15e16c20038df145994"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);