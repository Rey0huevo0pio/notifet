const express = require('express');
const socket = require('socket.io');
const http = require('http');
const session = require('express-session');
const cors = require('cors');
const db =require('./db');
require('dotenv').config();


const { registrarUsuario } = require('./registro');
const { iniciarSesion } = require('./login');
const { subscribeUser, sendPushNotification } = require('./public/src/notifications');
const {cargarMensajes, guardarMensaje } = require('./public/controles-js/mensajes.js/Gurdar_m');


const app = express();
const server = http.createServer(app); 
const io = socket(server);

// Middleware de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Middleware para verificar autenticación
function verificarAutenticacion(req, res, next) {
    if (req.session.username) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Configuración del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['*'],
    credentials: true
}));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const message = await iniciarSesion(username, password);
        req.session.username = username;
        console.log('Usuario autenticado:', req.session.username); // Debug
        res.status(200).json({ success: true, username: req.session.username, message });
    } catch (error) {
        console.log('Error en autenticación:', error); // Debug
        res.status(401).json({ success: false, message: error });
    }
});


app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/public/registro.html');
});

app.post('/registro', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const message = await registrarUsuario(username, email, password);
        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(400).json({ success: false, message: error });
    }
});

// Protege esta ruta
app.get('/principal', verificarAutenticacion, (req, res) => {
    res.sendFile(__dirname + '/public/httt/principal.html');
});

// Protege esta ruta
app.get('/user-info', verificarAutenticacion, (req, res) => {
    res.json({ username: req.session.username });
});

// WebSockets
io.on('connection', (socket) => {
    const username = socket.handshake.auth.username || 'Anónimo';

    console.log(`Nuevo usuario conectado: ${username}`);

    // Cargar mensajes previos
    cargarMensajes((err, results) => {
        if (err) {
            socket.emit('error', 'No se pudieron cargar los mensajes');
            return;
        }
        socket.emit('load messages', results);
    });

    socket.on('chat message', (msg) => {
        const serverOffset = Date.now();
        guardarMensaje(msg, username, serverOffset, (err) => {
            if (err) {
                socket.emit('error', 'No se pudo guardar el mensaje');
                return;
            }
            io.emit('chat message', { msg, serverOffset, username });
        });
    });

    socket.on('disconnect', () => {
        console.log(`${username} se ha desconectado`);
    });
});



server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});
