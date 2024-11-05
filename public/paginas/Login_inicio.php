<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/login_inicio.css">
    <title>Iniciar Sesión</title>
</head>


<body> 


    <div class="container" id="login-container">
        <h2>Inicio de Sesión</h2>
       
        <form action="" method="POST" id="login-form">
     
          <?php
        include ( "conexion/conexion_db.php");
        include ( "conexion/controlador.php");
        ?>
        
        <div class="inp">
                <label for="username">Usuario:</label>
                <input type="text" placeholder="Ingresa tu Control" id="username" name="username"><br><br>
            </div>
            <div class="inp">
                <label for="password">Contraseña:</label>
                <input type="password" placeholder="Ingresa tu Contraseña" id="password" name="password"><br><br>
            </div>
            <input name="btn" class="btn-sub" type="submit" value="Iniciar Sesión">
        </form>
        <div class="con_a">
            <a href="#" id="show-register">¿Registrate?</a>
        </div>
    </div>

    <div class="container" id="register-container" style="display:none;">
        <h1 class="Reg_tit">Registro</h1>
      
        <form action="" method="POST" id="register-form">

            <div class="inp">
                <label for="username-register">Usuario:</label>
                <input type="text" placeholder="Ingresa tu Control" id="username-register" name="username"><br><br>
            </div>
            <div class="inp">
                <label for="password-register">Contraseña:</label>
                <input type="password" placeholder="Ingresa tu Contraseña" id="password-register" name="password"><br><br>
            </div>

            <div class="inp">
            <label for="confirm-password">Confirmar Contraseña:</label>
            <input type="password" placeholder="Confirma tu Contraseña" id="confirm-password" name="confirm_password"><br><br>
            </div>

            <input name="btn" class="btn-sub" type="submit" value="Registrar">
        </form>
        <div class="con_a">
            <a href="#" id="show-login">¿Inicio?</a>
        </div>
    </div>

    <script src="javascript/main_cambio.js"></script>
</body>

</html>
