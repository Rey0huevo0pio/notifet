const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let grupos = [];

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('crearGrupo', (nombreGrupo) => {
        grupos.push(nombreGrupo);
        io.emit('actualizarGrupos', grupos); // Emitir la lista de grupos actualizada
    });

    // Otras lógicas para manejar mensajes privados o demás eventos
});

// Servir archivos estáticos
app.use(express.static('public')); // Asumiendo que tu HTML y CSS están en 'public'

// Iniciar el servidor
http.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
