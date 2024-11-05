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
