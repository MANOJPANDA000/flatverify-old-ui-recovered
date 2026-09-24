import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// --- TEMPORARY DIAGNOSTIC ---
const maskKey = (key: string) => {
  if (!key) return 'MISSING';
  if (key.length < 10) return 'TOO_SHORT';
  return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
};

console.log('--- FIREBASE RUNTIME DIAGNOSTIC ---');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('App ID:', firebaseConfig.appId);
console.log('API Key Length:', firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0);
console.log('API Key Stringified:', JSON.stringify(maskKey(firebaseConfig.apiKey)));
console.log('API Key Raw Stringified (full length check):', JSON.stringify(firebaseConfig.apiKey).length);
// Check for whitespace
if (firebaseConfig.apiKey && (firebaseConfig.apiKey.trim() !== firebaseConfig.apiKey)) {
  console.error('CRITICAL: API Key has hidden whitespace!');
}
console.log('------------------------------------');
// ----------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);

// Initialize Firestore using the default database
export const db = getFirestore(app);
