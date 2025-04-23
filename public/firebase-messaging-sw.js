importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC-JerWPIH1HQuEnBSzat0LWuOS4KFpz3Q",
  authDomain: "habitevolver.firebaseapp.com",
  projectId: "habitevolver",
  storageBucket: "habitevolver.firebasestorage.app",
  messagingSenderId: "691095865564",
  appId: "1:691095865564:web:aa933afbc0e195d71dcc19",
  measurementId: "G-J35CF5T5WT"
});

const messaging = firebase.messaging();
