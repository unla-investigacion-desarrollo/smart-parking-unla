import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBX2z3wKycFD-mQEE3zM0po9MmuTypo_gA",
    authDomain: "smart-parking-unla.firebaseapp.com",
    projectId: "smart-parking-unla",
    storageBucket: "smart-parking-unla.firebasestorage.app",
    messagingSenderId: "742032857020",
    appId: "1:742032857020:web:9e1931c4df417b6dc3bdb9",
    measurementId: "G-8FP75QPM44"
};
  

const app = initializeApp(firebaseConfig);

export const db = getFirestore();