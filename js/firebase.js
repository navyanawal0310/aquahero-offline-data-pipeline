// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmFLvi2CfsEE9I1kQ5MwiXI0mWdm9fvwI",
  authDomain: "aquahero-health.firebaseapp.com",
  projectId: "aquahero-health",
  storageBucket: "aquahero-health.firebasestorage.app",
  messagingSenderId: "69719868645",
  appId: "1:69719868645:web:416828c6310822fed5800c",
  measurementId: "G-4ZKWJ518TF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();
