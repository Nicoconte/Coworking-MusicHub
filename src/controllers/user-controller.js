const UserService = require('../services/user-service');
const AuthTokenService = require('../services/authtoken-service');

const UserController = function(req, res) {
    
    const userService = UserService();
    const authtokenService = AuthTokenService();

    async function register() {
        userService.createAsync(req?.body).then(async user => {
            if (!user) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.ALREADY_EXISTS
                })
            }
            
            await authtokenService.assignTokenToAsync(user);

            return res.send({
                "status": true,
                "data": { id: user.id } 
            })
        })
    }

    async function login() {
        userService.findByUsernameAndPasswordAsync(req?.body).then(async user => {
            if (!user) {
                return res.send({
                    "status": false,
                    "reason": RESPONSE_MESSAGE.USER_DOES_NOT_EXIST
                })
            }
            
            let token = await authtokenService.findTokenByUserIdAsync(user.id);

            return res.send({
                "status": true,
                "data": {
                    "id": user.id,
                    "username": user.username,
                    "token": token.key
                }
            })
        })    
    }

    return {
        "register": register,
        "login": login
    }
}

module.exports = UserController