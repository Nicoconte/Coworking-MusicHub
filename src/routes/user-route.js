const Router = require("express").Router();
const UserController = require('../controllers/user-controller')();
const { 
    UserRegisterRequestBodyValidator, 
    UserLoginRequestBodyValidator 
} = require('../validators/user-validator')


const RESPONSE_MESSAGE = require('../enums/response-message');

Router.post('/user/register', UserRegisterRequestBodyValidator, (req, res) => {
    let userData = req.body;
        
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


Router.post('/user/login', UserLoginRequestBodyValidator, (req, res) => {
    let userData = req.body;

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
