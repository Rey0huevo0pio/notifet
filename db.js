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
                        password VARCHAR(255) NOT NULL,
                            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                `;
                const crearTabla_notif = `
                CREATE TABLE IF NOT EXISTS subscriptions (
                    id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    userId VARCHAR(255) NOT NULL,
                    subscription VARCHAR(255) NOT NULL,
                         joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                   `;
                   const crearTabla_mensa= `
                CREATE TABLE IF NOT EXISTS menssages (
                    id INT(11) AUTO_INCREMENT PRIMARY KEY,
                    content TEXT,
                    username VARCHAR(255) NOT NULL,
                         joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                   `;
                   const crearTabla_grupo = `
                   CREATE TABLE IF NOT EXISTS grupo (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       Nombre_Grupo TEXT,
                       descripcion TEXT,
                       username VARCHAR(255) NOT NULL,
                       privilegio ENUM('public', 'private') NOT NULL,
                       creadorId INT NOT NULL,  -- Nueva columna para almacenar el ID del creador
                       joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (creadorId) REFERENCES usuarios(id) ON DELETE CASCADE
                   );

               `;               
               const crearTabla_Usuarios_grup = `
                   CREATE TABLE IF NOT EXISTS usuarios_grupos (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       userId INT NOT NULL,
                       groupId INT NOT NULL,
                       joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE,
                       FOREIGN KEY (groupId) REFERENCES grupo(id) ON DELETE CASCADE,
                       UNIQUE (userId, groupId)
                   );
               `;
               const crearTabla_grup_mensaje = `
              CREATE TABLE IF NOT EXISTS mensajes_grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    groupId INT NOT NULL,               -- Grupo al que pertenece el mensaje
    userId INT NOT NULL,                -- Usuario que envió el mensaje
    content TEXT NOT NULL,              -- Contenido del mensaje
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora del mensaje
    FOREIGN KEY (groupId) REFERENCES grupo(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE CASCADE
);

           `;
               
               



                        db.query(crearTabla, function (err, result) {
                    if (err) {
                        console.error('problemas al crear la tabla "usuarios": ', err.message);
                        return;
                    }
                db.query(crearTabla, function (err, result) {
                    if (err) {
                        console.error('problemas al crear la tabla "usuarios": ', err.message);
                        return;
                    }
                    console.log('Tabla "usuarios" fue creada correctamente.');
                });
                db.query(crearTabla_notif, function (err, result) {
                    if (err) {
                        console.error('problemas al crear la tabla "Notificacion": ', err.message);
                        return;
                    }
                    console.log('Tabla "Notificacion" fue creada correctamente.');
                });
                db.query(crearTabla_mensa, function (err, result) {
                    if (err) {
                        console.error('problemas al crear la tabla "mensaje": ', err.message);
                        return;
                    }
                    console.log('Tabla "mensaje" fue creada correctamente.');
                });
            });
            db.query(crearTabla_grupo, function (err, result) {
                if (err) {
                    console.error('problemas al crear la tabla "Grupos": ', err.message);
                    return;
                }
                console.log('Tabla "Grupos" fue creada correctamente.');
            });
            db.query(crearTabla_Usuarios_grup, function (err, result) {
                if (err) {
                    console.error('problemas al crear la tabla "Grupos de usuarios": ', err.message);
                    return;
                }
                console.log('Tabla "Grupos de usuarios" fue creada correctamente.');
            });
            db.query(crearTabla_grup_mensaje, function (err, result) {
                if (err) {
                    console.error('problemas al crear la tabla "mensajes de grupo": ', err.message);
                    return;
                }
                console.log('Tabla "mensajes de grupo" fue creada correctamente.');
            });
        });

       
     });
     
    });
    


module.exports = db;
