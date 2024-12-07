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
        res.status(401).json({ error: 'No autenticado' });
    }
}

// Middleware para añadir el nombre de usuario al socket
io.use(async (socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error('Usuario no autenticado'));
    }

    const query = 'SELECT id FROM usuarios WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err || results.length === 0) {
            return next(new Error('Usuario inválido'));
        }
        socket.userId = results[0].id;
        next();
    });
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

// Ruta para el inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const { message, userId, username: userUsername } = await iniciarSesion(username, password);

        // Guardar datos en la sesión
        req.session.userId = userId;
        req.session.username = userUsername;

        // Devolver respuesta JSON correctamente estructurada
        res.status(200).json({ 
            success: true, 
            message, 
            userId, 
            username: userUsername 
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: error 
        });
    }
});

// Ruta para el registro
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/public/registro.html');
});

// Ruta para manejar el registro de usuario
app.post('/registro', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const message = await registrarUsuario(username, email, password);
        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(400).json({ success: false, message: error });
    }
});

// Ruta para la página principal (requiere autenticación)
app.get('/principal', verificarAutenticacion, (req, res) => {
    res.sendFile(__dirname + '/public/httt/principal.html');
});

// Ruta para obtener información del usuario autenticado
app.get('/user-info', (req, res) => {
    if (req.session.username) {
        res.json({ username: req.session.username });
    } else {
        res.status(401).json({ message: 'Usuario no autenticado' });
    }
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: 'Sesión cerrada' });
    });
});

// Ruta para crear un grupo (requiere autenticación)
app.post('/crear-grupo', verificarAutenticacion, (req, res) => {
    crearGrupo(req, res, io); // Pasar el objeto 'io' al controlador
});

// Ruta para obtener los grupos (requiere autenticación)
app.get('/mis-grupos', verificarAutenticacion, obtenerGrupos);


// Ruta para unirse a un grupo (requiere autenticación)
app.post('/unirse-grupo', verificarAutenticacion, (req, res) => {
    const userId = req.session.userId;
    const { grupoId } = req.body;

    if (!userId || !grupoId) {
        return res.status(400).json({ error: 'Datos insuficientes' });
    }

    const query = `
        INSERT INTO usuarios_grupos (userId, groupId) 
        VALUES (?, ?)
    `;

    db.query(query, [userId, grupoId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al unirse al grupo' });
        }
        res.json({ message: 'Te has unido al grupo exitosamente.' });
    });
});

// Ruta para unirse a un grupo (requiere autenticación)
// ... (resto del código)

app.get('/grupos-disponibles', verificarAutenticacion, (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const query = `
        SELECT g.id, g.Nombre_Grupo, g.descripcion 
        FROM grupo g 
        LEFT JOIN usuarios_grupos ug ON g.id = ug.groupId
        WHERE g.creadorId != ? 
        AND (ug.userId != ? OR ug.userId IS NULL)
        AND g.privilegio = 'public';
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los grupos' });
        }
        res.json(results);
    });
});



// WebSockets
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Unir a una sala específica
    socket.on('join room', (grupoId) => {
        socket.join(grupoId);
        console.log(`Usuario unido a la sala ${grupoId}`);
    });

    // Manejar mensajes en una sala específica
    socket.on('chat message', ({ msg, grupoId }) => {
        guardarMensaje(msg, socket.username, grupoId, (err) => {
            if (err) {
                socket.emit('error', 'No se pudo guardar el mensaje');
                return;
            }
            io.to(grupoId).emit('chat message', { msg, username: socket.username });
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});



server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});