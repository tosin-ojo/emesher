import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBXw5zUxjkFgtvjntD4vqROGccSVrM3TWw",
    authDomain: "emesher.firebaseapp.com",
    projectId: "emesher",
    storageBucket: "emesher.appspot.com",
    messagingSenderId: "1045049400658",
    appId: "1:1045049400658:web:f281480a04308b3109ae8b",
    measurementId: "G-JNBHKNTPZN"
};

const firebaseAPP = firebase.initializeApp(firebaseConfig)

const db = firebaseAPP.firestore()
const auth = firebase.auth()
const functions = firebase.functions()
const storage = firebase.storage()
db.settings({ timestampsInSnapshots: true })

export { storage, db, auth, functions }