const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajusta la importación según tu configuración

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // otros campos según tu diseño
});

module.exports = User;
