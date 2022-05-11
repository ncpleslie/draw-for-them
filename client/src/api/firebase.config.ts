import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyC-UmvFRfPB-hIZ3nbH7jBAHWgQ6T1RbF8",
  authDomain: "draw-for-them.firebaseapp.com",
  databaseURL: "https://draw-for-them-default-rtdb.firebaseio.com",
  projectId: "draw-for-them",
  storageBucket: "draw-for-them.appspot.com",
  messagingSenderId: "836139658415",
  appId: "1:836139658415:web:a160615ea15f95a579b85a",
  measurementId: "G-HDG664FR41",
};

export const app = initializeApp(firebaseConfig);
export const compatApp = firebase.initializeApp(firebaseConfig);
