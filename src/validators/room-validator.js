
const RESPONSE_MESSAGE = require('../enums/response-message')

const NewRoomRequestBodyValidator = (req, res, next) => {
    if (!req.body) {
        res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INCOMPLETE_BODY
        })
    }

    if (!req.body.name) {
        res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.PROPERTY_REQUIRE('name')
        })
    }
    
    next()
}