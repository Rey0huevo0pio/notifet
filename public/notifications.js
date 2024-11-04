const webPush = require('web-push');
const mysql = require('mysql');
require('dotenv').config();

const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
};

webPush.setVapidDetails(`mailto:${process.env.EMAIL}`, vapidKeys.publicKey, vapidKeys.privateKey);

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Suscribir usuario
const subscribeUser = (userId, subscription, res) => {
    if (subscription && subscription.endpoint) {
        const checkQuery = 'SELECT * FROM subscriptions WHERE userId = ? AND subscription = ?';
        db.query(checkQuery, [userId, JSON.stringify(subscription)], (err, results) => {
            if (err) {
                console.error('Error al verificar la suscripción:', err);
                return res.status(500).json({ error: 'Error al verificar la suscripción' });
            }

            if (results.length > 0) {
                console.log('La suscripción ya existe en la base de datos:', { userId, subscription });
                return res.status(200).json({ message: 'Ya estás suscrito' });
            } else {
                const insertQuery = 'INSERT INTO subscriptions (userId, subscription, created_at) VALUES (?, ?, NOW())';
                db.query(insertQuery, [userId, JSON.stringify(subscription)], (err, result) => {
                    if (err) {
                        console.error('Error al guardar la suscripción:', err);
                        return res.status(500).json({ error: 'Error al guardar la suscripción' });
                    }
                    console.log('Nueva suscripción guardada:', { userId, subscription });
                    return res.status(201).json({ message: 'Suscripción guardada exitosamente' });
                });
            }
        });
    } else {
        console.error('Suscripción inválida:', subscription);
        res.status(400).json({ error: 'Suscripción inválida' });
    }
};

// Verifica la suscripción
const verifySubscription = (subscription) => {
    return webPush.sendNotification(subscription, 'Verificación')
        .then(() => true)
        .catch(err => {
            if (err.statusCode === 410) {
                return false; // Suscripción no válida
            }
            throw err; 
        });
};

// Envía notificaciones push
const sendPushNotification = async (message) => {
    const query = 'SELECT userId, subscription FROM subscriptions';

    db.query(query, async (err, results) => {
        if (err) {
            console.error('Error al obtener las suscripciones:', err);
            return;
        }

        for (const row of results) {
            const subscription = JSON.parse(row.subscription);
            const isValid = await verifySubscription(subscription);
            
            if (!isValid) {
                const deleteQuery = 'DELETE FROM subscriptions WHERE userId = ? AND subscription = ?';
                db.query(deleteQuery, [row.userId, row.subscription], (delErr) => {
                    if (delErr) {
                        console.error('Error al eliminar la suscripción inválida:', delErr);
                    } else {
                        console.log('Suscripción eliminada de la base de datos');
                    }
                });
            } else {
                const payload = JSON.stringify({
                    title: 'Nuevo Mensaje',
                    body: message,
                    url: 'http://localhost:3000/' 
                });

                webPush.sendNotification(subscription, payload)
                    .then(() => {
                        console.log('Notificación enviada');
                    })
                    .catch(err => {
                        console.error('Error al enviar la notificación', err);
                    });
            }
        }
    });
};

// Intervalo para recordatorio (ajustar el tiempo según sea necesario)
const reminderInterval = setInterval(() => {
    sendPushNotification('No olvides volver a la página para ver nuevos');
}, 10000); // Cambié a 10 segundos para pruebas

module.exports = { subscribeUser, sendPushNotification };
