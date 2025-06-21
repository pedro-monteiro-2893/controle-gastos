// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT6GPzVbzOzJA-dVMGP4yBV6N_yJjcC1g",
  authDomain: "controle-gastos-c9902.firebaseapp.com",
  projectId: "controle-gastos-c9902",
  storageBucket: "controle-gastos-c9902.firebasestorage.app",
  messagingSenderId: "658698627129",
  appId: "1:658698627129:web:9cb35872670c21768c85e8",
  measurementId: "G-X96PYVE8VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);