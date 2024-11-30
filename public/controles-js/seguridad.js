// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    fetch('/user-info', { credentials: 'include' })  // Solicita la información del usuario autenticado
      .then(response => response.json())
      .then(data => {
        if (!data.username) {
          window.location.href = '../login.html';  // Redirige si no está autenticado
        } else {
          document.getElementById('username').innerText = data.username;  // Muestra el nombre del usuario
        }
      })
      .catch(err => {
        console.error('Error al verificar autenticación', err);
        window.location.href = '../login.html';  // Redirige si hay un error al verificar la sesión
      });
  }
  
  // Llamamos a la función para comprobar la autenticación cuando la página se carga
  window.onload = checkAuthentication;
  
  function logout() {
    fetch('/logout', { method: 'POST', credentials: 'include' })  // Enviar solicitud al servidor para cerrar sesión
      .then(() => {
        localStorage.removeItem('username');  // Limpia el localStorage
        window.location.href = '../login.html';  // Redirige al login
      })
      .catch(err => {
        console.error('Error al cerrar sesión', err);
      });
  }
  