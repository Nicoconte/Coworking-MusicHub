const UserService = require('../services/user-service');

const UserController = function() {
    
    const userService = UserService();

    async function register(userData) {
        if (await userService.existsAsync(userData.username))
            return null;

        return await userService.createAsync(userData);
    }


    return {
        "register": register
    }
}

module.exports = UserController