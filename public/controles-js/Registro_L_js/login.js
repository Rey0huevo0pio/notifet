
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/index'; // Redirige a la página principal
        } else {
            // Mostrar mensaje de error en el contenedor
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Usuario/Contraseña incorrecta.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Error en el servidor. Inténtalo más tarde.';
    });
});
   