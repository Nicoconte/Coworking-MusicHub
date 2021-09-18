const Router = require("express").Router();
const validator = require('../helpers/validator-helper')();
const RESPONSE_MESSAGE = require('../enums/response-message');
const UserController = require('../controllers/user-controller')();

Router.post('/user/register', (req, res) => {
    let userData = req.body;
    
    if (!validator.hasFields(userData, ["username", "password"])) {
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

const UserRoutes = Router;


module.exports = UserRoutes;
