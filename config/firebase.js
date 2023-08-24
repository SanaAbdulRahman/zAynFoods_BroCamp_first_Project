const {initializeApp}=require('firebase/app');
const {getAuth, RecaptchaVerifier}=require('firebase/auth');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAGHCOI0XKzhV7zuiW7Y7iBsE3FdNNYjdw",
    authDomain: "zayn-foods.firebaseapp.com",
    projectId: "zayn-foods",
    storageBucket: "zayn-foods.appspot.com",
    messagingSenderId: "546906907401",
    appId: "1:546906907401:web:45aca70151d4398ce8e9d8",
    measurementId: "G-R1V36TB4VK"
  };
const firebaseApp= initializeApp(firebaseConfig);
const auth=getAuth(firebaseApp);
module.exports=auth;