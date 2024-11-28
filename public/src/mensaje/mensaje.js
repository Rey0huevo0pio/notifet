import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
        
const socket = io(); // Mover esto aquí para acceder a socket antes de la interacción del usuario

document.addEventListener('DOMContentLoaded', () => {
    // Pedir permiso de notificaciones cuando se hace clic en un botón
    document.getElementById('requestPermissionButton').addEventListener('click', () => {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Has accedido a dar permiso de notificación');
                    subscribeUserToPush(); // Suscribir después de dar permisos
                }
            });
        }
    });

    // Función para suscribirse a las notificaciones
    function subscribeUserToPush() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registrado:', registration);

                    // Suscribirse a las notificaciones
                    return registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(process.env.PUBLIC_VAPID_KEY) // Asegúrate de que esto esté definido
                    });
                })
                .then((subscription) => {
                    // Enviar la suscripción al servidor
                    socket.emit('subscribe', subscription);
                })
                .catch((error) => {
                    console.error('Error en la suscripción:', error);
                });
        }
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return new Uint8Array([...Array(rawData.length)].map((_, i) => rawData.charCodeAt(i)));
    }

    function mostrarNotificacion(msg, username) {
        if (Notification.permission === 'granted' && document.visibilityState === 'hidden') {
            const options = {
                body: msg,
                icon: '../assets/logo/fondo_1.jpg'
            };
            new Notification(`Nuevo mensaje de ${username}`, options);
        }
    }

    const getUsername = async () => {
        const username = localStorage.getItem('username');
        if (username) {
            console.log(`User existed ${username}`);
            return username;
        }
        const res = await fetch('https://random-data-api.com/api/users/random_user');
        const { username: randomUsername } = await res.json();
        console.log('random', randomUsername);
        localStorage.setItem('username', randomUsername);
        return randomUsername;
    };

    getUsername().then(username => {
        socket.auth = { username, serverOffset: 0 };
    });

    const form = document.getElementById('form');
    const input = document.getElementById('message');
    const messages = document.getElementById("messages");

    socket.on('chat message', (msg, serverOffset, username) => {
        const item = `<li><p>${msg}</p><small>${username}</small></li>`;
        messages.insertAdjacentHTML('beforeend', item);
        socket.auth.serverOffset = serverOffset;
        messages.scrollTop = messages.scrollHeight;
        mostrarNotificacion(msg, username);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });
});