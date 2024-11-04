const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para obtener el ID del usuario
router.get('/user-id', userController.getUserId);

module.exports = router;
