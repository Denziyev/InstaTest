import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAKkt9o731K6yQC0pKDepCbosLtMvSq8wM",
  authDomain: "instagram-618e1.firebaseapp.com",
  projectId: "instagram-618e1",
  storageBucket: "instagram-618e1.appspot.com",
  messagingSenderId: "95503966325",
  appId: "1:95503966325:web:ec8642a651140fed11583c",
  measurementId: "G-K06FJR7YQF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { app, auth, firestore, storage };
