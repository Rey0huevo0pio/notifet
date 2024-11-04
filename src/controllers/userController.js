const User = require('../models/user'); // Importa el modelo de usuario

// Obtener el ID del usuario (o cualquier dato necesario)
exports.getUserId = async (req, res) => {
    // Supongamos que usas sesión o token para identificar al usuario
    const userId = req.session.userId; // Ajusta esto según tu autenticación

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    try {
        const user = await User.findByPk(userId);
        res.status(200).json({ id: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al obtener el usuario.' });
    }
};
