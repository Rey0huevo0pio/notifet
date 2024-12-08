document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado");

    const btnCrearGrupo = document.querySelector('.btn-crear-grupo');
    const formCrearGrupo = document.getElementById('form-crear-grupo');
    const btnCancelar = document.getElementById('cancelar-crear-grupo');
    const form = document.getElementById('crear-grupo-form');

    // Mostrar y ocultar el formulario de creación de grupos
    if (btnCrearGrupo && formCrearGrupo && btnCancelar && form) {
        btnCrearGrupo.addEventListener('click', () => {
            formCrearGrupo.style.display = 'block';
        });

        btnCancelar.addEventListener('click', () => {
            formCrearGrupo.style.display = 'none';
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombreGrupo = document.getElementById('nombre-grupo').value;
            const descripcion = document.getElementById('descripcion').value;
            const privilegio = document.getElementById('privilegio').value;

            try {
                const response = await fetch('/crear-grupo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Nombre_Grupo: nombreGrupo, descripcion, privilegio }),
                });

                if (response.ok) {
                    alert('Grupo creado exitosamente');
                    form.reset();
                    formCrearGrupo.style.display = 'none';
                    fetchGroups(); // Actualizar los grupos
                } else {
                    alert('Error al crear el grupo');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
            fetchGroups();
        });
    }

    // Funciones auxiliares para la carga de grupos
    const showLoadingGroups = () => {
        const lista = document.getElementById('lis_grup');
        const loadingMessage = document.createElement('li');
        loadingMessage.classList.add('loading-indicator');
        loadingMessage.textContent = 'Cargando grupos...';
        lista.innerHTML = ''; // Limpiar la lista antes de mostrar el mensaje
        lista.appendChild(loadingMessage);
    };

    const removeLoadingGroups = () => {
        const loadingMessage = document.querySelector('.loading-indicator');
        if (loadingMessage) loadingMessage.remove();
     
    };

    // Obtener y mostrar los grupos
    const fetchGroups = async () => {
        const listaMisGrupos = document.getElementById('lis_grup');
        const listaGruposDisponibles = document.getElementById('gruposList');
        showLoadingGroups();
       
        try {
            const res = await fetch('/mis-grupos', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                removeLoadingGroups();

                // Renderizar mis grupos
                listaMisGrupos.innerHTML = data.misGrupos.length
                ? data.misGrupos.map(grupo => `
                    <li>
                        <strong>Nombre del Grupo:</strong> <span class="nombre-grupo">${grupo.Nombre_Grupo}</span><br>
                        <p><strong>Nombre del creador:</strong> ${grupo.username}</p>
                        <p><strong>Descripción:</strong> ${grupo.descripcion}</p>
                        <button class="btn-unirse-grupo" chatear-id="${grupo.id}">mensajear</button>
                    </li>`).join('')
                : '<li>No tienes grupos.</li>';
                
            
                // Renderizar grupos disponibles
                listaGruposDisponibles.innerHTML = data.gruposDisponibles.length
                    ? data.gruposDisponibles.map(grupo => `
                        <li>
                            <strong>Nombre del Grupo:</strong> ${grupo.Nombre_Grupo}<br>
                            <p><strong>Nombre del creador:</strong> ${grupo.username}</p>
                            <p><strong>Descripción:</strong> ${grupo.descripcion}</p>
                            <button class="btn-unirse-grupo" data-group-id="${grupo.id}">Unirse</button>
                        </li>`).join('')
                    : '<li>No hay grupos disponibles para unirse.</li>';

                // Asignar eventos a los botones de "Chatear" y "Unirse"
            
                asignarEventosGrupo();
            } else {
                alert('Error al cargar los grupos');
            }
        } catch (error) {
            console.error('Error al cargar los grupos:', error);
            alert('Error al cargar los grupos');
        }
      
    };
    fetchGroups();
    // Asignar eventos a los botones de "Chatear" y "Unirse"
  
    const asignarEventosGrupo = () => {
        // Evento para "Chatear" en un grupo
        document.querySelectorAll('.btn-unirse-grupo[chatear-id]').forEach(button => {
            button.addEventListener('click', (event) => {
                const grupoId = parseInt(event.target.getAttribute('chatear-id')); // Convertir a entero
                const grupoNombre = event.target.closest('li').querySelector('.nombre-grupo').textContent;
        
                // Actualizar el nombre del grupo en el chat
                const grupoNombreElement = document.getElementById('grupoNombre');
                grupoNombreElement.innerText = grupoNombre;
                grupoNombreElement.setAttribute('data-group-id', grupoId); // Actualizar el data-group-id
        
                // Iniciar chat en el grupo
                iniciarChat(grupoId);
            });
        });
        
        // Evento para "Unirse" a un grupo
        document.querySelectorAll('.btn-unirse-grupo[data-group-id]').forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const groupId = e.target.dataset.groupId;
                try {
                    const response = await fetch(`/unirse-grupo/${groupId}`, {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        alert('Te has unido al grupo.');
                         // Actualizar las listas
                    } else {
                        alert('Error al unirse al grupo.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al conectar con el servidor.');
                }
                fetchGroups();
            });
          
        });
    };

    // Función para iniciar el chat (simulada por consola por ahora)
    function iniciarChat(Nombre_Grupo) {
        console.log(`Iniciando chat para el grupo con ID: ${Nombre_Grupo}`);
        // Aquí puedes agregar la lógica para cargar los mensajes del grupo o establecer la conexión con el chat.
    }

    // Cargar los grupos al iniciar
    fetchGroups();
});
