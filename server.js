const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { subscribeUser, sendPushNotification } = require('./public/notifications'); // Asegúrate de que esta ruta es correcta
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.json());
app.use(express.static('public'));



app.get('/vapid-public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });


});



app.post('/subscribe', (req, res) => {
    const { userId, subscription } = req.body;
    console.log('Solicitud de suscripción recibida:', { userId, subscription });


    if (!subscription || Object.keys(subscription).length === 0) {
        console.error('Suscripción inválida:', subscription);
        return res.status(400).json({ error: 'Suscripción inválida' });
    }

    subscribeUser(userId, subscription, res);
});

io.on('connection', (socket) => {
    console.log('usuario conectado');

    socket.on('mensaje', (data) => {
     
        sendPushNotification(data); 
        io.emit('notificacion', data);

    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});


server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});







