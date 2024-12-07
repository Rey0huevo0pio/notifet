   // Verificar si el usuario está autenticado
   async function verificarAutenticacion() {
    try {
        const response = await fetch('/user-info', {
            method: 'GET',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error('Usuario no autenticado');
        }

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Función para cargar los grupos disponibles
async function cargarGruposDisponibles() {
try {
    const response = await fetch('/grupos-disponibles', {
        method: 'GET',
        credentials: 'same-origin', // Para que la cookie de la sesión se envíe
    });

    if (!response.ok) {
        throw new Error('Error al cargar los grupos');
    }

    const grupos = await response.json();
    const gruposList = document.getElementById('gruposList');

    // Limpiar la lista antes de agregar los nuevos grupos
    gruposList.innerHTML = '';

    // Mostrar los grupos disponibles
    grupos.forEach(grupo => {
        const li = document.createElement('li');
        li.textContent = `${grupo.Nombre_Grupo}: ${grupo.descripcion}`;
        
        // Crear botón para unirse
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Unirse';
        joinButton.addEventListener('click', () => unirseGrupo(grupo.id));

        li.appendChild(joinButton);
        gruposList.appendChild(li);
    });
} catch (error) {
    console.error('Error al cargar los grupos disponibles:', error);
}
}

async function unirseGrupo(grupoId) {
try {
    const response = await fetch('/unirse-grupo', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grupoId }),
    });

    if (!response.ok) {
        throw new Error('Error al unirse al grupo');
    }

    const result = await response.json();
    alert(result.message || 'Te has unido al grupo exitosamente.');

    // Recargar la lista de grupos para reflejar cambios
    cargarGruposDisponibles();
} catch (error) {
    console.error('Error al unirse al grupo:', error);
}
}

// Cargar los grupos disponibles al cargar la página solo si está autenticado
document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = await verificarAutenticacion();
    if (userInfo) {
        cargarGruposDisponibles();
    } else {
        console.error('Usuario no autenticado, redirigiendo al inicio de sesión.');
        window.location.href = '/'; // Redirigir al login
    }
});