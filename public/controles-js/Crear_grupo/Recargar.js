document.addEventListener('DOMContentLoaded', () => {
    const fetchGroups = async () => {
        try {
            const res = await fetch('/mis-grupos', { credentials: 'include' });
            if (res.ok) {
                const grupos = await res.json();
                const lista = document.getElementById('lis_grup');
                lista.innerHTML = ''; // Limpiar la lista antes de agregar los elementos
                grupos.forEach(grupo => {
                    const item = document.createElement('li');
                    item.textContent = `${grupo.content} (creado por: ${grupo.username})`;
                    lista.appendChild(item);
                });
            } else {
                throw new Error('Error al obtener los grupos');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchGroups();
});
