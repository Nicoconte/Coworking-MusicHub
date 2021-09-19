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
            password: roomData?.password,
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
        room.password = room.isPublic ? null : roomData.password;
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

    async function findByInviteCode(inviteCode) {
        let room = await Room.findOne({
            where: {
                inviteCode: inviteCode
            }
        });

        return room ?? null
    }

    async function deleteParticipant(roomId, userId) {
        let rows = RoomParticipant.destroy({
            where: {
                roomId: roomId,
                userId: userId
            }
        })

        return rows > 0;
    }

    return {
        "createAsync": createAsync,
        "deleteAsync": deleteAsync,
        "updateAsync": updateAsync,
        "findByIdAsync": findByIdAsync,
        "findByInviteCode": findByInviteCode,
        "deleteParticipant": deleteParticipant,        
        "listUserRoomsAsync": listUserRoomsAsync,
        "findUserAlreadyExist": findUserAlreadyExist,
        "listPublicRoomsAsync": listPublicRoomsAsync,
        "assignUserToRoomAsync": assignUserToRoomAsync,
        "getParticipantCountByIdAsync": getParticipantCountByIdAsync,         
    }

}

module.exports = RoomService