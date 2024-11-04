document.getElementById('createGroup').onclick = async function() {
    const groupName = document.getElementById('groupName').value;

    if (!groupName) {
        alert('Por favor, ingresa un nombre para el grupo.');
        return;
    }

    try {
        const userId = await getUserId(); // Función para obtener el ID del usuario
        const response = await fetch('/api/create-group', {
            method: 'POST',
            body: JSON.stringify({ groupName, userId }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            alert('Grupo creado con éxito');
            loadGroups(); // Recargar grupos
        } else {
            alert('Error al crear el grupo: ' + result.message);
        }
    } catch (err) {
        console.error('Error al crear el grupo:', err);
        alert('Error al crear el grupo');
    }
};

// Función para cargar los grupos del usuario
async function loadGroups() {
    try {
        const userId = await getUserId(); // Obtén el ID del usuario
        const response = await fetch(`/api/groups?userId=${userId}`);
        const groups = await response.json();

        const groupList = document.getElementById('groupList');
        groupList.innerHTML = ''; // Limpiar lista actual

        groups.forEach(group => {
            const li = document.createElement('li');
            li.textContent = group.name;
            groupList.appendChild(li);
        });
    } catch (err) {
        console.error('Error al cargar grupos:', err);
    }
}

// Función para obtener el ID del usuario
async function getUserId() {
    const response = await fetch('/api/user-id'); // Endpoint para obtener el ID del usuario
    const data = await response.json();
    return data.id; // Asume que el JSON tiene un campo "id"
}

// Cargar grupos al inicio
loadGroups();
