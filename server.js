const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { subscribeUser, sendPushNotification } = require('./public/notifications');
const mysql = require('mysql');
require('dotenv').config();

// Configurar la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('public'));

// Obtener clave pública VAPID
app.get('/vapid-public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Crear grupo
app.post('/crear-grupo', (req, res) => {
    const { nombreGrupo, userId } = req.body;

    if (!nombreGrupo || !userId) {
        return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }

    const query = 'INSERT INTO grupos (nombre, creadorId, created_at) VALUES (?, ?, NOW())';
    db.query(query, [nombreGrupo, userId], (err, result) => {
        if (err) {
            console.error('Error al crear grupo:', err);
            return res.status(500).json({ success: false, message: 'Error del servidor' });
        }
        res.status(201).json({ success: true, message: 'Grupo creado', groupId: result.insertId });
    });
});

// Obtener grupos de un usuario
// Obtener grupos de un usuario
app.get('/api/grupos', (req, res) => {
    const userId = req.query.userId; // Asegúrate de que el ID del usuario se pasa como query

    const query = `
        SELECT g.id, g.nombre 
        FROM grupos g
        JOIN miembros_grupo mg ON g.id = mg.grupoId
        WHERE mg.userId = ? OR g.creadorId = ?`;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error al obtener grupos:', err);
            return res.status(500).json({ error: 'Error al obtener grupos' });
        }
        res.json(results);
    });
});


// Obtener miembros de un grupo
app.get('/api/grupo-miembros', (req, res) => {
    const grupoId = req.query.grupoId;

    const query = `
        SELECT u.nombre FROM usuarios u
        JOIN miembros_grupo mg ON u.id = mg.userId
        WHERE mg.grupoId = ?`;

    db.query(query, [grupoId], (err, results) => {
        if (err) {
            console.error('Error al obtener miembros del grupo:', err);
            return res.status(500).json({ error: 'Error al obtener miembros del grupo' });
        }
        res.json(results);
    });
});

// Suscribir usuario
app.post('/subscribe', (req, res) => {
    const { userId, subscription } = req.body;

    if (!subscription || Object.keys(subscription).length === 0) {
        return res.status(400).json({ error: 'Suscripción inválida' });
    }

    subscribeUser(userId, subscription, res);
});

// Socket.IO para manejar eventos de mensajería
io.on('connection', (socket) => {
    console.log('Usuario conectado');

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
