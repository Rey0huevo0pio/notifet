const mysql = require('mysql');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

// Crear la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306 // Opcional, si usas un puerto distinto
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err; // Lanza un error si la conexión falla
    }
    console.log('Conectado a la base de datos MySQL');
});

// Exportar la conexión para que pueda ser utilizada en otros archivos
module.exports = db;
