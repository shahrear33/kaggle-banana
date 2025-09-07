import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCpnD8PkIJaxubvCMpAg62s2OlI3SeCB6w",
    authDomain: "push-messaging-28c09.firebaseapp.com",
    projectId: "push-messaging-28c09",
    storageBucket: "push-messaging-28c09.appspot.com",
    messagingSenderId: "644954159888",
    appId: "1:644954159888:web:e38cb15044f2e554c8c395",
    measurementId: "G-H8FJFXYXXM"
};

export function push_messaging_token() {
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        console.log("Push Messaging Token")

        getToken(messaging, { vapidKey: 'BDF9LMb6_mBNXmk7zdlPp1L7bIoNIy9kEQVLnVnb1KJCflRVwHX-dj9doYWQ9k2G_pT_oKG3gRiGyypKrwnvx0o' })
            .then((currentToken) => {
                if (currentToken) {
                    handleToken(currentToken);
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                }
            })
            .catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            });

        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            // Handle the message as needed
        });

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
}

async function handleToken(currentToken) {
    console.log('Token:', currentToken);
    await assign_token_to_user(currentToken);
}

async function assign_token_to_user(token) {
   
    const jwt = "Bearer "+JSON.parse(localStorage.getItem("token")).access_token
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/user/device-token?device_token=${token}`, {
        method:"PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": jwt
        },
    })

    const ans = await response.json()
    console.log(ans)
}