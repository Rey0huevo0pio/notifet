import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const getUsername = async () => {
        try {
            // Obtenemos el nombre de usuario desde el servidor
            const res = await fetch('/user-info', { credentials: 'include' });
            if (res.ok) {
                const { username } = await res.json();
                return username;
            } else {
                throw new Error('No se pudo obtener el usuario');
            }
        } catch (error) {
            console.error(error);
            return 'Anónimo'; // Fallback en caso de error
        }
    };

    getUsername().then(username => {
        localStorage.setItem('username', username);
        document.getElementById('username').textContent = username;
        socket.auth = { username };
        socket.connect();
    });

    
    const form = document.getElementById('form');
    const input = document.getElementById('message');
    const messages = document.getElementById("messages");

    socket.on('load messages', (messages) => {
        const list = messages.map(({ content, username }) => {
            const isOwnMessage = username === localStorage.getItem('username');
            const messageClass = isOwnMessage ? 'sent' : 'received';
            return `<li class="message ${messageClass}"><p>${content}</p><small>${username}</small></li>`;
        }).join('');
        document.getElementById('messages').innerHTML += list;
    });

    socket.on('chat message', ({ msg, username }) => {
        const isOwnMessage = username === localStorage.getItem('username');
        const messageClass = isOwnMessage ? 'sent' : 'received';
        const item = `<li class="message ${messageClass}"><p>${msg}</p><small>${username}</small></li>`;
        messages.insertAdjacentHTML('beforeend', item);
        messages.scrollTop = messages.scrollHeight;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });
});
