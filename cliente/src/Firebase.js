// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore,collection, addDoc, setDoc,updateDoc,getDoc,doc } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXCPqVDiGPVc7Y2LR0NPnuKsQjXkyaI6Y",
  authDomain: "forodex-48282.firebaseapp.com",
  databaseURL:"https://forodex-48282-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "forodex-48282",
  storageBucket: "forodex-48282.appspot.com",
  messagingSenderId: "68784879721",
  appId: "1:68784879721:web:3e8752a4369a340d2d0af8",
  measurementId: "G-1224PQX0N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export default app;