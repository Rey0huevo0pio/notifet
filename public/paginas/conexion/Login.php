<?php
include "../conexion/conexion_db.php";

$user = $_POST['username'];
$pass = $_POST['password'];

$sql = "SELECT * FROM usuarioss WHERE namuser = '$user' AND contra = '$pass'";
$result = $con->query($sql);

if ($result->num_rows > 0) {

    header ("Location: /public/paguina_1.html ");
    exit();
} else {

    echo "Usuario o contraseña incorrectos.";
}

$con->close();
?>

