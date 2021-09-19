const RESPONSE_MESSAGE = require('../enums/response-message');

const UserRegisterRequestBodyValidator = (req, res, next) => {

    if (!req.body) {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INCOMPLETE_BODY
        })
    }

    if (!req.body.username || !req.body.password) {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INCOMPLETE_BODY
        })
    }

    next()
}

const UserLoginRequestBodyValidator = (req, res, next) => {

    if (!req.body) {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INCOMPLETE_BODY
        })
    }

    if (!req.body.username || !req.body.password) {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INCOMPLETE_BODY
        })
    }

    next()
}


module.exports = {
    UserRegisterRequestBodyValidator,
    UserLoginRequestBodyValidator
}