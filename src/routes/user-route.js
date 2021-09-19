const Router = require("express").Router();

const UserController = require('../controllers/user-controller');

const { 
    UserRegisterRequestBodyValidator, 
    UserLoginRequestBodyValidator 
} = require('../validators/user-validator')


Router.post('/user/register', UserRegisterRequestBodyValidator, (req, res) => {
    UserController(req, res).register();
})


Router.post('/user/login', UserLoginRequestBodyValidator, (req, res) => {
    UserController(req, res).login()
})

const UserRoutes = Router;

module.exports = UserRoutes;
