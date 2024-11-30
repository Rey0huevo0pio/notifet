const db = require('../../../db'); // Importa la configuración de la base de datos

// Función para crear un grupo
function crearGrupo(req, res) {
    const { content, username, privilegio, created_at } = req.body;

    if (!content || !username || !privilegio || !created_at) {
        res.status(400).send('Faltan datos obligatorios');
        return;
    }

    const query = `INSERT INTO grupo (content, username, privilegio, created_at) VALUES (?, ?, ?, ?)`;
    db.query(query, [content, username, privilegio, created_at], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al guardar el grupo');
        } else {
            res.status(200).send('Grupo creado exitosamente');
        }
    });
}
function obtenerGrupos(req, res) {
    const username = req.session.username; // Obtenemos el username de la sesión

    if (!username) {
        res.status(401).send('Usuario no autenticado');
        return;
    }

    const query = `SELECT * FROM grupo WHERE username = ? OR privilegio = 'public'`;
    
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al obtener los grupos');
        } else {
            res.status(200).json(results);
        }
    });
}

module.exports = { crearGrupo, obtenerGrupos };
