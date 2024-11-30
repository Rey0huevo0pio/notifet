// Mostrar/Ocultar el formulario de creación de grupo
const btnCrearGrupo = document.querySelector('.btn-crear-grupo');
const formCrearGrupo = document.getElementById('form-crear-grupo');
const btnCancelar = document.getElementById('cancelar-crear-grupo');

// Obtener el nombre del usuario logueado
async function obtenerUsuario() {
    try {
        const response = await fetch('/user-info');
        if (response.ok) {
            const data = await response.json();
            return data.username;
        }
        throw new Error('Error al obtener el usuario');
    } catch (error) {
        console.error(error);
        alert('No se pudo obtener la información del usuario');
        return null;
    }
}

btnCrearGrupo.addEventListener('click', () => {
    formCrearGrupo.style.display = 'block';
});

btnCancelar.addEventListener('click', () => {
    formCrearGrupo.style.display = 'none';
});

// Enviar datos al servidor al enviar el formulario
const form = document.getElementById('crear-grupo-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    const nombreGrupo = document.getElementById('nombre-grupo').value;
    const username = await obtenerUsuario();

    if (!username) return;

    const grupoData = {
        content: nombreGrupo,
        username,
        privilegio: 'miembro',
        created_at: new Date().toISOString(),
    };

    try {
        const response = await fetch('/crear-grupo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(grupoData),
        });

        if (response.ok) {
            alert('Grupo creado exitosamente');
            formCrearGrupo.style.display = 'none';
            form.reset();
        } else {
            alert('Error al crear el grupo');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});
