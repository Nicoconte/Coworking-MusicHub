const Router = require("express").Router();

const SongQueueController = require('../controllers/songQueue-controller');

const {
    AuthTokenHeaderValidator
} = require('../validators/authtoken-validator');


Router.post('/room/:id/song/add/', AuthTokenHeaderValidator,(req, res) => {
    SongQueueController(req, res).addSongToQueue()
})

const SongQueueRoutes = Router;

module.exports = SongQueueRoutes;