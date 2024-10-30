const socket = io();
let isVisible = true;
let userId = localStorage.getItem('userId');

// Si el usuario no tiene un ID almacenado, generar uno y guardarlo
if (!userId) {
    userId = Math.floor(Math.random() * 10000);
    localStorage.setItem('userId', userId);
}

// Enviar mensaje al servidor
document.getElementById('enviar').onclick = function() {
    const mensaje = document.getElementById('mensaje').value;
    socket.emit('mensaje', mensaje);
};

// Pide permiso para mostrar notificaciones
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// Registro del Service Worker
navigator.serviceWorker.register('service-worker.js')
.then(register => {
    // Verificar si ya existe una suscripción activa
    return register.pushManager.getSubscription()
    .then(existingSubscription => {
        if (existingSubscription) {
            console.log('Ya existe una suscripción:', existingSubscription);
            return existingSubscription;
        } else {
            // No hay suscripción activa, crear una nueva
            return fetch('/vapid-public-key')
                .then(response => response.json())
                .then(({ publicKey }) => {
                    const options = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(publicKey)
                    };
                    return register.pushManager.subscribe(options);
                });
        }
    })
    .then(subscription => {
        // Enviar la suscripción al servidor
        if (subscription) {
            fetch('/subscribe', {
                method: 'POST',
                body: JSON.stringify({ userId, subscription }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    });
})
.catch(err => console.error('Error al suscribirse a las notificaciones push', err));

// Escuchar las notificaciones
socket.on('notificacion', (mensaje) => {
    if (!isVisible) {
        new Notification('Nuevo Mensaje', { body: mensaje });
    }
});

// Cambiar el estado de visibilidad
document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden; // Cambia el estado de visibilidad
});

// Función para convertir la clave pública en un arreglo Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from(new Array(rawData.length).fill(0).map((_, index) => rawData.charCodeAt(index)));
}
