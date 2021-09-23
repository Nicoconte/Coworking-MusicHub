const RoomService = require('../services/room-service');
const AuthTokenService = require('../services/authtoken-service')

const RESPONSE_MESSAGE = require('../enums/response-message')

const RoomController = function(req, res) {
    
    const roomService = RoomService();
    const authtokenService = AuthTokenService();

    async function createRoom() {
        authtokenService.validateAsync(req.headers.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
            
            let roomData = req?.body;
            roomData.userId = token.userId
    
            roomService.createAsync(roomData).then(r => {
                if (!r) {
                    return res.send({
                        "status": false,
                        "reason": RESPONSE_MESSAGE.CANNOT_CREATE('Room')
                    })
                }
    
                return res.send({
                    "status": true,
                    "data": r
                })
            })
    
        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err
            })
        })
    }

    async function listUserRoom() {
        authtokenService.validateAsync(req.headers.authorization).then(async token => {            
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
    
            await roomService.listUserRoomsAsync(token.userId).then(rooms => {
                return res.send({
                    "status": true,
                    "data": rooms
                })
            })
    
        })
        .catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err
            })
        })    
    }

    async function listPublicRoom() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
    
            await roomService.listPublicRoomsAsync().then(publicRooms => {
                return res.send({
                    "status": true,
                    "data": publicRooms
                })
            })
    
        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err
            })
        })
    }

    async function getRoom() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
            
            await roomService.findByIdAsync(req?.params.id).then(room => {
                return res.send({
                    "status": true,
                    "data": room
                })
            })
    
        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err
            })
        })
    }

    async function joinRoom() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
    
            await roomService.findByIdAsync(req?.params?.id).then(async room => {
                let userId = token.userId;
                let roomId = room.id;
    
                if (await roomService.findUserAlreadyExist(roomId, userId)) {
                    return res.send({
                        "status": false,
                        "reason": RESPONSE_MESSAGE.USER_ALREADY_EXIST_IN_THE_ROOM
                    })
                }
                
                //PRIVATE ROOM
                if (!room.isPublic) {
                    if (req.body.password !== room.password) {
                        return res.send({
                            "status": false,
                            "reason": RESPONSE_MESSAGE.PASSWORD_DOES_NOT_MATCH
                        })
                    }
                    
                    if (await roomService.getParticipantCountByIdAsync(roomId) > room.maxNumberOfParticipants) {
                        return res.send({
                            "status": false,
                            "reason": RESPONSE_MESSAGE.NOT_ENOUGH_SPACE
                        })
                    }
    
                    await roomService.assignUserToRoomAsync(roomId, userId).then(_ => {
                        return res.send({
                            "status": true,
                            "data": {
                                "message": RESPONSE_MESSAGE.USER_ADDED(userId)
                            }
                        })
                    });
                }
                

                //PUBLIC ROOM
                await roomService.assignUserToRoomAsync(roomId, userId).then(_ => {
                    return res.send({
                        "status": true,
                        "data":{
                            "message": RESPONSE_MESSAGE.USER_ADDED(userId)
                        }
                    })
                })
            })
        })
    }

    async function accessRoom() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {

            const io = app?.req?.get('io');

            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
    
            await roomService.findByIdAsync(req?.params?.id).then(async room => {
                let userId = token.userId;
                let roomId = room.id;
                
                if (!room.isPublic) {
                    if (req.body.password !== room.password) {
                        return res.send({
                            "status": false,
                            "reason": RESPONSE_MESSAGE.PASSWORD_DOES_NOT_MATCH
                        })
                    }
    
                    if (!await roomService.findUserAlreadyExist(roomId, userId)) {
                        return res.send({
                            "status": true,
                            "reason": "Yo no estoy dentro de la sala"
                        })
                    }
                    
                    return res.send({
                        "status": true,
                        "canEmit": true
                    });

                } else {
                    if (!await roomService.findUserAlreadyExist(roomId, userId)) {
                        return res.send({
                            "status": false,
                            "reason": "You're not a member of this room"
                        })
                    }    
                    
                    return res.send({
                        "status": true,
                        "canEmit": true
                    });
                }
            })    
        })
    }

    async function deleteRoom() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
    
            await roomService.deleteAsync(req?.params?.id, token.userId)
            .then(r => {
                if (!r) {
                    return res.send({
                      "status": false,
                      "reason": RESPONSE_MESSAGE.CANNOT_DELETE  
                    })
                }
    
                return res.send({
                    "status": true
                })
            })
            .catch(err => {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.ROOM_DOES_NOT_EXIST
                })
            });
        
        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err.toString()
            })
        })
    }

    async function updateRoom() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }
    
            await roomService.updateAsync(req?.params?.id, token.userId, req?.body.data)
            .then(r => {
                if (!r) {
                    return res.send({
                        "status": false,
                        "reason": RESPONSE_MESSAGE.CANNOT_UPDATE
                    })
                }
    
                return res.send({
                    "status": true
                })
            })
            .catch(err => {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.ROOM_DOES_NOT_EXIST
                })
            })
    
        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err.toString()
            })
        })
    }

    async function getRoomByInviteCode() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }

            let room = await roomService.findByInviteCode(req?.params?.code);
            

            if (!room) {
                return res.send({
                    "status": false,
                    "data": RESPONSE_MESSAGE.ROOM_DOES_NOT_EXIST
                })                
            }

            return res.send({
                "status": false,
                "data": room
            })

        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err.toString()
            })
        }) 
    } 


    async function removeParticipant() {
        authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }

            roomService.deleteParticipant(req?.params?.id, req?.params?.userId)
            .then(r => {
                if (r) {
                    return res.send({
                        "status": true
                    })
                }
            })
            .catch(err => {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.CANNOT_DELETE
                })
            })

        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err.toString()
            })
        })
    }

    return {
        "getRoom": getRoom,
        "joinRoom": joinRoom,
        "accessRoom": accessRoom,
        "deleteRoom": deleteRoom,
        "updateRoom": updateRoom,
        "createRoom": createRoom,
        "listUserRoom": listUserRoom,
        "listPublicRoom": listPublicRoom,
        "removeParticipant": removeParticipant,
        "getRoomByInviteCode": getRoomByInviteCode
    }
}


module.exports = RoomController;