document.getElementById('mis-grupos-btn').addEventListener('click', () => {
    document.getElementById('mis-grupos').style.display = 'block';
    document.getElementById('mis-amigos').style.display = 'none';
    document.getElementById('crear-grupo-modal').style.display = 'none';
});

document.getElementById('mis-amigos-btn').addEventListener('click', () => {
    document.getElementById('mis-grupos').style.display = 'none';
    document.getElementById('mis-amigos').style.display = 'block';
    document.getElementById('crear-grupo-modal').style.display = 'none';
});

document.getElementById('crear-grupo-btn').addEventListener('click', () => {
    document.getElementById('mis-grupos').style.display = 'none';
    document.getElementById('mis-amigos').style.display = 'none';
    document.getElementById('crear-grupo-modal').style.display = 'block';
});

// Enviar el formulario de creación de grupo
document.getElementById('form-crear-grupo').addEventListener('submit', (event) => {
    event.preventDefault();
    const nombreGrupo = document.getElementById('nombre-grupo').value;

    fetch('/crear-grupo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreGrupo, userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Grupo creado exitosamente');
            document.getElementById('lista-grupos').innerHTML += `<li>${nombreGrupo}</li>`;
            document.getElementById('crear-grupo-modal').style.display = 'none';
        } else {
            alert('Error al crear el grupo');
        }
    });
});

// Manejar la creación de grupo
document.getElementById('form-crear-grupo').addEventListener('submit', (event) => {
    event.preventDefault();
    const nombreGrupo = document.getElementById('nombre-grupo').value;

    fetch('/crear-grupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreGrupo, userId }), // Asegúrate de que userId esté definido
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cargarGrupos(); // Recargar la lista de grupos
            document.getElementById('crear-grupo-modal').style.display = 'none';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error al crear grupo:', error));
});

