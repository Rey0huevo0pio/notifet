const socket = io();
let isVisible = true;
let userId = localStorage.getItem('userId');

if (!userId) {
    userId = Math.floor(Math.random() * 10000);
    localStorage.setItem('userId', userId);
}


document.getElementById('enviar').onclick = function() {
    const mensaje = document.getElementById('mensaje').value;
    socket.emit('mensaje', mensaje);
};


if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

navigator.serviceWorker.register('service-worker.js')
    .then(register => {
        return register.pushManager.getSubscription()
            .then(existingSubscription => {
                if (existingSubscription) {
                    return existingSubscription.unsubscribe().then(() => {
                        console.log('Suscripción previa eliminada');
                    });
                }
            })
            
            .then(() => {
                return fetch('/vapid-public-key')
                    .then(response => response.json())
                    .then(({ publicKey }) => {
                        const options = {
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(publicKey)
                        };
                        return register.pushManager.subscribe(options);
                    });

            })
            .then(subscription => {
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

socket.on('notificacion', (mensaje) => {
    if (!isVisible) {
        new Notification('Nuevo Mensaje', { body: mensaje });
    }
});

document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden; 
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from(new Array(rawData.length).fill(0).map((_, index) => rawData.charCodeAt(index)));
}
