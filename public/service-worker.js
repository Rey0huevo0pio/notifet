self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Notificación';
    const options = {
        body: data.body || 'Tienes un nuevo mensaje.',
        icon: 'path/logo/fondo_1.jpg',
        badge: 'path/to/badge.png', 
        data: data.url || 'http://localhost:3000/' 
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});


self.addEventListener('notificationclick', event => {
    event.notification.close();

  
    let targetUrl = event.notification.data || 'http://localhost:3000/'; 

   
    if (!targetUrl.startsWith('http://localhost:3000/')) {
        targetUrl = 'http://localhost:3000/';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
   
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
           
            return clients.openWindow(targetUrl);
        })
    );
});


