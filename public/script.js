const socket = io();
let isVisible = true;
let userId = localStorage.getItem('userId');

// Generar un ID de usuario si no existe
if (!userId) {
    userId = Math.floor(Math.random() * 10000);
    localStorage.setItem('userId', userId);
}

// Evento para el botón de enviar
document.getElementById('enviar').onclick = function() {
    const mensaje = document.getElementById('mensaje').value;
    socket.emit('mensaje', mensaje);


    requestNotificationPermission();
};

function requestNotificationPermission() {
    // Verificar el estado de permisos
    if (Notification.permission === 'granted') {
        registerServiceWorker(); // Si ya se otorgó el permiso
    } else if (Notification.permission === 'default') {
        Notification.requestPermission()
            .then(permission => {
                if (permission === 'granted') {
                    registerServiceWorker();
                } else {
                    console.log('Permiso de notificación denegado');
                }
            })
            .catch(err => {
                console.error('Error al solicitar permiso:', err);
            });
    } else {
        console.log('Permiso de notificación ya denegado o no disponible');
    }
}

function registerServiceWorker() {
    navigator.serviceWorker.register('service-worker.js')
        .then(register => {
            return register.pushManager.getSubscription()
                .then(existingSubscription => {
                    if (existingSubscription) {
                        return existingSubscription; // Retornar la suscripción existente
                    }
                    // Obtener la clave pública VAPID
                    return fetch('/vapid-public-key')
                        .then(response => response.json())
                        .then(({ publicKey }) => {
                            const options = {
                                userVisibleOnly: true,
                                applicationServerKey: urlBase64ToUint8Array(publicKey)
                            };
                            return register.pushManager.subscribe(options); // Suscribirse
                        });
                })
                .then(subscription => {
                    if (subscription) {
                        // Enviar la suscripción al servidor para guardarla en la base de datos
                        fetch('/subscribe', {
                            method: 'POST',
                            body: JSON.stringify({ userId, subscription }),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Resultado de la suscripción:', data);
                        })
                        .catch(err => console.error('Error al enviar la suscripción al servidor:', err));
                    }
                });
        })
        .catch(err => console.error('Error al suscribirse a las notificaciones push', err));
}

// Escuchar mensajes de notificación
socket.on('notificacion', (mensaje) => {
    if (!isVisible) {
        new Notification('Nuevo Mensaje', { body: mensaje });
    }
});

// Controlar visibilidad
document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden; 
});

// Función para convertir la clave pública VAPID
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}
