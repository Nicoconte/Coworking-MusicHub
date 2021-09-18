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
                "data": r.toJSON()
            })
        })

    }).catch(err => {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INVALID_TOKEN
        })
    })

})



const RoomRoutes = Router;

module.exports = RoomRoutes;
