const RESPONSE_MESSAGE = require('../enums/response-message'); 

const SongQueueService = require('../services/songQueue-service');
const AuthTokenService = require('../services/authtoken-service')

const SongQueueController = function(req, res) {

    const songQueueService = SongQueueService();
    const authtokenService = AuthTokenService()

    function addSongToQueue() {

        authtokenService.validateAsync(req?.headers?.authorization).then(token => {
            if (!token) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.INVALID_TOKEN
                })
            }

            let roomId = req?.params?.id;
            let url = req?.body?.url;

            songQueueService.push(roomId, url);
            
            setTimeout(() => {
                let queue = songQueueService.get();

                if (!queue) {
                    return res.send({
                        "status": false,
                        "reason": RESPONSE_MESSAGE.CANNOT_UPDATE
                    })
                }
        
                return res.send({
                    "status": true,
                    "data": {
                        "queue": queue
                    }
                }) 
            }, 0)
 
                        
        }).catch(err => {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.UNEXPECTED_ERROR,
                "innerReason": err.toString()
            })
        })

    }

    return {
        "addSongToQueue": addSongToQueue,
    }
}

module.exports = SongQueueController;