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

    // Mostrar un indicador de carga mientras se obtiene el usuario
    const showLoadingMessages = () => {
        const messages = document.getElementById('messages');
        messages.innerHTML = '<li class="loading">Cargando mensajes...</li>';
    };

    const removeLoadingMessages = () => {
        const loadingMessage = document.querySelector('.loading');
        if (loadingMessage) loadingMessage.remove();
    };

    showLoadingMessages(); // Mostrar indicador de carga al inicio

    getUsername().then(username => {
        if (username !== 'Anónimo') {
            localStorage.setItem('username', username);
            document.getElementById('username').textContent = username;
            socket.auth = { username };
            socket.connect();
        } else {
            window.location.href = './login.html'; // Redirigir al login si no se puede obtener el usuario
        }
    });

    const form = document.getElementById('form');
    const input = document.getElementById('message');
    const messages = document.getElementById("messages");

    // Escuchar eventos de carga inicial de mensajes
    socket.on('load messages', (messagesData) => {
        setTimeout(() => {
            removeLoadingMessages(); // Eliminar indicador de carga tras un pequeño retraso
            const list = messagesData.map(({ content, username }) => {
                const isOwnMessage = username === localStorage.getItem('username');
                const messageClass = isOwnMessage ? 'sent' : 'received';
                return `<li class="message ${messageClass}"><p>${content}</p><small>${username}</small></li>`;
            }).join('');
            messages.innerHTML += list;
        }, 1000); // Retraso simulado de 1 segundo
    });

    // Escuchar eventos de nuevos mensajes
    socket.on('chat message', ({ msg, username }) => {
        const isOwnMessage = username === localStorage.getItem('username');
        const messageClass = isOwnMessage ? 'sent' : 'received';
        const item = `<li class="message ${messageClass}"><p>${msg}</p><small>${username}</small></li>`;
        messages.insertAdjacentHTML('beforeend', item);
        messages.scrollTop = messages.scrollHeight;
    });

    // Enviar mensajes
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
        }
    });
});
