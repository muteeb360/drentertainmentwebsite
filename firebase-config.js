const firebaseConfig = {
    apiKey: "AIzaSyDqMh6d1JgLH8TWfYARodz42AahazUjuYE",
    authDomain: "drentertainment-c4412.firebaseapp.com",
    projectId: "drentertainment-c4412",
    storageBucket: "drentertainment-c4412.firebasestorage.app",
    messagingSenderId: "156128530607",
    appId: "1:156128530607:web:14b75bd0459d212446045a",
    measurementId: "G-Z1TME96EM6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
