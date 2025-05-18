// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyAxoUZKEevX4gJUE6GEHF54EnLJmVWLax8',
  authDomain: 'swiftqr-e9750.firebaseapp.com',
  projectId: 'swiftqr-e9750',
  storageBucket: 'swiftqr-e9750.appspot.com',
  messagingSenderId: '602000963837',
  appId: '1:602000963837:android:ca6d1b1f3409cf1baee694',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
