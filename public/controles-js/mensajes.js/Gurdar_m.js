const db = require('../../../db');

/**
 * Carga todos los mensajes de la base de datos.
 * @param {Function} Función de devolución de llamada con los resultados o el error.
 */
const cargarMensajes = (groupId, callback) => {
    const query = `
        SELECT m.content, u.username 
        FROM mensajes_grupos m
        JOIN usuarios u ON m.userId = u.id
        WHERE m.groupId = ?
        ORDER BY m.created_at ASC;
    `;
    db.query(query, [groupId], callback);
};



/**
 * Inserta un nuevo mensaje en la base de datos.
 * @param {string} msg Contenido del mensaje.
 * @param {string} username Nombre de usuario.
 * @param {number} serverOffset Marca de tiempo del servidor.
 * @param {Function} callback Función de devolución de llamada con los resultados o el error.
 */
const guardarMensaje = (msg, username, groupId, timestamp, callback) => {
    const queryUser = 'SELECT id FROM usuarios WHERE username = ?';
    db.query(queryUser, [username], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error obteniendo usuario:', err || 'Usuario no encontrado');
            return callback('Usuario no encontrado');
        }
        const userId = results[0].id;
        const queryInsert = `
            INSERT INTO mensajes_grupos (content, userId, groupId, created_at)
            VALUES (?, ?, ?, ?);
        `;
        db.query(queryInsert, [msg, userId, groupId, new Date(timestamp)], (err, result) => {
            if (err) {
                console.error('Error al guardar el mensaje:', err);
                return callback(err);
            }
            console.log('Mensaje guardado correctamente:', result);
            callback(null, result);
        });
    });
};




module.exports = {
    cargarMensajes,
    guardarMensaje,
};