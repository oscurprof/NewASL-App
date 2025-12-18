// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCigvof6JliMz2JeBN5c_N3FwdcFYyUtcA",
    authDomain: "signlanguage-c4109.firebaseapp.com",
    projectId: "signlanguage-c4109",
    storageBucket: "signlanguage-c4109.appspot.com", // FIXED HERE
    messagingSenderId: "681382907283",
    appId: "1:681382907283:web:cc7e1de96a09b5c9a5ac66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services
export { auth, db, storage };
export default app;