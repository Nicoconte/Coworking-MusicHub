const RoomService = require('../services/room-service');

const RoomController = function() {
    
    const roomService = RoomService();

    async function createRoom(roomData) {
        return await roomService.createAsync(roomData) ?? null;
    }

    async function listUserRoom(userId) {
        return await roomService.listUserRoomsAsync(userId) ?? null;
    }

    async function listPublicRoom() {
        return await roomService.listPublicRoomsAsync() ?? null
    }

    async function getRoom(roomId) {
        return await roomService.findByIdAsync(roomId) ?? null
    }

    async function addNewParticipantToRoom(roomId, userId) {
        return await roomService.assignUserToRoomAsync(roomId, userId);
    }

    async function deleteRoom(roomId, userId) {
        return await roomService.deleteAsync(roomId, userId)
    }

    async function updateRoom(roomId, userId, roomData) {
        return await roomService.updateAsync(roomId, userId, roomData);
    }

    return {
        "createRoom": createRoom,
        "listUserRoom": listUserRoom,
        "listPublicRoom": listPublicRoom,
        "getRoom": getRoom,
        "addNewParticipantToRoom": addNewParticipantToRoom,
        "deleteRoom": deleteRoom,
        "updateRoom": updateRoom
    }
}


module.exports = RoomController;