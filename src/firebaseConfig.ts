// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyCaWgFKk4Ct0PoGhyP20_gAwNUIoThlOfE',
  authDomain: 'myapp-83672.firebaseapp.com',
  projectId: 'myapp-83672',
  storageBucket: 'myapp-83672.appspot.com',
  messagingSenderId: '670434060858',
  appId: '1:670434060858:web:16e65e922f79d8f058e303',
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { auth, firestore,storage };
