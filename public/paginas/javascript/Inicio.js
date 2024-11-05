// Manejar el click de cada opción del menú
document.getElementById('linkLiberacion').addEventListener('click', function(event) {
    event.preventDefault();
    alternarLista('listaLiberacion');
});

document.getElementById('linkAsesor').addEventListener('click', function(event) {
    event.preventDefault();
    alternarLista('listaAsesor');
});

document.getElementById('linkMensajes').addEventListener('click', function(event) {
    event.preventDefault();
    alternarLista('listaMensajes');
});

function alternarLista(id) {
    // Obtener la lista seleccionada
    const listaSeleccionada = document.getElementById(id);

    // Verificar si la lista seleccionada ya está visible
    const isVisible = listaSeleccionada.classList.contains('lista_opciones_visible');

    // Ocultar todas las listas
    document.querySelectorAll('.lista_opciones').forEach(function(lista) {
        lista.classList.remove('lista_opciones_visible');
    });

    // Si la lista seleccionada no estaba visible, mostrarla
    if (!isVisible) {
        listaSeleccionada.classList.add('lista_opciones_visible');
    }
}
