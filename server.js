const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { subscribeUser, sendPushNotification } = require('./public/notifications');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
app.use(express.json());



io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');
    socket.on('mensaje', (data) => {
        console.log('Mensaje recibido:', data);

        // Asegurarnos de que el mensaje se envía correctamente a los suscriptores
        sendPushNotification(data)
            .then(() => {
                console.log('Notificación enviada con éxito');
            })
            .catch(err => {
                console.error('Error al enviar la notificación:', err);
            });

        // Emitir el mensaje a todos los usuarios conectados
        io.emit('notificacion', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});
