const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');


const User = require('./user');

const Room = sequelize.define('room', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPublic: {
        primaryKey: true,
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    maxNumberOfParticipants: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    roomPassword: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})

//Creator
Room.belongsTo(User);

module.exports = Room;
