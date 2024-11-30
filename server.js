const express = require('express');
const socket = require('socket.io');
const http = require('http');
const session = require('express-session');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');

const { registrarUsuario } = require('./registro');
const { iniciarSesion } = require('./login');
const { subscribeUser, sendPushNotification } = require('./public/src/notifications');
const { cargarMensajes, guardarMensaje } = require('./public/controles-js/mensajes.js/Gurdar_m');
const { crearGrupo, obtenerGrupos } = require('./public/controles-js/Crear_grupo/Crear_grup');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Middleware de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware para verificar autenticación
function verificarAutenticacion(req, res, next) {
    if (req.session.username) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Middleware para añadir el nombre de usuario al socket
io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('Usuario no autenticado'));
    }
    socket.username = username;
    next();
});

// Configuración del servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
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
        res.status(200).json({ success: true, username: req.session.username, message });
    } catch (error) {
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

app.get('/principal', verificarAutenticacion, (req, res) => {
    res.sendFile(__dirname + '/public/httt/principal.html');
});

app.get('/user-info', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ message: 'Usuario no autenticado' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: 'Sesión cerrada' });
    });
});

app.post('/crear-grupo', crearGrupo);

app.get('/mis-grupos', verificarAutenticacion, obtenerGrupos);

// WebSockets
io.on('connection', (socket) => {
    console.log(`Nuevo usuario conectado: ${socket.username}`);
    cargarMensajes((err, results) => {
        if (err) {
            socket.emit('error', 'No se pudieron cargar los mensajes');
            return;
        }
        socket.emit('load messages', results);
    });

    socket.on('chat message', (msg) => {
        const serverOffset = Date.now();
        guardarMensaje(msg, socket.username, serverOffset, (err) => {
            if (err) {
                socket.emit('error', 'No se pudo guardar el mensaje');
                return;
            }
            io.emit('chat message', { msg, serverOffset, username: socket.username });
        });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username} se ha desconectado`);
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});
