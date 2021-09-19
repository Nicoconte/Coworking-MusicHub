const Router = require("express").Router();

const RoomController = require('../controllers/room-controller');

const {
    AuthTokenHeaderValidator
} = require('../validators/authtoken-validator');


Router.post('/room/new', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).createRoom();
})

Router.get('/room/me/all', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).listUserRoom();
})

Router.get('/room/public/all', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).listPublicRoom();
})


Router.get('/room/:id', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).getRoom();
})

Router.post('/room/:id/join', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).joinRoom();
})

Router.post('/room/:id/access', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).accessRoom();
})

Router.delete('/room/:id/remove', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).deleteRoom();
})

Router.put('/room/:id/update', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).updateRoom();
})

Router.get("/room/invite-code/:code", AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).getRoomByInviteCode();
})

Router.delete("/room/:id/participant/:userId/remove", AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).removeParticipant();
})

const RoomRoutes = Router;

module.exports = RoomRoutes;
