// mensajes.js
const db = require('../../../db');

/**
 * Carga todos los mensajes de la base de datos.
 * @param {Function} callback Función de devolución de llamada con los resultados o el error.
 */
function cargarMensajes(callback) {
    const query = 'SELECT * FROM menssages ORDER BY created_at ASC';
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
function guardarMensaje(msg, username, serverOffset, callback) {
    const query = 'INSERT INTO menssages (content, username, created_at) VALUES (?, ?, ?)';
    db.query(query, [msg, username, new Date(serverOffset).toISOString()], (err, results) => {
        if (err) {
            console.error('Error al guardar el mensaje:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

module.exports = {
    cargarMensajes,
    guardarMensaje,
};
