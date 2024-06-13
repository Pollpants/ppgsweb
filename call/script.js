// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC4e_nZnwKsGu30MWIdZkXXJjNUT2z42E",
    authDomain: "call-574bf.firebaseapp.com",
    projectId: "call-574bf",
    storageBucket: "call-574bf.appspot.com",
    messagingSenderId: "1076977042378",
    appId: "1:1076977042378:web:e43cfdc512a22d29390533",
    measurementId: "G-YKTSCWQZF1"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Elements
const notifyButton = document.getElementById('notifyButton');
const notificationDiv = document.getElementById('notification');

// Listen for notifications
database.ref('notifications').on('value', (snapshot) => {
    const notification = snapshot.val();
    if (notification) {
        notificationDiv.textContent = notification.message;
    }
});

// Send notification
notifyButton.addEventListener('click', () => {
    const message = 'Notification to all users!';
    database.ref('notifications').set({
        message: message
    });
});