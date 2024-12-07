document.addEventListener('DOMContentLoaded', async () => {

    const gruposDisponiblesDiv = document.getElementById('gruposList');

    // Función para cargar los grupos
    async function cargarGrupos() {
        try {
            const res = await fetch('/mis-grupos', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();

                // "Grupos Disponibles"
                gruposDisponiblesDiv.innerHTML = data.gruposDisponibles.map(grupo => 
                    <div>
                        <strong>${grupo.Nombre_Grupo}</strong>
                        <p>${grupo.descripcion}</p>
                        <button class="btn-unirse" data-group-id="${grupo.id}">Unirse</button>
                    </div>
                ).join('');

                document.querySelectorAll('.btn-unirse').forEach(btn => {
                    btn.addEventListener('click', () => {
                        console.log('Unirse al grupo ID: ${btn.dataset.groupId}');
                    });
                });
            } else {
                throw new Error('Error al cargar los grupos');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


});