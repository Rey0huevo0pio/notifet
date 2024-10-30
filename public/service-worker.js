self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notificación';
    const options = {
        body: data.body || 'Tienes un nuevo mensaje.',
        icon: 'path/to/icon.png', // Ruta a un ícono de notificación
        badge: 'path/to/badge.png', // Ruta a una insignia pequeña
        data: data.url || 'http://localhost:3000/' // URL opcional a abrir al hacer clic en la notificación
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close(); // Cierra la notificación cuando se hace clic

    // URL especificada en la notificación
    let targetUrl = event.notification.data || 'http://localhost:3000/'; // URL predeterminada

    // Asegúrate de que la URL nunca sea incorrecta, por ejemplo, '/mensajes'
    if (!targetUrl.startsWith('http://localhost:3000/')) {
        targetUrl = 'http://localhost:3000/'; // Fuerza siempre la página principal
    }

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Si ya hay una pestaña abierta, enfócala
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            // Si no, abre una nueva pestaña con la URL válida
            return clients.openWindow(targetUrl);
        })
    );
});


