// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBPfqcBweRBf2q0HAzL3ATgPkiLgGc3zW8',
  authDomain: 'palkka-laskuri.firebaseapp.com',
  databaseURL: 'https://palkka-laskuri-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'palkka-laskuri',
  storageBucket: 'palkka-laskuri.appspot.com',
  messagingSenderId: '710306956262',
  appId: '1:710306956262:web:beca0b9f2b045e295ecc27',
  measurementId: 'G-4GN7RJ9594'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const database = getDatabase(app)
export const auth = getAuth(app)
