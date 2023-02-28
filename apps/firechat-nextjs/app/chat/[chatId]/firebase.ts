import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD8TlWideexlrUurr_nLWOTGBEZQfLgffk",
  authDomain: "rithviknishad-firechat.firebaseapp.com",
  databaseURL:
    "https://rithviknishad-firechat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rithviknishad-firechat",
  storageBucket: "rithviknishad-firechat.appspot.com",
  messagingSenderId: "190370673692",
  appId: "1:190370673692:web:404b412328dd1f9cce5bd9",
  measurementId: "G-374RWVP37B",
};

export const app = initializeApp(firebaseConfig);
