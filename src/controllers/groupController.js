// Suponiendo que ya tienes una función para cargar grupos en 'lista-grupos'
function cargarGrupos() {
    router.get('/', (req, res) => {
        const userId = req.query.userId; // Obtiene el ID del usuario de la consulta
    
        const query = `
            SELECT g.id, g.nombre 
            FROM grupos g
            LEFT JOIN miembros_grupo mg ON g.id = mg.grupoId AND mg.userId = ?
            WHERE mg.userId IS NOT NULL OR g.creadorId = ?`;
    
        db.query(query, [userId, userId], (err, results) => {
            if (err) {
                console.error('Error al obtener grupos:', err);
                return res.status(500).json({ error: 'Error al obtener grupos' });
            }
            res.json(results); // Devuelve los grupos en formato JSON
        });
    });
    
}

// Función para mostrar los detalles del grupo
function mostrarDetallesGrupo(grupoId, nombreGrupo) {
    document.getElementById('nombre-grupo-seleccionado').textContent = nombreGrupo;
    document.getElementById('grupo-detalle').style.display = 'block';
    document.getElementById('miembros-en-linea').innerHTML = 'Cargando miembros...';

    // Llamada para obtener los miembros del grupo
    fetch(`/api/grupo-miembros?grupoId=${grupoId}`)
        .then(response => response.json())
        .then(miembros => {
            mostrarMiembrosEnLinea(miembros);
        })
        .catch(error => console.error('Error al obtener miembros del grupo:', error));
}

// Mostrar los miembros en línea
function mostrarMiembrosEnLinea(miembros) {
    const divMiembros = document.getElementById('miembros-en-linea');
    divMiembros.innerHTML = ''; // Limpiar contenido anterior

    miembros.forEach(miembro => {
        const p = document.createElement('p');
        p.textContent = miembro.nombre; // Suponiendo que el objeto miembro tiene la propiedad 'nombre'
        divMiembros.appendChild(p);
    });
}

// Asegúrate de cargar los grupos al iniciar
cargarGrupos();
