import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const getUsername = async () => {
        const username = localStorage.getItem('username');
        if (username) {
            return username;
        }
        const res = await fetch('https://random-data-api.com/api/users/random_user');
        const { username: randomUsername } = await res.json();
        localStorage.setItem('username', randomUsername);
        return randomUsername;
    };

    getUsername().then(username => {
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

    socket.on('chat message', ({ msg, serverOffset, username }) => {
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
