
const RESPONSE_MESSAGE = require('../enums/response-message');

const AuthTokenHeaderValidator = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.UNAUTHORIZED
        })
    }   

    next()
}


module.exports = {
    AuthTokenHeaderValidator
}