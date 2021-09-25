const Router = require("express").Router();

const RoomController = require('../controllers/room-controller');

const {
    AuthTokenHeaderValidator
} = require('../validators/authtoken-validator');


Router.post('/api/room/new', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).createRoom();
})

Router.get('/api/room/me/all', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).listUserRoom();
})

Router.get('/api/room/public/all', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).listPublicRoom();
})


Router.get('/api/room/:id', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).getRoom();
})

Router.post('/api/room/:id/join', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).joinRoom();
})

Router.post('/api/room/:id/access', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).accessRoom();
})

Router.delete('/api/room/:id/remove', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).deleteRoom();
})

Router.put('/api/room/:id/update', AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).updateRoom();
})

Router.get("/api/room/invite-code/:code", AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).getRoomByInviteCode();
})

Router.delete("/api/room/:id/participant/:userId/remove", AuthTokenHeaderValidator, (req, res) => {
    RoomController(req, res).removeParticipant();
})

const RoomRoutes = Router;

module.exports = RoomRoutes;
