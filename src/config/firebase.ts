import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8hPJGXymPOQVzaNMkV__6i2XQ7oL3KFk",
  authDomain: "assesment-tool-6fc16.firebaseapp.com",
  projectId: "assesment-tool-6fc16",
  storageBucket: "assesment-tool-6fc16.firebasestorage.app",
  messagingSenderId: "1088392908891",
  appId: "1:1088392908891:web:106534c59e5288af9faf7e",
  measurementId: "G-PLXDHQNC2M",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;