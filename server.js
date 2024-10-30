const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const webPush = require('web-push');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de VAPID
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
};

webPush.setVapidDetails(`mailto:${process.env.EMAIL}`, vapidKeys.publicKey, vapidKeys.privateKey);

// Conexión a la base de datos
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

app.use(express.static('public'));
app.use(express.json());

// Endpoint para obtener la clave pública VAPID
app.get('/vapid-public-key', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
});

// Endpoint para recibir las suscripciones
app.post('/subscribe', (req, res) => {
    const { userId, subscription } = req.body;
    
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
                    return res.status(201).json({});
                });
            }
        });
    } else {
        console.error('Suscripción inválida:', subscription);
        res.status(400).json({ error: 'Suscripción inválida' });
    }
});

// Función para enviar notificaciones push
const verifySubscription = (subscription) => {
    return webPush.sendNotification(subscription, 'Verificación')
        .then(() => true)
        .catch(err => {
            if (err.statusCode === 410) {
                return false; // La suscripción ya no es válida
            }
            throw err; // Otros errores deben ser manejados
        });
};

// Función para enviar notificaciones
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
                // Si la suscripción no es válida, eliminarla
                const deleteQuery = 'DELETE FROM subscriptions WHERE userId = ? AND subscription = ?';
                db.query(deleteQuery, [row.userId, row.subscription], (delErr) => {
                    if (delErr) {
                        console.error('Error al eliminar la suscripción inválida:', delErr);
                    } else {
                        console.log('Suscripción eliminada de la base de datos');
                    }
                });
            } else {
                // Si es válida, enviar la notificación
                const payload = JSON.stringify({
                    title: 'Nuevo Mensaje',
                    body: message,
                    url: 'http://localhost:3000/' // Página principal en lugar de mensajes
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



// Lógica de socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('mensaje', (data) => {
        sendPushNotification(data);
        io.emit('notificacion', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Función para enviar recordatorios periódicos
const reminderInterval = setInterval(() => {
    sendPushNotification('No olvides volver a la página para ver nuevos');
}, 10000); // Cada 60 segundos



server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});
