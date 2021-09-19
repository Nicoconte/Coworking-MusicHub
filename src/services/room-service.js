const Room = require('../models/room');
const RoomParticipant = require('../models/room-participant');

const uuid = require('uuid');

const RoomService = function() {

    async function createAsync(roomData) {
        let room = await Room.create({
            id: uuid.v4().toString(),
            name: roomData.name,
            isPublic: roomData.isPublic,
            maxNumberOfParticipants: roomData?.maxNumberOfParticipants,
            roomPassword: roomData?.password,
            userId: roomData?.userId 
        })

        return room;
    }

    async function findByIdAsync(roomId) {

        let room = await Room.findOne({
            where:{
                id: roomId
            }
        })

        return room;
    }

    async function listUserRoomsAsync(userId ) {
        let rooms = await Room.findAll({
            where: {
                userId: userId
            }
        })

        return rooms;
    }

    async function listPublicRoomsAsync() {
        let publicRooms = await Room.findAll({
            where: {
                isPublic: true,
            }
        })

        return publicRooms;
    }

    return {
        "createAsync": createAsync,
        "findByIdAsync": findByIdAsync,
        "listUserRoomsAsync": listUserRoomsAsync,
        "listPublicRoomsAsync": listPublicRoomsAsync
    }

}

module.exports = RoomService