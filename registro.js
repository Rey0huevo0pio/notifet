const db = require('./db.js');
const bcrypt = require('bcrypt'); // Para encriptar la contraseña

// Función para registrar un nuevo usuario
async function registrarUsuario(username, email, password) {
    return new Promise((resolve, reject) => {
        // Verificar si el nombre de usuario o el correo ya están registrados
        db.query('SELECT * FROM usuarios WHERE username = ? OR email = ?', [username, email], function(err, results) {
            if (err) {
                return reject('Error en la consulta de verificación: ' + err);
            }

            if (results.length > 0) {
                return reject('El nombre de usuario o el correo electrónico ya están en uso.');
            }

            // Encriptar la contraseña
            bcrypt.hash(password, 10, function(err, hashedPassword) {
                if (err) {
                    return reject('Error al encriptar la contraseña: ' + err);
                }

                // Insertar el nuevo usuario en la base de datos
                db.query('INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err, result) {
                    if (err) {
                        return reject('Error al registrar el usuario: ' + err);
                    }

                    resolve('Usuario registrado exitosamente.');
                });
            });
        });
    });
}

module.exports = { registrarUsuario };
