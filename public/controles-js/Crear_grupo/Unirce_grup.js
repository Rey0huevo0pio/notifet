document.addEventListener('DOMContentLoaded', () => {
    // Función para unirse al grupo
    document.querySelectorAll('.btn-unirse').forEach(btn => {
        btn.addEventListener('click', async () => {
            const groupId = btn.dataset.groupId;
            try {
                const res = await fetch('/unirse-grupo/${groupId}', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (res.ok) {
                    alert('Te has unido al grupo');
                    // Aquí podemos emitir un evento o actualizar la lista de grupos disponibles
                    // Similar a lo que hemos hecho con el evento 'grupoCreado'
                    const socket = io();
                    socket.emit('grupoUnido', groupId);
                }
            } catch (error) {
                console.error('Error al unirse al grupo', error);
            }
        });
    });
});
