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

    async function deleteAsync(roomId, userId) {

        let room = await findByIdAsync(roomId);

        if (userId !== room.userId) {
            return null;
        }

        let rows = await Room.destroy({
            where: {
                id: roomId,
                userId: userId
            },
        });
        
        //On cascade from Room Destroy
        await RoomParticipant.destroy({
            where: {
                roomId: roomId
            }
        })

        return rows > 0 ? true : false
    }

    async function updateAsync(roomId, userId, roomData) {
        let room = await findByIdAsync(roomId);

        if (userId !== room.userId) {
            return null;
        }

        room.name = roomData?.name ?? room.name;
        room.isPublic = roomData?.isPublic ?? room.isPublic;
        room.roomPassword = room.isPublic ? null : roomData.password;
        room.maxNumberOfParticipants = roomData?.maxNumberOfParticipants ?? room.maxNumberOfParticipants;
        
        let updated = await room.save();

        return updated ? true : false;
    }

    async function assignUserToRoomAsync(roomId, userId) {
        let participant = await RoomParticipant.create({
            userId: userId,
            roomId: roomId
        })

        return participant ?? null
    }

    async function getParticipantCountByIdAsync(roomId) {
        let participants = await RoomParticipant.findAll({
            where: {
                roomId: roomId
            }
        });

        return participants.length;
    }

    async function findUserAlreadyExist(roomId, userId) {
        let participant = await RoomParticipant.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        });

        return participant ? true : false 
    }

    return {
        "createAsync": createAsync,
        "findByIdAsync": findByIdAsync,
        "listUserRoomsAsync": listUserRoomsAsync,
        "listPublicRoomsAsync": listPublicRoomsAsync,
        "assignUserToRoomAsync": assignUserToRoomAsync,
        "getParticipantCountByIdAsync": getParticipantCountByIdAsync,
        "findUserAlreadyExist": findUserAlreadyExist,
        "deleteAsync": deleteAsync,
        "updateAsync": updateAsync 
    }

}

module.exports = RoomService