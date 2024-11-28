// Suponiendo que usas Node.js con Socket.io

const io = require('socket.io')(server);

// Al recibir un evento de logout
io.on('connection', (socket) => {
    console.log('Usuario conectado');

});
