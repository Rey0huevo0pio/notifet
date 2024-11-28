
        document.getElementById('registerForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');  // Contenedor para mensajes de error
            const errorIcon = document.querySelector('#errorMessage .error-icon'); // Icono de error
            const errorText = document.getElementById('errorText'); // Texto del error

            // Limpiar mensajes de error anteriores
            errorMessage.style.display = 'none';
            errorText.textContent = '';

            fetch('/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/';  // Redirige al login
                } else {
                    errorText.textContent =  data.message;  // Muestra el mensaje de error
                    errorMessage.style.display = 'flex'; // Muestra el mensaje de error
                    errorIcon.style.display = 'inline'; // Muestra el icono de advertencia
                }
            })
            .catch(error => {
                errorText.textContent = error.message;  // Muestra el mensaje de error
                errorMessage.style.display = 'flex'; // Muestra el mensaje de error
                errorIcon.style.display = 'inline'; // Muestra el icono de advertencia
            });
        });
   