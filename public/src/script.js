const socket = io();  // Esta línea debe estar antes de cualquier uso de 'socket'


let isVisible = !document.hidden;  // Establecemos el estado inicial

let userId = localStorage.getItem('userId');

if (!userId) {
    userId = Math.floor(Math.random() * 10000);
    localStorage.setItem('userId', userId);
}


// Solicitar permiso de notificaciones solo cuando el usuario haga clic en algo
document.getElementById('solicitar-permiso').addEventListener('click', () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permiso para notificaciones concedido');
            } else {
                console.log('Permiso para notificaciones denegado');
            }
        });
    }
});


// Solicitar permiso de notificaciones si no está concedido
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

navigator.serviceWorker.register('service-worker.js')
.then(register => {
    return register.pushManager.getSubscription()
    .then(existingSubscription => {
        if (existingSubscription) {
            console.log('Ya existe una suscripción:', existingSubscription);
            return existingSubscription;
        } else {
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
        if (subscription) {
            fetch('/subscribe', {
                method: 'POST',
                body: JSON.stringify({ userId, subscription }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error al suscribir al usuario:', data.error);
                } else {
                    console.log('Usuario suscrito correctamente:', data.message);
                }
            })
            .catch(err => console.error('Error al suscribir al usuario:', err));
        }
    });
})
.catch(err => console.error('Error al suscribirse a las notificaciones push', err));

// Controlar las notificaciones solo cuando la página NO esté visible
socket.on('notificacion', (mensaje) => {
    // Solo mostrar notificaciones si la página NO está visible
    if (!isVisible) {
        new Notification('Nuevo Mensaje', { body: mensaje });
    }
});

// Detectar cuando la visibilidad cambia
document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (document.hidden) {
        console.log('El usuario ha cambiado de pestaña o minimizado la ventana');
    } else {
        console.log('El usuario ha vuelto a la pestaña');
    }
});
