// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCfRIDqhICHj4TaKUD23pevrobp1AcTUhk",
    authDomain: "react-chat-40c7d.firebaseapp.com",
    projectId: "react-chat-40c7d",
    storageBucket: "react-chat-40c7d.appspot.com",
    messagingSenderId: "684861892366",
    appId: "1:684861892366:web:1ab34dc4fbffc2304a995f",
    measurementId: "G-V3V08E0L3D"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);