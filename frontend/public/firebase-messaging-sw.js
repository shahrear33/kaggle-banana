// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCpnD8PkIJaxubvCMpAg62s2OlI3SeCB6w",
    authDomain: "push-messaging-28c09.firebaseapp.com",
    projectId: "push-messaging-28c09",
    storageBucket: "push-messaging-28c09.appspot.com",
    messagingSenderId: "644954159888",
    appId: "1:644954159888:web:e38cb15044f2e554c8c395",
    measurementId: "G-H8FJFXYXXM"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
