const Router = require("express").Router();
const Validator = require('../helpers/validator-helper')();
const RESPONSE_MESSAGE = require('../enums/response-message');
const UserController = require('../controllers/user-controller')();

Router.post('/user/register', (req, res) => {
    let userData = req.body;
    
    if (!Validator.hasFields(userData, ["username", "password"])) {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INCOMPLETE_BODY
        })
    } 
    
    UserController.register(userData).then(user => {
        if (!user) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.ALREADY_EXISTS
            })
        }

        return res.send({
            "status": true,
            "data": { id: user.id } 
        })
    })
})


Router.post('/user/login', (req, res) => {
    let userData = req.body;

    if (!Validator.hasFields(userData, ["username", "password"])) {
        return res.send({
            "status": false,
            "reason": RESPONSE_MESSAGE.INCOMPLETE_BODY
        })
    }

    UserController.login(userData).then(u => {
        if (!u) {
            return res.send({
                "status": false,
                "reason": RESPONSE_MESSAGE.USER_DOES_NOT_EXIST
            })
        }

        return res.send({
            "status": true,
            "data": {
                "id": u.user.id,
                "username": u.user.username,
                "token": u.token
            }
        })
    })

})

const UserRoutes = Router;


module.exports = UserRoutes;
