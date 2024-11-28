const express = require('express');
const router = express.Router();
const { subscribeUser } = require('');

// Obtener clave pública VAPID
router.get('/vapid-public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// Suscribirse a las notificaciones
router.post('/subscribe', (req, res) => {
    const { userId, subscription } = req.body;

    if (!subscription || Object.keys(subscription).length === 0) {
        return res.status(400).json({ error: 'Suscripción inválida' });
    }

    subscribeUser(userId, subscription, res);
});

module.exports = router;
