const { DataTypes } = require('sequelize');
const sequelize = require('../configs/sequelize');

const Room = require('./room');

const RoomParticipant = sequelize.define('roomparticipant', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

RoomParticipant.belongsTo(Room);

module.exports = RoomParticipant;