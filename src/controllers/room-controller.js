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

    return {
        "createRoom": createRoom,
        "listUserRoom": listUserRoom,
        "listPublicRoom": listPublicRoom,
        "getRoom": getRoom
    }
}


module.exports = RoomController;