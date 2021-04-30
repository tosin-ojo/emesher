import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyAsPoCAPlJiJGEGW8uxkDI45k28T8EXDU4",
    authDomain: "agrocunda.firebaseapp.com",
    databaseURL: "https://agrocunda.firebaseio.com",
    projectId: "agrocunda",
    storageBucket: "agrocunda.appspot.com",
    messagingSenderId: "1088980952895",
    appId: "1:1088980952895:web:6e70b3d7d6af31fc19158a",
    measurementId: "G-60DJQY1E64"
  };

const firebaseAPP = firebase.initializeApp(firebaseConfig)

const db = firebaseAPP.firestore()
const auth = firebase.auth()
const functions = firebase.functions()
const storage = firebase.storage()
db.settings({ timestampsInSnapshots: true })

export { storage, db, auth, functions }