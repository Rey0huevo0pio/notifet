const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
});

db.connect(function (err) {
    if (err) {
        console.log('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado al servidor MySQL.');

    db.query('DROP DATABASE IF EXISTS piochat', function (err, result) {
  
        db.query('CREATE DATABASE IF NOT EXISTS piochat', function (err, result) {
            if (err) {
                console.error('Problemas al crear la tabla principal: ', err.message);
                return;
            }
            console.log('base principal de "piochat" fue creada correctamente.');


            db.changeUser({ database: 'piochat' }, function (err) {
                if (err) {
                    console.error('PROBLEMAS al cambiar a la base principal de "piochat": ', err.message);
                    return;
                }
                console.log('Usando la base de datos "piochat".');
                const crearTabla = `
                    CREATE TABLE IF NOT EXISTS usuarios (
                        id INT(11) AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        password VARCHAR(255) NOT NULL
                    );
                `;
                db.query(crearTabla, function (err, result) {
                    if (err) {
                        console.error('problemas al crear la tabla "usuarios": ', err.message);
                        return;
                    }
                    console.log('Tabla "usuarios" fue creada correctamente.');
                });
            });
        });
    });
});

module.exports = db;
