const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true 
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User
