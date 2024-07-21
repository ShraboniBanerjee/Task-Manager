// Import the functions you need from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZeYnY_JTYoi6KuRNrD_VfOTV7QxJKz3M",
  authDomain: "task-manager-app-fd207.firebaseapp.com",
  projectId: "task-manager-app-fd207",
  storageBucket: "task-manager-app-fd207.appspot.com",
  messagingSenderId: "580420707509",
  appId: "1:580420707509:web:6e9d31ff8db5a5adec4afc",
  databaseURL: "https://task-manager-app-fd207-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
