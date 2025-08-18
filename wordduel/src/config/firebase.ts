import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

// Demo Firebase configuration for WordDuel
// This is a test configuration - replace with your own for production
const firebaseConfig = {
  apiKey: "AIzaSyBxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ",
  authDomain: "wordduel-demo.firebaseapp.com",
  projectId: "wordduel-demo",
  storageBucket: "wordduel-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  databaseURL: "https://wordduel-demo-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

// Connect to emulators in development
if (__DEV__) {
  try {
    // Connect to Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099');
    
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Connect to Realtime Database emulator
    connectDatabaseEmulator(realtimeDb, 'localhost', 9000);
    
    console.log('🔥 Connected to Firebase emulators');
  } catch (error) {
    console.log('⚠️ Firebase emulators not available, using production');
  }
}

export default app;