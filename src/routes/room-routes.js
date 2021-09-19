const Router = require("express").Router();

const RESPONSE_MESSAGE = require('../enums/response-message');

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

        //Room controller creation

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


Router.post('/room/:id/enter', AuthTokenHeaderValidator, (req, res) => {

    authtokenService.validateAsync(req?.headers?.authorization).then(async token => {
        if (!token) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.INVALID_TOKEN
            })
        }
    })

})




const RoomRoutes = Router;

module.exports = RoomRoutes;
