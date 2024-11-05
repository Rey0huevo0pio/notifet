// Obtener usuarios y mensajes de un grupo
app.get('/api/grupos/:id', async (req, res) => {
    const groupId = req.params.id;

    try {
        // Obtener los usuarios en línea
        const usuarios = await db.query('SELECT * FROM users WHERE groupId = ?', [groupId]);

        // Obtener los mensajes del grupo
        const mensajes = await db.query('SELECT * FROM mensajes WHERE groupId = ? ORDER BY created_at', [groupId]);

        res.json({ usuarios, mensajes });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el grupo' });
    }
});
