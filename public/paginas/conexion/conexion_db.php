<?php
$con=new mysqli("localhost", "root", "", "mi_registro");
if($con->connect_error){
    die("error de conexion: " . $con->connect_error);

}


?>