<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/Inicio_1.css">
    <title>Inicio</title>
</head>
<body>
    <header class="con_hed">
        <div class="hed_log">
            <img src="css/img/imagenes-ia-sueno-o-pesadilla.webp" alt="Logo">
            <h2 class="con_ti">Pesses</h2>
        </div>
        <div class="hed_bus">
            <input class="int" type="text" placeholder="Busca...">
            <button class="hed_bott" type="submit">Buscar</button>
        </div>
        <nav class="hed_nav">
            <a href="#" class="hed_opt" id="linkLiberacion">Liberación</a>
            <a href="#" class="hed_opt" id="linkAsesor">Asesor</a>
            <a href="#" class="hed_opt" id="linkMensajes">Mensajes</a>
        </nav>
    </header>
    
    <div class="container">
        <!-- Sección para "Liberación" -->
        <div id="listaLiberacion" class="con_div_1 lista_opciones">
            <ul>
                <li>Opción 1 de Liberación</li>
                <li>Opción 2 de Liberación</li>
                <li>Opción 3 de Liberación</li>
            </ul>
        </div>

        <!-- Sección para "Asesor" -->
        <div id="listaAsesor" class="con_div_1 lista_opciones">
            <ul>
                <li>Opción 1 de Asesor</li>
                <li>Opción 2 de Asesor</li>
                <li>Opción 3 de Asesor</li>
            </ul>
        </div>

        <!-- Sección para "Mensajes" -->
        <div id="listaMensajes" class="con_div_1 lista_opciones">
            <ul>
                <li>Mensaje 1</li>
                <li>Mensaje 2</li>
                <li>Mensaje 3</li>
            </ul>
        </div>
    </div>

    <!-- Enlace al archivo de JavaScript -->
    <script src="javascript/Inicio.js"></script>
</body>
</html>
