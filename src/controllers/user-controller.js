const UserService = require('../services/user-service');
const AuthTokenService = require('../services/authtoken-service');

const UserController = function() {
    
    const userService = UserService();
    const authtokenService = AuthTokenService();

    async function register(userData) {
        if (await userService.existsAsync(userData.username))
            return;

        let user = await userService.createAsync(userData); 
        
        if (!user)
            return;

        let token = await authtokenService.assignTokenToAsync(user);

        return token ? user : null;
    }

    async function login(userData) {
        let user = await userService.findByUsernameAndPasswordAsync(userData);
        
        if (!user)
            return;
        
        let token = await authtokenService.findTokenByUserIdAsync(user.id);

        if (!token)
            return;

        return {
            "user": user,
            "token": token.key 
        }
    }

    return {
        "register": register,
        "login": login
    }
}

module.exports = UserController