const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');
const webPush = require('web-push');
const NotificationManager = require('./public/notifications'); // Importar la clase

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    email: process.env.EMAIL
};

// Configurar la base de datos MySQL
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

// Instanciar la clase NotificationManager
const notificationManager = new NotificationManager(db, webPush, vapidKeys);

app.use(express.static('public'));
app.use(express.json());

app.get('/vapid-public-key', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
});

app.post('/subscribe', async (req, res) => {
    const { userId, subscription } = req.body;

    try {
        const result = await notificationManager.subscribeUser(userId, subscription);
        res.status(result.status).json({ message: result.message });
    } catch (err) {
        console.error('Error al suscribir usuario:', err);
        res.status(500).json({ error: 'Error al suscribir usuario' });
    }
});

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('mensaje', async (data) => {
        console.log('Mensaje recibido:', data);

        try {
            await notificationManager.sendPushNotification(data);
            console.log('Notificación enviada con éxito');
        } catch (err) {
            console.error('Error al enviar la notificación:', err);
        }

        io.emit('notificacion', data); // Emitir el mensaje a todos los usuarios conectados
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});
