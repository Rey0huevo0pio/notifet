import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const grupoNombreElement = document.querySelector('#grupoNombre');
    const groupId = grupoNombreElement ? grupoNombreElement.dataset.groupId : null;

    if (!groupId) {
        console.error('No se pudo obtener el ID del grupo.');
        return;
    }

    const username = localStorage.getItem('username');
    socket.auth = { username, groupId };
    socket.connect();

    socket.emit('join group', groupId);

    socket.on('load messages', (messages) => {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
        messages.forEach(({ content, username }) => {
            const messageClass = username === localStorage.getItem('username') ? 'sent' : 'received';
            const messageElement = `<li class="${messageClass}">${content}</li>`;
            messagesContainer.innerHTML += messageElement;
        });
    });

    socket.on('chat message', ({ content, username }) => {
        const messageClass = username === localStorage.getItem('username') ? 'sent' : 'received';
        const messageElement = `<li class="${messageClass}">${content}</li>`;
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML += messageElement;
    });

    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('message');
        const msg = messageInput.value;
        const groupId = parseInt(document.getElementById('grupoNombre').dataset.groupId); // Asegurarse que sea un número
        socket.emit('chat message', { msg, groupId });
        messageInput.value = '';
    });
});
