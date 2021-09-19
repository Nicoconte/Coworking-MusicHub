const Router = require("express").Router();

const RESPONSE_MESSAGE = require('../enums/response-message');

const roomService = require('../services/room-service')();
const roomController = require('../controllers/room-controller')();

const authtokenService = require('../services/authtoken-service')();
const {
    AuthTokenHeaderValidator
} = require('../validators/authtoken-validator');


Router.post('/room/new', AuthTokenHeaderValidator, (req, res) => {

    authtokenService.validateAsync(req.headers.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }

        //Add userId as property to roomData Object
        let roomData = req.body
        roomData.userId = token.userId

        roomController.createRoom(roomData).then(r => {
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

})

Router.get('/room/me/all', AuthTokenHeaderValidator, (req, res) => {

    authtokenService.validateAsync(req.headers.authorization).then(async token => {
        console.log(token)
        
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }

        await roomController.listUserRoom(token.userId).then(rooms => {
            console.log(rooms);
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

})

Router.get('/room/public/all', AuthTokenHeaderValidator, (req, res) => {
    authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }

        await roomController.listPublicRoom().then(publicRooms => {
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
})

Router.get('/room/:id', AuthTokenHeaderValidator, (req, res) => {
    authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }
        
        await roomController.getRoom(req?.params.id).then(room => {
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
})


Router.post('/room/:id/join', AuthTokenHeaderValidator, (req, res) => {

    authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }

        await roomController.getRoom(req?.params?.id).then(async room => {
            let userId = token.userId;
            let roomId = room.id;

            if (await roomController.userAlreadyIn(roomId, userId)) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.USER_ALREADY_EXIST_IN_THE_ROOM
                })
            }

            if (!room.isPublic) {
                if (req.body.password !== room.roomPassword) {
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

                await roomController.addNewParticipantToRoom(roomId, userId).then(_ => {
                    return res.send({
                        "status": true,
                        "data": {
                            "message": RESPONSE_MESSAGE.USER_ADDED(userId)
                        }
                    })
                });
            }

            await roomController.addNewParticipantToRoom(roomId, userId).then(_ => {
                return res.send({
                    "status": true,
                    "data":{
                        "message": RESPONSE_MESSAGE.USER_ADDED(userId)
                    }
                })
            })
        })
    })
})

Router.post('/room/:id/access', AuthTokenHeaderValidator, (req, res) => {

    authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }

        await roomController.getRoom(req?.params?.id).then(async room => {
            let userId = token.userId;
            let roomId = room.id;
            
            if (!room.isPublic) {
                if (req.body.password !== room.roomPassword) {
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
                
                //Socket action

            } else {
                if (!await roomService.findUserAlreadyExist(roomId, userId)) {
                    return res.send({
                        "status": true,
                        "reason": "No puedoentrar"
                    })
                }

                //Socket action
            }
        })

    })

})

Router.delete('/room/:id/remove', AuthTokenHeaderValidator, (req, res) => {
    authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }

        await roomController.deleteRoom(req?.params?.id, token.userId)
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
})

Router.put('/room/:id/update', AuthTokenHeaderValidator, (req, res) => {
    authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }

        await roomController.updateRoom(req?.params?.id, token.userId, req?.body.data)
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
})

const RoomRoutes = Router;

module.exports = RoomRoutes;
