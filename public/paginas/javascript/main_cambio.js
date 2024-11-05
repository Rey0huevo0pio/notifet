document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById('register-form');
    const passwordField = document.getElementById('password-register');
    const confirmPasswordField = document.getElementById('confirm-password');

    registerForm.addEventListener('submit', function(event) {
        if (passwordField.value !== confirmPasswordField.value) {
            event.preventDefault(); // Prevenir el envío del formulario
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
        }
    });

    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');

    showRegister.addEventListener('click', function() {
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    showLogin.addEventListener('click', function() {
        loginContainer.style.display = 'block';
        registerContainer.style.display = 'none';
    });

    const messages = document.querySelectorAll('.message');
    if (messages.length > 0) {
        setTimeout(function() {
            messages.forEach(function(message) {
                message.classList.add('hidden'); // Añade la clase que oculta el mensaje
            });
        }, 5000); // El mensaje se ocultará después de 5 segundos
    }
});
