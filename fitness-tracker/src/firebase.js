
// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyDG2Rk5UYbgH01TbZ9a5rQbV-TRL0xvo3Y",
    authDomain: "fitness-tracker-app-80aec.firebaseapp.com",
    projectId: "fitness-tracker-app-80aec",
    storageBucket: "fitness-tracker-app-80aec.appspot.com",
    messagingSenderId: "109844631497",
    appId: "1:109844631497:web:4460a0adcdaacecced2218"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it for use in other files
export const auth = getAuth(app);

export const db = getFirestore(app);