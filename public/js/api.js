const Group = require('../models/group'); // Importa el modelo de grupo

// Crear un nuevo grupo
exports.createGroup = async (req, res) => {
    const { groupName, userId } = req.body;

    try {
        const newGroup = await Group.create({ name: groupName, userId });
        res.status(201).json({ success: true, group: newGroup });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al crear el grupo.' });
    }
};

// Obtener grupos por usuario
exports.getGroupsByUser = async (req, res) => {
    const userId = req.query.userId;

    try {
        const groups = await Group.findAll({ where: { userId } });
        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al cargar los grupos.' });
    }
};
