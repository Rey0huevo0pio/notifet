document.getElementById('createGroup').addEventListener('click', () => {
    const groupName = document.getElementById('groupName').value;

    if (groupName.trim() === '') {
        alert('Por favor, ingresa un nombre para el grupo.');
        return;
    }

    // Aquí podrías agregar la lógica para enviar el nombre del grupo al servidor.
    socket.emit('crearGrupo', groupName);
    
    // Limpiar el campo de entrada
    document.getElementById('groupName').value = '';
});
