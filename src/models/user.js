const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');

const User = sequelize.define('user', {
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
