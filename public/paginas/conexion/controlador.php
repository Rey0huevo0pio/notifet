<?php
if (!empty($_POST["btn"])) {

    // Verifica si se está intentando iniciar sesión
    if ($_POST["btn"] === "Iniciar Sesión") {
        if (empty($_POST["username"]) || empty($_POST["password"])) {
            echo '<div class="message M_ERROR">LOS CAMPOS SON OBLIGATORIOS</div>';
        } else {
            $user = $_POST['username'];
            $pass = $_POST['password'];

            // Consulta preparada para el inicio de sesión
            $stmt = $con->prepare("SELECT * FROM usuarioss WHERE namuser = ?");
            $stmt->bind_param("s", $user);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $datos = $result->fetch_object();

                // Verificación de la contraseña (si se usa hash)
                if (password_verify($pass, $datos->contra)) {
                    header("Location: Inicio.php");
                    exit(); // Asegura que el script se detenga después de redirigir
                } else {
                    echo '<div class="message M_ERROR">REVISA TUS DATOS O REGISTRATE</div>';
                }
            } else {
                echo '<div class="message M_ERROR">REVISA TUS DATOS O REGISTRATE</div>';
            }

            $stmt->close();
        }
    }

    // Verifica si se está intentando registrar
    if ($_POST["btn"] === "Registrar") {
        $user = $_POST['username'];
        $pass = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];

        // Validar campos vacíos
        if (empty($user) || empty($pass) || empty($confirm_password)) {
            echo "<div class='message M_ERROR'>Por favor, completa los campos</div>";
        } 
        // Verificar si las contraseñas coinciden
        elseif ($pass !== $confirm_password) {
            echo "<div class='message M_ERROR'>Por favor, verifique su contraseña</div>";
        } 
        // Si todo está bien, verificamos si el usuario ya existe
        else {
            // Comprobar si el usuario ya está registrado
            $checkUser = $con->prepare("SELECT * FROM usuarioss WHERE namuser = ?");
            $checkUser->bind_param("s", $user);
            $checkUser->execute();
            $result = $checkUser->get_result();

            if ($result->num_rows > 0) {
                echo "<div class='message M_ERROR'>El nombre de usuario ya está registrado. Elige otro.</div>";
            } else {
                // Si no existe, lo registramos
                $passwordHash = password_hash($pass, PASSWORD_DEFAULT);

                $sql = "INSERT INTO usuarioss (namuser, contra) VALUES (?, ?)";
                $stmt = $con->prepare($sql);

                if ($stmt) {
                    $stmt->bind_param("ss", $user, $passwordHash);

                    if ($stmt->execute()) {
                        echo "<div class='message M_SUCCESS'>Registro exitoso. ¡Ahora puedes iniciar sesión!</div>";
                    } else {
                        echo "<div class='message M_ERROR'>Error en el registro. Inténtalo nuevamente.</div>";
                    }

                    $stmt->close(); // Cerrar la declaración preparada
                } else {
                    echo "<div class='message M_ERROR'>Error en la preparación de la consulta.</div>";
                }
            }
            $checkUser->close(); // Cerrar la verificación de usuario
        }
    }
}