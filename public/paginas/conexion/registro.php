<?php
include "../conexion/conexion_db.php"; // Asegúrate de que la conexión a la base de datos esté correctamente incluida

// Verificar que el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $username = $con->real_escape_string($_POST['username']);
    $email = $con->real_escape_string($_POST['email']);
    $password = $_POST['password']; // La manejaremos más adelante con password_hash()

    // Validar que los campos no estén vacíos
    if (!empty($username) && !empty($email) && !empty($password)) {
        // Hashear la contraseña para almacenarla de manera segura
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Preparar la consulta SQL para evitar SQL Injection
        $stmt = $con->prepare("INSERT INTO r_usuarios (username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $hashed_password);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo "Registro exitoso. ¡Bienvenido, $username!";
        } else {
            // Si el usuario o correo ya existen (por ser UNIQUE), muestra un mensaje
            if ($con->errno == 1062) {
                echo "El usuario o correo ya existen. Por favor, elige otro.";
            } else {
                echo "Error: " . $con->error;
            }
        }

        // Cerrar la consulta
        $stmt->close();
    } else {
        echo "Por favor, rellena todos los campos.";
    }
}

// Cerrar la conexión a la base de datos
$con->close();
?>
