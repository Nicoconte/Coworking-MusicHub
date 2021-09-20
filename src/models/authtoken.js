const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');

const User = require('./user');

const AuthToken = sequelize.define('authtoken', {
    key: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

AuthToken.belongsTo(User)

module.exports = AuthToken;
