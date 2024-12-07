document.querySelector('#form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const messageInput = document.querySelector('#message');
    const message = messageInput.value.trim();
    if (!message) {
        alert('El mensaje no puede estar vacío');
        return;
    }

    try {
        const response = await fetch('/enviar-mensaje', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message, userId, groupId }), // Asegúrate de obtener userId y groupId
        });

        if (response.ok) {
            messageInput.value = ''; // Limpiar el campo
            alert('Mensaje enviado');
        } else {
            alert('Error al enviar el mensaje');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});
