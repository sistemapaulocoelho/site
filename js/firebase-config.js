// firebase-config.js

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCGudG7CvPLW_GE8JycQrC0xPE7_BvIDro",
    authDomain: "academia-27102.firebaseapp.com",
    projectId: "academia-27102",
    storageBucket: "academia-27102.firebasestorage.app",
    messagingSenderId: "702608503871",
    appId: "1:702608503871:web:c5359c42513615ffd4348a"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
