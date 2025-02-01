import { initializeApp, getApps } from 'firebase/app'; 
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'; 
import { getStorage } from 'firebase/storage'; 
import { getFirestore } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native';
 
const firebaseConfig = {  
  apiKey: "", 
  authDomain: "hack-6d6bf.firebaseapp.com", 
  projectId: "hack-6d6bf", 
  storageBucket: "hack-6d6bf.appspot.com", 
  messagingSenderId: "1016964256437", 
  appId: "1:1016964256437:web:2b3c07d7ebdfbf3ece64fc", 
  measurementId: "G-HVM1EF0D34" 
}; 
 
// Initialize Firebase only if it hasn't been initialized yet 
let app; 
if (!getApps().length) { 
  app = initializeApp(firebaseConfig); 
} else { 
  app = getApps()[0]; 
} 
 
// Initialize Auth only if it hasn't been initialized 
let auth; 
try { 
  auth = getAuth(app); 
} catch (error) { 
  auth = initializeAuth(app, { 
    persistence: getReactNativePersistence(AsyncStorage) 
  }); 
} 
 
// Initialize other services 
const storage = getStorage(app); 
const db = getFirestore(app); 
 
export { auth, storage, db }; 
export default app;
