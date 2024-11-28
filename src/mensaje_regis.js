import { initDB } from './db/db';
import webpush from 'web-push';

// Crear las tablas necesarias
export const crearTablas = async () => {
    const db = await initDB();
    await db.execute(`
        CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        content TEXT,
        user TEXT
    );
    `);


};

// Insertar un mensaje en la base de datos
export const insertarMensaje = async (msg, username) => {
    const db = await initDB();
    const [result] = await db.execute(
        'INSERT INTO messages (content, user) VALUES (?, ?)',
        [msg, username]
    );
    return result;
};


// Manejar el evento de mensajes de chat
export const manejarEventoMensaje = (io, socket) => {
    socket.on('chat message', async (msg) => {
        const username = socket.handshake.auth.username || 'anonymous';
        try {
            // Insertar mensaje en la base de datos
            const result = await insertarMensaje(msg, username);
            io.emit('chat message', msg, result.insertId.toString(), username);

            // Obtener suscriptores para enviar notificaciones push
            const db = await initDB();
            const [subscriptions] = await db.execute('SELECT * FROM subscriptions');
            for (const { endpoint, keyss } of subscriptions) {
                const pushSubscription = {
                    endpoint,
                    keys: JSON.parse(keyss)
                };
                const payload = JSON.stringify({
                    title: 'Nuevo mensaje',
                    body: `${username} ha enviado: ${msg}`,
                    tag: 'chat-notification'
                });
                webpush.sendNotification(pushSubscription, payload)
                    .catch(error => console.error('Error enviando notificación', error));
            }
        } catch (e) {
            console.error(e);
        }
    });
};
