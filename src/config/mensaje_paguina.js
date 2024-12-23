import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
        
const socket = io(); // Mover esto aquí para acceder a socket antes de la interacción del usuario

document.addEventListener('DOMContentLoaded', () => {



    const getUsername = async () => {
        const username = localStorage.getItem('username');
        if (username) {
            console.log(`User existed ${username}`);
            return username;
        }
        const res = await fetch('https://random-data-api.com/api/users/random_user');
        const { username: randomUsername } = await res.json();
        console.log('random', randomUsername);
        localStorage.setItem('username', randomUsername);
        return randomUsername;
    };

    getUsername().then(username => {
        socket.auth = { username, serverOffset: 0 };
    });

    const form = document.getElementById('form');
    const input = document.getElementById('message');
    const messages = document.getElementById("messages");

    socket.on('chat message', (msg, serverOffset, username) => {
        const item = `<li><p>${msg}</p><small>${username}</small></li>`;
        messages.insertAdjacentHTML('beforeend', item);
        socket.auth.serverOffset = serverOffset;
        messages.scrollTop = messages.scrollHeight;
        mostrarNotificacion(msg, username);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });
});