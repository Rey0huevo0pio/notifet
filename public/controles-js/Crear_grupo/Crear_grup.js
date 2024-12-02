const db = require('../../../db');

// Función para crear un grupo
function crearGrupo(req, res, io) {
    const { Nombre_Grupo, descripcion, privilegio } = req.body;
    const userId = req.session.userId;
    const username = req.session.username;

    // Validación de datos obligatorios
    if (!Nombre_Grupo || !descripcion || !privilegio) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para crear el grupo.' });
    }

    const queryGrupo = `
        INSERT INTO grupo (Nombre_Grupo, descripcion, privilegio, creadorId, username)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(queryGrupo, [Nombre_Grupo, descripcion, privilegio, userId, username], (err, result) => {
        if (err) {
            console.error('Error al guardar el grupo: ', err);
            return res.status(500).json({ error: 'Ocurrió un error al guardar el grupo.' });
        }

        res.status(201).json({
            success: true,
            message: 'Grupo creado exitosamente.',
            groupId: result.insertId,
        });

        // Notificar a los clientes conectados (si aplica)
        if (io) {
            io.emit('nuevoGrupo', { Nombre_Grupo, descripcion, privilegio, creadorId: userId });
        }
    });
}

// Función para obtener los grupos del usuario
function obtenerGrupos(req, res) {
    const userId = req.session.userId;

    const queryMisGrupos = `
        SELECT g.id, g.Nombre_Grupo, g.descripcion, g.username, g.privilegio
        FROM grupo g
        WHERE g.creadorId = ? OR g.id IN (
            SELECT groupId FROM usuarios_grupos WHERE userId = ?
        )
    `;

    db.query(queryMisGrupos, [userId, userId], (err, grupos) => {
        if (err) {
            console.error('Error al obtener mis grupos: ', err);
            return res.status(500).json({ error: 'Error al obtener tus grupos.' });
        }

        const queryGruposDisponibles = `
            SELECT g.id, g.Nombre_Grupo, g.descripcion, g.username, g.privilegio
            FROM grupo g
            WHERE g.id NOT IN (
                SELECT groupId FROM usuarios_grupos WHERE userId = ?
            ) AND g.privilegio = 'publico'
        `;

        db.query(queryGruposDisponibles, [userId], (err, gruposDisponibles) => {
            if (err) {
                console.error('Error al obtener grupos disponibles: ', err);
                return res.status(500).json({ error: 'Error al obtener grupos disponibles.' });
            }

            res.status(200).json({
                misGrupos: grupos,
                gruposDisponibles,
            });
        });
    });
}

module.exports = { crearGrupo, obtenerGrupos };
