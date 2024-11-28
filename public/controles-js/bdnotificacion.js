
        // Configuración para la suscripción a las notificaciones push
      // Función para generar un ID aleatorio
      const generateRandomUserId = () => {
            return 'user_' + Math.random().toString(36).substr(2, 9);
        };

        // Configuración para la suscripción a las notificaciones push
        const publicKey = '/vapid-public-key'; // Endpoint para obtener la clave pública VAPID

        const subscribeButton = document.getElementById('subscribe');
        let swRegistration = null;

        // Solicita la suscripción del usuario
        const subscribeUser = async () => {
            const res = await fetch(publicKey);
            const data = await res.json();
            const vapidPublicKey = data.publicKey;

            // Solicitar permisos para mostrar notificaciones
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Para suscribirse a las notificaciones, se necesita tu permiso.');
                return;
            }

            // Registro del Service Worker
            swRegistration = await navigator.serviceWorker.register('./src/service-worker.js');
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey
            });

            // Generar un ID aleatorio para el usuario
            const userId = generateRandomUserId();

            // Enviar la suscripción al backend
            const response = await fetch('/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, subscription })
            });

            if (response.ok) {
                alert('Te has suscrito a las notificaciones');
            } else {
                alert('Hubo un error al suscribirse');
            }
        };

        // Asociar el botón de suscripción con la función
        subscribeButton.addEventListener('click', subscribeUser);
