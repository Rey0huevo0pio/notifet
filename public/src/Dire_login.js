const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Para enviar cookies de sesión
        });

        const result = await response.json();

        if (result.success) {
            // Redirigir al usuario
            window.location.href = '../httt/principal.html';
        } else {
            errorMessage.style.display = 'block';
            errorMessage.textContent = result.message;
        }
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Error en la conexión con el servidor.';
    }
});
