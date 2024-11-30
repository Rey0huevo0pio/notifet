const db = require('./db.js');
const bcrypt = require('bcrypt');

// Función para iniciar sesión
async function iniciarSesion(username, password) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE username = ?', [username], function(err, results) {
            if (err) {
                return reject('Error en el servidor.');
            }

            if (results.length === 0) {
                return reject('Usuario/Contraseña. Incorrecta.'); // Mensaje genérico
            }

            const user = results[0];

            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) {
                    return reject('Error en el servidor.');
                }

                if (!isMatch) {
                    return reject('Usuario/Contraseña. Incorrecta.'); // Mensaje genérico
                }
                
                setTimeout(()=>{
                 
                resolve('Inicio de sesión exitoso.');
                return reject('iniciando la paguina...');

            },5000);
            
            });
        });
    });
}

module.exports = { iniciarSesion };
