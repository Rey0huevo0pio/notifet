const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de que la ruta sea correcta

// Obtener grupos de un usuario
router.get('/', (req, res) => {
    const userId = req.query.userId; // Obtiene el ID del usuario de la consulta

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
        res.json(results); // Devuelve los grupos en formato JSON
    });
});

// Obtener miembros de un grupo
router.get('/miembros', (req, res) => {
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
        res.json(results); // Devuelve los miembros en formato JSON
    });
});

module.exports = router; // Exporta el router
