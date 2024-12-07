const db = require('../../../db');

/**
 * Carga todos los mensajes de la base de datos.
 * @param {Function} Función de devolución de llamada con los resultados o el error.
 */
function cargarMensajes(callback) {
    const query = 'SELECT * FROM menssages ORDER BY joined_at ASC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al cargar mensajes:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

/**
 * Inserta un nuevo mensaje en la base de datos.
 * @param {string} msg Contenido del mensaje.
 * @param {string} username Nombre de usuario.
 * @param {number} serverOffset Marca de tiempo del servidor.
 * @param {Function} callback Función de devolución de llamada con los resultados o el error.
 */
function guardarMensaje(msg, username, grupoId, callback) {
    const verifyMembershipQuery = `
        SELECT COUNT(*) AS count 
        FROM usuarios_grupos 
        WHERE userId = (SELECT id FROM usuarios WHERE username = ?) AND groupId = ?;
    `;

    db.query(verifyMembershipQuery, [username, grupoId], (err, results) => {
        if (err) {
            console.error('Error verificando membresía del usuario:', err);
            return callback(err, null);
        }
        if (results[0].count === 0) {
            return callback(new Error('Usuario no pertenece al grupo'), null);
        }

        const insertMessageQuery = `
            INSERT INTO mensajes_grupos (content, userId, groupId)
            VALUES (?, (SELECT id FROM usuarios WHERE username = ?), ?)
        `;
        db.query(insertMessageQuery, [msg, username, grupoId], (err, results) => {
            if (err) {
                console.error('Error al guardar el mensaje:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    });
}



module.exports = {
    cargarMensajes,
    guardarMensaje,
};