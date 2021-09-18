const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const User = require('./user');

const AuthToken = sequelize.define('authtoken', {
    key: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

AuthToken.belongsTo(User)

module.exports = AuthToken;
