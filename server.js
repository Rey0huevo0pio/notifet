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
        sendPushNotification(data); 
        io.emit('notificacion', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3001/');
});
